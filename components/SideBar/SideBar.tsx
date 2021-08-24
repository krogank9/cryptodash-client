import css from './SideBar.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';
import Link from 'next/link'
import { withRouter, NextRouter } from 'next/router'

import StoreSingleton from '../../store/CryptodashStoreSingleton'

import { observer } from 'mobx-react'

interface IProps {
  toggled: boolean,
  router: NextRouter,
}
interface IState {
}

export default withRouter(observer(class SideBar extends React.Component<IProps, IState> {
  matchPage(regex) {
    let s = ""
    try { s = this.props.router.asPath || "" } catch(e){}

    return s.match(regex) ? " " + css.sideBar__item_active : ""
  }

  render() {
    return (
      <div className={css.sideBar + " " + (this.props.toggled ? css.sideBar_toggled : "")}>

        <h2 className={css.sideBar__sectionTitle}>
          Dashboard
        </h2>

        <Link href="/">
          <a className={css.sideBar__item + this.matchPage(/\/$/g)}>
            <IonIcon name="pie-chart" />
            <span>Overview</span>
          </a>
        </Link>
        <Link href={`/analyze/${this.matchPage(/\/analyze\/.*/g) ? this.props.router.asPath.split("/").pop() : StoreSingleton.selectedCoin.coin}`}>
          <a className={css.sideBar__item + this.matchPage(/\/analyze\/.*/g)}>
            <IonIcon name="stats-chart" />
            <span>Analyze</span>
          </a>
        </Link>
        <a className={css.sideBar__item}>
          <IonIcon name="swap-horizontal" />
          <span>Exchange</span>
        </a>

        <h2 className={css.sideBar__sectionTitle}>
          Account
        </h2>

        <a className={css.sideBar__item}>
          <IonIcon name="notifications" />
          <span>Notifications</span>
        </a>
        <a className={css.sideBar__item}>
          <IonIcon name="settings" />
          <span>Settings</span>
        </a>
        <a className={css.sideBar__item}>
          <IonIcon name="information-circle" />
          <span>About</span>
        </a>

        <a className={css.sideBar__item + " " + css.sideBar__loginLogoutItem} onClick={() => StoreSingleton.toggleLoginModal(true)}>
          <IonIcon name="enter" />
          <span>Log In / Create Account</span>
        </a>
      </div>
    )
  }
}))