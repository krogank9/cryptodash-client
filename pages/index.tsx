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

var fs = require('fs');
var xml2js = require('xml2js')
var parser = new xml2js.Parser();

export async function getServerSideProps(context) {
  // todo if context.req.cookie.isLoaded == true return {}

  var marketData = JSON.parse(fs.readFileSync('static_data/coins_markets_list.json', 'utf8'));
  var rssJson = await parser.parseStringPromise(fs.readFileSync( 'static_data/crypto_rss.xml', 'utf8'));

  var stableCoins = ["usdt", "dai", "usdc", "tusd", "dgx", "eusd", "busd", "gusd"]
  var trendingData = marketData.filter((m) => stableCoins.indexOf(m.symbol) === -1)

  marketData = marketData.filter((m) => DefaultCoins.indexOf(m.symbol) !== -1)
  let coinsFiltered = Object.keys(CoinIconList32B64).reduce(function (filtered, key) {
    if (DefaultCoins.indexOf(key) !== -1) filtered[key] = CoinIconList32B64[key];
    return filtered;
  }, {});

  return {
    props: {
      trendingData: trendingData,
      marketData: marketData,
      coinImagesB64: coinsFiltered,
      rssJson: rssJson.rss.channel[0].item.slice(0,5)
    }
  }
}

//-------------------------------------------------------------

export default function Overview(props) {
  return (
    <>
      <WalletCarousel />
      <div className={css.graphSplit}>
        <OverviewGraph className={css.graphSplit__graph} />
        <PricesTable className={css.graphSplit__table} data={props.marketData.slice(0,12)} coinImagesB64={props.coinImagesB64}/>
      </div>

      <div className={css.halfSplit}>
        <TrendingCurrenciesTable data={props.trendingData} />
        <CryptoNewsfeed data={props.rssJson} />
      </div>
    </>
  )
}
