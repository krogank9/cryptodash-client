import css from './WalletTile.module.scss'
import IonIcon from '../../IonIcon/IonIcon'
import React, { Component } from 'react';
import Graph, { GraphWithResize } from '../../Graph/Graph'

import BTCPrices from '../../../static_data/btc_1d.json'
import CoinNames from '../../../static_data/coin_name_map.json'

import StoreSingleton from '../../../store/CryptodashStoreSingleton.js'

interface WalletTileProps { data?: any }

class WalletTile extends React.Component<WalletTileProps> {
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
            width: this.containerRef.current.offsetWidth, height: 65,
            showGrid: false,
            showLabels: false,
            strokeWidth: 1.5,
            dataObjs: [
                { data: this.props.data.graphData, color: "#5FA3D2" },
            ]
        }

        this.setState({graphOptions: new_graphOptions})
    }

    formatCurrency(amount) {
        if(amount < 10000) 
            return "$" + Number(amount).toLocaleString("en-US", {maximumFractionDigits: 2, minimumFractionDigits: 2})
        else
            return "$" + Number(amount).toLocaleString("en-US", {maximumFractionDigits: 0, minimumFractionDigits: 0})
    }

    getChangePct(data) {
        let start = data[0][1]
        let end = data[data.length - 1][1]
        let change = end / start
        let changePct = Number((change - 1) * 100)
        return changePct
    }

    render() {
        let changePct = this.getChangePct(this.props.data.graphData)
        return (
            <div className={css.walletTile} ref={this.containerRef}>
                <div className={css.walletTile__info}>
                    <div className={css.walletTile__crypto}>
                        <div className={css.walletTile__cryptoIcon}>
                            <img src={"data:image/png;base64,"+StoreSingleton.coinImagesB64[this.props.data.coin]} />
                        </div>
                        <div className={css.walletTile__cryptoText}>
                            <div className={css.walletTile__cryptoTextAmount}>{this.props.data.amount} {this.props.data.coin}</div>
                            <div className={css.walletTile__cryptoTextName}>{CoinNames[this.props.data.coin]}</div>
                        </div>
                    </div>
                    <div className={css.walletTile__currency + " show-1550-and-up"}>
                        <div className={css.walletTile__currencyAmount}>{this.formatCurrency(this.props.data.graphData.slice(0).pop()[1] * this.props.data.amount)}</div>
                        <div className={css.walletTile__currencyChange + " " + (changePct > 0 ? css.walletTile__currencyChange_positive : css.walletTile__currencyChange_negative)}>
                            <span>{changePct > 0 ? "+":""}{changePct.toFixed(1)}%</span><IonIcon name={changePct > 0 ? "arrow-up-outline" : "arrow-down-outline"} />
                        </div>
                    </div>
                </div>
                <div className={css.walletTile__graph}>
                    <GraphWithResize options={this.state.graphOptions} />
                </div>
            </div>
        )
    }
}

export default WalletTile;