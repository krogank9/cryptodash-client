import React, { Component } from 'react';
import css from './Exchange.module.scss'

interface IState {
  mode: 'buy' | 'sell';
  currency: string;
  cryptoAmount: string;
  usdAmount: string;
}

export default class Exchange extends React.Component<{}, IState> {
  state: IState = {
    mode: 'buy',
    currency: 'bitcoin',
    cryptoAmount: '',
    usdAmount: ''
  }

  // Mock exchange rates
  rates: { [key: string]: number } = {
    bitcoin: 93500,
    ethereum: 3350,
    litecoin: 105,
    solana: 185,
    cardano: 0.89
  }

  handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value) || 0;
    const usdValue = numValue * this.rates[this.state.currency];
    this.setState({
      cryptoAmount: value,
      usdAmount: usdValue > 0 ? usdValue.toFixed(2) : ''
    });
  }

  handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value) || 0;
    const cryptoValue = numValue / this.rates[this.state.currency];
    this.setState({
      usdAmount: value,
      cryptoAmount: cryptoValue > 0 ? cryptoValue.toFixed(8) : ''
    });
  }

  handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value;
    this.setState({ currency }, () => {
      if (this.state.usdAmount) {
        const numValue = parseFloat(this.state.usdAmount) || 0;
        const cryptoValue = numValue / this.rates[currency];
        this.setState({
          cryptoAmount: cryptoValue > 0 ? cryptoValue.toFixed(8) : ''
        });
      }
    });
  }

  getCurrencySymbol(): string {
    const symbols: { [key: string]: string } = {
      bitcoin: 'BTC',
      ethereum: 'ETH',
      litecoin: 'LTC',
      solana: 'SOL',
      cardano: 'ADA'
    };
    return symbols[this.state.currency] || 'BTC';
  }

  render() {
    const { mode, currency } = this.state;

    return (
      <div className={css.container}>
        <div className={css.demoNotice}>
          <div className={css.demoNotice__icon}>⚠️</div>
          <h3 className={css.demoNotice__title}>Demo Mode</h3>
          <p className={css.demoNotice__text}>
            This is a demonstration interface only. No real transactions will be processed.
            This feature showcases what an exchange interface could look like.
          </p>
        </div>

        <div className={css.card}>
          <div className={css.header}>
            <h1>Exchange</h1>
            <p>Buy and sell cryptocurrency instantly</p>
          </div>

          <div className={css.tabs}>
            <button 
              className={`${css.tab} ${css.tab_buy} ${mode === 'buy' ? css.tab_active : ''}`}
              onClick={() => this.setState({ mode: 'buy' })}
            >
              Buy
            </button>
            <button 
              className={`${css.tab} ${css.tab_sell} ${mode === 'sell' ? css.tab_active : ''}`}
              onClick={() => this.setState({ mode: 'sell' })}
            >
              Sell
            </button>
          </div>

          <div className={css.formGroup}>
            <label>Cryptocurrency</label>
            <select value={currency} onChange={this.handleCurrencyChange}>
              <option value="bitcoin">Bitcoin (BTC)</option>
              <option value="ethereum">Ethereum (ETH)</option>
              <option value="litecoin">Litecoin (LTC)</option>
              <option value="solana">Solana (SOL)</option>
              <option value="cardano">Cardano (ADA)</option>
            </select>
          </div>

          <div className={css.formGroup}>
            <label>Payment Method</label>
            <select>
              <option>Mastercard •••• 1234</option>
              <option>Visa •••• 5678</option>
              <option>Bank Account •••• 9012</option>
            </select>
          </div>

          <div className={css.amountInputs}>
            <div className={css.formGroup}>
              <label>{mode === 'buy' ? 'You Pay' : 'You Receive'} (USD)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={this.state.usdAmount}
                onChange={this.handleUsdChange}
              />
            </div>
            <div className={css.swapIcon}>⇄</div>
            <div className={css.formGroup}>
              <label>{mode === 'buy' ? 'You Receive' : 'You Pay'} ({this.getCurrencySymbol()})</label>
              <input 
                type="number" 
                placeholder="0.00000000"
                value={this.state.cryptoAmount}
                onChange={this.handleCryptoChange}
              />
            </div>
          </div>

          <div className={css.rateInfo}>
            <div className={css.rateInfo__label}>Current Rate</div>
            <div className={css.rateInfo__value}>
              1 {this.getCurrencySymbol()} = ${this.rates[currency].toLocaleString()}
            </div>
          </div>

          <button className={css.exchangeButton}>
            {mode === 'buy' ? 'Buy' : 'Sell'} {this.getCurrencySymbol()}
          </button>
        </div>
      </div>
    )
  }
}
