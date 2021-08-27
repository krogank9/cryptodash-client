import css from './CryptoNewsfeed.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';
import StoreSingleton from '../../store/CryptodashStoreSingleton';

interface CryptoNewsfeedProps {
    className?: string,
    data?: any
}

class CryptoNewsfeed extends React.Component<CryptoNewsfeedProps> {

    makeList(data) {
        return data.map((story, i) => {
            
            let pubAgo = Date.now() - (new Date(story.pubDate)).getTime()
            pubAgo = Math.round(pubAgo / (3600*1000))
            if(pubAgo === 0)
                pubAgo = 1

            return (
                <li className={css.storyPreview} key={i}>
                    <a className={css.storyPreview__link} href={story.link[0]} target="_blank">
                        <h4 className={css.storyPreview__header}>{story.title[0]}</h4>
                        <span className={css.storyPreview__subtext}>{`CoinTelegraph - Bitcoin News, Blockchain News - ${pubAgo}h ago`}</span>
                        <p className={css.storyPreview__description}>{story.description[0]}</p>
                    </a>
                </li>
            )
        })
    }

    render() {
        let rssData = []
        try {
            [].push.apply(rssData, StoreSingleton.rssData.rss.channel[0].item.slice(0, 5))
        } catch {}

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
                <ul className={css.cryptoNewsfeed__storyList}>
                    {this.makeList(rssData)}
                </ul>
            </div>
        )
    }
}

export default CryptoNewsfeed