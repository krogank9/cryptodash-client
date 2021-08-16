import { makeObservable, autorun, observable, computed, action, makeAutoObservable, comparer } from "mobx"
import { observer } from 'mobx-react'
import config from '../config'
import CoinIdMap from "../static_data/coin_id_map.json"

import Utils from '../Utils'

import { toJS } from 'mobx';
import React from "react";

const fakeComputed = observable

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

    // Could not get MobX's computed to work. Not sure if it's a bug but not wasting time wrestling with it anymore.
    // Very simple to just write my own computed observable for each walletData granularity and sync them all.
    // Updates more predictably anyway, don't have to rely on MobX's compare functions,
    //  which I don't think any of them worked exactly how I wanted them to anyway.
    walletData_1d = []
    walletData_1w = []
    walletData_1m = []
    walletData_1y = []
    walletData_all = []

    filterWalletGraphs(walletData, filterFor) {
        return walletData.map(w => {
            const unusedGranularities = ["graph_1d", "graph_1w", "graph_1m", "graph_1y", "graph_all"].filter(g => !g.endsWith(filterFor))
            return Utils.filterDictKeys(w, k => !unusedGranularities.includes(k))
        })
    }

    syncWalletDataComputeds() {
        [].splice.apply(this.walletData_1d, [0, this.walletData_1d.length].concat(this.filterWalletGraphs(this.walletData, "1d")));
        [].splice.apply(this.walletData_1w, [0, this.walletData_1w.length].concat(this.filterWalletGraphs(this.walletData, "1w")));
        [].splice.apply(this.walletData_1m, [0, this.walletData_1m.length].concat(this.filterWalletGraphs(this.walletData, "1m")));
        [].splice.apply(this.walletData_1y, [0, this.walletData_1y.length].concat(this.filterWalletGraphs(this.walletData, "1y")));
        [].splice.apply(this.walletData_all, [0, this.walletData_all.length].concat(this.filterWalletGraphs(this.walletData, "all")));
    }

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
            removeSelectedWallet: action,
            // Custom computed's
            walletData_1d: observable,
            walletData_1w: observable,
            walletData_1m: observable,
            walletData_1y: observable,
            walletData_all: observable,
        })
    }

    addWalletData(data, clearData = false) {
        if (clearData)
            this.walletData.length = 0
        data = [].concat(data)

        if (!this.selectedCoin.coin)
            this.setSelectedCoin(data[0].coin)

        // fetch graphs from server api endpoint not present in supplied data,
        // then update data upon response
        let timeFrames = ["1d", "1w", "1m", "1y", "all"];

        [].push.apply(this.walletData, data);
        this.syncWalletDataComputeds()

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

    removeSelectedWallet = () => {
        console.log(`Removing wallet for ${this.selectedCoin.coin}...`)

        console.log("this")
        console.log(this)

        let idx = this.walletData.findIndex(w => w.coin === this.selectedCoin.coin)
        if (idx !== -1) {
            this.walletData.splice(idx, 1)
            this.syncWalletDataComputeds()
        }

        console.log("this.walletData")
        console.log(toJS(this.walletData))

        idx = Math.min(idx, this.walletData.length - 1)
        if (idx >= 0 && idx < this.walletData.length) {
            this.selectedCoin.coin = this.walletData[idx].coin
        }
        else {
            this.selectedCoin.coin = ""
        }
    }

    addGraphToWallet(coin, timeFrame, graph) {
        const idx = this.walletData.findIndex(w => w.coin === coin)
        this.walletData[idx]["graph_" + timeFrame] = graph
        // Update appropriate computed too. Avoid using sync here. This is what we're trying to prevent component re-render on.
        this["walletData_" + timeFrame][idx]["graph_" + timeFrame] = graph
    }

    setWalletData(data) {
        this.addWalletData(data, true)
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
            overrideObservedProps: []
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

        Utils.mapDict(observedPropsDict, (k, v) => {
            if (!(toJS(v) instanceof Object))
                throw new Error(`Quirk of using this filtered auto observer method, all observed props must be objects with an unchanged ref. On ${k}`)
        })

        return observedPropsDict
    }

    changeObservedProps = (newObservedProps) => {
        this.setState({
            overrideObservedProps: newObservedProps
        })
    }

    render() {
        const ChildObserverClass = this.props.childObserverClass
        const observedProps = this.mapObservedProps(this.props.observedProps)
        const overrideObservedProps = this.mapObservedProps(this.state.overrideObservedProps)
        const allObservedProps = { ...observedProps, ...overrideObservedProps }
        return <ChildObserverClass {...allObservedProps} {...this.props.passProps} changeObservedProps={this.changeObservedProps}></ChildObserverClass>
    }
}

export function makeObserver(observedProps, fromClass) {
    observedProps = [].concat(observedProps)

    const ObserverWrappedClass = observer(fromClass)
    return (props) => {
        return <ObservedPropsFilter observedProps={observedProps} passProps={props} childObserverClass={ObserverWrappedClass}></ObservedPropsFilter>
    }
}

export function makeObserverWC(fromClass) {
    const ObserverWrappedClass = observer(fromClass)
    console.log("making WC observer")
    console.log(CryptodashStoreSingleton.walletData_1d)
    return (props) => {
        return <ObserverWrappedClass selectedCoin={CryptodashStoreSingleton.selectedCoin} walletData_1d={CryptodashStoreSingleton.walletData_1d} {...props}></ObserverWrappedClass>
    }
}

// Naive way of exporting a singleton that is fine for most cases. Depends on module caching:
// https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
export default CryptodashStoreSingleton