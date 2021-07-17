import css from './Overview.module.scss'

import WalletCarousel from '../components/WalletCarousel/WalletCarousel'
import OverviewGraph from '../components/OverviewGraph/OverviewGraph'
import MarketCapTable from '../components/MarketCapTable/MarketCapTable'

export default function Overview({ Component, pageProps, className }) {
  return (
    <>
        <WalletCarousel />
        <div className={css.graphSplit}>
          <OverviewGraph className={css.overviewGraph} />
          <MarketCapTable />
        </div>
    </>
  )
}
