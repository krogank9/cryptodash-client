import css from './Overview.module.scss'

import WalletCarousel from '../components/WalletCarousel/WalletCarousel'
import OverviewGraph from '../components/OverviewGraph/OverviewGraph'
import PricesTable from '../components/PricesTable/PricesTable'
import IonIcon from '../components/IonIcon/IonIcon'
import TrendingCurrenciesTable from '../components/TrendingCurrenciesTable/TrendingCurrenciesTable'
import CryptoNewsfeed from '../components/CryptoNewsfeed/CryptoNewsfeed'

export default function Overview(props) {
  return (
    <>
      <WalletCarousel />
      <div className={css.graphSplit}>
        <OverviewGraph className={css.graphSplit__graph} />
        <PricesTable className={css.graphSplit__table} data={props.marketData}/>
      </div>

      <div className={css.halfSplit}>
        <TrendingCurrenciesTable />
        <CryptoNewsfeed />
      </div>
    </>
  )
}
