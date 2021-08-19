import React, { Component } from 'react';

import css from './Analyze.module.scss'

import CoinDescriptions from '../../static_data/coin_descriptions.json'
import CoinNameMap from '../../static_data/coin_name_map.json'
import CoinIdMap from "../../static_data/coin_id_map.json"

import PredictiveGraph from '../../components/PredictiveGraph/PredictiveGraph'
import PricesTable from '../../components/PricesTable/PricesTable'
import DollarCostAveragingTile from '../../components/DollarCostAveragingTile/DollarCostAveragingTile'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

import IonIcon from '../../components/IonIcon/IonIcon'
import config from '../../config'

import Utils from '../../Utils'

import { withRouter, NextRouter } from 'next/router'


//-------------------------------------------------------------

import CoinIconList32B64 from "../../public/coins_32_color_b64_icon_list.json"
var fs = require('fs')

export async function getServerSideProps(context) {
  // todo if context.req.cookie.isLoaded == true return {}

  console.log(context.query)
  console.log(context.params)

  const coin = context.query.coin

  let coinB64 = CoinIconList32B64[coin] || CoinIconList32B64["generic"]

  var marketInfo = JSON.parse(fs.readFileSync('static_data/coins_markets_list.json', 'utf8')).find(m => m["symbol"] == coin)
  console.log("marketInfo")
  console.log(marketInfo)

  return {
    props: {
      coinB64: coinB64,
      marketInfo: marketInfo,
      coin: coin
    }
  }
}

interface AnalyzeProps {
  router: NextRouter,
  coin: string,
  coinB64: string,
  marketInfo: any
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

  formatDate(date_str, showYear = true) {
    let d = new Date(date_str)
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    let month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d);
    let day = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(d);
    return [month, day].concat(showYear ? year : []).join("/")
  }

  componentDidMount() {
    let that = this
    fetch(`${config.API_ENDPOINT}/predictions/${CoinIdMap[this.props.coin]}`)
      .then(response => response.json())
      .then(data => {
        console.log(`got data`)
        console.log(data)

        let graphData = data[0]
        let predictedData = data[1]
        that.setState({ ...that.state, graphData: graphData, predictedData: predictedData })
      })
  }

  makePredictionInfo() {
    console.log("makePredictionInfo")
    console.log(this.state.graphData)
    try {
      const latestRealData = this.state.graphData.slice(0).pop()
      const latestPredictedData = this.state.predictedData.slice(0).pop()
      const profit = latestPredictedData[1] - latestRealData[1]
      const changePct = Utils.getChangePct([latestRealData, ...this.state.predictedData])
      return (
        <p>
          Prediction start date: {this.formatDate(latestRealData[0], false)}
          <br />
          Prediction end date: {this.formatDate(latestPredictedData[0], false)}
          <br />
          Current price: {Utils.nFormatter(latestRealData[1])}
          <br />
          End price: {Utils.nFormatter(latestPredictedData[1])}
          <br />
          Total {profit >= 0 ? "profit" : "loss"}: {Utils.nFormatter(profit)} {(changePct >= 0 ? "+":"") + changePct.toFixed(1)}%
          <br />
          Projected 14 day high: {Utils.nFormatter(Math.max(...this.state.predictedData.map(d => d[1])))}
          <br />
          Projected 14 day low: {Utils.nFormatter(Math.min(...this.state.predictedData.map(d => d[1])))}
        </p>
      )
    }
    catch {
      return <p></p>
    }
  }

  render() {
    console.log(this.props)
    let coinName = CoinNameMap[this.props.coin] || ""
    let coinDescription = CoinDescriptions[this.props.coin] || ""
    let coinLink = `https://en.bitcoinwiki.org/wiki/${coinName.split(' ').join('_')}`
    return (
      <>
        <div className={css.halfSplit}>
          <div>
            <div>
              <h2 className={css.analyzeCoinHeader}>
                Analyzing:
                <img className={css.analyzeCoinHeaderIcon} src={"data:image/png;base64," + this.props.coinB64} />
                {coinName}
              </h2>
            </div>
            <p className={css.coinDescription}>{coinDescription} Read more on <a href={coinLink} target="_blank">BitcoinWiki</a>.</p>
            <p>
              {coinName}'s market cap currently sits at {Utils.nFormatter(this.props.marketInfo.market_cap)} in total dollars invested.
              The all time high of {coinName} was {Utils.nFormatter(this.props.marketInfo.ath)} on {this.formatDate(this.props.marketInfo.ath_date)},
              and the all time low was {Utils.nFormatter(this.props.marketInfo.atl)} on {this.formatDate(this.props.marketInfo.atl_date)}.
            </p>
          </div>
          <DollarCostAveragingTile coinName={coinName} graphData={this.state.graphData} predictedData={this.state.predictedData} />
        </div>

        <div className={css.graphSplit}>
          <PredictiveGraph className={css.graphSplit__graph} data={[this.state.graphData, this.state.predictedData]} coin={this.props.coin} />
          <div className={css.graphSplit__table}>
            <h2>{coinName} Price Prediction</h2>
            <p>
              To the left is a prediction for the next 14 days as forecasted by an HTM neural network.
              This prediction is a basic experimental example to show what is possible, and shouldn't be taken as investment advice.
            </p>
            {this.makePredictionInfo()}
          </div>
        </div>
      </>
    )
  }
})