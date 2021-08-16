import { makeObservable, autorun, observable, computed, action, makeAutoObservable, comparer } from "mobx"
import { observer } from 'mobx-react'
import config from '../config'
import CoinIdMap from "../static_data/coin_id_map.json"

import Utils from '../Utils'

import { toJS } from 'mobx';
import React from "react";

class CryptodashStore {

    // When wallet data is added, I think I want to lazy load in the rest of the graphs besides graph_1d
    // This will also allow for just adding a coin like {coin: "btc", amount: 1}

    selectedCoin = { coin: "" }
    setSelectedCoin(coin) {
        this.selectedCoin.coin = coin
    }

    walletData = [
        //{
        //    coin: c,
        //    amount: DefaultCoinAmounts[c],
        //    graph_1d: [[t,v], ...],
        //    graph_1w: [[t,v], ...],
        //    graph_1m: [[t,v], ...],
        //    graph_1y: [[t,v], ...],
        //    graph_all: [[t,v], ...]
        //}, ...
    ]

    filterWalletGraphs(filterFor) {
        return this.walletData.map(w => {
            let newWallet = { ...w }
            const granularities = ["graph_1d", "graph_1w", "graph_1m", "graph_y", "graph_all"]
            granularities.filter(g => !g.endsWith(filterFor)).forEach(g => {
                delete newWallet[g]
            })
            return newWallet
        })
    }

    get walletData_1d() { return this.filterWalletGraphs("1d") }
    get walletData_1w() { return this.filterWalletGraphs("1w") }
    get walletData_1m() { return this.filterWalletGraphs("1m") }
    get walletData_1y() { return this.filterWalletGraphs("1y") }
    get walletData_all() { return this.filterWalletGraphs("all") }

    marketData = [
        //{
        //    ...from API
        //}
    ]

    // I think no need for coin images to be observable, static except for lazy loading
    coinImagesB64 = {/* coinSymbol: b64 */ }

    saveToLocalStorage() {
        //localStorage.setItem('walletData', this.walletData);
        //localStorage.setItem('marketData', this.marketData);
    }

    loadFromLocalStorage() {
        // Todo this involves cookies probably
        //localStorage.getItem('walletData');
    }

    constructor() {
        makeObservable(this, {
            walletData: observable,
            marketData: observable,
            selectedCoin: observable,
            addWalletData: action,
            setWalletData: action,
            addGraphToWallet: action,
            setMarketData: action,
            setSelectedCoin: action,
            // Only need shallow compare for these. New data won't load into initial arrays:
            walletData_1d: computed({ equals: comparer.structural }),
            walletData_1w: computed({ equals: comparer.structural }),
            walletData_1m: computed({ equals: comparer.structural }),
            walletData_1y: computed({ equals: comparer.structural }),
            walletData_all: computed({ equals: comparer.structural }),
        })
    }

    addWalletData(data) {
        data = [].concat(data)

        if (!this.selectedCoin.coin)
            this.setSelectedCoin(data[0].coin)

        // fetch graphs from server api endpoint not present in supplied data,
        // then update data upon response
        let timeFrames = ["1d", "1w", "1m", "1y", "all"];

        [].push.apply(this.walletData, data);

        data.forEach((wallet, i) => {
            timeFrames.filter(t => !wallet.hasOwnProperty("graph_" + t)).forEach(timeFrame => {
                //console.log(`fetching.... ${config.API_ENDPOINT}/graphs/${CoinIdMap[wallet.coin]}_${timeFrame}`)
                fetch(`${config.API_ENDPOINT}/graphs/${CoinIdMap[wallet.coin]}_${timeFrame}`)
                    .then(response => response.json())
                    .then(graph => {
                        //console.log(graph)
                        //wallet["graph_"+timeFrame] = graph.data.prices
                        this.addGraphToWallet(wallet.coin, timeFrame, graph)
                    })
            })
        })

        // fetch().onresponse(data = new).onerror(retry maybe)
        // then, overviewgraph will be able to use the data
        // as a test we can try not supplying initial 1d graphs for default data... then will probably need observable.
    }

    addGraphToWallet(coin, timeFrame, graph) {
        const wallet = this.walletData.find(w => w.coin === coin)
        wallet["graph_" + timeFrame] = graph
        //console.log(`added ${timeFrame} graph to wallet ${coin}`)
        //console.log(toJS(wallet))
    }

    setWalletData(data) {
        this.walletData.length = 0
        this.addWalletData(data)
    }

    setMarketData(data) {
        this.marketData.length = 0;
        [].push.apply(this.marketData, data);
    }

    setCoinImagesB64(data) {
        this.coinImagesB64 = { ...this.coinImagesB64, ...data }
    }
}
const CryptodashStoreSingleton = new CryptodashStore()

// Automatically create wrapper that only passes what's necessary to the observer so as not to update unnecessarily
// Be able to update what's being passed from wrapped class through a callback for stuff like switching to relevant graph
// Also need to be able to do fancy stuff like map an observed prop and pass that...
class ObservedPropsFilter extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            observedProps: this.mapObservedProps(this.props.observedProps)
        }
    }

    mapObservedProps = (observedProps) => {
        const observedPropsDict = {}
        observedProps.forEach(p => {
            if (p instanceof Object) {
                // For syntax {"passPropAlias": "realVariableName"}
                Utils.mapDict(p, (key, val) => {
                    observedPropsDict[key] = CryptodashStoreSingleton[val]
                })
            }
            else {
                observedPropsDict[p] = CryptodashStoreSingleton[p]
            }
        });

        Object.values(observedPropsDict).forEach(v => {
            if (!(toJS(v) instanceof Object))
                throw new Error("Quirk of using this filtered auto observer method, all observed props must be objects with an unchanged ref.")
        })

        return observedPropsDict
    }

    changeObservedProps = (newObservedProps) => {
        this.setState({
            observedProps: this.mapObservedProps(newObservedProps)
        })
    }

    render() {
        const ChildObserverClass = this.props.childObserverClass
        return <ChildObserverClass {...this.state.observedProps} {...this.props.passProps} changeObservedProps={this.changeObservedProps}></ChildObserverClass>
    }
}

export function makeObserver(observedProps, fromClass) {
    observedProps = [].concat(observedProps)

    const ObserverWrappedClass = observer(fromClass)
    return (props) => {
        return <ObservedPropsFilter observedProps={observedProps} passProps={props} childObserverClass={ObserverWrappedClass}></ObservedPropsFilter>
    }
}

// Naive way of exporting a singleton that is fine for most cases. Depends on module caching:
// https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
export default CryptodashStoreSingleton