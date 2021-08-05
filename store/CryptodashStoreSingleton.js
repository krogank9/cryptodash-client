import { makeObservable, autorun, observable, computed, action } from "mobx"
//import {observer} from 'mobx-react';

class CryptodashStore {
    walletData = [
        //{
        //    coin: c,
        //    amount: DefaultCoinAmounts[c],
        //    graph_1d: [[t,v], ...]
        //    graph_1w: [[t,v], ...]
        //    graph_1m: [[t,v], ...]
        //    graph_1y: [[t,v], ...]
        //    graph_all: [[t,v], ...]
        //}, ...
    ]

    marketData = [
        //{
        //    ...from API
        //}
    ]

    // I think no need for coin images to be observable, static except for lazy loading
    coinImagesB64 = {/* coinSymbol: b64 */}

    constructor() {
        makeObservable(this, {
            walletData: observable,
            marketData: observable,
            setWalletData: action,
            setMarketData: action,
        });
        //autorun(() => console.log(this.report));
    }

    setWalletData(data) {
        this.walletData.length = 0
        this.walletData = this.walletData.concat(data)
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