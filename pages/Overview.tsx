import css from './Overview.module.scss'

import WalletCarousel from '../components/WalletCarousel/WalletCarousel'
import OverviewGraph from '../components/OverviewGraph/OverviewGraph'
import MarketCapTable from '../components/MarketCapTable/MarketCapTable'
import IonIcon from '../components/IonIcon/IonIcon'
import TrendingCurrenciesTable from '../components/TrendingCurrenciesTable/TrendingCurrenciesTable'
import CryptoNewsfeed from '../components/CryptoNewsfeed/CryptoNewsfeed'

export default function Overview(props) {
  let data = [
    ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "-1.2%"],
    ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "-1.2%"],
    ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "-1.2%"],
    ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "-1.2%"],
  ]
  
  return (
    <>
      <WalletCarousel />
      <div className={css.graphSplit}>
        <OverviewGraph className={css.graphSplit__graph} />
        <MarketCapTable className={css.graphSplit__table} data={props.marketData}/>
      </div>

      <div className={css.halfSplit}>
        <TrendingCurrenciesTable />
        <CryptoNewsfeed />
      </div>
    </>
  )
}
