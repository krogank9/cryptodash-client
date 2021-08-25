import config from '../config'

import Utils from '../Utils'

const TokenService = {
  saveAuthToken(token) {
    Utils.setCookie(config.TOKEN_KEY, token)
    //window.localStorage.setItem(config.TOKEN_KEY, token)
  },
  getAuthToken() {
    return Utils.getCookie(config.TOKEN_KEY)
    //return window.localStorage.getItem(config.TOKEN_KEY)
  },
  clearAuthToken() {
    Utils.eraseCookie(config.TOKEN_KEY)
    //window.localStorage.removeItem(config.TOKEN_KEY)
  }
}

export default TokenService
