import css from './PricesTable.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

interface PricesTableProps {
    className?: string,
    data?: any,
    coinImagesB64?: any,
}

class PricesTable extends React.Component<PricesTableProps> {

    makeList(data) {
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

    render() {
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
                            <span className="show-mobile-only">Balance:</span>
                        </div>
                        <div className={css.pricesTable__footerItemInfo}>
                            <div className={css.pricesTable__footerItemInfoBalance}>
                                $1,234.12
                            </div>
                            <div className={css.pricesTable__footerItemInfoChange + " " + css.pricesTable__footerItemInfoChange_positive}>
                                <span>+1.2%</span><IonIcon name="arrow-up-outline" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PricesTable