import Overview from './Overview'

//-------------------------------------------------------------
// Serverside static/initial props -- updated with cron job that fetches coingecko api
// Then, we can use cookie from user's request to determine which of the market data is relevant and what they have in their portfolio

var fs = require('fs');

function nFormatter(num) {

  if(num < 1000) {
    return "$"+Number(num).toFixed(2)
  }

  const lookup = [
      { value: 1e18, symbol: "E" },
      { value: 1e15, symbol: "P" },
      { value: 1e12, symbol: "T" },
      { value: 1e9, symbol: "G" },
      { value: 1e6, symbol: "M" },
      { value: 1e3, symbol: "K" },
      { value: 1, symbol: "" },
  ];
  var item = lookup.find(function (item) {
      return num >= item.value;
  });
  return item ? "$" + (num / item.value).toFixed(2) + item.symbol : "0";
}

export async function getServerSideProps(context) {

  var marketData = JSON.parse(fs.readFileSync('static_data/coins_markets_list.json', 'utf8'));

  marketData.length = 20
  marketData = marketData.map((coinInfo) => [coinInfo.symbol.toUpperCase(), nFormatter(coinInfo.current_price), Number(coinInfo.price_change_percentage_24h).toFixed(1)+"%"])
  return {
    props: {
      marketData: marketData
    }
  }
}

//-------------------------------------------------------------

export default function Home(args) {
  return Overview(args)
}
