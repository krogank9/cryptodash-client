
import GraphsCache from '../cryptodash-server/src/graphs/graphs-cache'
import Utils from './Utils'
import AuthService from '../cryptodash-server/src/auth/auth-service'
import WalletsService from '../cryptodash-server/src/wallets/wallets-service'

var fs = require('fs')
var xml2js = require('xml2js')

//import db from '../cryptodash-server/src/db'

const ONE_DAY = 1000 * 60 * 60 * 24

const timeFrames = {
    "1d": ONE_DAY,
    "1w": ONE_DAY * 7,
    "1m": ONE_DAY * 30,
    "1y": ONE_DAY * 365,
}

const knex = require('knex')

import { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_DB } from '../cryptodash-server/src/config'

const db = knex({
    client: 'pg',
    connection: {
        host: DATABASE_HOST,
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_DB,
    },
})

import CoinIdMap from "./static_data/coin_id_map.json"

const ServerUtils = {
    getCoinGraph(coin, timeFrame) {
        const timeEnd = Date.now()
        const timeStart = timeFrames[timeFrame] ? timeEnd - timeFrames[timeFrame] : 0
        let [ok, graph] = GraphsCache.checkCache(coin, timeStart, timeEnd)

        return ok ? graph : null
    },
    getUserWallets(authToken) {
        const payload = AuthService.verifyJwt(authToken)
        return AuthService.getUserWithUserName(
            db,
            payload.sub,
        ).then(user => {
            if (!user || !user.id)
                return null
            return WalletsService.getWalletsForUser(db, user.id)
        })
    },
    getRssData() {
        var parser = new xml2js.Parser()
        return parser.parseStringPromise(fs.readFileSync('static_data/crypto_rss.xml', 'utf8'));
    },
    getMarketData() {
        return JSON.parse(fs.readFileSync('static_data/coins_markets_list.json', 'utf8'));
    },
    tryGetPredictionData(coin) {
        let preloadedPrediction = GraphsCache.getPredictionCacheJSON(CoinIdMap[coin])
        let lastRealData = preloadedPrediction[0].slice().pop()

        const ONE_HOUR = 1000 * 60 * 60
        // Make sure up to date within 24 h
        if (!lastRealData || Date.now() - lastRealData[0] > ONE_HOUR * 24) {

            // Micro optimization to already start preloading prediction before client makes 2nd request if no data ready now
            try {
                fetch(`http://localhost:8000/api/predictions/${CoinIdMap[coin]}`)
            } catch { }

            return [[], []]
        }

        return preloadedPrediction
    }
}

function withServerDir(f) {
    return (...args) => {
        const saveCWD = process.cwd()
        process.chdir("../cryptodash-server")

        try {
            return f(...args)
        } finally {
            process.chdir(saveCWD)
        }
    }
}

const MappedServerUtils = Utils.mapDict(ServerUtils, (k, v) => withServerDir(v))

export default MappedServerUtils