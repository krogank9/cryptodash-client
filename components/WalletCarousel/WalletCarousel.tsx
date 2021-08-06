import css from './WalletCarousel.module.scss'
import WalletTile from './WalletTile/WalletTile'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react'

import StoreSingleton from '../../store/CryptodashStoreSingleton.js'

interface WalletCarouselProps { data?: any, coinImagesB64?: any }

export default class WalletCarousel extends React.Component<WalletCarouselProps> {
    state = {
        scrollPos: 1
    }

    constructor(props) {
        super(props)

        this.state = {
            scrollPos: 0
        }
    }

    getIsMobile = () => {
        // I was thinking some sort of css query on how many elements are visible. mobile will always be 4, desktop will be 5.
        return false
    }

    getMaxScrollPos = () => {
        //return StoreSingleton.walletData.length - (this.getIsMobile() ? 4 : 5)
        return Math.floor(StoreSingleton.walletData.length / 5) * 5
    }

    getStride = () => {
        return this.getIsMobile() ? 4 : 5
    }

    scroll = (dir) => {
        let newScrollPos = this.state.scrollPos + this.getStride() * dir
        newScrollPos = Math.min(Math.max(newScrollPos, 0), this.getMaxScrollPos())

        this.setState({
            scrollPos: newScrollPos
        })
    }

    makeWalletTiles() {
        let tiles = StoreSingleton.walletData.slice(this.state.scrollPos, this.state.scrollPos+5).map(w => {
            return <WalletTile data={w} />
        })

        // Push empty divs for remaining spaces at end of scroll
        while(tiles.length < 5)
            tiles.push(<div></div>)

        return (<>
            {tiles}
        </>)
    }

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
                        <IonIcon className={css.walletCarousel__actionButton+" "+(this.state.scrollPos > 0 ? "" : css.walletCarousel__actionButton_inactive)} name="chevron-back-outline" onClick={() => this.scroll(-1)} />
                        <IonIcon className={css.walletCarousel__actionButton+" "+(this.state.scrollPos < this.getMaxScrollPos() ? "" : css.walletCarousel__actionButton_inactive)} name="chevron-forward-outline" onClick={() => this.scroll(1)} />
                    </div>
                </div>
                <div className={css.walletCarousel__track}>
                    {this.makeWalletTiles()}
                </div>
            </div>
        )
    }
}
