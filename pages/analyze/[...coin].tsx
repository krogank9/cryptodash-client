import React, { Component } from 'react';

import css from './Analyze.module.scss'

import CoinDescriptions from '../../static_data/coin_descriptions.json'
import CoinNameMap from '../../static_data/coin_name_map.json'

import PredictiveGraph from '../../components/PredictiveGraph/PredictiveGraph'
import PricesTable from '../../components/PricesTable/PricesTable'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

import { withRouter, NextRouter } from 'next/router'


//-------------------------------------------------------------

interface AnalyzeProps {
  router: NextRouter
}

export default withRouter(class Analyze extends React.Component<AnalyzeProps> {
  state: {
    graphData: any,
    predictedData: any,
  }

  constructor(props) {
    super(props)
    this.state = {
      graphData: [],
      predictedData: []
    }
  }

  render() {
    let coin = (this.props.router.query.coin ? this.props.router.query.coin[0] : "") || ""
    return (
      <>
        <div className={css.halfSplit}>
          <div>
            <h2>Analyze: {CoinNameMap[coin]}</h2>
            <p>{CoinDescriptions[coin]}</p>
          </div>
          <div>
            <h2>Dollar Cost Averaging</h2>
            <p>
              Dollar Cost Averaging is when you invest a fixed amount on a regular basis, instead of buying a large amount all at once.
              This strategy is a simple way to shield yourself from market volatility while still taking advantage of the general upward trend.
            </p>
          </div>
        </div>

        <div className={css.graphSplit}>
          <PredictiveGraph className={css.graphSplit__graph} data={this.state.graphData.concat(this.state.predictedData)} coin={coin} />
          <div className={css.graphSplit__table}>
            Prediction info
            <br />
            <p>
              To the left is a prediction for the next 14 days as forecasted by an HTM neural network.
            </p>
          </div>
        </div>
      </>
    )
  }
})