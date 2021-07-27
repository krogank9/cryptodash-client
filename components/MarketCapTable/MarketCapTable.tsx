import css from './MarketCapTable.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

interface MarketCapTableProps {
    className?: string
}

class MarketCapTable extends React.Component<MarketCapTableProps> {

    makeList(data) {
        return data.map((d, i) => (
            <div className={css.marketCapTable__listItem} key={i}>
                <div className={css.marketCapTable__listItemName}>
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACv0lEQVR4AaxWA6xdQRB9URs7qW0rThvXiGvbdqPa/EZt27bNb9u83tOd4u733W16knc1u3Nmd2bOPp8scKpDLd2vUV/dr0GA7t/gPv9F6P71i+hHz/SNbDSGxvr+FxDQtC53Hqj71S/Q/OpD5kdjaQ7N/Xfiay1ra34N1nBnxcK52o/mkg/ypbxqPvG5BInUj3xJ74YR2LAzn5CkQCD1I5+GX8NOEitXIVcPgjiqz7nitluvdsBJfQ39cC9oIW2gBbWQSkeVNUHForoiJ+0NGHM4eVuYzzaCORaMi6NkglhTudUkqt2OvQkn+RnMF9s40QgihJP56bct4SEI2r4eUt1RLhXUszIrZsXpqAhWkgXr4z4wswROfpz07hGnUDhpkWkA4+ZsVAdm67C+neA10VNKrIjbR9KplPvwzigL885CWJ8Pg5XmiEDMUhhXxnv6Im4f6bdKAMb1aS6RkxcjbLwQ7fh7ro0C8uoK4qb831dqvU8HXBLry5HyDk8PBgQ8U0HcFECEUuvlRLgEpANaQFMR3NsAsQOODS20nVcAET46TuXz3wkCgsgpSAQzilEW1vswT3/ErRSAcX2qIC5K5cV3iJMnoCLM+8skW7F+oVIKrE/7IfJ/VDg6NZAL1HPXRruhH+8jowURoggV82/cnFXeHtAErCDJtZNqSgRw37MN9RN9eLvFwk56DAGS3O4Vx5IsixbN+OgZAHF7CpH9/VSVhUfiY95ZwFtvCIwLw0QHiBRJCZG3FId1hHFtCum9KDgPMNsgDZCSYqXDyHq1CwTrQzhXvbsoD6GAxs2ZUoeR8nHspL4CY4wLTHuYT9eBYD5cBf1kPxiXx4K6QQtupX4cS/0h8W8IJz8eTtZXend1X/u5+SbkNM2ayG+SzdSA1wl/n55Alye/SUb/RunAN8vp3zEZCl0z+ndOB7x7DgARoloEset8/QAAAABJRU5ErkJggg==" />
                    <div>{d[0]}</div>
                </div>
                <div className={css.marketCapTable__listItemInfo}>
                    <div className={css.marketCapTable__listItemInfoBalance}>
                        {d[1]}
                    </div>
                    <div className={css.marketCapTable__listItemInfoChange + " " + (d[2].charAt(0) == "+" ? css.marketCapTable__listItemInfoChange_positive : css.marketCapTable__listItemInfoChange_negative)}>
                        <span>{d[2]}</span><IonIcon name={d[2].charAt(0) == "+" ? "arrow-up-outline" : "arrow-down-outline"} />
                    </div>
                </div>
            </div>
        ))
    }

    render() {
        let data = [["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "+1.2%"], ["BTC", "$39,034", "-1.2%"]]
        return (
            <div className={css.marketCapTable + " " + (this.props.className || "")}>
                <div className={css.marketCapTable__header}>
                    Market Cap
                    <IonIcon style={{ float: "right" }} name="swap-vertical-outline" />
                </div>
                <div className={css.marketCapTable__list}>
                    {this.makeList(data)}
                </div>
                <div className={css.marketCapTable__footer}>
                    <div className={css.marketCapTable__footerItem}>
                        <div className={css.marketCapTable__footerItemName}>
                            <span className="show-desktop-only">Balance:</span>
                            <span className="show-tablet-only">Total Portfolio Balance:</span>
                            <span className="show-mobile-only">Balance:</span>
                        </div>
                        <div className={css.marketCapTable__footerItemInfo}>
                            <div className={css.marketCapTable__footerItemInfoBalance}>
                                $1,234.12
                            </div>
                            <div className={css.marketCapTable__footerItemInfoChange + " " + css.marketCapTable__footerItemInfoChange_positive}>
                                <span>+1.2%</span><IonIcon name="arrow-up-outline" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MarketCapTable