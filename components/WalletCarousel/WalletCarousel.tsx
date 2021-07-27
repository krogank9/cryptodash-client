import css from './WalletCarousel.module.scss'
import WalletTile from './WalletTile/WalletTile'
import IonIcon from '../IonIcon/IonIcon'

export default function WalletCarousel() {
    return (
        <div className={css.walletCarousel}>
            <div className={css.walletCarousel__header}>
                <div className={css.walletCarousel__sectionTitle}>Your Portfolio</div>
                <a href="#" className={css.walletCarousel__textButton+" show-desktop-only"}>Add wallet</a>
                <a href="#" className={css.walletCarousel__textButton+" show-desktop-only"}>Import from Coinbase</a>

                <div className={css.walletCarousel__controls}>
                    <IonIcon className={css.walletCarousel__actionButton} name="close-outline" />
                    <IonIcon className={css.walletCarousel__actionButton} name="add-outline" />
                    <IonIcon className={css.walletCarousel__actionButton+" "+css.walletCarousel__actionButton_inactive} name="chevron-back-outline" />
                    <IonIcon className={css.walletCarousel__actionButton} name="chevron-forward-outline" />
                </div>
            </div>
            <div className={css.walletCarousel__track}>
                <WalletTile />
                <WalletTile />
                <WalletTile />
                <WalletTile />
                <WalletTile />
            </div>
        </div>
    )
}