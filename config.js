export default {
  API_ENDPOINT: process.env.NODE_ENV === "development"? 'http://localhost:8000/api' : 'https://cryptodash.ltkdigital.com:8000/api',
}
