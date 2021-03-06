import css from './TrendingCurrenciesTable.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';
import StoreSingleton from '../../store/CryptodashStoreSingleton';
import { observer } from 'mobx-react'

interface TrendingCurrenciesTableProps {
    className?: string,
    data?: any
}

export default observer(class TrendingCurrenciesTable extends React.Component<TrendingCurrenciesTableProps> {

    makeList(data) {

        data = data.slice(0).sort((a, b) => b["price_change_24h"] - a["price_change_24h"])

        return data.slice(0, 20).map((d, i) => {
            let priceChange = Number(d["price_change_24h"])
            let positiveChange = priceChange >= 0
            let priceChangeFmt = priceChange.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            if (priceChange == 0) {
                priceChangeFmt = "$0.00"
            }
            else if (priceChange > 0) {
                priceChangeFmt = "+$" + priceChangeFmt
            }
            else if (priceChange < 0) {
                priceChangeFmt = "-$" + priceChangeFmt.substring(1) // remove minus sign
            }

            let decDigits = d["current_price"] > 999 ? 2 : 2

            return (
                <tr className={css.TrendingCurrenciesTable__row} key={i}>
                    <td className="show-desktop-only">{i + 1}</td>
                    <td>{d["symbol"].toUpperCase()}</td>
                    <td>{"$" + d["current_price"].toLocaleString("en-US", { minimumFractionDigits: decDigits, maximumFractionDigits: decDigits })}</td>
                    <td className={css.TrendingCurrenciesTable__rowChange}>
                        <span className={css.TrendingCurrenciesTable__rowChangeNum}>
                            {priceChangeFmt}
                        </span>
                        <span className={css.TrendingCurrenciesTable__rowChangePct + " " + (positiveChange ? css.TrendingCurrenciesTable__rowChangePct_positive : css.TrendingCurrenciesTable__rowChangePct_negative)}>
                            <span>{Number(d["price_change_percentage_24h"]).toFixed(1).replace("-", "") + "%"}</span><IonIcon name={positiveChange ? "arrow-up-outline" : "arrow-down-outline"} />
                        </span>
                    </td>
                    <td className="show-1650-and-up">
                        <a href={`/analyze/${d["symbol"]}`}>Analyze</a>
                    </td>
                </tr>
            )
        })
    }

    render() {
        const stableCoins = ["usdt", "dai", "usdc", "tusd", "dgx", "eusd", "busd", "gusd", "cusdc", "wbtc"]
        const trendingData = StoreSingleton.marketData.filter(m => stableCoins.indexOf(m.symbol) === -1).sort((a, b) => b.market_cap_change_24h - a.market_cap_change_24h).slice(0, 20)

        return (
            <div className={css.TrendingCurrenciesTableTile + " " + (this.props.className || "")}>
                <div className={css.TrendingCurrenciesTitle}>
                    <IonIcon className={css.TrendingCurrenciesTitle__icon} name="stats-chart" />
                    <h3 className={css.TrendingCurrenciesTitle__text}>Top Trending Currencies</h3>
                </div>
                <div className={css.TrendingCurrenciesTableContainer}>
                    <table className={css.TrendingCurrenciesTable} style={{ width: "100%", textAlign: "center" }} cellSpacing={0}>
                        <thead>
                            <tr className={css.TrendingCurrenciesTable__headerRow}>
                                <th className="show-desktop-only">#</th>
                                <th>
                                    <span className="show-desktop-only">
                                        Currency
                                    </span>
                                    <span className="show-tablet-and-under">
                                        Coin
                                    </span>
                                </th>
                                <th>Price</th>
                                <th>Change (24h)</th>
                                <th className="show-1650-and-up">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.makeList(trendingData)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
})