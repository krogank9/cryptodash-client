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

// Disable serverside rendering. Login button needs props from cookies
import dynamic from "next/dynamic";

function disableSSR(component) {
  return dynamic(() => Promise.resolve(() => component), {
    ssr: false,
  });
}

export default withRouter(observer(class SideBar extends React.Component<IProps, IState> {
  matchPage(regex) {
    let s = ""
    try { s = this.props.router.asPath || "" } catch (e) { }

    let result
    if (typeof regex === "string")
      result = s === regex
    else
      result = s.match(regex)

    return result ? " " + css.sideBar__item_active : ""
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

    const LogButtonNoSSR = disableSSR(StoreSingleton.loggedInUser.userName ? logoutButton : loginButton)

    return (
      <div className={css.sideBar + " " + (this.props.toggled ? css.sideBar_toggled : "")}>

        <h2 className={css.sideBar__sectionTitle}>
          Dashboard
        </h2>

        <Link href="/">
          <a className={css.sideBar__item + this.matchPage("/")}>
            <IonIcon name="pie-chart" />
            <span>Overview</span>
          </a>
        </Link>
        <Link href={`/analyze/${StoreSingleton.selectedCoin.coin || "bitcoin"}`}>
          <a className={css.sideBar__item + this.matchPage(/\/analyze\/.*/g)}>
            <IonIcon name="stats-chart" />
            <span>Analyze</span>
          </a>
        </Link>
        <Link href="/exchange">
          <a className={css.sideBar__item + this.matchPage("/exchange")}>
            <IonIcon name="swap-horizontal" />
            <span>Exchange</span>
          </a>
        </Link>

        <h2 className={css.sideBar__sectionTitle}>
          Account
        </h2>

        <Link href="/notifications">
          <a className={css.sideBar__item + this.matchPage("/notifications")}>
            <IonIcon name="notifications" />
            <span>Notifications</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={css.sideBar__item + this.matchPage("/settings")}>
            <IonIcon name="settings" />
            <span>Settings</span>
          </a>
        </Link>
        <Link href="/about">
          <a className={css.sideBar__item + this.matchPage("/about")}>
            <IonIcon name="information-circle" />
            <span>About</span>
          </a>
        </Link>

        <LogButtonNoSSR />
      </div>
    )
  }
}))