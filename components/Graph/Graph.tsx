import React, { Component } from 'react';
import { makeChart } from './GenerateGraph.js'

import { withResizeDetector } from 'react-resize-detector';

interface IProps {
    options: any,
    width?: Number,
    height?: Number,
}
interface IState {
}

class Graph extends React.Component<IProps, IState> {

    /*
    shouldComponentUpdate(nextProps, nextState) {
        // Should be able to just check if prev and next dataObjs === each other
        // That + any prop differences
        // + maybe shim thing for resize detector, i think that passes width
        return true
    }
    */

    render() {
        if (!this.props || Object.keys(this.props).length === 0 || Object.keys(this.props.options).length === 0)
            return (<></>)

        let options = {...this.props.options}
        if(this.props.width)
            options.width = this.props.width

        let svg = makeChart(options)
        return (
            <div>
                {svg}
            </div>
        )
    }
}

export default Graph

export function GraphWithResize(props) {
    const GraphWR = withResizeDetector(Graph)
    return (
        <GraphWR {...props} />
    )
}