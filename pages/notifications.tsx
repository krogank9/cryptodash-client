import React, { Component } from 'react';

import css from './Notifications.module.scss'

import StoreSingleton from '../store/CryptodashStoreSingleton.js'

//-------------------------------------------------------------

export default class Exchange extends React.Component {
  makeTypeSpan(t) {
    const styleModifiers = {
      "new": css.notificationType__new,
      "info": css.notificationType__info,
      "urgent": css.notificationType__urgent,
    }
    return <span className={css.notificationType + " " + styleModifiers[t]}>{t.substring(0,1).toUpperCase()+t.substring(1)}</span>
  }
  makeNotifications(data) {
    return data.map(({ title, description, type, time }) => (
      <div className={css.notification}>
        {this.makeTypeSpan(type)}
        <span style={{float: "right"}}>
          {time}
        </span>

        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    ))
  }

  render() {
    const contactSpan = (
      <span>
        I'm located near Philadelphia, Pennslyania, you can check out the rest of my portfolio and contact me <a target="_blank" href="https://ltkdigital.com/">here.</a>
      </span>
    )
    const data = [
      { title: "Welcome to my app", description: "Cryptodash is a demo cryptocurrency dashboard.", type: "new", time: "8/27/2021" },
      { title: "Data by CoinGecko", description: "CoinGecko is the most comprehensive cryptocurrency API.", type: "urgent", time: "8/21/2021" },
      { title: "Created by Logan Krumbhaar", description: contactSpan, type: "info", time: "8/25/2021" },
    ]
    return (
      <div className={css.container}>
        <h1>Notifications</h1>
        <div className={css.notificationsContainer}>
          {this.makeNotifications(data)}
        </div>
      </div>
    )
  }
}