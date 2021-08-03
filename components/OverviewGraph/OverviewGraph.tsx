import css from './OverviewGraph.module.scss'
import { generateData } from '../Graph/GenerateGraph.js'
import Graph, { GraphWithResize } from '../Graph/Graph'
import BTCPrices from '../../static_data/btc_1d.json'

import React, { Component } from 'react';

interface OverviewGraphProps { className?: string, data?: any, balances?: any }

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

    addData(data, amounts) {
        let cumulativeGraph = data[0].map(e => [e[0], e[1] * amounts[0]])
        data.slice(1).forEach((coinGraph, coinGraphIndex) => {
            coinGraph.forEach((graphPoint, i) => {
                cumulativeGraph[i][1] += graphPoint[1] * amounts[coinGraphIndex + 1]
            })
        })
        return cumulativeGraph
    }

    weighData(data, amount) {
        return data.map(d => [d[0], d[1] * amount])
    }

    setGraphOptions = (candlestick?: false) => {

        let amounts = Object.keys(this.props.data).map(c => this.props.balances[c])
        let portfolio = this.addData(Object.values(this.props.data).map((d:any) => d.prices), amounts)

        //console.log(this.props.walletData)

        let new_graphOptions = {
            width: this.containerRef.current.offsetWidth, height: 555,
            candlestick: candlestick,
            dataObjs: [
                { name: "Total Portfolio", data: portfolio, solidFill: false },
                { name: "BTC", data: this.weighData(this.props.data["btc"].prices, candlestick ? 1 : this.props.balances["btc"]), solidFill: false },
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