import css from './index.module.scss'

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

var fs = require('fs')
var xml2js = require('xml2js')
var parser = new xml2js.Parser()

function getCoinData() {
  let coinData = {}
  fs.readdirSync("static_data").forEach((file) => {
    if (!file.endsWith("_1d.json"))
      return

    let coin = file.replace("_1d.json", "")
    file = "./static_data/" + file

    coinData[coin] = JSON.parse(fs.readFileSync(file, 'utf8'))
  })
  return coinData
}

export async function getServerSideProps(context) {
  // todo if context.req.cookie.isLoaded == true return {}

  var rssJson = await parser.parseStringPromise(fs.readFileSync('static_data/crypto_rss.xml', 'utf8'));

  var marketData = JSON.parse(fs.readFileSync('static_data/coins_markets_list.json', 'utf8'));
  var stableCoins = ["usdt", "dai", "usdc", "tusd", "dgx", "eusd", "busd", "gusd", "cusdc"]
  var trendingData = marketData.filter((m) => stableCoins.indexOf(m.symbol) === -1)

  let coinsB64Filtered = Object.keys(CoinIconList32B64).reduce(function (filtered, key) {
    if (DefaultCoins.indexOf(key) !== -1) filtered[key] = CoinIconList32B64[key];
    return filtered;
  }, {});

  let coinData = getCoinData()

  let walletData = DefaultCoins.map((c) => {
    return {
      coin: c,
      amount: DefaultCoinAmounts[c],
      graph_1d: coinData[c]
    }
  })

  return {
    props: {
      trendingData: trendingData,
      coinImagesB64: coinsB64Filtered,
      rss: rssJson.rss.channel[0].item.slice(0, 5),
      walletData: walletData,
    }
  }
}

//-------------------------------------------------------------

interface OverviewProps {
  coinImagesB64?: any,
  marketData?: any,
  walletData?: any,
  trendingData?: any
  rss?: any
}

export default class Overview extends React.Component<OverviewProps> {
  constructor(props) {
    super(props)

    StoreSingleton.setWalletData(this.props.walletData)
    StoreSingleton.setMarketData(this.props.marketData)
    StoreSingleton.setCoinImagesB64(this.props.coinImagesB64)
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
          <TrendingCurrenciesTable data={this.props.trendingData} />
          <CryptoNewsfeed data={this.props.rss} />
        </div>
      </>
    )
  }
}