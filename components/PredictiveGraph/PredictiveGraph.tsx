import css from './PredictiveGraph.module.scss'
import Graph, { GraphWithResize } from '../Graph/Graph'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

import React, { Component } from 'react';
import { toJS } from 'mobx';

import Utils from '../../Utils'

import config from '../../config'
import CoinIdMap from "../../static_data/coin_id_map.json"
import CoinNameMap from "../../static_data/coin_name_map.json"

interface OverviewGraphProps { className?: string, data?: any, coin?: string }

class OverviewGraph extends React.Component<OverviewGraphProps> {
    containerRef: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props)
        this.containerRef = React.createRef()
    }

    render() {
        const ONE_MONTH = 1000 * 60 * 60 * 24 * 30
        let realData = this.props.data[0].filter(d => d[0] >= Date.now() - ONE_MONTH)

        let lastRealData = realData[realData.length - 1]
        let graphOptions = {
            width: this.containerRef.current ? this.containerRef.current.offsetWidth : 0, height: 555,
            lastRealTime: lastRealData ? lastRealData[0] : undefined,
            dataObjs: [
                { name: CoinNameMap[this.props.coin], data: realData },
                { name: "14 Day Prediction", data: (lastRealData ? [lastRealData] : []).concat(this.props.data[1]) },
            ],
            loadingLabel: `Calculating 14 day prediction for ${CoinNameMap[this.props.coin]}...`
        }

        return (
            <div className={css.overviewGraph + " " + (this.props.className || "")} ref={this.containerRef}>
                <div id="chart" className={css.overviewGraph__graphContainer}>
                    <GraphWithResize options={graphOptions} />
                </div>
            </div>
        )
    }
}

export default OverviewGraph