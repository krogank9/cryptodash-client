var http = require('follow-redirects').http;
var fs = require('fs');

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