import css from './OverviewGraph.module.scss'
import { generateData } from '../Graph/GenerateGraph.js'
import Graph, { GraphWithResize } from '../Graph/Graph'
import BTCPrices from '../../static_data/btc_1d.json'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

import React, { Component } from 'react';
import { toJS } from 'mobx';

interface OverviewGraphProps { className?: string }

class OverviewGraph extends React.Component<OverviewGraphProps> {
    containerRef: React.RefObject<HTMLDivElement>;
    state: {
        graphOptions: any,
        candlestick: boolean,
        timeFrame: string
    }

    constructor(props) {
        super(props)
        this.containerRef = React.createRef()
        this.state = {
            graphOptions: {},
            candlestick: false,
            timeFrame: "1d"
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

    setGraphOptions = (state = {candlestick: false, timeFrame: "1d"}) => {
        if(state.timeFrame === undefined)
            state.timeFrame = this.state.timeFrame || "1d"
        if(state.candlestick === undefined)
            state.candlestick = this.state.candlestick || false 

        //console.log(`StoreSingleton.walletData.find(w => w.coin === "btc")`)
        //console.log(StoreSingleton.walletData.find(w => w.coin === "btc"))

        let walletData = toJS(StoreSingleton.walletData)
        console.log(`Setting new graph options... timeFrame: ${state.timeFrame}`)
        console.log(walletData)
        console.log(walletData.find(w => w.coin === "btc"))

        //console.log("after convert")
        //console.log(walletData.find(w => w.coin === "btc"))

        let balances = walletData.reduce((acc, cur) => {acc[cur.coin] = cur.amount; return acc}, {})
        let balances_arr = walletData.map(w => balances[w.coin])
        //let portfolio = this.addData(walletData.map(w => w["graph_"+state.timeFrame]), balances_arr)

        //console.log(this.props.walletData)

        let new_graphOptions = {
            width: this.containerRef.current.offsetWidth, height: 555,
            candlestick: state.candlestick,
            dataObjs: [
                //{ name: "Total Portfolio", data: portfolio, solidFill: false },
                { name: "BTC", data: this.weighData(walletData.find(w => w.coin === "btc")["graph_"+state.timeFrame], state.candlestick ? 1 : balances["btc"]), solidFill: false },
            ],
        }

        this.setState({...state, graphOptions: new_graphOptions })
    }

    componentDidMount() {
        this.setGraphOptions()
    }

    setCandlestick = (b) => {
        this.setGraphOptions({...this.state, candlestick: b})
    }

    graphTypeSelect = (evt) => {
        this.setCandlestick(evt.target.value === "candlestick")
    }

    setTimeframe = (t) => {
        this.setGraphOptions({...this.state, timeFrame: t})
        ///this.setGraphOptions(this.state.graphOptions.candlestick)
    }

    graphTimeSelect = (evt) => {
        this.setTimeframe(evt.target.value)
    }

    makeControls() {
        const desktopPlotButton = (
            <div className={css.overviewGraph__controlsDesktopPlot}>
                <a className={css.overviewGraph__controlsDesktopPlotButton + " " + (!this.state.graphOptions.candlestick ? css.overviewGraph__controlsDesktopPlotButton_active : "")} onClick={() => this.setCandlestick(false)}>Line</a>
                <a className={css.overviewGraph__controlsDesktopPlotButton + " " + (this.state.graphOptions.candlestick ? css.overviewGraph__controlsDesktopPlotButton_active : "")} onClick={() => this.setCandlestick(true)}>Candlestick</a>
                <a className={css.overviewGraph__controlsDesktopPlotButton}>Predictive</a>
            </div>
        )
        const mobilePlotButton = (
            <select className={css.overviewGraph__controlsMobilePlot} onChange={this.graphTypeSelect} value={this.state.graphOptions.candlestick ? "candlestick" : "line"} value={this.state.candlestick ? "candlestick" : "line"}>
                <option className={css.overviewGraph__controlsMobilePlotButton + " " + css.overviewGraph__controlsMobilePlotButton_active} value="line">Line plot</option>
                <option className={css.overviewGraph__controlsMobilePlotButton} value="candlestick">Candlestick</option>
                <option className={css.overviewGraph__controlsMobilePlotButton} value="predictive">Predictive</option>
            </select>
        )

        const desktopTimeButton = (
            <div className={css.overviewGraph__controlsDesktopTime}>
                <a className={css.overviewGraph__controlsDesktopTimeButton + " " + (this.state.timeFrame === "1d" ? css.overviewGraph__controlsDesktopTimeButton_active : "")} onClick={() => this.setTimeframe("1d")}>Day</a>
                <a className={css.overviewGraph__controlsDesktopTimeButton + " " + (this.state.timeFrame === "1w" ? css.overviewGraph__controlsDesktopTimeButton_active : "")} onClick={() => this.setTimeframe("1w")}>Week</a>
                <a className={css.overviewGraph__controlsDesktopTimeButton + " " + (this.state.timeFrame === "1m" ? css.overviewGraph__controlsDesktopTimeButton_active : "")} onClick={() => this.setTimeframe("1m")}>Month</a>
                <a className={css.overviewGraph__controlsDesktopTimeButton + " " + (this.state.timeFrame === "1y" ? css.overviewGraph__controlsDesktopTimeButton_active : "")} onClick={() => this.setTimeframe("1y")}>Year</a>
                <a className={css.overviewGraph__controlsDesktopTimeButton + " " + (this.state.timeFrame === "all" ? css.overviewGraph__controlsDesktopTimeButton_active : "")} onClick={() => this.setTimeframe("all")}>All</a>
            </div>
        )
        const mobileTimeButton = (
            <select className={css.overviewGraph__controlsMobileTime} onChange={this.graphTimeSelect} value={this.state.timeFrame}>
                <option className={css.overviewGraph__controlsMobileTimeButton + " " + css.overviewGraph__controlsMobileTimeButton_active} value="1d">One day</option>
                <option className={css.overviewGraph__controlsMobileTimeButton} value="1w">One week</option>
                <option className={css.overviewGraph__controlsMobileTimeButton} value="1m">One month</option>
                <option className={css.overviewGraph__controlsMobileTimeButton} value="1y">One year</option>
                <option className={css.overviewGraph__controlsMobileTimeButton} value="all">All</option>
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