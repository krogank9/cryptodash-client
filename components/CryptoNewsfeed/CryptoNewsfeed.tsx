import css from './CryptoNewsfeed.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';

interface CryptoNewsfeedProps {
    className?: string
}

class CryptoNewsfeed extends React.Component<CryptoNewsfeedProps> {

    makeList(data) {
        return data.map((d, i) => (
            <li className={css.storyPreview}>
                <h4 className={css.storyPreview__header}>{d[0]}</h4>
                <span className={css.storyPreview__subtext}>{d[1]}</span>
                <p className={css.storyPreview__description}>{d[2]}</p>
            </li>
        ))
    }

    render() {
        let data = [
            ["Bitcoin Holds Above $30K but Price Chart Looks 'Ugly'", "CoinDesk - Bitcoin News, Blockchain News - 4h ago", "Also, Circle might be an attractive \"starter stock for the cautious\" when it goes public, according to one analyst."],
            ["Bitcoin Holds Above $30K but Price Chart Looks 'Ugly'", "CoinDesk - Bitcoin News, Blockchain News - 4h ago", "Also, Circle might be an attractive \"starter stock for the cautious\" when it goes public, according to one analyst."],
            ["Bitcoin Holds Above $30K but Price Chart Looks 'Ugly'", "CoinDesk - Bitcoin News, Blockchain News - 4h ago", "Also, Circle might be an attractive \"starter stock for the cautious\" when it goes public, according to one analyst."],
        ]
        return (
            <div className={css.cryptoNewsfeed}>
                <div className={css.headerSection}>
                    <div className={css.headerSection__titleContainer} >
                        <IonIcon className={css.headerSection__titleContainerIcon} name="newspaper-outline" />
                        <h3 className={css.headerSection__titleContainerText}>Crypto Newsfeed</h3>
                    </div>
                    <div className={css.headerSection__buttonContainer}>
                        <a href="https://cointelegraph.com/rss-feeds" target="_blank" className={css.headerSection__subscribeButton}>
                            <span className="show-desktop-only">Subscribe to RSS Feed</span>
                            <span className="show-tablet-and-under">RSS</span>
                        </a>
                    </div>
                </div>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                    {this.makeList(data)}
                </ul>
            </div>
        )
    }
}

export default CryptoNewsfeed