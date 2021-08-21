import { makeObservable, autorun, observable, computed, action, makeAutoObservable, comparer } from "mobx"
import { observer } from 'mobx-react'
import config from '../config'
import CoinIdMap from "../static_data/coin_id_map.json"

import GenericCoinB64 from '../public/generic_coin.json'

import Utils from '../Utils'

import { toJS } from 'mobx';
import React from "react";

const timeFrames = ["1d", "1w", "1m", "1y", "all"]

class CryptodashStore {

    // When wallet data is added, I think I want to lazy load in the rest of the graphs besides graph_1d
    // This will also allow for just adding a coin like {coin: "btc", amount: 1}

    selectedCoin = { coin: "" }
    setSelectedCoin(coin) {
        this.selectedCoin.coin = coin
    }

    marketData = [
        //{
        //    ...from API
        //}
    ]

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

    syncWalletDataComputeds(forTimeFrame) {
        for(let t of timeFrames) {
            if(forTimeFrame && t !== forTimeFrame)
                continue
            [].splice.apply(this["walletData_"+t], [0, this["walletData_"+t].length].concat(this.filterWalletGraphs(this.walletData, t).filter(w => w["graph_"+t])));
        }
    }

    coinImagesB64 = {/* coinSymbol: b64 */ }
    lazyLoadCoinImages() {
        const NUM_COIN_IMAGES = 457
        if(Object.keys(this.coinImagesB64).length < NUM_COIN_IMAGES) {        
            import("../public/coins_32_color_b64_icon_list.json")
                .then(coins => {
                    this.coinImagesB64 = {...this.coinImagesB64, ...coins.default}
                })
        }
    }

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
            removeWalletForCoin: action,
            addBalanceSmart: action,
            // Custom computed's
            walletData_1d: observable,
            walletData_1w: observable,
            walletData_1m: observable,
            walletData_1y: observable,
            walletData_all: observable,
        })

        this.lazyLoadCoinImages()
    }

    // When adding coins via querying the API, the API calls can be spaced out by minutes or seconds.
    // The 1 day data is displayed in 5 minute intervals so this new data may be out of sync with the old.
    // This causes a gap at the beginning of the graph where the recently added data does not go back far
    //  enough due to newer Date.now() and therefore Date.now() - 1d will not go back as far.
    // It's necessary to pass a query parameter to make sure all graph's Date.now()'s stay the same.
    getDateNowFromCurData() {
        let now = Date.now()
        this.walletData.forEach(w => {
            try {
                now = Math.min(now, w.graph_1d.slice().pop()[0] || Date.now())
                return true
            } catch {/*1d data not available or empty*/}
        })
        return now
    }

    addWalletAfterAllGraphs(coin, amount) {
        let wallet = {coin: coin, amount: amount}

        let getGraphPromises = timeFrames.map(timeFrame => {
            return fetch(`${config.API_ENDPOINT}/graphs/${CoinIdMap[wallet.coin]}_${timeFrame}?now=${this.getDateNowFromCurData()}`)
                .then(response => response.json())
                .then(graph => {
                    wallet["graph_"+timeFrame] = graph
                })
        })

        return Promise.all(getGraphPromises).then(() => {
            this.addWalletData(wallet)
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

        [].unshift.apply(this.walletData, data);
        this.syncWalletDataComputeds()

        // Should make an option to only add to wallet after all graphs are done
        data.forEach((wallet, i) => {
            timeFrames.filter(t => !wallet.hasOwnProperty("graph_" + t)).forEach(timeFrame => {
                //console.log(`fetching.... ${config.API_ENDPOINT}/graphs/${CoinIdMap[wallet.coin]}_${timeFrame}`)
                fetch(`${config.API_ENDPOINT}/graphs/${CoinIdMap[wallet.coin]}_${timeFrame}?now=${this.getDateNowFromCurData()}`)
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

    addBalanceSmart = (coin, amount) => {
        const coinWallet = this.walletData.find(w => w.coin === coin)
        
        if(coinWallet) {
            coinWallet.amount = Utils.addNumsPrecise(coinWallet.amount, amount)

            if(this.walletData.find(w => w.coin === coin).amount <= 0)
                this.removeWalletForCoin(coin)
            else
                this.syncWalletDataComputeds() // Above syncs for us
        }
        else {
            if(amount >= 0) {
                this.addWalletAfterAllGraphs(coin, amount).then(() => this.setSelectedCoin(coin))
            }
        }
    }

    removeWalletForCoin = (coin) => {
        console.log(`Removing wallet for ${coin}...`)

        let idx = this.walletData.findIndex(w => w.coin === coin)
        let selectedIdx = this.walletData.findIndex(w => w.coin === this.selectedCoin.coin)
        if (idx !== -1) {
            this.walletData.splice(idx, 1)
            this.syncWalletDataComputeds()

            if(selectedIdx >= idx) {
                selectedIdx = Math.min(selectedIdx, this.walletData.length - 1)

                if (this.walletData.length >= 1 && selectedIdx >= 0) {
                    this.selectedCoin.coin = this.walletData[idx].coin
                }
                else {
                    this.selectedCoin.coin = ""
                }
            }
        }
    }

    removeSelectedWallet = () => {
        this.removeWalletForCoin(this.selectedCoin.coin)
    }

    addGraphToWallet(coin, timeFrame, graph) {
        const idx = this.walletData.findIndex(w => w.coin === coin)
        this.walletData[idx]["graph_" + timeFrame] = graph
        // Update appropriate computed too. Avoid using sync here. This is what we're trying to prevent component re-render on.
        // this["walletData_" + timeFrame][idx]["graph_" + timeFrame] = graph
        this.syncWalletDataComputeds(timeFrame)
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

    getCoinImageB64(coin) {
        return this.coinImagesB64[coin] || GenericCoinB64.data
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

    let propsDict = {}
    observedProps.forEach(p => {
        if (p instanceof Object) {
            // For syntax {"passPropAlias": "realVariableName"}
            Utils.mapDict(p, (key, val) => {
                propsDict[key] = CryptodashStoreSingleton[val]
            })
        }
        else {
            propsDict[p] = CryptodashStoreSingleton[p]
        }
    })

    const ObserverWrappedClass = observer(fromClass)
    //return (props) => <ObserverWrappedClass {...propsDict}></ObserverWrappedClass>
    return (props) => {
        return <ObservedPropsFilter observedProps={observedProps} passProps={props} childObserverClass={ObserverWrappedClass}></ObservedPropsFilter>
    }
}

// Naive way of exporting a singleton that is fine for most cases. Depends on module caching:
// https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
export default CryptodashStoreSingleton