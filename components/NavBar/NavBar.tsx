import css from './NavBar.module.scss'
import Image from 'next/image'
import IonIcon from '../IonIcon/IonIcon'

export default function NavBar() {
    return (
        <div className={css.navBar}>
            <Image className={css.navBar__logo} alt="Cryptodash" src="/cryptodash_logo.png" width={277} height={80} />
            <a href="#" className={css.navBar__hamburgerButton}>
                <IonIcon className={css.navBar__hamburgerButtonIcon} name="menu" />
            </a>
            <div className={css.navBar__searchBox}>
                <input type="text" className={css.navBar__searchBoxInput} placeholder='Type an action... "Add 5 BTC"' />
                <a href="#" className={css.navBar__searchBoxButton}>
                    <IonIcon name="return-down-forward" />
                </a>
            </div>

            <div style={{ flexGrow: 1 }} />

            <a href="https://github.com/krogank9/cryptodash-client" target="_blank" className={css.navBar__sourceCodeButton}>
                <IonIcon name="logo-github" />
                {" "}
                <span>Source code</span>
            </a>
            <a href="#" className={css.navBar__notificationsButton}>
                <IonIcon className={css.navBar__icon} name="notifications" />
            </a>
            <a href="#" className={css.navBar__mailButton}>
                <IonIcon className={css.navBar__icon} name="mail" />
            </a>
            <a href="#" className={css.navBar__profileButton}>
                <div className={css.navBar__profileButtonIcon} />
                <span className={css.navBar__profileButtonText}>Guest</span>
            </a>
        </div>
    )
}