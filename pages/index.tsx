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

var fs = require('fs');
var xml2js = require('xml2js')
var parser = new xml2js.Parser();

export async function getServerSideProps(context) {

  var marketData = JSON.parse(fs.readFileSync('static_data/coins_markets_list.json', 'utf8'));
  var rssJson = await parser.parseStringPromise(fs.readFileSync( 'static_data/crypto_rss.xml', 'utf8'));

  return {
    props: {
      marketData: marketData,
      coinImagesB64: CoinIconList32B64,
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
        <PricesTable className={css.graphSplit__table} data={props.marketData} coinImagesB64={props.coinImagesB64}/>
      </div>

      <div className={css.halfSplit}>
        <TrendingCurrenciesTable data={props.marketData} />
        <CryptoNewsfeed data={props.rssJson} />
      </div>
    </>
  )
}
