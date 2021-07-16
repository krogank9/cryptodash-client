import Head from 'next/head'
import css from './SideBar.module.scss'

export default function SideBar() {
  return (
    <div className={css.sideBar}>

      <h2 className={css.sideBar__sectionTitle}>
        Dashboard
      </h2>

      <a href="#" className={css.sideBar__item + " " + css.sideBar__item_active}>
        <ion-icon name="pie-chart"></ion-icon>
        <span>Overview</span>
      </a>
      <a href="#" className={css.sideBar__item}>
        <ion-icon name="stats-chart"></ion-icon>
        <span>Analyze</span>
      </a>
      <a href="#" className={css.sideBar__item}>
        <ion-icon name="swap-horizontal"></ion-icon>
        <span>Exchange</span>
      </a>

      <h2 className={css.sideBar__sectionTitle}>
        Account
      </h2>

      <a href="#" className={css.sideBar__item}>
        <ion-icon name="notifications"></ion-icon>
        <span>Notifications</span>
      </a>
      <a href="#" className={css.sideBar__item}>
        <ion-icon name="settings"></ion-icon>
        <span>Settings</span>
      </a>
      <a href="#" className={css.sideBar__item}>
        <ion-icon name="information-circle"></ion-icon>
        <span>About</span>
      </a>

      <a href="#" className={css.sideBar__item + " " + css.sideBar__loginLogoutItem}>
        <ion-icon name="enter"></ion-icon>
        <span>Log In / Create Account</span>
      </a>
    </div>
  )
}