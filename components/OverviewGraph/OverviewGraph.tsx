import css from './OverviewGraph.module.scss'
import { generateData } from '../Graph/GenerateGraph.js'
import Graph, { GraphWithResize } from '../Graph/Graph'

import React, { Component } from 'react';

function mToR(x) {
    if (x <= 12) {
        return x + "AM";
    }
    if (x >= 24) {
        x -= 12
        return x + "AM"
    }
    if (x > 12) {
        x %= 12
        return x + "PM"
    }
}

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
            xMin: 0, xMax: 12,
            yMin: 0, yMax: 15,
            yInterval: 3, xInterval: 2,
            dataObjs: [
                { name: "Total Portfolio", data: generateData(0.5, 0.75, 15, 3.5), solidFill: false },
                { name: "BTC", data: generateData(0.5, 0.6 / 2, 15, 4 / 2), solidFill: false },
            ],
            yLabelCallback: (y) => "$" + (y * 1.25).toLocaleString(undefined, { minimumIntegerDigits: 1, maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "K",
            xLabelCallback: (x) => mToR(x + 12)
        }

        this.setState({ graphOptions: new_graphOptions })
    }

    render() {
        return (
            <div className={css.overviewGraph + " " + (this.props.className || "")} ref={this.containerRef}>
                <div className={css.overviewGraph__controls}>
                    <div className={css.overviewGraph__controlsPlot}>
                        <a href="#" className={css.overviewGraph__controlsPlotButton + " " + css.overviewGraph__controlsPlotButton_active}>Line</a>
                        <a href="#" className={css.overviewGraph__controlsPlotButton}>Candlestick</a>
                        <a href="#" className={css.overviewGraph__controlsPlotButton}>Predictive</a>
                    </div>

                    <div className={css.overviewGraph__controlsTime}>
                        <a href="#" className={css.overviewGraph__controlsTimeButton + " " + css.overviewGraph__controlsTimeButton_active}>Day</a>
                        <a href="#" className={css.overviewGraph__controlsTimeButton}>Week</a>
                        <a href="#" className={css.overviewGraph__controlsTimeButton}>Month</a>
                        <a href="#" className={css.overviewGraph__controlsTimeButton}>Year</a>
                        <a href="#" className={css.overviewGraph__controlsTimeButton}>All</a>
                    </div>
                </div>
                <div id="chart" className={css.overviewGraph__graphContainer}>
                    <GraphWithResize options={this.state.graphOptions} />
                </div>
            </div>
        )
    }
}

export default OverviewGraph