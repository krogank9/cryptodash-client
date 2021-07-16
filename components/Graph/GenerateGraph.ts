let chart_container = document.getElementById("chart")
let width = chart_container.offsetWidth
let height = chart_container.offsetHeight

//let svg = `<svg width=100% height=100% viewBox="0 0 1000 930" preserveAspectRatio="none"><path class="area" style="fill: rgba(0, 114, 198, 0.2980392156862745);" d="M-0,872.1457551394693C4.6000000000000005,868.0364319269877,26.066666666666666,797.9386846177426,30.666666666666668,787.278743840129S56.733333333333334,728.3835750661772,61.333333333333336,730.0132114379539S87.4,800.0933886879487,92,809.0072287971533S118.06666666666668,842.0399550538006,122.66666666666667,848.8644128940141S148.73333333333332,903.8693836786841,153.33333333333331,900S179.4,804.7627148345915,184,797.2726305115585S210.06666666666666,805.2258784939872,214.66666666666666,800.1322090262267S240.73333333333335,733.6161970338039,245.33333333333334,729.357037608086S271.4,739.532928153508,276,743.3434166833206S302.0666666666666,770.8434939974969,306.66666666666663,780.16355133892S332.73333333333335,868.4036850606145,337.33333333333337,867.610847902295S363.4,784.1589003159586,368,769.592389227992S394.06666666666666,684.3118741070884,398.6666666666667,673.3907000627415S424.7333333333333,633.1596368127348,429.3333333333333,623.9767353033673S455.4,560.0202150727658,460,550.9520132711746S486.06666666666666,503.0663994133497,490.6666666666667,503.06737794881735S516.7333333333333,552.158932327768,521.3333333333334,550.9650604107431S547.4,493.7675390530424,552,487.1490857218206S578.0666666666666,466.1838245385211,582.6666666666666,462.7190159944524S608.7333333333332,445.36620075506227,613.3333333333333,440.95163846757083S639.4000000000001,405.0130857654193,644.0000000000001,403.85818549456644S670.0666666666667,430.18429463403777,674.6666666666667,425.55296818953184S700.7333333333333,349.54268104463677,705.3333333333334,342.1071662344867S731.4,336.02210198471766,736,326.4127707208655S762.0666666666667,213.95556450442257,766.6666666666667,213.98274938312397S792.7333333333333,313.5469356579391,797.3333333333334,326.77523577021793S823.4,388.78075552163386,828,390.36008421350857S854.0666666666666,351.8867510511966,858.6666666666666,347.83295166188077S884.7333333333333,340.20771450620623,889.3333333333334,336.3094256892973S915.4,300.0866334286284,920,295.85576743642764S946.0666666666667,289.97796074285225,950.6666666666667,279.8978791266204S976.7333333333333,161.69844733926686,981.3333333333334,161.4546792200042S1007.4000000000001,271.6895591675776,1012.0000000000001,276.6476375364508S1038.0666666666668,235.6111964084887,1042.6666666666667,227.56239080497983S1068.7333333333336,168.77230061740897,1073.3333333333335,169.33022948966516S1099.4,229.35498269851132,1104,235.00144243506247S1130.0666666666668,243.8367399381625,1134.6666666666667,244.6163593103464S1160.7333333333333,247.0350047114789,1165.3333333333333,245.3963673975146S1191.4,221.92638467412087,1196,222.76786179082364S1222.0666666666666,251.3644285511407,1226.6666666666665,256.61606228688447S1252.7333333333331,298.59417940077356,1257.3333333333333,292.7896449340725S1283.4000000000003,194.32114945786407,1288.0000000000002,179.22226939753637S1314.0666666666668,99.77649519402462,1318.6666666666667,91.47124412970243S1344.7333333333336,75.34593184963478,1349.3333333333335,68.4855885399071S1375.4,4.05988687932836,1380,0S1406.0666666666668,10.077532787466339,1410.6666666666667,14.353763482196086S1436.7333333333333,45.56337614432641,1441.3333333333333,57.016409263063Q1444.3999999999999,64.6517646755542,1472,167.06087173201854L1472,925Q1444.3999999999999,925,1441.3333333333333,925C1436.7333333333333,925,1415.2666666666667,925,1410.6666666666667,925S1384.6,925,1380,925S1353.9333333333334,925,1349.3333333333335,925S1323.2666666666667,925,1318.6666666666667,925S1292.6000000000001,925,1288.0000000000002,925S1261.9333333333334,925,1257.3333333333333,925S1231.2666666666664,925,1226.6666666666665,925S1200.6,925,1196,925S1169.9333333333332,925,1165.3333333333333,925S1139.2666666666667,925,1134.6666666666667,925S1108.6,925,1104,925S1077.9333333333334,925,1073.3333333333335,925S1047.2666666666667,925,1042.6666666666667,925S1016.6000000000001,925,1012.0000000000001,925S985.9333333333334,925,981.3333333333334,925S955.2666666666668,925,925.6666666666667,925S924.6,925,920,925S893.9333333333334,925,889.3333333333334,925S863.2666666666667,925,858.6666666666666,925S832.6,925,828,925S801.9333333333334,925,797.3333333333334,925S771.2666666666668,925,766.6666666666667,925S740.6,925,736,925S709.9333333333334,925,705.3333333333334,925S679.2666666666668,925,674.6666666666667,925S648.6000000000001,925,644.0000000000001,925S617.9333333333333,925,613.3333333333333,925S587.2666666666667,925,582.6666666666666,925S556.6,925,552,925S525.9333333333334,925,521.3333333333334,925S495.2666666666667,925,490.6666666666667,925S464.6,925,460,925S433.93333333333334,925,429.3333333333333,925S403.2666666666667,925,398.6666666666667,925S372.6,925,368,925S341.9333333333334,925,337.33333333333337,925S311.26666666666665,925,306.66666666666663,925S280.6,925,276,925S249.93333333333334,925,245.33333333333334,925S219.26666666666665,925,214.66666666666666,925S188.6,925,184,925S157.9333333333333,925,153.33333333333331,925S127.26666666666667,925,122.66666666666667,925S96.6,925,92,925S65.93333333333334,925,61.333333333333336,925S35.266666666666666,925,30.666666666666668,925S4.6000000000000005,925,0,925Q-3.066666666666667,925,-0.666666666666668,925Z"></path></svg>`
let svg = `<svg width="100%" height="100%" viewbox="0 0 1000 930" preserveaspectratio="none"><line x1="0" x2="0" y1="0" y2="930" stroke="white"></line><line x1="100" x2="100" y1="0" y2="930" stroke="white"></line><line x1="200" x2="200" y1="0" y2="930" stroke="white"></line><line x1="300" x2="300" y1="0" y2="930" stroke="white"></line><line x1="400" x2="400" y1="0" y2="930" stroke="white"></line><line x1="500" x2="500" y1="0" y2="930" stroke="white"></line><line x1="600" x2="600" y1="0" y2="930" stroke="white"></line><line x1="700" x2="700" y1="0" y2="930" stroke="white"></line><line x1="800" x2="800" y1="0" y2="930" stroke="white"></line><line x1="900" x2="900" y1="0" y2="930" stroke="white"></line><line y1="0" y2="0" x1="0" x2="1000" stroke="white"></line><line y1="93" y2="93" x1="0" x2="1000" stroke="white"></line><line y1="186" y2="186" x1="0" x2="1000" stroke="white"></line><line y1="279" y2="279" x1="0" x2="1000" stroke="white"></line><line y1="372" y2="372" x1="0" x2="1000" stroke="white"></line><line y1="465" y2="465" x1="0" x2="1000" stroke="white"></line><line y1="558" y2="558" x1="0" x2="1000" stroke="white"></line><line y1="651" y2="651" x1="0" x2="1000" stroke="white"></line><line y1="744" y2="744" x1="0" x2="1000" stroke="white"></line><line y1="837" y2="837" x1="0" x2="1000" stroke="white"></line></svg>`


function mToR(x) {
    if(x <= 12) {
        return x + "AM";
    }
    if(x >= 24) {
        x -= 12
        return x + "AM"
    }
    if(x > 12) {
        x %= 12
        return x + "PM"
    }
}

chart_container.appendChild(makeChart({
    width: width, height: height,
    xMin: 0, xMax: 12,
    yMin: 0, yMax: 15,
    yInterval: 3, xInterval: 2,
    dataObjs: [
        {name: "Total Portfolio", data: generateData(0.5, 0.75, 15, 3.5), solidFill: false},
        {name: "BTC", data: generateData(0.5, 0.6/2, 15, 4/2), solidFill: false},
    ],
    yLabelCallback: (y) => "$"+(y*1.25).toLocaleString(undefined, {minimumIntegerDigits: 1,  maximumFractionDigits: 2, minimumFractionDigits: 2 })+"K",
    xLabelCallback: (x) => mToR(x+12)
}))

for(let wg of Array.from(document.getElementsByClassName("wallet-graph"))) {
    wg.appendChild(makeChart({
        width: wg.offsetWidth, height: 65,
        xMin: 0, xMax: 10,
        yMin: 0, yMax: 10,
        showGrid: false,
        showLabels: false,
        strokeWidth: 1.5,
        dataObjs: [
            {name: "BTC", data: generateData(0.5, 0.5, 10, 2), color: "#5FA3D2"}
        ]
    }))
}

//chart_container.innerHTML = svg

function setAttributes(el, attrs) {
    for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function createElementSVG(e, attrs = {}) {
    let elem = document.createElementNS('http://www.w3.org/2000/svg', e);
    setAttributes(elem, attrs)
    return elem
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
function makeChart(options = {}) {
    let defaults = {
        xInterval: 1, yInterval: 1,
        showGrid: true, showLabels: true, strokeWidth: 2,
        xLabelCallback: (x) => ""+x,
        yLabelCallback: (y) => ""+y,
    }
    options = Object.assign(defaults, options)
    
    // setup some internal values
    options = {
        ...options,

        _leftPadding: 0,
        _rightPadding: 0,
        _bottomPadding: 0,
        _topPadding: 0,

        _lastX: options.xMin + Math.floor((options.xMax-options.xMin)/options.xInterval)*options.xInterval,
        _lastY: options.yMin + Math.floor((options.yMax-options.yMin)/options.yInterval)*options.yInterval,
        
        _xToGraph: (x) => {
            let xScale = (options.width - options._leftPadding - options._rightPadding) / (options.xMax - options.xMin)
            return Math.round(x*xScale) + options._leftPadding
        },
        _yToGraph: (y) => {
            let yScale = (options.height - options._bottomPadding - options._topPadding) / (options.yMax - options.yMin)
            return Math.round(options.height - y*yScale - options._bottomPadding) + options._topPadding
        },
        _posToGraph: (pos) => [options._xToGraph(pos[0]), options._yToGraph(pos[1])],
    }

    let svg = createElementSVG("svg", undefined)
    setAttributes(svg, {
        //width: "100%", height: "100%",
        viewBox: `0 0 ${options.width} ${options.height}`,
        preserveAspectRatio: "none"
    })

    let defs = createElementSVG("defs")
    options.defs = defs

    let defaultColors = ["#7CCB9E", "#76C9FF"]
    options.dataObjs = options.dataObjs.map((data, i) => {
        // Set colors
        data = {color: defaultColors[i % defaultColors.length], ...data}
        data.fillColor = data.color
        if(!data.solidFill) {
            // note: fillCount is global here because svg's will use global id's for fill styling. can't have overlap between graphs on page
            defs.innerHTML += `
            <linearGradient id="chartFillGrad${window.fillCount = (window.fillCount||0)+1}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${data.color};stop-opacity:${options.dataObjs.length > 1 && i==0? 0.75:0.75}" />
                <stop offset="90%" style="stop-color:${data.color};stop-opacity:${0.75}" />
                <stop offset="100%" style="stop-color:${data.color};stop-opacity:${0.75}" />
            </linearGradient>
            `
            data.fillColor = `url(#chartFillGrad${window.fillCount})`
        }
        return data
    })
    svg.appendChild(defs)

    if(options.showGrid) {
        let grid = makeGrid(options)
        grid.forEach((e) => svg.appendChild(e))

        let legend = makeLegend(options)
        legend.forEach((e) => svg.appendChild(e))
    }

    let plot = plotData(options)
    plot.forEach((e) => svg.appendChild(e))

    return svg
}

function makeLegend(options) {
    let svgElems = []

    const {xMin, xMax, yMin, yMax, xInterval, yInterval, width, height, strokeWidth, _lastX, _lastY, _xToGraph, _yToGraph, xLabelCallback, yLabelCallback, _leftPadding, _topPadding} = options

    options.dataObjs.forEach(({name, color}, i) => {
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
            "alignment-baseline": "middle",
            "font-weight": "bold",
            "font-size": 18
        })
        label.innerHTML = name

        svgElems.push(circle)
        svgElems.push(label)
    })

    return svgElems
}

function makeGrid(options) {
    let svgElems = []
    const {xMin, xMax, yMin, yMax, xInterval, yInterval, width, height, strokeWidth, _lastX, _lastY, _xToGraph, _yToGraph, xLabelCallback, yLabelCallback} = options

    // Measure space for axis labels, and add appropriate padding
    _leftPadding = options._leftPadding = 90
    _bottomPadding = options._bottomPadding = 50

    for(let x = xMin; x < xMax; x += xInterval) {
        let line = createElementSVG("line", {
            x1: _xToGraph(x), x2: _xToGraph(x),
            y1: _yToGraph(0), y2: _yToGraph(_lastY),
            stroke: "#454545",
            "stroke-width": 1.5
        })

        let underMarker = createElementSVG("line", {
            x1: _xToGraph(x), x2: _xToGraph(x),
            y1: _yToGraph(0), y2: _yToGraph(0) + 8,
            stroke: "#454545",
            "stroke-width": 2
        })

        let circle = createElementSVG("circle", {
            cx: _xToGraph(x), cy: _yToGraph(0),
            r: 4,
            fill: "#454545"
        })

        let label = createElementSVG("text", {
            x: _xToGraph(x), y: _yToGraph(0) + _bottomPadding/2,
            fill: "white",
            "text-anchor": "middle",
            "alignment-baseline": "middle",
        })
        label.innerHTML = xLabelCallback(x)

        if(x == xMin)
            svgElems.push(line)
        if(x != _lastX) {
            svgElems.push(underMarker)
            //svgElems.push(circle)
            svgElems.push(label)
        }
    }

    for(let y = yMin; y < yMax; y += yInterval) {
        let line = createElementSVG("line", {
            y1: _yToGraph(y), y2: _yToGraph(y),
            x1: y == 0 || y == _lastY ? 0 : _xToGraph(0), x2: _xToGraph(_lastX),
            stroke: "#454545",
            "stroke-width": 1.5
        })

        let label = createElementSVG("text", {
            x: _leftPadding/2, y: _yToGraph(y),
            fill: "white",
            "text-anchor": "middle",
            "alignment-baseline": "middle",
        })
        label.innerHTML = yLabelCallback(y)

        svgElems.push(line)
        if(y != yMin && y != _lastY) {
            svgElems.push(label)
        }
    }

    return svgElems
}

function plotData(options) {
    let svgElems = []
    const {width, height, strokeWidth, _lastX, _lastY, _xToGraph, _yToGraph, _posToGraph} = options

    options.dataObjs.forEach(({data, color, fillColor}, i) => {
        let lineTos = data.map(_posToGraph)
        let line_d = `M${lineTos[0][0]},${lineTos[0][1]}`
        line_d += lineTos.map(lt => `L${lt[0]},${lt[1]}`).join("")

        let linePath = createElementSVG("path", {
            stroke: color,
            fill: "none",
            "stroke-width": strokeWidth,
            d: line_d
        })

        let fill_d = line_d + `L${_xToGraph(_lastX)},${_yToGraph(0)}L${_xToGraph(0)},${_yToGraph(0)}z`
        let fillPath = createElementSVG("path", {
            fill: fillColor,
            "stroke-width": 0,
            d: fill_d
        })

        let clipPath = createElementSVG("mask", {id: `clipNum${i}`})
        let clipPathRect = createElementSVG("rect", {width: width, height: height, fill: "white"})
        clipPath.appendChild(clipPathRect)
        let clipPathPath = createElementSVG("path", {
            fill: "black",
            d: fill_d,
        })
        clipPath.appendChild(clipPathPath)

        if(i == 0 && options.dataObjs.length >= 2) {
            setAttributes(fillPath, {
                "mask": `url(#clipNum1)`
            })
        }

        svgElems.push(fillPath)
        svgElems.push(linePath)
        options.defs.innerHTML += clipPath.outerHTML
    })

    return svgElems
}


/*----------------------------------------*/

// return array of x,y values
function generateData(xStepAvg, yStepAvg, maxX, startY = 0, avgSlope = 0.2) {
    let data = [[0,startY]]
    for(let x = xStepAvg; ; x += Math.random() * xStepAvg) {
        let lastData = data[data.length-1]
        let y = Math.max(lastData[1] + yStepAvg * Math.random() - yStepAvg * 0.5 + yStepAvg * avgSlope, 0)
        data.push([x, y])

        if(x >= maxX) {
            // interpolate to exact maxX if went over
            if(x > maxX) {
                let prev = data[data.length-2]
                let cur = data[data.length-1]
                let dx = cur[0] - prev[0]
                let dy = cur[1] - prev[1]

                let toEnd = maxX - prev[0]
                let percentInterp = toEnd / dx // dx * x = toEnd, x = toEnd / dx

                data[data.length-1] = [prev[0] + percentInterp*dx, prev[1] + percentInterp*dy]
            }

            break;
        }
    }
    return data
}