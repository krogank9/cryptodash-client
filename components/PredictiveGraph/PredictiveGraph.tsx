import css from './PredictiveGraph.module.scss'
import Graph, { GraphWithResize } from '../Graph/Graph'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

import React, { Component } from 'react';
import { toJS } from 'mobx';

import Utils from '../../utils'

import config from '../../config'
import CoinIdMap from "../../static_data/coin_id_map.json"
import CoinNameMap from "../../static_data/coin_name_map.json"

interface OverviewGraphProps { className?: string, data?: any, coin?: string }

class OverviewGraph extends React.Component<OverviewGraphProps> {
    containerRef: React.RefObject<HTMLDivElement>;
    state: {
        graphOptions: any,
        candlestick: boolean,
        timeFrame: string,
        coin: string,
    }

    constructor(props) {
        super(props)
        this.containerRef = React.createRef()
        this.state = {
            graphOptions: {},
            candlestick: false,
            timeFrame: "1d",
            coin: ""
        }
    }

    setGraphOptions = (data1 = [], data2 = []) => {
        console.log("data1")
        console.log(data1)
        let lastRealData = data1[data1.length - 1]
        let new_graphOptions = {
            width: this.containerRef.current.offsetWidth, height: 555,
            lastRealTime: lastRealData ? lastRealData[0] : undefined,
            dataObjs: [
                { name: CoinNameMap[this.props.coin], data: data1 },
                { name: "14 Day Prediction", data: (lastRealData ? [lastRealData] : []).concat(data2) },
            ],
        }

        this.setState({ ...this.state, graphOptions: new_graphOptions })
    }

    componentDidUpdate() {
        if(this.props.coin != this.state.coin) {
            this.state.coin = this.props.coin
            this.setGraphOptions()
            let that = this
            if (this.props.coin) {
                console.log("Getting coin "+this.props.coin)
                fetch(`${config.API_ENDPOINT}/predictions/${CoinIdMap[this.props.coin]}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(`got data`)
                        console.log(data)
                        that.setGraphOptions(data[0], data[1])
                    })
            }
        }
    }

    render() {
        return (
            <div className={css.overviewGraph + " " + (this.props.className || "")} ref={this.containerRef}>
                <div id="chart" className={css.overviewGraph__graphContainer}>
                    <GraphWithResize options={this.state.graphOptions} />
                </div>
            </div>
        )
    }
}

export default OverviewGraph