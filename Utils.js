import BigDecimal from 'js-big-decimal';

const Utils = {
    lerp(a, b, t) {
        return a + (b - a) * t
    },

    clamp(v, min, max) {
        return Math.max(Math.min(v, max), min)
    },

    nFormatter(num, mobile = false) {
        const isNegative = num < 0
        const negativeSign = isNegative ? "-" : ""
        num = Math.abs(num)

        if (num < 1) {
            return negativeSign + "$" + num.toFixed(mobile ? 2 : 4);
        }

        const lookup = [
            { value: 1e18, symbol: "E" },
            { value: 1e15, symbol: "P" },
            { value: 1e12, symbol: "T" },
            { value: 1e9, symbol: "B" },
            { value: 1e6, symbol: "M" },
            { value: 1e3, symbol: "K" },
            { value: 1, symbol: "" },
        ];
        var item = lookup.find(function (item) {
            return num >= item.value;
        });

        if(!item)
            item = lookup.slice(0).pop()

        return negativeSign + "$" + (num / item.value).toFixed(mobile ? 0 : 2) + item.symbol;
    },
    transformGraphSpace(from, to) {
        // Make x coords of "from" graph match the "to" graph, interpolate between points.
        return to.map((point, i) => {
            const time = point[0]

            const nextTime = i < to.length - 1 ? to[i + 1][0] : 0
            if (time < from[0][0] && nextTime < from[0][0]) {
                return [time, 0]
            }

            // Find interpolated value on the "from" graph.
            let xAboveIndex = from.findIndex((p) => p[0] >= time)
            // if "to" spans more recent times than "from", use most recently available data to interpolate from
            if (time > from[from.length - 1][0])
                return [time, from[from.length - 1][1]]//xAboveIndex = from.length - 1
            let xBelowIndex = xAboveIndex - 1

            // When either index is -1, it means the graph hasn't started yet. One of the coins may be older than the other.
            // Treat the value before starting as 0
            let xAboveVal = xAboveIndex < 0 ? 0 : from[xAboveIndex][1]
            let xBelowVal = xBelowIndex < 0 ? 0 : from[xBelowIndex][1]
            let xAboveTime = xAboveIndex < 0 ? 0 : from[xAboveIndex][0]
            let xBelowTime = xBelowIndex < 0 ? 0 : from[xBelowIndex][0]

            if (i === to.length - 1)
                0;//return [time, point[1]]

            // Lerp from values from "from" graph's times to "to" graph's times
            let betweenSpan = xAboveTime - xBelowTime
            if (betweenSpan === 0) {
                console.log(`found zero. xAboveIndex: ${xAboveIndex}. time: ${time}`)
                return [time, xAboveVal]
            }
            let pctBetween = (time - xBelowTime) / betweenSpan

            let result = Utils.clamp(Utils.lerp(xBelowVal, xAboveVal, pctBetween), xBelowVal, xAboveVal)
            if (isNaN(result) || result === 0) {
                console.log(`NaN on ${i}, betweenSpan: ${betweenSpan}, pctBetween: ${pctBetween}`)
            }

            return [time, result]
        })
    },
    filterDictKeys(dict, filterFunc) {
        const filteredKeys = Object.keys(dict).filter(key => filterFunc(key, dict[key]))
        let filteredDict = {}
        filteredKeys.forEach(k => filteredDict[k] = dict[k])
        return filteredDict
    },
    mapDict(dict, cb) {
        let newDict = {}
        Object.keys(dict).forEach(key => {
            newDict[key] = cb(key, dict[key])
        })
        return newDict
    },
    getChangePct(data) {
        let y1 = data[0][1]
        let y2 = data.slice(0).pop()[1]
        let change = (y2 - y1) / y1
        return change * 100
    },
    addNumsPrecise(a,b) {
        return BigDecimal.add(a, b)
    }
}

export default Utils