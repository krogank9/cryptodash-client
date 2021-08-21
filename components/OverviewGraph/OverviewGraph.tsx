import css from './OverviewGraph.module.scss'
import Graph, { GraphWithResize } from '../Graph/Graph'

import StoreSingleton, { makeObserver } from '../../store/CryptodashStoreSingleton.js'

import React, { Component } from 'react';
import { toJS } from 'mobx';

import Router from 'next/router'

import Utils from '../../Utils'

interface IProps { className?: string, walletData: any, selectedCoin: any, changeObservedProps: (props: any) => void }

export default makeObserver([{"walletData": "walletData_1d"}, "selectedCoin"], class OverviewGraph extends React.Component<IProps> {
    state: {
        graphOptions: any,
        candlestick: boolean,
        timeFrame: string
    }

    constructor(props) {
        super(props)
        this.state = {
            graphOptions: {},
            candlestick: false,
            timeFrame: "1d"
        }
    }

    clampGraphResolution(graph, maxVals) {
        let mod = Math.floor(graph.length / maxVals)
        if (mod === 0)
            return graph

        return graph.filter((_, i) => i === 0 || i % mod === 0 || i === graph.length - 1)
    }

    addData(data) {
        let cumulativeGraph = data[0].map(e => [e[0], 0])
        //console.log("cumulativeGraph (Overview) data")
        //console.log(data)
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

    getGraphOptions = () => {
        let walletData = toJS(this.props.walletData)//.slice(0,2)

        //console.log("walletData")
        //console.log(walletData)

        let graphTimeFrame = "graph_" + this.state.timeFrame

        let balances = walletData.reduce((acc, cur) => { acc[cur.coin] = cur.amount; return acc }, {})
        let balances_arr = walletData.map(w => balances[w.coin])
        let balanceWeightedData = walletData.map(w => this.clampGraphResolution(w[graphTimeFrame], 500)).map((g, i) => this.weighData(g, balances_arr[i]))

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
                return Utils.transformGraphSpace(g, largestTimespanData)
        })

        let portfolio = this.addData(sameSpaceData)
        let dataObjs = [{ name: "Total Portfolio", data: portfolio }]

        try {
            // If it's a candlestick graph, can just use raw wallet data. No need to make same as portfolio or weight by wallet balance
            if (this.state.candlestick) {
                dataObjs.push({
                    name: this.props.selectedCoin.coin.toUpperCase(),
                    data: walletData.find(w => w.coin === this.props.selectedCoin.coin)[graphTimeFrame]
                })
            }
            else {
                dataObjs.push({
                    name: this.props.selectedCoin.coin.toUpperCase(),
                    data: sameSpaceData[walletData.findIndex(w => w.coin === this.props.selectedCoin.coin)]
                })
            }
        }
        catch (err) {
        }

        let graphOptions = {
            //width: this.containerRef.current.offsetWidth,
            height: 555,
            candlestick: this.state.candlestick,
            dataObjs: dataObjs
        }
        return graphOptions
    }

    setCandlestick = (b) => {
        this.setState({ candlestick: b })
    }

    graphTypeSelect = (evt) => {
        console.log("graph type set")
        console.log(evt.target.value)
        if (evt.target.value === "predictive") {
            Router.push({
                pathname: `/analyze/${this.props.selectedCoin.coin || "btc"}`,
            })
        }
        else {
            this.setCandlestick(evt.target.value === "candlestick")
        }
    }

    setTimeframe = (t) => {
        this.props.changeObservedProps([{"walletData": `walletData_${t}`}, "selectedCoin"])
        this.setState({ timeFrame: t })
        ///this.setGraphOptions(this.state.graphOptions.candlestick)
    }

    graphTimeSelect = (evt) => {
        this.setTimeframe(evt.target.value)
    }

    makeControls() {
        const desktopPlotButton = (
            <div className={css.overviewGraph__controlsDesktopPlot}>
                <a className={css.overviewGraph__controlsDesktopPlotButton + " " + (!this.state.candlestick ? css.overviewGraph__controlsDesktopPlotButton_active : "")} onClick={() => this.setCandlestick(false)}>Line</a>
                <a className={css.overviewGraph__controlsDesktopPlotButton + " " + (this.state.candlestick ? css.overviewGraph__controlsDesktopPlotButton_active : "")} onClick={() => this.setCandlestick(true)}>Candlestick</a>
                <a className={css.overviewGraph__controlsDesktopPlotButton} href={`/analyze/${this.props.selectedCoin.coin || "btc"}`}>Predictive</a>
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
        console.log("Render OverviewGraph")
        let graphOptions = {}
        //graphOptions = this.getGraphOptions()
        console.log("this.props.walletData")
        console.log(toJS(this.props.walletData))
        try {
            graphOptions = this.getGraphOptions()
        } catch {}
        return (
            <div className={css.overviewGraph + " " + (this.props.className || "")}>
                {this.makeControls()}
                <div id="chart" className={css.overviewGraph__graphContainer}>
                    <GraphWithResize options={graphOptions} />
                </div>
            </div>
        )
    }
})