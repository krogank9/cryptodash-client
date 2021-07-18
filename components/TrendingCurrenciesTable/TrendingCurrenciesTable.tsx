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
                <td>{i + 1}</td>
                <td>{d[0]}</td>
                <td>{d[1]}</td>
                <td className={css.TrendingCurrenciesTable__rowChange}>
                    <div className={css.TrendingCurrenciesTable__rowChangeNum}>
                        {d[2]}
                    </div>
                    <div className={css.TrendingCurrenciesTable__rowChangePct + " " + (d[2].charAt(0) == "+" ? css.TrendingCurrenciesTable__rowChangePct_positive : css.TrendingCurrenciesTable__rowChangePct_negative)}>
                        <span>{d[3]}</span><IonIcon name={d[2].charAt(0) == "+" ? "arrow-up-outline" : "arrow-down-outline"} />
                    </div>
                </td>
                <td>
                    <a href="#">Analyze</a>
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
            <div className={this.props.className}>
                <h3 className={css.TrendingCurrenciesTableTitle}>Top Trending Currencies</h3>
                <table className={css.TrendingCurrenciesTable} style={{ width: "100%", textAlign: "center" }} border={0} cellSpacing={0}>
                    <tr className={css.TrendingCurrenciesTable__headerRow}>
                        <th>#</th>
                        <th>Currency</th>
                        <th>Current Price</th>
                        <th>Change (24h)</th>
                        <th>Action</th>
                    </tr>
                    {this.makeList(data)}
                </table>
            </div>
        )
    }
}

export default TrendingCurrenciesTable