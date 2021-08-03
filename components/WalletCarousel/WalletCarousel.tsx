import css from './WalletCarousel.module.scss'
import WalletTile from './WalletTile/WalletTile'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react'

interface WalletCarouselProps { data?: any, coinImagesB64?: any }

export default class WalletCarousel extends React.Component<WalletCarouselProps> {
    render() {
        return (
            <div className={css.walletCarousel}>
                <div className={css.walletCarousel__header}>
                    <div className={css.walletCarousel__sectionTitle}>Your Portfolio</div>
                    <a className={css.walletCarousel__textButton+" show-desktop-only"}>Add wallet</a>
                    <a className={css.walletCarousel__textButton+" show-desktop-only"}>Import from Coinbase</a>
    
                    <div className={css.walletCarousel__controls}>
                        <IonIcon className={css.walletCarousel__actionButton} name="close-outline" />
                        <IonIcon className={css.walletCarousel__actionButton} name="add-outline" />
                        <IonIcon className={css.walletCarousel__actionButton+" "+css.walletCarousel__actionButton_inactive} name="chevron-back-outline" />
                        <IonIcon className={css.walletCarousel__actionButton} name="chevron-forward-outline" />
                    </div>
                </div>
                <div className={css.walletCarousel__track}>
                    <WalletTile data={this.props.data[0]} coinImagesB64={this.props.coinImagesB64} />
                    <WalletTile data={this.props.data[1]} coinImagesB64={this.props.coinImagesB64} />
                    <WalletTile data={this.props.data[2]} coinImagesB64={this.props.coinImagesB64} />
                    <WalletTile data={this.props.data[3]} coinImagesB64={this.props.coinImagesB64} />
                    <WalletTile data={this.props.data[4]} coinImagesB64={this.props.coinImagesB64} />
                </div>
            </div>
        )
    }
}
