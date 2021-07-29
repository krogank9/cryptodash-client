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
        graphOptions: {}
    }

    constructor(props) {
        super(props)
        this.containerRef = React.createRef()
        this.state = {
            graphOptions: {}
        }
    }

    componentDidMount() {
        let new_graphOptions = {
            width: this.containerRef.current.offsetWidth, height: 555,
            candlestick: true,
            dataObjs: [
                { name: "Total Portfolio", data: BTCPrices.prices, solidFill: false },
                { name: "BTC", data: BTCPrices.prices.map(p => [p[0], p[1]*0.9]).map((p, i, arr) => [p[0], arr[arr.length - 1 - i][1]]), solidFill: false },
                //{ name: "ETH", data: ETHPrices.prices, solidFill: false },
            ],
            //yLabelCallback: (y) => "$" + (y * 1.25).toLocaleString(undefined, { minimumIntegerDigits: 1, maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "K",
            //xLabelCallback: (x) => timeConverter
        }

        this.setState({ graphOptions: new_graphOptions })
    }

    makeControls() {
        const desktopPlotButton = (
            <div className={css.overviewGraph__controlsDesktopPlot}>
                <a href="#" className={css.overviewGraph__controlsDesktopPlotButton + " " + css.overviewGraph__controlsDesktopPlotButton_active}>Line</a>
                <a href="#" className={css.overviewGraph__controlsDesktopPlotButton}>Candlestick</a>
                <a href="#" className={css.overviewGraph__controlsDesktopPlotButton}>Predictive</a>
            </div>
        )
        const mobilePlotButton = (
            <select className={css.overviewGraph__controlsMobilePlot}>
                <option className={css.overviewGraph__controlsMobilePlotButton + " " + css.overviewGraph__controlsMobilePlotButton_active}>Line plot</option>
                <option className={css.overviewGraph__controlsMobilePlotButton}>Candlestick</option>
                <option className={css.overviewGraph__controlsMobilePlotButton}>Predictive</option>
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