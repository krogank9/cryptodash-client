import css from './WalletCarousel.module.scss'
import WalletTile from './WalletTile/WalletTile'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react'

import StoreSingleton, {makeObserver} from '../../store/CryptodashStoreSingleton.js'

interface WalletCarouselProps { data?: any, selectedCoin: {coin: string}, walletData_1d: any }

export default makeObserver(["selectedCoin", {"walletData_1d": "walletData_1d"}], class WalletCarousel extends React.Component<WalletCarouselProps> {
    state = {
        scrollPos: 1
    }

    carouselTrackRef: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props)

        this.state = {
            scrollPos: 0
        }

        this.carouselTrackRef = React.createRef()
    }

    getIsMobile = () => {
        if(!this.carouselTrackRef.current)
            return false // Cannot determine until page load. Not needed until scrolling anyway.
        
        // On mobile, the track will only display 4 children per page per the css.
        let numVisibleChildren = Array.from(this.carouselTrackRef.current.children).filter((el:any) => el.offsetParent !== null).length
        return numVisibleChildren < 5
    }

    getMaxScrollPos = () => {
        //return this.props.walletData_1d.length - (this.getIsMobile() ? 4 : 5) // Other scroll style, I like below better I think.

        let maxScroll = Math.floor(this.props.walletData_1d.length / (this.getIsMobile() ? 4 : 5)) * (this.getIsMobile() ? 4 : 5)
        if(maxScroll === this.props.walletData_1d.length)
            maxScroll = this.props.walletData_1d.length - (this.getIsMobile() ? 4 : 5)
        return maxScroll
    }

    getStride = () => {
        return this.getIsMobile() ? 4 : 5
    }

    scroll = (dir) => {
        let newScrollPos = this.state.scrollPos + this.getStride() * dir
        newScrollPos = Math.min(Math.max(newScrollPos, 0), this.getMaxScrollPos())
        
        if(this.state.scrollPos !== newScrollPos) {
            this.setState({
                scrollPos: newScrollPos
            })
        }
    }

    makeWalletTiles() {
        let tiles = this.props.walletData_1d.slice(this.state.scrollPos, this.state.scrollPos+5).map(w => {
            return <WalletTile data={w} key={w.coin} selected={w.coin === this.props.selectedCoin.coin} />
        })

        // Push empty divs for remaining spaces at end of scroll
        let filledReal = tiles.length
        let emptyNeeded = 5 - tiles.length
        for(let i = 0; i < emptyNeeded; i++) {
            tiles.push(<div key={"empty_tile_"+Math.random()}></div>)
        }

        return tiles
    }

    render() {
        console.log("Rendering WalletCarousel")
        console.log(this.props.walletData_1d.map(w => w.coin))
        return (
            <div className={css.walletCarousel}>
                <div className={css.walletCarousel__header}>
                    <div className={css.walletCarousel__sectionTitle}>Your Portfolio</div>
                    <a className={css.walletCarousel__textButton+" show-desktop-only"}>Add wallet</a>
                    {/*<a className={css.walletCarousel__textButton+" show-desktop-only"}>Import from Coinbase</a>*/}
    
                    <div className={css.walletCarousel__controls}>
                        <IonIcon className={css.walletCarousel__actionButton+" "+(this.props.selectedCoin.coin ? "" : css.walletCarousel__actionButton_inactive)} name="close-outline" onClick={() => StoreSingleton.removeSelectedWallet()} />
                        <IonIcon className={css.walletCarousel__actionButton} name="add-outline" />
                        <IonIcon className={css.walletCarousel__actionButton+" "+(this.state.scrollPos > 0 ? "" : css.walletCarousel__actionButton_inactive)} name="chevron-back-outline" onClick={() => this.scroll(-1)} />
                        <IonIcon className={css.walletCarousel__actionButton+" "+(this.state.scrollPos < this.getMaxScrollPos() ? "" : css.walletCarousel__actionButton_inactive)} name="chevron-forward-outline" onClick={() => this.scroll(1)} />
                    </div>
                </div>
                <div className={css.walletCarousel__track} ref={this.carouselTrackRef}>
                    {this.makeWalletTiles()}
                </div>
            </div>
        )
    }
})