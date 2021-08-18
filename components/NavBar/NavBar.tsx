import css from './NavBar.module.scss'
import Image from 'next/image'
import IonIcon from '../IonIcon/IonIcon'

import React, { Component } from 'react';

import ActionSearch from '../ActionSearch/ActionSearch'

interface IProps {
    toggleHamburgerCallback: () => void
}

class NavBar extends React.Component<IProps> {
    _toggleHamburgerCallback: () => void

    constructor(props) {
        super(props)

        this._toggleHamburgerCallback = props.toggleHamburgerCallback
    }

    render() {
        return (
            <div className={css.navBar}>
                <img className={css.navBar__logoIcon} alt="Cryptodash Logo" src="/cryptodash_logo_icon.png" width={67} height={80} />
                <img className={css.navBar__logoText} alt="Cryptodash" src="/cryptodash_logo_text.png" width={210} height={80} />
                <span className={css.navBar__hamburgerButton} onClick={ this._toggleHamburgerCallback }>
                    <IonIcon className={css.navBar__hamburgerButtonIcon} name="menu" />
                </span>

                <ActionSearch />

                {/*
                <div className={css.navBar__searchBox}>
                    <input type="text" className={css.navBar__searchBoxInput} placeholder='Type an action... "Add 5 BTC"' />
                    <a className={css.navBar__searchBoxButton}>
                        <IonIcon name="return-down-forward" />
                    </a>
                </div>
                */}

                <div style={{ flexGrow: 1 }} />

                <a href="https://github.com/krogank9/cryptodash-client" target="_blank" className={css.navBar__sourceCodeButton}>
                    <IonIcon name="logo-github" />
                    {" "}
                    <span>Source code</span>
                </a>
                <a className={css.navBar__notificationsButton}>
                    <IonIcon className={css.navBar__icon} name="notifications" />
                </a>
                <a className={css.navBar__mailButton}>
                    <IonIcon className={css.navBar__icon} name="mail" />
                </a>
                <a className={css.navBar__profileButton}>
                    <div className={css.navBar__profileButtonIcon} />
                    <span className={css.navBar__profileButtonText}>Guest</span>
                </a>
            </div>
        )
    }
}

export default NavBar;