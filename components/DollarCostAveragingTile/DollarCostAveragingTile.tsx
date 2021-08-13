import css from './DollarCostAveragingTile.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

interface DollarCostAveragingTileProps {
    className?: string,
    data: any
    coinName: string
}

class DollarCostAveragingTile extends React.Component<DollarCostAveragingTileProps> {
    render() {
        return (
            <div>
                <div className={css.titleContainer}>
                    <IonIcon className={css.titleContainerIcon} name="cash" />
                    <h2 className={css.titleContainerText}>Dollar Cost Averaging</h2>
                </div>
                <p>
                    Dollar Cost Averaging is when you invest a fixed amount on a regular basis, instead of buying a large amount all at once.
                    This strategy is a simple way to shield yourself from market volatility while still taking advantage of a general upward trend.
                </p>
                <div className={css.dcaCalculator}>
                    <div>
                        If you invested &nbsp;
                        <select value="10">
                            <option value="5">$5</option>
                            <option value="10">$10</option>
                            <option value="20">$20</option>
                            <option value="100">$100</option>
                        </select>
                        &nbsp; into {this.props.coinName} every &nbsp;
                        <select>
                            <option value="1">day</option>
                            <option  value="3">3 days</option>
                            <option  value="7">week</option>
                        </select>
                        &nbsp; for the last &nbsp;
                        <select>
                            <option value="365">year</option>
                            <option value="1825">5 years</option>
                            <option  value="999999999999">all time</option>
                        </select>
                    </div>
                    <p style={{ margin: "9px 0" }}>
                        You would have invested $3650 and walked away with $7202, a 202% profit.
                    </p>
                </div>
            </div>
        )
    }
}

export default DollarCostAveragingTile