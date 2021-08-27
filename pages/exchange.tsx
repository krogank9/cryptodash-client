import React, { Component } from 'react';

import css from './Exchange.module.scss'

import StoreSingleton from '../store/CryptodashStoreSingleton.js'

//-------------------------------------------------------------

export default class Exchange extends React.Component {
  render() {
    return (
      <div className={css.container}>
        <h1>Exchange</h1>
        <h4>*Demo application, exchange functionality not implemented*</h4>
        <div>
          <a className={css.buyButton}>Buy</a>
          <a className={css.buyButton}>Sell</a>

          <h4>Currency</h4>
          <select>
            <option>Bitcoin</option>
            <option>Ethereum</option>
            <option>Litecoin</option>
          </select>

          <h4>Payment Method</h4>
          <select>
            <option>Mastercard ***********1234</option>
            <option>VISA ***********5678</option>
          </select>

          <h4>Amount</h4>
          <input type="text" placeholder="123 BTC" />
          <input type="text" placeholder="456 USD" />

          <br />
          <br />

          <a className={css.exchangeButton}>
            Exchange Now
          </a>

        </div>
      </div>
    )
  }
}