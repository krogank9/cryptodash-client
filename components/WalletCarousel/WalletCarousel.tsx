import css from './WalletCarousel.module.scss'
import WalletTile from './WalletTile/WalletTile'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

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
                    <WalletTile data={StoreSingleton.walletData[0]} />
                    <WalletTile data={StoreSingleton.walletData[1]} />
                    <WalletTile data={StoreSingleton.walletData[2]} />
                    <WalletTile data={StoreSingleton.walletData[3]} />
                    <WalletTile data={StoreSingleton.walletData[4]} />
                </div>
            </div>
        )
    }
}
