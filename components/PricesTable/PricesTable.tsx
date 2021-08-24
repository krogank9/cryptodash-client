import css from './PricesTable.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

import Utils from '../../Utils'
import CryptodashStoreSingleton from '../../store/CryptodashStoreSingleton.js';

import { observer } from 'mobx-react'

interface PricesTableProps {
    className?: string
}

export default observer(class PricesTable extends React.Component<PricesTableProps> {

    state: {
        sortDescending: boolean
    }

    constructor(props) {
        super(props)

        this.state = {
            sortDescending: true
        }
    }

    makeList(data) {
        data = data.map(w => ({
            symbol: w.coin,
            current_price: w.graph_1d.slice(0).pop()[1],
            price_change_percentage_24h: Utils.getChangePct(w.graph_1d)
        }))
        data.sort((a, b) => this.state.sortDescending ? (b.current_price - a.current_price) : (a.current_price - b.current_price))
        data = data.map((coinInfo) => [coinInfo.symbol, Utils.nFormatter(coinInfo.current_price), Number(coinInfo.price_change_percentage_24h).toFixed(1) + "%"])

        return data.map((d, i) => {
            if (d[2].charAt(0) !== "-" && d[2].charAt(0) !== "+") {
                d[2] = "+" + d[2]
            }

            let coinBase64 = StoreSingleton.getCoinImageB64(d[0].toLowerCase())

            let selectedStyle = ""
            if(StoreSingleton.selectedCoin.coin === d[0]) {
                console.log("Coin is selected. Setting style")
                selectedStyle = " " + css.pricesTable__listItem_selected
            }

            return (
                <li className={css.pricesTable__listItem + selectedStyle} key={i} onClick={() => StoreSingleton.setSelectedCoin(d[0])}>
                    <div className={css.pricesTable__listItemName}>
                        <img src={"data:image/png;base64," + coinBase64} />
                        <div>{d[0].toUpperCase()}</div>
                    </div>
                    <div className={css.pricesTable__listItemInfo}>
                        <div className={css.pricesTable__listItemInfoBalance}>
                            {d[1]}
                        </div>
                        <div className={css.pricesTable__listItemInfoChange + " " + (d[2].charAt(0) == "+" ? css.pricesTable__listItemInfoChange_positive : css.pricesTable__listItemInfoChange_negative)}>
                            <span>{d[2]}</span><IonIcon name={d[2].charAt(0) == "+" ? "arrow-up-outline" : "arrow-down-outline"} />
                        </div>
                    </div>
                </li>
            )
        }
        )
    }


    // Refactor into utilties file... reuse.
    formatCurrency(amount) {
        if (amount < 10000)
            return "$" + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
        else
            return "$" + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })
    }

    addData(data, amounts) {
        let cumulativeGraph = data[0].map(e => [e[0], 0])
        data.forEach((coinGraph, coinGraphIndex) => {
            coinGraph.forEach((graphPoint, i) => {
                if (!cumulativeGraph[i])
                    console.log(`could not find i ${i}. cumulativeGraphLen = ${cumulativeGraph.length}, coinGraphLen=${coinGraph.length}`)
                cumulativeGraph[i][1] += graphPoint[1] * amounts[coinGraphIndex]
            })
        })
        return cumulativeGraph
    }

    render() {
        let curTotal
        let totalGraph
        let changePct

        try {
            let oneDayData = StoreSingleton.walletData_1d.map(w => w.graph_1d)
            //console.log(oneDayData)
            let largestTimespanData = oneDayData.slice(0).sort((a, b) => (b[b.length - 1][0] - b[0][0]) - (a[a.length - 1][0] - a[0][0]))[0]

            //console.log(largestTimespanData)
            // Transform all data to the largest spanning graphs space.
            // Have to do this so indices & times will match up for when we add the graph.
            // Mostly for "all time" graphs where each coin's graph may have a different starting day, month, year.
            // Also good to normalize all for safety before we add them incase CoinGecko's API returns something unexpected.
            let sameSpaceData = oneDayData.map((g, i) => {
                if (g === largestTimespanData)
                    return g
                else
                    return Utils.transformGraphSpace(g, largestTimespanData, StoreSingleton.walletData[i].graph_1w)
            })

            totalGraph = this.addData(sameSpaceData, StoreSingleton.walletData_1d.map(w => w.amount))
            curTotal = totalGraph.slice(0).pop()[1]
            changePct = Utils.getChangePct(totalGraph)
        } catch {
            totalGraph = []
            curTotal = 0
            changePct = 0
        }

        return (
            <div className={css.pricesTable + " " + (this.props.className || "")}>
                <div className={css.pricesTable__header}>
                    Current Prices
                    <IonIcon style={{ float: "right" }} name="swap-vertical-outline" onClick={() => this.setState({sortDescending: !this.state.sortDescending})} />
                </div>
                <div className={css.pricesTable__listContainer}>
                    <ul className={css.pricesTable__list}>
                        {this.makeList(StoreSingleton.walletData_1d)}
                    </ul>
                </div>
                <div className={css.pricesTable__footer}>
                    <div className={css.pricesTable__footerItem}>
                        <div className={css.pricesTable__footerItemName}>
                            <span className="show-desktop-only">Balance:</span>
                            <span className="show-tablet-only">Total Portfolio Balance:</span>
                            <span className="show-mobile-only">Portfolio Balance:</span>
                        </div>
                        <div className={css.pricesTable__footerItemInfo}>
                            <div className={css.pricesTable__footerItemInfoBalance}>
                                {this.formatCurrency(curTotal)}
                            </div>
                            <div className={css.pricesTable__footerItemInfoChange + " " + (changePct >= 0 ? css.pricesTable__footerItemInfoChange_positive : css.pricesTable__footerItemInfoChange_negative)}>
                                <span>{changePct > 0 ? "+" : ""}{changePct.toFixed(1)}%</span><IonIcon name={changePct >= 0 ? "arrow-up-outline" : "arrow-down-outline"} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})