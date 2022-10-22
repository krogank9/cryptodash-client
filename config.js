export default {
  API_ENDPOINT: process.env.NODE_ENV === "development"? 'http://localhost:8443/api' : 'https://cryptodash.ltkdigital.com:8443/api',
  TOKEN_KEY: "CryptodashAuthToken"
}
