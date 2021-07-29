import css from './OverviewGraph.module.scss'
import { generateData } from '../Graph/GenerateGraph.js'
import Graph, { GraphWithResize } from '../Graph/Graph'
import BTCPrices from '../../sample_data/bitcoin_1day every5mins.json'
import ETHPrices from '../../sample_data/ethereum_1day every5mins.json'

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

    setGraphOptions = () => {
        let new_graphOptions = {
            width: this.containerRef.current.offsetWidth, height: 555,
            candlestick: this.state.candlestick,
            dataObjs: [
                { name: "Total Portfolio", data: BTCPrices.prices, solidFill: false },
                { name: "BTC", data: BTCPrices.prices.map(p => [p[0], p[1]*0.9]).map((p, i, arr) => [p[0], arr[arr.length - 1 - i][1]]), solidFill: false },
                //{ name: "ETH", data: ETHPrices.prices, solidFill: false },
            ],
            //yLabelCallback: (y) => "$" + (y * 1.25).toLocaleString(undefined, { minimumIntegerDigits: 1, maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "K",
            //xLabelCallback: (x) => timeConverter
        }

        this.setState({...this.state, graphOptions: new_graphOptions })
    }

    componentDidMount() {
        this.setGraphOptions()
    }

    setcandlestick = (b) => {
        let graphOptions = this.state.graphOptions
        graphOptions.candlestick = b
        this.setState({...this.state, graphOptions})
    }

    selectChange = (evt) => {
        this.setcandlestick(evt.target.value === "candlestick")
    }

    makeControls() {
        const desktopPlotButton = (
            <div className={css.overviewGraph__controlsDesktopPlot}>
                <a href="#" className={css.overviewGraph__controlsDesktopPlotButton + " " + (!this.state.graphOptions.candlestick ? css.overviewGraph__controlsDesktopPlotButton_active : "")} onClick={() => this.setcandlestick(false)}>Line</a>
                <a href="#" className={css.overviewGraph__controlsDesktopPlotButton + " " + (this.state.graphOptions.candlestick ? css.overviewGraph__controlsDesktopPlotButton_active : "")} onClick={() => this.setcandlestick(true)}>Candlestick</a>
                <a href="#" className={css.overviewGraph__controlsDesktopPlotButton}>Predictive</a>
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
                <a href="#" className={css.overviewGraph__controlsDesktopTimeButton + " " + css.overviewGraph__controlsDesktopTimeButton_active}>Day</a>
                <a href="#" className={css.overviewGraph__controlsDesktopTimeButton}>Week</a>
                <a href="#" className={css.overviewGraph__controlsDesktopTimeButton}>Month</a>
                <a href="#" className={css.overviewGraph__controlsDesktopTimeButton}>Year</a>
                <a href="#" className={css.overviewGraph__controlsDesktopTimeButton}>All</a>
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