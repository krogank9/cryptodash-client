import css from './TrendingCurrenciesTable.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

interface TrendingCurrenciesTableProps {
    className?: string
}

class TrendingCurrenciesTable extends React.Component<TrendingCurrenciesTableProps> {

    makeList(data) {
        return data.map((d, i) => (
            <tr className={css.TrendingCurrenciesTable__row}>
                <td className="show-desktop-only">{i + 1}</td>
                <td>{d[0]}</td>
                <td>{d[1]}</td>
                <td className={css.TrendingCurrenciesTable__rowChange}>
                    <span className={css.TrendingCurrenciesTable__rowChangeNum}>
                        {d[2]}
                    </span>
                    <span className={css.TrendingCurrenciesTable__rowChangePct + " " + (d[2].charAt(0) == "+" ? css.TrendingCurrenciesTable__rowChangePct_positive : css.TrendingCurrenciesTable__rowChangePct_negative)}>
                        <span>{d[3]}</span><IonIcon name={d[2].charAt(0) == "+" ? "arrow-up-outline" : "arrow-down-outline"} />
                    </span>
                </td>
                <td className="show-1550-and-up">
                    <a>Analyze</a>
                </td>
            </tr>
        ))
    }

    render() {
        let data = [
            ["BTC", "$20,012", "+$4,032", "1.2%"],
            ["BTC", "$20,012", "+$4,032", "1.2%"],
            ["BTC", "$20,012", "+$4,032", "1.2%"],
            ["BTC", "$20,012", "+$4,032", "1.2%"],
            ["BTC", "$20,012", "+$4,032", "1.2%"],
            ["BTC", "$20,012", "+$4,032", "1.2%"],
            ["BTC", "$20,012", "+$4,032", "1.2%"],
            ["BTC", "$20,012", "+$4,032", "1.2%"],
        ]
        return (
            <div className={css.TrendingCurrenciesTableContainer+" "+(this.props.className||"")}>
                <div className={css.TrendingCurrenciesTitle}>
                    <IonIcon className={css.TrendingCurrenciesTitle__icon} name="stats-chart" />
                    <h3 className={css.TrendingCurrenciesTitle__text}>Top Trending Currencies</h3>
                </div>
                <table className={css.TrendingCurrenciesTable} style={{ width: "100%", textAlign: "center" }} cellSpacing={0}>
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
                        <th className="show-1550-and-up">Action</th>
                    </tr>
                    {this.makeList(data)}
                </table>
            </div>
        )
    }
}

export default TrendingCurrenciesTable