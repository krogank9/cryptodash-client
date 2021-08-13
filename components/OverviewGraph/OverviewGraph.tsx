import css from './OverviewGraph.module.scss'
import Graph, { GraphWithResize } from '../Graph/Graph'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

import React, { Component } from 'react';
import { toJS } from 'mobx';

import Utils from '../../Utils'

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

    transformGraphSpace(from, to) {
        // Make x coords of "from" graph match the "to" graph, interpolate between points.
        return to.map((point, i) => {
            const time = point[0]

            // Find interpolated value on the "from" graph.
            let xAboveIndex = from.findIndex((p) => p[0] >= time)
            // if "to" spans more recent times than "from", use most recently available data to interpolate from
            if (time > from[from.length - 1][0])
                return [time, from[from.length - 1][1]]//xAboveIndex = from.length - 1
            let xBelowIndex = xAboveIndex - 1

            // When either index is -1, it means the graph hasn't started yet. One of the coins may be older than the other.
            // Treat the value before starting as 0
            let xAboveVal = xAboveIndex < 0 ? 0 : from[xAboveIndex][1]
            let xBelowVal = xBelowIndex < 0 ? 0 : from[xBelowIndex][1]
            let xAboveTime = xAboveIndex < 0 ? 0 : from[xAboveIndex][0]
            let xBelowTime = xBelowIndex < 0 ? 0 : from[xBelowIndex][0]

            if (i === to.length - 1)
                0;//return [time, point[1]]

            // Lerp from values from "from" graph's times to "to" graph's times
            let betweenSpan = xAboveTime - xBelowTime
            if (betweenSpan === 0) {
                console.log(`found zero. xAboveIndex: ${xAboveIndex}. time: ${time}`)
                return [time, xAboveVal]
            }
            let pctBetween = (time - xBelowTime) / betweenSpan

            let result = Utils.clamp(Utils.lerp(xBelowVal, xAboveVal, pctBetween), xBelowVal, xAboveVal)
            if (isNaN(result) || result === 0) {
                console.log(`NaN on ${i}, betweenSpan: ${betweenSpan}, pctBetween: ${pctBetween}`)
            }

            return [time, result]
        })
    }

    clampGraphResolution(graph, maxVals) {
        let mod = Math.floor(graph.length / maxVals)
        if (mod === 0)
            return graph

        return graph.filter((_, i) => i === 0 || i % mod === 0 || i === graph.length - 1)
    }

    addData(data) {
        let cumulativeGraph = data[0].map(e => [e[0], 0])
        console.log("cumulativeGraph (Overview) data")
        console.log(data)
        data.forEach(coinGraph => {
            coinGraph.forEach((graphPoint, i) => {
                cumulativeGraph[i][1] += graphPoint[1]
            })
        })
        return cumulativeGraph
    }

    weighData(data, amount) {
        return data.map(d => [d[0], d[1] * amount])
    }

    setGraphOptions = (state = { candlestick: false, timeFrame: "1d" }) => {
        if (state.timeFrame === undefined)
            state.timeFrame = this.state.timeFrame || "1d"
        if (state.candlestick === undefined)
            state.candlestick = this.state.candlestick || false

        let walletData = toJS(StoreSingleton.walletData)//.slice(0,2)
        console.log("walletData")
        console.log(walletData)
        console.log(`portfolio={${walletData.map(w => w.coin).join(", ")}}`)
        let balances = walletData.reduce((acc, cur) => { acc[cur.coin] = cur.amount; return acc }, {})
        let balances_arr = walletData.map(w => balances[w.coin])
        let balanceWeightedData = walletData.map(w => this.clampGraphResolution(w["graph_" + state.timeFrame], 500))

        // Don't need to apply weights if looking at candlestick graph of individual coin
        if (!state.candlestick) {
            balanceWeightedData = balanceWeightedData.map((g, i) => this.weighData(g, balances_arr[i]))
        }

        let largestTimespanData = balanceWeightedData.slice(0).sort((a, b) => (b[b.length - 1][0] - b[0][0]) - (a[a.length - 1][0] - a[0][0]))[0]

        //console.log(largestTimespanData)
        // Transform all data to the largest spanning graphs space.
        // Have to do this so indices & times will match up for when we add the graph.
        // Mostly for "all time" graphs where each coin's graph may have a different starting day, month, year.
        // Also good to normalize all for safety before we add them incase CoinGecko's API returns something unexpected.
        let sameSpaceData = balanceWeightedData.map(g => {
            if (g === largestTimespanData)
                return g
            else
                return this.transformGraphSpace(g, largestTimespanData)
        })

        let portfolio = this.addData(sameSpaceData)

        console.log("----------------------------------------------------------------------------------------------------------------")

        let ln = largestTimespanData === balanceWeightedData[0] ? "btc" : "eth"
        console.log(`largest timespan: ${ln}`)
        console.log(largestTimespanData)

        console.log("portfolio:")
        console.log(portfolio)

        let new_graphOptions = {
            width: this.containerRef.current.offsetWidth, height: 555,
            candlestick: state.candlestick,
            dataObjs: [
                { name: "Total Portfolio", data: portfolio, solidFill: false },
                { name: "BTC", data: sameSpaceData[walletData.findIndex(w => w.coin === "btc")], solidFill: false },
            ],
        }

        this.setState({ ...state, graphOptions: new_graphOptions })
    }

    componentDidMount() {
        this.setGraphOptions()
    }

    setCandlestick = (b) => {
        this.setGraphOptions({ ...this.state, candlestick: b })
    }

    graphTypeSelect = (evt) => {
        this.setCandlestick(evt.target.value === "candlestick")
    }

    setTimeframe = (t) => {
        this.setGraphOptions({ ...this.state, timeFrame: t })
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
            <select className={css.overviewGraph__controlsMobilePlot} onChange={this.graphTypeSelect} value={this.state.candlestick ? "candlestick" : "line"}>
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