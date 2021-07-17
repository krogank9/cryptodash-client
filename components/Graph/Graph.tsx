import React, { Component } from 'react';
import { makeChart } from './GenerateGraph.js'

export default function Graph(props) {
    if (!props || Object.keys(props).length === 0 || Object.keys(props.options).length === 0)
        return (<></>)

    let svg = makeChart(props.options)
    return (
        svg
    )
}