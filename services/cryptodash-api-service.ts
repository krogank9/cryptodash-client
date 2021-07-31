import config from '../config'

const CryptoDashApiService = {
  // Coins
  getCharts(coins, timeSpan) {
    return fetch(`${config.API_ENDPOINT}/charts`, {
      headers: {
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  // Todo incremental static regeneration on this once per hour... Plus a cron job running on server hourly.
  getMarketData(coins) {
    return fetch(`${config.API_ENDPOINT}/market_data`, {
      headers: {
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  // Rss -- Could probably optimize this out... Check once hourly on serverside for little to no overhead and serve as a constant in the react app server. Might make code simpler + faster
  // Todo also incremental static regeneration on this once per hour
  getRss() {
    return fetch(`${config.API_ENDPOINT}/rss`, {
      headers: {
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
}

export default CryptoDashApiService
