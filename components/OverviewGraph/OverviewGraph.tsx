import css from './OverviewGraph.module.scss'
import { generateData } from '../Graph/GenerateGraph.js'
import Graph, { GraphWithResize } from '../Graph/Graph'
import BTCPrices from '../../static_data/btc_1d.json'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

import React, { Component } from 'react';

interface OverviewGraphProps { className?: string }

class OverviewGraph extends React.Component<OverviewGraphProps> {
    containerRef: React.RefObject<HTMLDivElement>;
    state: {
        graphOptions: any,
        candlestick: boolean,
    }

    constructor(props) {
        super(props)
        this.containerRef = React.createRef()
        this.state = {
            graphOptions: {},
            candlestick: false,
        }
    }

    addData(data, balances?) {
        if(!balances)
            balances = data.map(_ => 1)
        let cumulativeGraph = data[0].map(e => [e[0], 0])
        data.forEach((coinGraph, coinGraphIndex) => {
            coinGraph.forEach((graphPoint, i) => {
                cumulativeGraph[i][1] += graphPoint[1] * balances[coinGraphIndex]
            })
        })
        return cumulativeGraph
    }

    weighData(data, amount) {
        return data.map(d => [d[0], d[1] * amount])
    }

    setGraphOptions = (candlestick?: false) => {

        let balances = StoreSingleton.walletData.reduce((acc, cur) => {acc[cur.coin] = cur.amount; return acc}, {})
        let balances_arr = StoreSingleton.walletData.map(w => balances[w.coin])
        let portfolio = this.addData(StoreSingleton.walletData.map(w => w.graphData), balances_arr)

        //console.log(this.props.walletData)

        let new_graphOptions = {
            width: this.containerRef.current.offsetWidth, height: 555,
            candlestick: candlestick,
            dataObjs: [
                { name: "Total Portfolio", data: portfolio, solidFill: false },
                { name: "BTC", data: this.weighData(StoreSingleton.walletData.find(w => w.coin === "btc").graphData, candlestick ? 1 : balances["btc"]), solidFill: false },
            ],
        }

        this.setState({...this.state, graphOptions: new_graphOptions })
    }

    componentDidMount() {
        this.setGraphOptions()
    }

    setcandlestick = (b) => {
        this.setGraphOptions(b)
    }

    selectChange = (evt) => {
        this.setcandlestick(evt.target.value === "candlestick")
    }

    makeControls() {
        const desktopPlotButton = (
            <div className={css.overviewGraph__controlsDesktopPlot}>
                <a className={css.overviewGraph__controlsDesktopPlotButton + " " + (!this.state.graphOptions.candlestick ? css.overviewGraph__controlsDesktopPlotButton_active : "")} onClick={() => this.setcandlestick(false)}>Line</a>
                <a className={css.overviewGraph__controlsDesktopPlotButton + " " + (this.state.graphOptions.candlestick ? css.overviewGraph__controlsDesktopPlotButton_active : "")} onClick={() => this.setcandlestick(true)}>Candlestick</a>
                <a className={css.overviewGraph__controlsDesktopPlotButton}>Predictive</a>
            </div>
        )
        const mobilePlotButton = (
            <select className={css.overviewGraph__controlsMobilePlot} onChange={this.selectChange} value={this.state.graphOptions.candlestick ? "candlestick" : "line"}>
                <option className={css.overviewGraph__controlsMobilePlotButton + " " + css.overviewGraph__controlsMobilePlotButton_active} value="line" {...this.state.graphOptions.candlestick ? {} : {selected: true}}>Line plot</option>
                <option className={css.overviewGraph__controlsMobilePlotButton} value="candlestick">Candlestick</option>
                <option className={css.overviewGraph__controlsMobilePlotButton} value="predictive">Predictive</option>
            </select>
        )

        const desktopTimeButton = (
            <div className={css.overviewGraph__controlsDesktopTime}>
                <a className={css.overviewGraph__controlsDesktopTimeButton + " " + css.overviewGraph__controlsDesktopTimeButton_active}>Day</a>
                <a className={css.overviewGraph__controlsDesktopTimeButton}>Week</a>
                <a className={css.overviewGraph__controlsDesktopTimeButton}>Month</a>
                <a className={css.overviewGraph__controlsDesktopTimeButton}>Year</a>
                <a className={css.overviewGraph__controlsDesktopTimeButton}>All</a>
            </div>
        )
        const mobileTimeButton = (
            <select className={css.overviewGraph__controlsMobileTime}>
                <option className={css.overviewGraph__controlsMobileTimeButton + " " + css.overviewGraph__controlsMobileTimeButton_active}>One day</option>
                <option className={css.overviewGraph__controlsMobileTimeButton}>One week</option>
                <option className={css.overviewGraph__controlsMobileTimeButton}>One month</option>
                <option className={css.overviewGraph__controlsMobileTimeButton}>One year</option>
                <option className={css.overviewGraph__controlsMobileTimeButton}>All</option>
            </select>
        )

        return (
            <>
                <div className={css.overviewGraph__controlsDesktop}>
                    {desktopPlotButton}
                    {desktopTimeButton}
                </div>
                <div className={css.overviewGraph__controlsMobile}>
                    {mobilePlotButton}
                    {mobileTimeButton}
                </div>
            </>
        )
    }

    render() {
        return (
            <div className={css.overviewGraph + " " + (this.props.className || "")} ref={this.containerRef}>
                {this.makeControls()}
                <div id="chart" className={css.overviewGraph__graphContainer}>
                    <GraphWithResize options={this.state.graphOptions} />
                </div>
            </div>
        )
    }
}

export default OverviewGraph