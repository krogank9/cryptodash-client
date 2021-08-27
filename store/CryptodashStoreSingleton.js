import { makeObservable, autorun, observable, computed, action, makeAutoObservable, comparer } from "mobx"
import config from '../config'
import CoinIdMap from "../static_data/coin_id_map.json"
import Utils from '../Utils'

import GenericCoinB64 from '../public/generic_coin.json'
import DefaultCoinsAmounts from '../static_data/default_coin_amounts.json'
const DefaultWallets = Object.values(Utils.mapDict(DefaultCoinsAmounts, (k, v) => ({ coin: k, amount: v })))

import { toJS } from 'mobx';
import React from "react";

import CryptoDashApiService from "../services/cryptodash-api-service"

import Router from 'next/router'

const timeFrames = ["1d", "1w", "1m", "1y", "all"]
const ONE_MINUTE = 1000 * 60 * 60
const HALF_HOUR = ONE_MINUTE * 30

class CryptodashStore {

    toggleLoginModal = (b) => { }
    setToggleLoginModalCallback(f) {
        this.toggleLoginModal = f
    }

    loggedInUser = {
        authToken: "",
        userName: "",
        profilePic: 1
    }

    // One sync at a time
    syncQueuePromise = Promise.resolve()
    syncWalletsToServer() {
        console.log("syncing user to server--------------------------------------------------------")
        if (this.loggedInUser.authToken)
            this.syncQueuePromise = this.syncQueuePromise.then(() => CryptoDashApiService.setWallets(this.loggedInUser.authToken, toJS(this.walletData)))
    }


    setProfilePicQueue = Promise.resolve()
    selectProfilePic(n) {
        const NUM_PICS = 4

        let newPic = (this.loggedInUser.profilePic || 1) + n
        if (newPic < 1)
            newPic = NUM_PICS
        if (newPic > NUM_PICS)
            newPic = 1

        this.loggedInUser.profilePic = newPic

        console.log(this.loggedInUser.profilePic)

        //this.setProfilePicQueue = this.setProfilePicQueue.then(() => CryptoDashApiService.updateProfilePic(this.loggedInUser.authToken, newPic))
    }

    tryDeleteAccount() {
        if (this.loggedInUser.authToken) {
            CryptoDashApiService.deleteAccount(this.loggedInUser.authToken)
                .then(() => {
                    this.logoutUser()
                })
        }
    }

    tryLoginFromCookie() {
        const userName = Utils.getCookie("userName")
        const authToken = Utils.getCookie("authToken")
        const profilePic = Utils.getCookie("profilePic")
        if (userName && authToken) {
            console.log(`logging in from cookie ${userName} ${authToken}-------------------------------------------`)
            this.setLoggedInUser({ userName, authToken, profilePic })
        }
    }
    tryRefreshLoginCookie() {
        const authToken = Utils.getCookie("authToken")
        if (authToken) {
            CryptoDashApiService.refresh(authToken).then(({ userName, authToken }) => {
                this.loggedInUser.authToken = authToken
            }).catch(err => {
                this.logoutUser(true)
            })
        }
    }
    setLoggedInUser({ userName, authToken, profilePic, justRegistered }) {
        console.log(`Settinged logged in user: ${userName}, ${authToken}`)
        Utils.clearDict(this.loggedInUser)
        Utils.copyDictTo(this.loggedInUser, { userName, authToken, profilePic })

        if (Utils.isServerSideRendering())
            return

        if (justRegistered) {
            this.syncWalletsToServer()
        }
        else {
            //CryptoDashApiService.setWallets(authToken, [{coin: "btc", amount: 3}])
            CryptoDashApiService.getWallets(authToken)
                .then(wallets => {
                    console.log("just logged in, wallets:----------------------------------------------")
                    console.log(wallets)
                    this.setSelectedCoin("")
                    this.setWalletData(wallets)
                })
        }
    }

    logoutUser(noRefresh = false) {

        Utils.copyDictTo(this.loggedInUser, { userName: "", authToken: "" })
        console.log("this.loggedInUser")
        console.log(toJS(this.loggedInUser))

        if (!noRefresh) {
            Router.reload(window.location.pathname)
        }
    }

    // When wallet data is added, I think I want to lazy load in the rest of the graphs besides graph_1d
    // This will also allow for just adding a coin like {coin: "btc", amount: 1}

    selectedCoin = { coin: "" }
    setSelectedCoin(coin) {
        if (Utils.isServerSideRendering()) {
            console.log(`Setting coin ${coin}`)
        }
        this.selectedCoin.coin = coin
    }
    selectedCoinIsValid() {
        if (!this.selectedCoin.coin)
            return false
        if (!this.walletData.find(w => w.coin === this.selectedCoin.coin))
            return false
        return true
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

    syncWalletDataComputeds(forTimeFrame) {
        for (let t of timeFrames) {
            if (forTimeFrame && t !== forTimeFrame)
                continue
            [].splice.apply(this["walletData_" + t], [0, this["walletData_" + t].length].concat(this.filterWalletGraphs(this.walletData, t).filter(w => w["graph_" + t])));
        }
    }

    coinImagesB64 = {/* coinSymbol: b64 */ }
    lazyLoadCoinImages() {
        const NUM_COIN_IMAGES = 457
        if (Object.keys(this.coinImagesB64).length < NUM_COIN_IMAGES) {
            import("../public/coins_32_color_b64_icon_list.json")
                .then(coins => {
                    this.coinImagesB64 = { ...this.coinImagesB64, ...coins.default }
                })
        }
    }

    constructor() {
        makeAutoObservable(this, {
            selectProfilePicture: action
        })
        /*
        makeObservable(this, {
            walletData: observable,
            selectedCoin: observable,
            toggleLoginModal: observable,
            loggedInUser: observable,
            tryRefreshLoginCookie: action,
            setLoggedInUser: action,
            logoutUser: action,
            setToggleLoginModalCallback: action,
            addWalletData: action,
            setWalletData: action,
            addGraphToWallet: action,
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
        */

        this.lazyLoadCoinImages()

        this.tryLoginFromCookie()
        this.tryRefreshLoginCookie()

        // Called after getInitialProps set
        // This is necessary because getInitialProps will only be called if starting on index page
        setTimeout(() => {
            if (this.walletData.length === 0 && !this.loggedInUser.authToken) {
                this.setWalletData(DefaultWallets.slice())
            }

            this.tryFetchMarketData()
            this.tryFetchRssData()
        }, 1)

        autorun(() => {
            Utils.setCookie("userName", this.loggedInUser.userName)
            Utils.setCookie("authToken", this.loggedInUser.authToken)
            Utils.setCookie("profilePic", this.loggedInUser.profilePic)
        })
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
            } catch {/*1d data not available or empty*/ }
        })
        return now
    }

    addWalletAfterAllGraphs(coin, amount) {
        let wallet = { coin: coin, amount: amount }

        let getGraphPromises = timeFrames.map(timeFrame => {
            return fetch(`${config.API_ENDPOINT}/graphs/${CoinIdMap[wallet.coin]}_${timeFrame}?now=${this.getDateNowFromCurData()}`)
                .then(response => response.json())
                .then(graph => {
                    wallet["graph_" + timeFrame] = graph
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

        // fetch graphs from server api endpoint not present in supplied data,
        // then update data upon response
        let timeFrames = ["1d", "1w", "1m", "1y", "all"];

        [].unshift.apply(this.walletData, data);
        this.syncWalletDataComputeds()
        if (this.loggedInUser.authToken)
            CryptoDashApiService.setWallets(this.loggedInUser.authToken, toJS(this.walletData))

        if (!this.selectedCoinIsValid() && data.length) {
            if (Utils.isServerSideRendering()) {
                console.log("SERVER SELECTED COIN~~~:")
                console.log(data.map(({ coin, amount }) => ({ coin, amount })))
                //console.log(this.walletData.map(({coin, amount}) => ({coin, amount})))
            }

            this.setSelectedCoin(data[0].coin)
            console.log(`setting selected coin ${data[0].coin}`)
        }
        else {
            if (this.selectedCoin.coin)
                console.log(`not selecting coin, ${this.selectedCoin.coin} already set`)
            else if (this.walletData.length === 0)
                console.log(`not selecting coin, walletData length === 0`)
        }

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
    }

    addBalanceSmart = (coin, amount) => {
        const coinWallet = this.walletData.find(w => w.coin === coin)

        if (coinWallet) {
            coinWallet.amount = Utils.addNumsPrecise(coinWallet.amount, amount)

            if (this.walletData.find(w => w.coin === coin).amount <= 0)
                this.removeWalletForCoin(coin)
            else
                this.syncWalletDataComputeds() // Above syncs for us
        }
        else {
            if (amount >= 0) {
                this.addWalletAfterAllGraphs(coin, amount).then(() => this.setSelectedCoin(coin))
            }
        }
    }

    removeWalletForCoin = (coin) => {
        console.log(`Removing wallet for ${coin}...`)

        let idxToRemove = this.walletData.findIndex(w => w.coin === coin)
        let selectedIdx = this.walletData.findIndex(w => w.coin === this.selectedCoin.coin)
        if (idxToRemove !== -1) {
            // Remove wallet
            this.walletData.splice(idxToRemove, 1)
            this.syncWalletDataComputeds()

            this.syncWalletsToServer()

            if (selectedIdx >= idxToRemove)
                selectedIdx = Math.max(0, selectedIdx - 1)
            this.selectedCoin.coin = this.walletData[selectedIdx]?.coin || ""
        }
    }

    removeSelectedWallet = () => {
        this.removeWalletForCoin(this.selectedCoin.coin)
    }

    addGraphToWallet(coin, timeFrame, graph) {
        try {
            this.walletData.find(w => w.coin === coin)["graph_" + timeFrame] = graph
            this.syncWalletDataComputeds(timeFrame)
        } catch {/* wallet was removed before fetch returned */ }
    }

    setWalletData(data) {
        this.addWalletData(data, true)
    }

    marketData = []
    setMarketData(data) {
        this.marketData.length = 0;
        [].push.apply(this.marketData, data)
    }
    tryFetchMarketData() {
        if(this.marketData.length === 0) {
            fetch(`${config.API_ENDPOINT}/market_data`).then(res => res.json())
                .then(data => {
                    this.setMarketData(data)
                })
        }
    }

    rssData = {}
    setRssData(data) {
        Utils.copyDictTo(this.rssData, data)
    }
    tryFetchRssData() {
        if(Object.keys(this.rssData).length === 0) {
            fetch(`${config.API_ENDPOINT}/rss`).then(res => res.json())
                .then(data => {
                    this.setRssData(data)
                })
        }
    }

    setCoinImagesB64(data) {
        this.coinImagesB64 = { ...this.coinImagesB64, ...data }
    }

    getCoinImageB64(coin) {
        return this.coinImagesB64[coin] || GenericCoinB64.data
    }
}

const CryptodashStoreSingleton = new CryptodashStore()

// Naive way of exporting a singleton that is fine for most cases. Depends on module caching:
// https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
export default CryptodashStoreSingleton