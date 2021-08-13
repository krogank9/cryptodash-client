var HTMLParser = require('node-html-parser')
var http = require('follow-redirects').http;
const fetch = require('sync-fetch');

var coinFullNames = require('./static_data/coin_name_map.json')
var coinDescriptions = {
    "_comment": "Data fetched from bitcoinwiki.org"
}

Object.keys(coinFullNames).forEach(coin => {
    let url = `https://en.bitcoinwiki.org/wiki/${coinFullNames[coin].split(" ").join("_")}`
    let parsedHTML = HTMLParser.parse(fetch(url).text())

    console.log(url)

    let firstThreeSentences = parsedHTML.querySelectorAll("#mw-content-text p").slice(1).filter(p => p.text.length > 5).map(p => p.text.replace(/\[[0-9]*\]/i, "").trim()).join(" ").split(". ").slice(0,3).join(". ")
    if(firstThreeSentences.length > 0) {
        if(firstThreeSentences.length > 300) {
            let firstTwoSentences = firstThreeSentences.split(". ").slice(0,2).join(". ")
            coinDescriptions[coin] = firstTwoSentences + "."
        }
        else {
            coinDescriptions[coin] = firstThreeSentences + "."
        }
    }
})


var fs = require('fs');

fs.writeFileSync("static_data/coin_descriptions.json", JSON.stringify(coinDescriptions, null, 2));