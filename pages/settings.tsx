import css from './Settings.module.scss'

import React, { Component } from 'react';
import WalletCarousel from '../components/WalletCarousel/WalletCarousel'
import OverviewGraph from '../components/OverviewGraph/OverviewGraph'
import PricesTable from '../components/PricesTable/PricesTable'
import IonIcon from '../components/IonIcon/IonIcon'
import TrendingCurrenciesTable from '../components/TrendingCurrenciesTable/TrendingCurrenciesTable'
import CryptoNewsfeed from '../components/CryptoNewsfeed/CryptoNewsfeed'

import StoreSingleton from '../store/CryptodashStoreSingleton.js'

import Image from 'next/image';
import { observer } from 'mobx-react'
import CryptodashStoreSingleton from '../store/CryptodashStoreSingleton.js';

export default observer(class Settings extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    if(!CryptodashStoreSingleton.loggedInUser.authToken) {
      return <span>Please log in to view this page.</span>
    }
    
    return (
      <>
        <h1>Account Settings</h1>
        <h3>Username</h3>
        <span>{StoreSingleton.loggedInUser.userName || "Guest"}</span>
        <h3>Set Profile picture</h3>
        <div className={css.imageSelect}>
          <Image src={`/profile-${StoreSingleton.loggedInUser.profilePic || 1}.jpg`} width={256} height={256} />
          <div className={css.imageSelect__controls}>
            <div onClick={() => StoreSingleton.selectProfilePic(-1)} >
              <IonIcon name="arrow-back-outline" />
            </div>
            <div onClick={() => StoreSingleton.selectProfilePic(1)} >
              <IonIcon name="arrow-forward-outline" />
            </div>
          </div>
        </div>
        <h3>Delete Account</h3>
        <a className={css.confirmDelete} onClick={() => StoreSingleton.tryDeleteAccount()} >Confirm Deletion</a>
      </>
    )
  }
})