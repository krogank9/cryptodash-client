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

function formatTimestamp(unixTimestamp, options) {
    // Find the best fit granularity option for our data. This will be what we mark our x axis with.
    // If the timespan is <= a day, we display time as 6,8,10,12PM/AM etc...
    if (!options._granularity) {
        let timeSpan = options.xMax - options.xMin

        console.log("timeSpan")
        console.log(timeSpan)

        let possible_granularities = {
            "day"   : 1000 * 60 * 60 * 24,
            "week"  : 1000 * 60 * 60 * 24 * 7,
            "month" : 1000 * 60 * 60 * 24 * 7 * 30,
            "year"  : 1000 * 60 * 60 * 24 * 7 * 30 * 12,
            "decade": 1000 * 60 * 60 * 24 * 7 * 30 * 12 * 10
        }


        // Find the granularity option closest to the given time span
        let best_g = "day"
        for (const g in possible_granularities) {
            let best_diff = Math.abs(possible_granularities[best_g] - timeSpan)
            let diff = Math.abs(possible_granularities[g] - timeSpan)
            if (diff < best_diff)
                best_g = g
        }

        options._granularity = best_g
    }

    const d = new Date(unixTimestamp)

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const roundedMinutes = Math.round(d.getMinutes() / 60)
    let hours12 = (d.getHours() + roundedMinutes) % 12
    hours12 = hours12 === 0 ? 12 : hours12

    console.log(options._granularity)

    switch (options._granularity) {
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

function nFormatter(num, digits) {
    const lookup = [
        { value: 1e18, symbol: "E" },
        { value: 1e15, symbol: "P" },
        { value: 1e12, symbol: "T" },
        { value: 1e9, symbol: "G" },
        { value: 1e6, symbol: "M" },
        { value: 1e3, symbol: "K" },
        { value: 1, symbol: "" },
    ];
    var item = lookup.find(function(item) {
      return num >= item.value;
    });
    return item ? "$" + (num / item.value).toFixed(digits) + item.symbol : "0";
  }

function formatCurrency(price) {
    //return "$" + price.toLocaleString(undefined, { minimumIntegerDigits: 1, maximumFractionDigits: 2, minimumFractionDigits: 2 })// + "K"
    return nFormatter(price, 2)
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
var fillCount = 0
export var makeChart = function (options = {}) {
    let minMax = findMinMax(options.dataObjs || [])

    let xSpan = minMax.xMax - minMax.xMin
    let ySpan = minMax.yMax - minMax.yMin
    let numXTicks = 6
    let numYTicks = 5 // actually 4 but the first at the x axis isn't labeled
    let xInterval = xSpan / numXTicks
    let yInterval = ySpan / numYTicks

    console.log(xInterval, yInterval)

    let defaults = {
        ...minMax,
        xInterval: xInterval, yInterval: yInterval,
        showGrid: true, showLabels: true, strokeWidth: 2,
        xLabelCallback: (x) => formatTimestamp(x, options),
        yLabelCallback: (y) => formatCurrency(y),
    }
    options = Object.assign(defaults, options)

    // setup some internal values
    options = {
        ...options,

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

    let plots = plotData(options)

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
        let circle = createElementSVG("circle", {
            cx: x, cy: y + spacing * i,
            r: 4,
            fill: color
        })

        let label = createElementSVG("text", {
            x: x + 15, y: (y + spacing * i) + text_offset,
            fill: color,
            alignmentBaseline: "middle",
            fontWeight: "bold",
            fontSize: 18
        }, name)

        svgElems.push(circle)
        svgElems.push(label)
    })

    return svgElems
}

function makeGrid(options) {
    let svgElems = []
    const { xMin, xMax, yMin, yMax, xInterval, yInterval, width, height, strokeWidth, _lastX, _lastY, _xToGraph, _yToGraph, xLabelCallback, yLabelCallback } = options

    // Measure space for axis labels, and add appropriate padding
    let _leftPadding = options._leftPadding = 90
    let _bottomPadding = options._bottomPadding = 50

    for (let x = xMin; x < xMax; x += xInterval) {
        console.log("creating grid marker x: " + x)
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

    for (let y = yMin; y < yMax; y += yInterval) {
        let line = createElementSVG("line", {
            y1: _yToGraph(y), y2: _yToGraph(y),
            x1: y == 0 || y == _lastY ? 0 : _xToGraph(0), x2: _xToGraph(_lastX),
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
    const { width, height, strokeWidth, yMin, yMax, xMin, xMax, _lastX, _lastY, _xToGraph, _yToGraph, _posToGraph } = options

    options.dataObjs.forEach(({ data, color, fillColor }, i) => {
        let lineTos = data.map(_posToGraph)
        let line_d = `M${lineTos[0][0]},${lineTos[0][1]}`
        line_d += lineTos.map(lt => `L${lt[0]},${lt[1]}`).join("")

        let linePath = createElementSVG("path", {
            stroke: color,
            fill: "none",
            strokeWidth: strokeWidth,
            d: line_d
        })

        let fill_d = line_d + `L${_xToGraph(_lastX)},${_yToGraph(yMin)}L${_xToGraph(xMin)},${_yToGraph(yMin)}z`
        let fillPath = createElementSVG("path", {
            fill: fillColor,
            fillOpacity: 0.75,
            strokeWidth: 0,
            d: fill_d,
            mask: i == 0 && options.dataObjs.length >= 2 ? "url(#clipNum1)" : undefined
        })

        let clipPath = (
            <mask id={`clipNum${i}`}>
                <rect width={width} height={height} fill={"white"}></rect>
                <path fill={"black"} d={fill_d}></path>
            </mask>
        )

        svgElems.push(fillPath)
        svgElems.push(linePath)
        options.defs.push(clipPath)
    })

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
