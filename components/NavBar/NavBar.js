import Head from 'next/head'
import css from './NavBar.module.scss'
import Image from 'next/image'

export default function NavBar() {
    return (
        <div className={css.navBar}>
            <Image className={css.navBar__logo} alt="Cryptodash" src="/cryptodash_logo.png" width={277} height={80} />
            <a href="#" className={css.navBar__hamburgerButton}>
                <ion-icon className={css.navBar__hamburgerButtonIcon} name="menu" />
            </a>
            <div className={css.navBar__searchBox}>
                <input type="text" className={css.navBar__searchBoxInput} placeholder='Type an action... "Add 5 BTC"' />
                <a href="#" className={css.navBar__searchBoxButton}>
                    <ion-icon name="return-down-forward" />
                </a>
            </div>

            <div style={{flexGrow: 1}}></div>

            <a href="https://github.com/krogank9/" target="_blank" className={css.navBar__sourceCodeButton}>
                <ion-icon name="logo-github" />
                {" "}
                <span>Source code</span>
            </a>
            <a href="#" className={css.navBar__notificationsButton}>
                <ion-icon className={css.navBar__icon} name="notifications" />
            </a>
            <a href="#" className={css.navBar__mailButton}>
                <ion-icon className={css.navBar__icon} name="mail" />
            </a>
            <a href="#" className={css.navBar__profileButton}>
                <div className={css.navBar__profileButtonIcon} />
                <span className={css.navBar__profileButtonText}>Guest</span>
            </a>
        </div>
    )
}