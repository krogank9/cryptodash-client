import css from './Overview.module.scss'

import React, { Component } from 'react';
import WalletCarousel from '../components/WalletCarousel/WalletCarousel'
import OverviewGraph from '../components/OverviewGraph/OverviewGraph'
import PricesTable from '../components/PricesTable/PricesTable'
import IonIcon from '../components/IonIcon/IonIcon'
import TrendingCurrenciesTable from '../components/TrendingCurrenciesTable/TrendingCurrenciesTable'
import CryptoNewsfeed from '../components/CryptoNewsfeed/CryptoNewsfeed'

import StoreSingleton from '../store/CryptodashStoreSingleton.js'

//-------------------------------------------------------------
// Serverside static/initial props -- updated with cron job that fetches coingecko api
// Then, we can use cookie from user's request to determine which of the market data is relevant and what they have in their portfolio

import CoinIconList32B64 from "../public/coins_32_color_b64_icon_list.json"
import DefaultCoins from "../static_data/default_coins.json"
import DefaultCoinAmounts from "../static_data/default_coin_amounts.json"

import ServerUtils from '../ServerUtils'
import CoinIdMap from '../static_data/coin_id_map.json'
import Utils from '../Utils';
import CryptodashStoreSingleton from '../store/CryptodashStoreSingleton.js';

import { toJS } from 'mobx';

var fs = require('fs')
var xml2js = require('xml2js')

//-------------------------------------------------------------

interface OverviewProps {
  coinImagesB64?: any,
  walletData?: any,
  trendingData?: any
  rss?: any
}

export default class Overview extends React.Component<OverviewProps> {

  static async getInitialProps(context) {
    if (!Utils.isServerSideRendering())
      return {}

    console.log("getInitialProps() -----------------------------------------------------")
    // todo if context.req.cookie.isLoaded == true return {}

    Utils.setServersideCookie(context.req.headers.cookie)

    console.log("USERNAME SERVER:")
    console.log(Utils.getCookie("userName"))

    var parser = new xml2js.Parser()
    var rssJson = await parser.parseStringPromise(fs.readFileSync('static_data/crypto_rss.xml', 'utf8'));

    var marketData = JSON.parse(fs.readFileSync('static_data/coins_markets_list.json', 'utf8'));
    var stableCoins = ["usdt", "dai", "usdc", "tusd", "dgx", "eusd", "busd", "gusd", "cusdc", "wbtc"]
    var trendingData = marketData.filter((m) => stableCoins.indexOf(m.symbol) === -1).sort((a, b) => b.market_cap_change_24h - a.market_cap_change_24h).slice(0, 20)

    const defaultWallets = DefaultCoins.map((c) => {
      console.log(c)
      return {
        coin: c,
        amount: DefaultCoinAmounts[c]
      }
    })

    let userWallets = null
    try {
      userWallets = (await ServerUtils.getUserWallets(Utils.getCookie("authToken"))).map(({ coin, amount }) => ({ coin, amount }))
    } catch { }
    console.log("GOT USER WALLETS:")
    console.log(userWallets)

    let wallets = (userWallets || defaultWallets).map(w => {
      const graph_1d = ServerUtils.getCoinGraph(CoinIdMap[w.coin], "1d")
      const graph_1w = ServerUtils.getCoinGraph(CoinIdMap[w.coin], "1w")
      const graphs = Utils.filterDictKeys({ graph_1d, graph_1w }, (k, v) => v != null)
      return { ...w, ...graphs }
    })

    let coinsB64Filtered = Object.keys(CoinIconList32B64).reduce(function (filtered, key) {
      if (wallets.find(w => w.coin === key)) filtered[key] = CoinIconList32B64[key];
      return filtered;
    }, {});

    return {
      trendingData: trendingData,
      coinImagesB64: coinsB64Filtered,
      rss: rssJson.rss.channel[0].item.slice(0, 5),
      walletData: wallets,
    }
  }

  constructor(props) {
    super(props)

    if (this.props.walletData)
      StoreSingleton.setWalletData(this.props.walletData)
    if (this.props.coinImagesB64)
      StoreSingleton.setCoinImagesB64(this.props.coinImagesB64)
    if(this.props.rss)
      StoreSingleton.setRssData(this.props.rss)
    if(this.props.trendingData)
      StoreSingleton.setTrendingData(this.props.trendingData)
  }

  render() {
    return (
      <>
        <WalletCarousel data={this.props.walletData} />
        <div className={css.graphSplit}>
          <OverviewGraph className={css.graphSplit__graph} />
          <PricesTable className={css.graphSplit__table} />
        </div>

        <div className={css.halfSplit}>
          <TrendingCurrenciesTable />
          <CryptoNewsfeed />
        </div>
      </>
    )
  }
}