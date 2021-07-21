import React, { Component } from 'react';

function createElementSVG(e, props = {}, innerHTML) {
    return React.createElement(e, props, [innerHTML])
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
    let defaults = {
        xInterval: 1, yInterval: 1,
        showGrid: true, showLabels: true, strokeWidth: 2,
        xLabelCallback: (x) => "" + x,
        yLabelCallback: (y) => "" + y,
    }
    options = Object.assign(defaults, options)

    // setup some internal values
    options = {
        ...options,

        _leftPadding: 0,
        _rightPadding: 0,
        _bottomPadding: 0,
        _topPadding: 0,

        _lastX: options.xMin + Math.floor((options.xMax - options.xMin) / options.xInterval) * options.xInterval,
        _lastY: options.yMin + Math.floor((options.yMax - options.yMin) / options.yInterval) * options.yInterval,

        _xToGraph: (x) => {
            let xScale = (options.width - options._leftPadding - options._rightPadding) / (options.xMax - options.xMin)
            return Math.round(x * xScale) + options._leftPadding
        },
        _yToGraph: (y) => {
            let yScale = (options.height - options._bottomPadding - options._topPadding) / (options.yMax - options.yMin)
            return Math.round(options.height - y * yScale - options._bottomPadding) + options._topPadding
        },
        _posToGraph: (pos) => [options._xToGraph(pos[0]), options._yToGraph(pos[1])],
    }

    let defs = []
    options.defs = defs

    let defaultColors = ["#7CCB9E", "#76C9FF"]
    options.dataObjs = options.dataObjs.map((data, i) => {
        // Set colors
        data = { color: defaultColors[i % defaultColors.length], ...data }
        data.fillColor = data.color

        return data
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
    children = children.map( (el,key) => React.cloneElement(el, {key}) );

    return (
        <svg viewBox={`0 0 ${options.width} ${options.height}`}>
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
        let line = createElementSVG("line", {
            x1: _xToGraph(x), x2: _xToGraph(x),
            y1: _yToGraph(0), y2: _yToGraph(_lastY),
            stroke: "#454545",
            strokeWidth: 1.5
        })

        let underMarker = createElementSVG("line", {
            x1: _xToGraph(x), x2: _xToGraph(x),
            y1: _yToGraph(0), y2: _yToGraph(0) + 8,
            stroke: "#454545",
            strokeWidth: 2
        })

        let circle = createElementSVG("circle", {
            cx: _xToGraph(x), cy: _yToGraph(0),
            r: 4,
            fill: "#454545"
        })

        let label = createElementSVG("text", {
            x: _xToGraph(x), y: _yToGraph(0) + _bottomPadding / 2,
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
    const { width, height, strokeWidth, _lastX, _lastY, _xToGraph, _yToGraph, _posToGraph } = options

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

        let fill_d = line_d + `L${_xToGraph(_lastX)},${_yToGraph(0)}L${_xToGraph(0)},${_yToGraph(0)}z`
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
