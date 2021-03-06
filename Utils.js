import BigDecimal from 'js-big-decimal';

const ONE_HOUR = 1000 * 60 * 60

let serversideCookie = ""

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

        if (!item)
            item = lookup.slice(0).pop()

        return negativeSign + "$" + (num / item.value).toFixed(mobile ? 0 : 2) + item.symbol;
    },
    upgradeTimeFrame(timeFrame) {
        const prefixed = timeFrame.startsWith("graph_")
        timeFrame = timeFrame.replace("graph_", "")

        const newTimeFrame = { "1d": "1w", "1w": "1m", "1m": "1y", "1y": "all", "all": null }[timeFrame]
        return (prefixed ? "graph_" : "") + newTimeFrame
    },
    transformGraphSpace(from, to, longerTimeFrameFrom) {
        longerTimeFrameFrom = longerTimeFrameFrom || []
        // Make x coords of "from" graph match the "to" graph, interpolate between points.
        return to.map((point, i) => {
            const time = point[0]

            // Case where there aren't 2 times to lerp between. Usually happens when "all" graphs are different lengths,
            //  or sometimes when 2 graphs of the same timeFrame returned by API are slightly different lengths. This causes a visual glitch.
            //  Workaround is to pass 0 (handles "all" graphs which haven't started yet)
            //  or try to lerp from timeFrame 1 above if provided (handles visual glitches)
            if (time < from[0][0]) {
                const lower = longerTimeFrameFrom.find(([pointTime, val]) => time >= pointTime)
                let upper = longerTimeFrameFrom.find(([pointTime, val]) => time <= pointTime)
                if (lower && upper) {
                    if (from[0][0] < upper[0])
                        upper = from[0]
                    const pctBetween = (time - lower[0]) / (upper[0] - lower[0])
                    return [time, Utils.lerp(lower[1], upper[1], pctBetween)]
                }
                else {
                    return [time, 0]
                }
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
    addNumsPrecise(a, b) {
        return BigDecimal.add(a, b)
    },
    filterMoveToBeginning(arr, cb) {
        let addToBeginning = []
        arr = arr.filter(el => {
            if (cb(el)) {
                addToBeginning.push(el)
                return false
            }
            else
                return true
        })
        return addToBeginning.concat(arr)
    },
    clearDict(dict) {
        for (var prop in dict) {
            if (dict.hasOwnProperty(prop)) {
                delete dict[prop];
            }
        }
    },
    copyDictTo(to, from) {
        for (var prop in from) {
            if (from.hasOwnProperty(prop)) {
                to[prop] = from[prop];
            }
        }
    },
    setCookie(name, value, expireTime = ONE_HOUR) {
        try { document } catch { return /* Serverside */ }

        var expires = "";
        if (expireTime) {
            var date = new Date();
            date.setTime(date.getTime() + expireTime);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    },
    getCookie(name) {
        let cookieSource = serversideCookie || ""
        try {
            if (document)
                cookieSource = document.cookie || ""
        } catch { }

        var nameEQ = name + "=";
        var ca = cookieSource.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie(name) {
        try { document } catch { return /* Serverside */ }
        document.cookie = name+'=; Max-Age=-99999999;';
    },
    setServersideCookie(cookie) {
        serversideCookie = cookie
    },
    isServerSideRendering() {
        try {
            return !window
        }
        catch {
            return true
        }
    }
}

export default Utils