import css from './Overview.module.scss'

import WalletCarousel from '../components/WalletCarousel/WalletCarousel'
import OverviewGraph from '../components/OverviewGraph/OverviewGraph'
import PricesTable from '../components/PricesTable/PricesTable'
import IonIcon from '../components/IonIcon/IonIcon'
import TrendingCurrenciesTable from '../components/TrendingCurrenciesTable/TrendingCurrenciesTable'
import CryptoNewsfeed from '../components/CryptoNewsfeed/CryptoNewsfeed'

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

  var marketData = JSON.parse(fs.readFileSync('static_data/coins_markets_list.json', 'utf8'));
  var rssJson = await parser.parseStringPromise(fs.readFileSync('static_data/crypto_rss.xml', 'utf8'));

  var stableCoins = ["usdt", "dai", "usdc", "tusd", "dgx", "eusd", "busd", "gusd", "cusdc"]
  var trendingData = marketData.filter((m) => stableCoins.indexOf(m.symbol) === -1)

  marketData = marketData.filter((m) => DefaultCoins.indexOf(m.symbol) !== -1)
  let coinsFiltered = Object.keys(CoinIconList32B64).reduce(function (filtered, key) {
    if (DefaultCoins.indexOf(key) !== -1) filtered[key] = CoinIconList32B64[key];
    return filtered;
  }, {});

  let coinData = getCoinData()

  let walletData = DefaultCoins.map((c) => {
    return {
      coin: c,
      amount: DefaultCoinAmounts[c],
      graphData: coinData[c]
    }
  })

  let balances = {}
  DefaultCoins.forEach(c => {
    balances[c] = DefaultCoinAmounts[c]
  })

  return {
    props: {
      trendingData: trendingData,
      marketData: marketData,
      coinImagesB64: coinsFiltered,
      rssJson: rssJson.rss.channel[0].item.slice(0, 5),
      coinData: coinData,
      walletData: walletData,
      balances: balances
    }
  }
}

//-------------------------------------------------------------

export default function Overview(props) {
  return (
    <>
      <WalletCarousel data={props.walletData} coinImagesB64={props.coinImagesB64} />
      <div className={css.graphSplit}>
        <OverviewGraph className={css.graphSplit__graph} data={props.coinData} balances={props.balances} />
        <PricesTable className={css.graphSplit__table} data={props.marketData.slice(0, 12)} coinImagesB64={props.coinImagesB64} walletData={props.walletData} />
      </div>

      <div className={css.halfSplit}>
        <TrendingCurrenciesTable data={props.trendingData} />
        <CryptoNewsfeed data={props.rssJson} />
      </div>
    </>
  )
}
