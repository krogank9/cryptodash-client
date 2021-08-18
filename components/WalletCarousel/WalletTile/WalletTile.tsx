import css from './WalletTile.module.scss'
import IonIcon from '../../IonIcon/IonIcon'
import React, { Component } from 'react';
import Graph, { GraphWithResize } from '../../Graph/Graph'

import CoinNames from '../../../static_data/coin_name_map.json'

import StoreSingleton, { makeObserver } from '../../../store/CryptodashStoreSingleton.js'
import CryptodashStoreSingleton from '../../../store/CryptodashStoreSingleton.js';

import { observer } from 'mobx-react'

import Utils from '../../../Utils'

interface WalletTileProps { data?: any, selected: boolean }

export default class WalletTile extends React.Component<WalletTileProps> {
    containerRef: React.RefObject<HTMLDivElement>;
    state: {
        didMount: false
    }

    constructor(props) {
        super(props)
        this.containerRef = React.createRef()
        this.state = {
            didMount: false
        }
    }

    componentDidMount() {
        this.setState({ didMount: true })
    }

    formatCurrency(amount) {
        if (amount < 10000)
            return "$" + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })
        else
            return "$" + Number(amount).toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })
    }

    selectCoin = () => {
        console.log(`Selecting coin ${this.props.data.coin}`)
        StoreSingleton.setSelectedCoin(this.props.data.coin)
    }

    render() {
        let changePct = Utils.getChangePct(this.props.data["graph_1d"])
        let graphOptions = !this.state.didMount ? {} : {
            width: this.containerRef.current.offsetWidth, height: 65,
            showGrid: false,
            showLabels: false,
            strokeWidth: 1.5,
            dataObjs: [
                { data: this.props.data["graph_1d"], color: "#5FA3D2" },
            ]
        }

        return (
            <div className={css.walletTile + " " + (this.props.selected ? css.walletTile_selected : "")} ref={this.containerRef}  onClick={this.selectCoin}>
                <div className={css.walletTile__info}>
                    <div className={css.walletTile__crypto}>
                        <div className={css.walletTile__cryptoIcon}>
                            <img src={"data:image/png;base64," + StoreSingleton.coinImagesB64[this.props.data.coin]} />
                        </div>
                        <div className={css.walletTile__cryptoText}>
                            <div className={css.walletTile__cryptoTextAmount}>{this.props.data.amount} {this.props.data.coin}</div>
                            <div className={css.walletTile__cryptoTextName}>{CoinNames[this.props.data.coin]}</div>
                        </div>
                    </div>
                    <div className={css.walletTile__currency + " show-1650-and-up"}>
                        <div className={css.walletTile__currencyAmount}>{this.formatCurrency(this.props.data["graph_1d"].slice(0).pop()[1] * this.props.data.amount)}</div>
                        <div className={css.walletTile__currencyChange + " " + (changePct > 0 ? css.walletTile__currencyChange_positive : css.walletTile__currencyChange_negative)}>
                            <span>{changePct > 0 ? "+" : ""}{changePct.toFixed(1)}%</span><IonIcon name={changePct > 0 ? "arrow-up-outline" : "arrow-down-outline"} />
                        </div>
                    </div>
                </div>
                <div className={css.walletTile__graph}>
                    <GraphWithResize options={graphOptions} />
                </div>
            </div>
        )
    }
}