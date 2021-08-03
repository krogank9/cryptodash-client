var http = require('follow-redirects').http;
var fs = require('fs');

// Rss feed

http.get({host: "cointelegraph.com", port: 80, path: '/editors_pick_rss'}, function (res) {
    console.log("Got response: " + res.statusCode);

    let allChunks = ""

    res.on('data', function (chunk) {
        allChunks += chunk
        fs.writeFile("static_data/crypto_rss.xml", allChunks, function (err) {
            if (err) return console.log(err);
            console.log(`rss > "static_data/crypto_rss.xml"`);
        });
      });
}).on('error', function (e) {
    console.log("Got error: " + e.message);
});

// Market data

http.get({host: "api.coingecko.com", port: 80, path: '/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=price_change_percentage'}, function (res) {
    console.log("Got response: " + res.statusCode);

    let allChunks = ""

    res.on('data', function (chunk) {
        allChunks += chunk
        fs.writeFile("static_data/coins_markets_list.json", allChunks, function (err) {
            if (err) return console.log(err);
            console.log(`coins market data > "static_data/coins_markets_list.json"`);
        });
      });
}).on('error', function (e) {
    console.log("Got error: " + e.message);
});

// Coin data

var DefaultCoins = require('./static_data/default_coins.json')

for(let coin of DefaultCoins) {
    let curUnixTimestamp = Date.now() / 1000
    let dayAgoUnixTimestamp = curUnixTimestamp - 3600*24

    let _coin = coin === "btc" ? "bitcoin" : coin
    http.get({host: "api.coingecko.com", port: 80, path: `/api/v3/coins/${_coin}/market_chart/range?vs_currency=usd&from=${dayAgoUnixTimestamp}&to=${curUnixTimestamp}`}, function (res) {
        console.log("Got response: " + res.statusCode);
    
        let allChunks = ""
    
        res.on('data', function (chunk) {
            allChunks += chunk
            fs.writeFile(`static_data/${coin}_1d.json`, allChunks, function (err) {
                if (err) return console.log(err);
                console.log(`${coin} graph data > "static_data/${coin}_1d.json"`);
            });
          });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    });
}
