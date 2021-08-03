import css from './PricesTable.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

function nFormatter(num) {

    if(num < 1000) {
      return "$"+Number(num).toFixed(2)
    }
  
    const lookup = [
        { value: 1e18, symbol: "E" },
        { value: 1e15, symbol: "P" },
        { value: 1e12, symbol: "T" },
        { value: 1e9, symbol: "G" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "K" },
        { value: 1, symbol: "" },
    ];
    var item = lookup.find(function (item) {
        return num >= item.value;
    });
    return item ? "$" + (num / item.value).toFixed(2) + item.symbol : "0";
  }

interface PricesTableProps {
    className?: string,
    data?: any,
    coinImagesB64?: any,
    walletData?: any
}

class PricesTable extends React.Component<PricesTableProps> {

    makeList(data) {
        data = data.slice(0,20).map((coinInfo) => [coinInfo.symbol.toUpperCase(), nFormatter(coinInfo.current_price), Number(coinInfo.price_change_percentage_24h).toFixed(1)+"%"])

        return data.map((d, i) => {
            if(d[2].charAt(0) !== "-" && d[2].charAt(0) !== "+") {
                d[2] = "+"+d[2]
            }

            let coinBase64 = this.props.coinImagesB64[d[0].toLowerCase()] || this.props.coinImagesB64["generic"]
            
            return (
                <li className={css.pricesTable__listItem} key={i}>
                    <div className={css.pricesTable__listItemName}>
                        <img src={"data:image/png;base64,"+coinBase64} />
                        <div>{d[0]}</div>
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
        if(amount < 10000) 
            return "$" + Number(amount).toLocaleString("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 2})
        else
            return "$" + Number(amount).toLocaleString("en-US", {maximumFractionDigits: 0, minimumFractionDigits: 0})
    }

    getChangePct(data) {
        let start = data[0][1]
        let end = data[data.length - 1][1]
        let change = end / start
        let changePct = Number((change - 1) * 100)
        return changePct
    }

    addData(data, amounts?) {
        if(!amounts)
            amounts = data.map(_ => 1)
        let cumulativeGraph = data[0].map(e => [e[0], e[1] * amounts[0]])
        data.slice(1).forEach((coinGraph, coinGraphIndex) => {
            coinGraph.forEach((graphPoint, i) => {
                cumulativeGraph[i][1] += graphPoint[1] * amounts[coinGraphIndex + 1]
            })
        })
        return cumulativeGraph
    }

    render() {
        let totalGraph = this.addData(this.props.walletData.map(w => w.graphData.prices), this.props.walletData.map(w => w.amount))
        let curTotal = totalGraph[totalGraph.length - 1][1]
        let changePct = this.getChangePct(totalGraph)

        return (
            <div className={css.pricesTable + " " + (this.props.className || "")}>
                <div className={css.pricesTable__header}>
                    Current Prices
                    <IonIcon style={{ float: "right" }} name="swap-vertical-outline" />
                </div>
                <div className={css.pricesTable__listContainer}>
                    <ul className={css.pricesTable__list}>
                        {this.makeList(this.props.data)}
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
}

export default PricesTable