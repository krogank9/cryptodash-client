import css from './TrendingCurrenciesTable.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

interface TrendingCurrenciesTableProps {
    className?: string
}

class TrendingCurrenciesTable extends React.Component<TrendingCurrenciesTableProps> {

    makeList(data) {
        return data.map((d, i) => (
            <tr>
                <td>{i + 1}</td>
                <td>{d[0]}</td>
                <td>{d[1]}</td>
                <td>{d[2]} <IonIcon name="arrow-up-outline" /></td>
                <td>Analyze</td>
            </tr>
        ))
    }

    render() {
        let data = [["BTC", "$20,012", "+$4,032 1.2%"], ["BTC", "$20,012", "+$4,032 1.2%"], ["BTC", "$20,012", "+$4,032 1.2%"], ["BTC", "$20,012", "+$4,032 1.2%"]]
        return (
            <div className={css.TrendingCurrenciesTableContainer + " " + (this.props.className || "")}>
                <h3 className={css.TrendingCurrenciesTableTitle}>Top Trending Currencies</h3>
                <table className={css.TrendingCurrenciesTable} style={{ width: "100%", textAlign: "center" }}>
                    <tr>
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