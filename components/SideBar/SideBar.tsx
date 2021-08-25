import css from './SideBar.module.scss'
import IonIcon from '../IonIcon/IonIcon'
import React, { Component } from 'react';
import Link from 'next/link'
import Router, { withRouter, NextRouter } from 'next/router'

import StoreSingleton from '../../store/CryptodashStoreSingleton'
import Utils from '../../Utils'

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
    try { s = this.props.router.asPath || "" } catch (e) { }

    return s.match(regex) ? " " + css.sideBar__item_active : ""
  }

  render() {
    const loginButton = (
      <a className={css.sideBar__item + " " + css.sideBar__loginLogoutItem} onClick={() => StoreSingleton.toggleLoginModal(true)}>
        <IonIcon name="enter" />
        <span>Log In / Create Account</span>
      </a>)

    const logoutButton = (
      <a className={css.sideBar__item + " " + css.sideBar__loginLogoutItem} onClick={() => StoreSingleton.logoutUser()}>
        <IonIcon name="enter" />
        <span>Logout</span>
      </a>)

    return (
      <div className={css.sideBar + " " + (this.props.toggled ? css.sideBar_toggled : "")}>

        <h2 className={css.sideBar__sectionTitle}>
          Dashboard
        </h2>

          <a className={css.sideBar__item + this.matchPage(/\/$/g)} onClick={() => Router.push("/")}>
            <IonIcon name="pie-chart" />
            <span>Overview</span>
          </a>
        <a className={css.sideBar__item + this.matchPage(/\/analyze\/.*/g)} onClick={() => Router.push(`/analyze/${StoreSingleton.selectedCoin.coin || ""}`)}>
          <IonIcon name="stats-chart" />
          <span>Analyze</span>
        </a>
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

        {StoreSingleton.loggedInUser.userName ? logoutButton : loginButton}
      </div>
    )
  }
}))