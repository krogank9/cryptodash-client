import css from './DollarCostAveragingTile.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

import Utils from '../../Utils'

interface DollarCostAveragingTileProps {
    className?: string,
    coinName: string,
    graphData: any,
    predictedData: any
}

const ONE_DAY = 1000 * 60 * 60 * 24
const ONE_WEEK = ONE_DAY * 7
const ONE_MONTH = ONE_DAY * 30
const ONE_YEAR = ONE_DAY * 365

class DollarCostAveragingTile extends React.Component<DollarCostAveragingTileProps> {
    state: {
        graphData: any,
        predictedData: any,
        dcaDuration: number,
        dcaFreq: number,
        dcaAmt: number,
    }

    constructor(props) {
        super(props)
        this.state = {
            graphData: [],
            predictedData: [],
            dcaDuration: ONE_YEAR,
            dcaFreq: ONE_DAY,
            dcaAmt: 10,
        }
    }

    getDCAString() {
        try {
            const investEndPrice = this.props.graphData.slice(0).pop()[1]
            const investEndTime = this.props.graphData.slice(0).pop()[0]
            const investStartTime = investEndTime - this.state.dcaDuration
            const data = this.props.graphData.filter(d => d[0] >= investStartTime)
            const investAmount = this.state.dcaAmt
            const freq = Math.round(this.state.dcaFreq / ONE_DAY)

            let balance = 0
            let totalInvested = 0
            for(let i = 0; i < data.length; i += freq) {
                balance += investAmount / Number(data[i][1])
                totalInvested += investAmount
            }

            const balanceInUSD = balance * investEndPrice
            const changePct = ((balanceInUSD - totalInvested) / totalInvested) * 100

            return (
                <p style={{ margin: "9px 0" }}>
                    You would have invested {Utils.nFormatter(totalInvested)} and walked away with {Utils.nFormatter(balanceInUSD)}, a {changePct.toFixed(1)}% {changePct >= 0 ? "profit" : "loss"}.
                </p>
            )
        }
        catch (err) {
            console.log(err)
            return <p></p>
        }
    }

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
                        <select value={this.state.dcaAmt} onChange={evt => this.setState({ ...this.state, dcaAmt: Number(evt.target.value) })}>
                            <option value={5}>$5</option>
                            <option value={10}>$10</option>
                            <option value={20}>$20</option>
                            <option value={100}>$100</option>
                        </select>
                        &nbsp; into {this.props.coinName} every &nbsp;
                        <select value={this.state.dcaFreq} onChange={evt => this.setState({ ...this.state, dcaFreq: Number(evt.target.value) })}>
                            <option value={ONE_DAY}>day</option>
                            <option value={ONE_DAY * 3}>3 days</option>
                            <option value={ONE_WEEK}>week</option>
                        </select>
                        &nbsp; for the last &nbsp;
                        <select value={this.state.dcaDuration} onChange={evt => this.setState({ ...this.state, dcaDuration: Number(evt.target.value) })}>
                            <option value={ONE_YEAR}>year</option>
                            <option value={ONE_YEAR * 5}>5 years</option>
                            <option value={ONE_YEAR * 999}>all time</option>
                        </select>
                    </div>
                    {this.getDCAString()}
                </div>
            </div>
        )
    }
}

export default DollarCostAveragingTile