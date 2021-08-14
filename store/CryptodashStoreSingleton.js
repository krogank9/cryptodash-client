import { makeObservable, autorun, observable, computed, action } from "mobx"
//import { Observer } from 'mobx-react'
import config from '../config'
import CoinIdMap from "../static_data/coin_id_map.json"

import { toJS } from 'mobx';

class CryptodashStore {

    // When wallet data is added, I think I want to lazy load in the rest of the graphs besides graph_1d
    // This will also allow for just adding a coin like {coin: "btc", amount: 1}

    selectedCoin = ""
    get selectedCoin() { return toJS(this.selectedCoin) || (this.walletData[0] || {}).coin || "" }

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
    get walletData() {
        return toJS(this.walletData)
    }

    marketData = [
        //{
        //    ...from API
        //}
    ]
    get marketData() {
        return toJS(this.marketData)
    }

    // I think no need for coin images to be observable, static except for lazy loading
    coinImagesB64 = {/* coinSymbol: b64 */}

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
            setWalletData: action,
            addWalletData: action,
            addGraphToWallet: action,
            setMarketData: action,
        });
        //autorun(() => console.log(this.report));
    }

    addWalletData(data) {
        // fetch graphs from server api endpoint not present in supplied data,
        // then update data upon response
        let timeFrames = ["1d", "1w", "1m", "1y", "all"];

        [].concat(data).forEach((wallet, i) => {
            this.walletData.push(wallet)
            
            timeFrames.filter(t => !wallet.hasOwnProperty("graph_"+t)).forEach(timeFrame => {
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
        wallet["graph_"+timeFrame] = graph
        //console.log(`added ${timeFrame} graph to wallet ${coin}`)
        //console.log(toJS(wallet))
    }

    setWalletData(data) {
        this.walletData.length = 0
        this.addWalletData(data)
    }

    setMarketData(data) {
        this.marketData.length = 0
        this.marketData = this.marketData.concat(data)
    }

    setCoinImagesB64(data) {
        this.coinImagesB64 = {...this.coinImagesB64, ...data}
    }
}

// Naive way of exporting a singleton that is fine for most cases. Depends on module caching:
// https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
const CryptodashStoreSingleton = new CryptodashStore()
export default CryptodashStoreSingleton