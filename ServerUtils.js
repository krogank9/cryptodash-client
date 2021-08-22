
import GraphsCache from '../cryptodash-server/src/graphs/graphs-cache'
import Utils from './Utils'

const ONE_DAY = 1000 * 60 * 60 * 24

const timeFrames = {
    "1d": ONE_DAY,
    "1w": ONE_DAY * 7,
    "1m": ONE_DAY * 30,
    "1y": ONE_DAY * 365,
}

const ServerUtils = {
    getCoinGraph(coin, timeFrame) {
        const timeEnd = Date.now()
        const timeStart = timeFrames[timeFrame] ? timeEnd - timeFrames[timeFrame] : 0
        let [ok, graph] = GraphsCache.checkCache(coin, timeStart, timeEnd)

        return ok ? graph : null
    }
}

function withServerDir(f) {
    return (...args) => {
        const saveCWD = process.cwd()
        process.chdir("../cryptodash-server")

        const result = f(...args)

        process.chdir(saveCWD)

        return result
    }
}

const MappedServerUtils = Utils.mapDict(ServerUtils, (k,v) => withServerDir(v))

export default MappedServerUtils