import css from './Overview.module.scss'

import WalletCarousel from '../components/WalletCarousel/WalletCarousel'
import OverviewGraph from '../components/OverviewGraph/OverviewGraph'
import MarketCapTable from '../components/MarketCapTable/MarketCapTable'
import IonIcon from '../components/IonIcon/IonIcon'
import TrendingCurrenciesTable from '../components/TrendingCurrenciesTable/TrendingCurrenciesTable'



export default function Overview({ Component, pageProps, className }) {
  return (
    <>
      <WalletCarousel />
      <div className={css.graphSplit}>
        <OverviewGraph className={css.graphSplit__graph} />
        <MarketCapTable className={css.graphSplit__table} />
      </div>

      <div className={css.halfSplit}>
        <TrendingCurrenciesTable />
        <div>
          <h3>Crypto Newsfeed</h3>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            <li>
              <h4>Bitcoin Holds Above $30K but Price Chart Looks 'Ugly'</h4>
              <span>CoinDesk - Bitcoin News, Blockchain News - 4h ago</span>
              <p>Also, Circle might be an attractive "starter stock for the cautious" when it goes public, according to one analyst.</p>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
