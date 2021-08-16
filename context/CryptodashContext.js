import React from 'react'
import { cloneDeep, isEqual } from 'lodash'
import config from '../config'
import CoinIdMap from "../static_data/coin_id_map.json"
import Utils from "../Utils"

/*
    Had trouble getting MobX to do exactly what I wanted, and wasn't using that many of its features anyway
    So decided to write my own efficient simple state management system
*/

const CryptodashContextFunctions = {
    setWalletData: () => { },
    addWalletData: () => { },
    addGraphToWallet: () => { },
    setMarketData: () => { },
    setCoinImagesB64: () => { },
}

const CryptodashContextData = {
    selectedCoin: "",
    walletData: [
        //{
        //    coin: c,
        //    amount: DefaultCoinAmounts[c],
        //    graph_1d: [[t,v], ...],
        //    graph_1w: [[t,v], ...],
        //    graph_1m: [[t,v], ...],
        //    graph_1y: [[t,v], ...],
        //    graph_all: [[t,v], ...]
        //}, ...
    ],
    marketData: [
        //{
        //    ...from API
        //}
    ],
    coinImagesB64: {
        // coin: "b64 string",
        // ...
    },
}

const CryptodashContext = React.createContext({
    ...CryptodashContextData,
    ...CryptodashContextFunctions
})

class ContextPropsPassFilter extends React.Component {
    lastNonContextProps = {}
    lastUsedContextPropsChangeIds = {}

    getNonContextProps(props) {
        return Utils.filterDictKeys(props, key => !(["childClass", "propsToWatch", "ctxValue"].includes(key)))
    }

    getUsedContextProps(props) {
        return Utils.filterDictKeys(props, key => this.props.propsToWatch.includes(key))
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true

        // Simple check on passed prop deep equality. Not going to be passing a lot of data to Context consumers from parents anyway.
        // Not worried about performance here.
        const nonContextProps = this.getNonContextProps(nextProps)
        if (!isEqual(nonContextProps, this.lastNonContextProps)) {
            this.lastNonContextProps = cloneDeep(nonContextProps)
            return true
        }

        // Want to be a little bit smarter with context as we may be passing around a lot of data for graphs etc
        // May have performance issues so using proxies to detect changes
        // Maybe overkill but want to do it right
        const usedContextProps = this.getUsedContextProps(nextProps.ctxValue)
        let usedContextPropsChangeIds = {}
        Object.keys(usedContextProps).forEach(p => {
            if (p instanceof Proxy)
                usedContextPropsChangeIds[p] = usedContextProps[p].__proxy__changeCount
            else
                usedContextPropsChangeIds[p] = usedContextProps[p]
        })

        if (!isEqual(usedContextPropsChangeIds, this.lastUsedContextPropsChangeIds)) {
            this.lastUsedContextPropsChangeIds = { ...usedContextPropsChangeIds }
            return true
        }
    }

    render() {
        console.log("rendering ContextPropsPassFilter")
        const usedProps = { ...this.getNonContextProps(this.props), ...this.getUsedContextProps(this.props.ctxValue) }
        //const usedProps = { ...this.props, ...this.props.value }
        const ChildClass = this.props.childClass
        return <ChildClass {...usedProps}></ChildClass>
    }
}

// This function will return a component class that automatically wraps the class with a consumer + a filter for that consumer.
// The filter only sends the child the props it asks for from the context, and only re-renders if those props, or other props passed from the parent update.
export function makeContextObserver(propsToWatch, fromClass) {
    return (props) => {
        return (
            <CryptodashContext.Consumer>
                {(value) => {
                    return <ContextPropsPassFilter propsToWatch={[].concat(propsToWatch)} childClass={fromClass} ctxValue={value} {...props}></ContextPropsPassFilter>
                }}
            </CryptodashContext.Consumer>
        )
    }
}

class ContextManager extends React.Component {

    // When wallet data is added, I think I want to lazy load in the rest of the graphs besides graph_1d
    // This will also allow for just adding a coin like {coin: "btc", amount: 1}

    addWalletData = (data, clearData = false) => {
        data = [].concat(data)
        if (!this.state.selectedCoin)
            this.setState({ ...this.state, selectedCoin: data[0].coin })
        // fetch graphs from server api endpoint not present in supplied data,
        // then update data upon response
        let timeFrames = ["1d", "1w", "1m", "1y", "all"];

        console.log("adding wallet data")

        this.setState({
            ...this.state,
            walletData: [...(clearData ? [] : this.state.walletData), ...data]
        }, () => {
            console.log("wallet state applied-----------------------------------")
            console.log(this.state.walletData)
            data.forEach((wallet, i) => {
                timeFrames.filter(t => !wallet.hasOwnProperty("graph_" + t)).forEach(timeFrame => {
                    //console.log(`fetching.... ${config.API_ENDPOINT}/graphs/${CoinIdMap[wallet.coin]}_${timeFrame}`)
                    fetch(`${config.API_ENDPOINT}/graphs/${CoinIdMap[wallet.coin]}_${timeFrame}`)
                        .then(response => response.json())
                        .then(graph => {
                            //console.log(graph)
                            //wallet["graph_"+timeFrame] = graph.data.prices
                            this.addGraphToWallet(wallet.coin, timeFrame, graph)
                        })
                })
            })
        })

        //console.log("setting wallet data")
        //console.log(data)



        // fetch().onresponse(data = new).onerror(retry maybe)
        // then, overviewgraph will be able to use the data
        // as a test we can try not supplying initial 1d graphs for default data... then will probably need observable.
    }

    addGraphToWallet = (coin, timeFrame, graph) => {
        //console.log("this.state")
        //console.log(this.state)
        //console.log(this.state.walletData)
        const wallet = this.state.walletData.find(w => w.coin === coin)
        this.setState({
            ...this.state,
            walletData: this.state.walletData.map(w => w !== wallet ? w : { ...w, ["graph_" + timeFrame]: graph })
        })
    }

    setWalletData = (data) => {
        console.log("setting wallet data")
        console.log(data)
        this.state.addWalletData(data, true)
        console.log(this.state.walletData)
    }

    setMarketData = (data) => {
        console.log("setting market data")
        console.log(data)
        this.setState({
            ...this.state,
            marketData: data.slice(0)
        })
    }

    setCoinImagesB64 = (data) => {
        this.setState({
            ...this.state,
            coinImagesB64: { ...this.state.coinImagesB64, ...data }
        })
    }

    constructor(props) {
        super(props)

        console.log("ContextManager constructor~~")

        let managementFunctions = Utils.mapDict(CryptodashContextFunctions, (k, v) => this[k])

        this.state = {
            ...CryptodashContextData,
            ...managementFunctions
        }
    }

    render() {
        const ChildClass = this.props.childClass
        const passProps = Utils.filterDictKeys(this.props, key => key !== "childClass")
        return (
            <CryptodashContext.Provider value={{ ...this.state }}>
                <ChildClass {...passProps}></ChildClass>
            </CryptodashContext.Provider>
        )
    }
}

export function makeContextManager(fromClass) {
    return props => <ContextManager childClass={fromClass} {...props}></ContextManager>
}

export default CryptodashContext