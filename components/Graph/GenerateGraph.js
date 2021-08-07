import React, { Component } from 'react';

function createElementSVG(e, props = {}, innerHTML) {
    return React.createElement(e, props, [innerHTML])
}

function findMinMax(dataObjs) {
    if (dataObjs.length === 0)
        return {}

    // Find x/y min/max from data

    let xMin = dataObjs[0].data[0][0]
    let xMax = dataObjs[0].data.slice(-1)[0][0]

    let yMin = dataObjs[0].data[0][1]
    let yMax = yMin

    dataObjs.forEach(function (dataObj) {
        dataObj.data.forEach(function (plotPoint) {
            xMin = Math.min(plotPoint[0], xMin)
            xMax = Math.max(plotPoint[0], xMax)

            yMin = Math.min(plotPoint[1], yMin)
            yMax = Math.max(plotPoint[1], yMax)
        })
    })

    // Add padding to y axis
    let ySpan = yMax - yMin
    yMin -= ySpan * 0.4
    yMax += ySpan * 0.4

    yMin = Math.max(yMin, 0)

    //console.log(xMin, xMax)
    //console.log(yMin, yMax)
    //console.log("---------")

    return {
        "xMin": xMin, "xMax": xMax,
        "yMin": yMin, "yMax": yMax,
    }
}

function getGraphGranularity(options) {
    if ("_granularity" in options)
        return options._granularity

    let timeSpan = options.xMax - options.xMin

    let possible_granularities = {
        "day": 1000 * 60 * 60 * 24,
        "week": 1000 * 60 * 60 * 24 * 7,
        "month": 1000 * 60 * 60 * 24 * 30,
        "year": 1000 * 60 * 60 * 24 * 30 * 12,
        "decade": 1000 * 60 * 60 * 24 * 30 * 12 * 10
    }


    // Find the granularity option closest to the given time span
    let best_g = "day"
    for (const g in possible_granularities) {
        let best_diff = Math.abs(possible_granularities[best_g] - timeSpan)
        let diff = Math.abs(possible_granularities[g] - timeSpan)
        if (diff < best_diff)
            best_g = g
    }

    return options._granularity = best_g
}

function formatTimestamp(unixTimestamp, options) {
    // Find the best fit granularity option for our data. This will be what we mark our x axis with.
    // If the timespan is <= a day, we display time as 6,8,10,12PM/AM etc...

    const d = new Date(unixTimestamp)

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const roundedMinutes = Math.round(d.getMinutes() / 60)
    let hours12 = (d.getHours() + roundedMinutes) % 12
    hours12 = hours12 === 0 ? 12 : hours12

    switch (getGraphGranularity(options)) {
        case "day":
            return `${hours12}${d.getHours() >= 12 ? "PM" : "AM"}`
        case "week":
        case "month":
            return `${d.getMonth() + 1}/${d.getDate()}`
        case "year":
        case "decade":
            return `${monthNames[d.getMonth()]} ${d.getFullYear()}`
    }
}

function nFormatter(num, options) {
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
    return item ? "$" + (num / item.value).toFixed(options._mobile ? 0 : 2) + item.symbol : "0";
}

/*
makeChart options:
------------------
width, height // width and height of outputted svg's viewbox
xMin, yMin, xMax, yMax // min and max x/y values for the graph. minX=0,maxX=100 for example would display
xInterval, yInterval

allData = [Array of dataObjects]
dataObject = {
    name: "", // Identifier for graph legend
    data: [x,y],
    color: #aaaaaa,
    solidFill: false
}

xLabelCallback // default (x)=>x, callback to optionally transform x axis labels to a string, for example formatted dates
yLabelCallback // default (y)=>y, callback to optionally transform y axis labels to a string, for example append a currency symbol

showGrid // default true, show gridlines
*/
var chartCount = 0
export var makeChart = function (options = {}) {
    options = JSON.parse(JSON.stringify(options))

    if (options.candlestick && options.dataObjs.length > 1)
        options.dataObjs = options.dataObjs.slice(-1)

    let minMax = findMinMax(options.dataObjs || [])

    options._mobile = options.width < options.height

    let xSpan = minMax.xMax - minMax.xMin
    let ySpan = minMax.yMax - minMax.yMin
    let numXTicks = options._mobile ? 4 : 6
    let numYTicks = 3
    let xInterval = xSpan / numXTicks
    // + 1 to numYTicks because gridline which would be at very top is always hidden.
    // Simplest way to give even spacing to the rest of the gridlines and labels.
    let yInterval = ySpan / (numYTicks + 1)

    let defaults = {
        ...minMax,
        xInterval: xInterval, yInterval: yInterval,
        showGrid: true, showLabels: true, strokeWidth: 2,
        xLabelCallback: (x) => formatTimestamp(x, options),
        yLabelCallback: (y) => nFormatter(y, options),
    }
    options = Object.assign(defaults, options)

    // setup some internal values
    options = {
        ...options,

        _chartCount: chartCount++,

        _leftPadding: 0, // Set later in makeGrid to give space for labels
        _rightPadding: 0,
        _bottomPadding: 0, // Set later in makeGrid to give space for labels
        _topPadding: 0,

        _lastX: options.xMin + Math.floor((options.xMax - options.xMin) / options.xInterval) * options.xInterval,
        _lastY: options.yMin + Math.floor((options.yMax - options.yMin) / options.yInterval) * options.yInterval,

        _xToGraph: (x) => {
            let xScale = (options.width - options._leftPadding - options._rightPadding) / (options.xMax - options.xMin)
            return Math.round((x - options.xMin) * xScale) + options._leftPadding
        },
        _yToGraph: (y) => {
            let yScale = (options.height - options._bottomPadding - options._topPadding) / (options.yMax - options.yMin)
            return Math.round(options.height - (y - options.yMin) * yScale - options._bottomPadding) + options._topPadding
        },
        _pxToDataScale: (x, y) => {
            let xScale = (options.width - options._leftPadding - options._rightPadding) / (options.xMax - options.xMin)
            let yScale = (options.height - options._bottomPadding - options._topPadding) / (options.yMax - options.yMin)
            return [
                x / xScale,
                y / yScale
            ]
        },
        _posToGraph: (pos) => [options._xToGraph(pos[0]), options._yToGraph(pos[1])],
    }

    //console.log("window")
    //console.log(window)
    window._xToGraph = options._xToGraph
    window._yToGraph = options._yToGraph

    let defs = []
    options.defs = defs

    let defaultColors = ["#7CCB9E", "#76C9FF"]
    options.dataObjs = options.dataObjs.map((dataObj, i) => {
        // Set colors
        dataObj.color = dataObj.color || defaultColors[i % defaultColors.length]
        dataObj.fillColor = dataObj.color

        return dataObj
    })

    let grid = []
    let legend = []
    if (options.showGrid) {
        grid = makeGrid(options)
        legend = makeLegend(options)
    }

    let plots = options.candlestick ? plotCandlestick(options) : plotData(options)

    let children = defs.concat(grid, legend, plots)
    // Keep react from complaining even though it isn't really a list
    children = children.map((el, key) => React.cloneElement(el, { key }));

    return (
        <svg style={{ width: "100%", height: options.height }}>
            {children}
        </svg>
    )
}

function makeLegend(options) {
    let svgElems = []

    const { xMin, xMax, yMin, yMax, xInterval, yInterval, width, height, strokeWidth, _lastX, _lastY, _xToGraph, _yToGraph, xLabelCallback, yLabelCallback, _leftPadding, _topPadding } = options

    options.dataObjs.forEach(({ name, color }, i) => {
        const [x, y] = [_leftPadding + 40, _topPadding + 40]
        const spacing = 30
        const text_offset = 2

        let label = createElementSVG("text", {
            x: x + 15, y: (y + spacing * i) + text_offset,
            fill: color,
            alignmentBaseline: "middle",
            fontWeight: "bold",
            fontSize: 18
        }, name)

        if (options.candlestick) {
            let halfCircleTop = createElementSVG("path", {
                fill: "#6dd598",
                d: `M${x - 4},${y + spacing * i} a1,1 0,0 1 8,0`
            })
            let halfCircleBottom = createElementSVG("path", {
                fill: "#d46d6f",
                d: `M${x - 4},${y + spacing * i} a1,1 0,0 0 8,0`
            })

            svgElems.push(halfCircleTop)
            svgElems.push(halfCircleBottom)
        }
        else {
            let circle = createElementSVG("circle", {
                cx: x, cy: y + spacing * i,
                r: 4,
                fill: color
            })
            svgElems.push(circle)
        }
        svgElems.push(label)
    })

    return svgElems
}

function makeGrid(options) {
    let svgElems = []
    const { xMin, xMax, yMin, yMax, xInterval, yInterval, width, height, strokeWidth, _lastX, _lastY, _xToGraph, _yToGraph, xLabelCallback, yLabelCallback } = options

    // Measure space for axis labels, and add appropriate padding
    let _leftPadding = options._leftPadding = options._mobile ? 60 : 90
    let _bottomPadding = options._bottomPadding = 50

    for (let x = xMin; x < xMax - 1; x += xInterval) {
        let line = createElementSVG("line", {
            x1: _xToGraph(x), x2: _xToGraph(x),
            y1: _yToGraph(yMin), y2: _yToGraph(_lastY),
            stroke: "#454545",
            strokeWidth: 1.5
        })

        let underMarker = createElementSVG("line", {
            x1: _xToGraph(x), x2: _xToGraph(x),
            y1: _yToGraph(yMin), y2: _yToGraph(yMin) + 8,
            stroke: "#454545",
            strokeWidth: 2
        })

        let circle = createElementSVG("circle", {
            cx: _xToGraph(x), cy: _yToGraph(yMin),
            r: 4,
            fill: "#454545"
        })

        let label = createElementSVG("text", {
            x: _xToGraph(x), y: _yToGraph(yMin) + _bottomPadding / 2,
            fill: "white",
            textAnchor: "middle",
            alignmentBaseline: "middle",
        }, xLabelCallback(x))

        if (x == xMin)
            svgElems.push(line)
        if (x != _lastX) {
            svgElems.push(underMarker)
            //svgElems.push(circle)
            svgElems.push(label)
        }
    }

    // yMax - 1 below prevents gridline & label from appearing at very top pixel of graph and getting cut off.
    for (let y = yMin; y < yMax - 1; y += yInterval) {
        let line = createElementSVG("line", {
            y1: _yToGraph(y), y2: _yToGraph(y),
            x1: y == yMin || y == _lastY ? 0 : _xToGraph(xMin), x2: _xToGraph(_lastX),
            stroke: "#454545",
            strokeWidth: 1.5
        })

        let label = createElementSVG("text", {
            x: _leftPadding / 2, y: _yToGraph(y),
            fill: "white",
            textAnchor: "middle",
            alignmentBaseline: "middle",
        }, yLabelCallback(y))

        svgElems.push(line)
        if (y != yMin && y != _lastY) {
            svgElems.push(label)
        }
    }

    return svgElems
}

function plotData(options) {
    let svgElems = []
    const { width, height, strokeWidth, yMin, yMax, xMin, xMax, _lastX, _lastY, _xToGraph, _yToGraph, _posToGraph, _chartCount } = options

    options.dataObjs.forEach(({ data, color, fillColor }, i) => {
        // Simplify data a bit, was lagging browser to have so many lineTos seemed like.
        data = data.filter((d, ii, a) => ii === 0 || ii === a.length - 1 || ii % 2 === 0)

        let lineTos = data.map(_posToGraph)
        let line_d = `M${lineTos[0][0]},${lineTos[0][1]}`
        line_d += lineTos.map(lt => `L${lt[0]},${lt[1]}`).join("")

        let linePath = createElementSVG("path", {
            stroke: color,
            fill: "none",
            strokeWidth: strokeWidth,
            d: line_d
        })

        const expandBeyond = 50 // Prevents visual glitching of edge of graph

        let fill_d = line_d + `L${width + expandBeyond},${_yToGraph(_lastY)}L${width + expandBeyond},${_yToGraph(yMin)}L${_xToGraph(xMin)},${_yToGraph(yMin)}z`
        let fillPath = createElementSVG("path", {
            fill: fillColor,
            fillOpacity: 0.75,
            strokeWidth: 0,
            d: fill_d,
            mask: options.dataObjs.length == 2 && i == 0 ? `url(#clipNum1${_chartCount})` : ""//`url(#clipNum0${_chartCount})`
        })

        let clipPath = (
            <mask id={`clipNum${i}${_chartCount}`}>
                <rect width={Math.abs(width - _xToGraph(xMin)) + expandBeyond} height={Math.abs(_yToGraph(yMax) - _yToGraph(yMin))} x={_xToGraph(xMin)} y="0" fill="white"></rect>
                {i == 1 ? <path fill="black" d={fill_d}></path> : []}
            </mask>
        )

        svgElems.push(fillPath)
        svgElems.push(linePath)
        options.defs.push(clipPath)
    })

    return svgElems
}

function plotCandlestick(options) {
    let svgElems = []
    const { width, height, strokeWidth, yMin, yMax, xMin, xMax, _lastX, _lastY, _xToGraph, _yToGraph, _posToGraph, _chartCount } = options

    let dataObj = options.dataObjs[0]
    const { data, color, fillColor, i } = dataObj

    // ------

    let xSpan = xMax - xMin

    // Typically, each candle on a candlestick chart represents one trading day. We can also use intervals shorter/longer than a day.
    const intervalSizes = {
        day: 48, // Twice-hourly intervals (48 candles)
        week: 48, // Twice daily
        month: 30, // Per month, standard 1 day intervals, 30 candles
        year: 48, // 4x monthly
        decade: 48
    }

    let numCandlesticks = intervalSizes[getGraphGranularity(options)]
    console.log("getGraphGranularity(options)")
    console.log(getGraphGranularity(options))
    let candlestickInterval = xSpan / numCandlesticks
    let candlestickWidthPx = Math.abs(_xToGraph(xMax) - _xToGraph(xMin)) / numCandlesticks

    let dataI = 0

    for (let i = 0; i < numCandlesticks; i++) {
        const x = xMin + candlestickInterval * i
        const endX = x + candlestickInterval

        // The body indicates the opening/closing values for the given time period.
        // The shadow indicates the highest/lowest values for the given time period.

        let bodyStart = data[dataI][1]
        let shadowMin = data[dataI][1]
        let shadowMax = data[dataI][1]
        let bodyEnd = bodyStart
        for (; dataI < data.length && data[dataI][0] <= endX; dataI++) {
            shadowMin = Math.min(shadowMin, data[dataI][1])
            shadowMax = Math.max(shadowMax, data[dataI][1])
            bodyEnd = data[dataI][1]
        }
        dataI-- // Start value of each wick should overlap with the end value of the previous and include it in its min/max calculations.


        let candleHeight = _yToGraph(bodyStart) - _yToGraph(bodyEnd)
        let fill = "#6dd598"
        if (candleHeight < 0) {
            candleHeight *= -1
            fill = "#d46d6f"
        }

        let realBody = createElementSVG("rect", {
            fill: fill,
            width: candlestickWidthPx - (options._mobile ? 2 : 6),
            height: Math.max(candleHeight, 1),
            x: _xToGraph(x) + (options._mobile ? 1 : 3),
            y: _yToGraph(Math.max(bodyStart, bodyEnd)),
            rx: options._mobile ? 1 : 2
        })

        let shadow = createElementSVG("line", {
            x1: _xToGraph(x) + candlestickWidthPx / 2, x2: _xToGraph(x) + candlestickWidthPx / 2,
            y1: _yToGraph(shadowMin) - 1, y2: _yToGraph(shadowMax) + 1, // - 1 to account for linecap nubs
            stroke: fill,
            strokeWidth: 2,
            strokeLinecap: "round"
        })

        svgElems.push(realBody)
        svgElems.push(shadow)
    }

    return svgElems
}

/*----------------------------------------*/

// return array of x,y values
export var generateData = function (xStepAvg, yStepAvg, maxX, startY = 0, avgSlope = 0.2) {
    let data = [[0, startY]]
    for (let x = xStepAvg; ; x += Math.random() * xStepAvg) {
        let lastData = data[data.length - 1]
        let y = Math.max(lastData[1] + yStepAvg * Math.random() - yStepAvg * 0.5 + yStepAvg * avgSlope, 0)
        data.push([x, y])

        if (x >= maxX) {
            // interpolate to exact maxX if went over
            if (x > maxX) {
                let prev = data[data.length - 2]
                let cur = data[data.length - 1]
                let dx = cur[0] - prev[0]
                let dy = cur[1] - prev[1]

                let toEnd = maxX - prev[0]
                let percentInterp = toEnd / dx // dx * x = toEnd, x = toEnd / dx

                data[data.length - 1] = [prev[0] + percentInterp * dx, prev[1] + percentInterp * dy]
            }

            break;
        }
    }
    return data
}
