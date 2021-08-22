import React, { Component } from 'react';
import ReactModal from 'react-modal';
import css from './AddWalletModal.module.scss'
import IonIcon from '../IonIcon/IonIcon';
import AutosuggestTheme from './Autosuggest.module.scss'

//import 'rsuite/dist/rsuite.min.css'

import Autosuggest from 'react-autosuggest';

import { InputNumber } from 'rsuite';

import Utils from "../../Utils"

import { toast, ToastContainer } from 'react-nextjs-toast'


import DefaultCoins from '../../static_data/default_coins.json'
import CoinNameMap from '../../static_data/coin_name_map.json'
const CoinSymbols = Object.keys(CoinNameMap)
const CoinNames = CoinSymbols.map(c => CoinNameMap[c])

import StoreSingleton from '../../store/CryptodashStoreSingleton'

function getSuggestions(text) {
    text = text.trim().toLowerCase()
    if (text.length === 0)
        return []

    let autoCompletCoinsDict = Utils.filterDictKeys(CoinNameMap, (coin, name) => coin.startsWith(text) || name.toLowerCase().startsWith(text))
    let autoCompleteCoins = []
    Object.keys(autoCompletCoinsDict).forEach(coin => autoCompleteCoins.push([coin, CoinNameMap[coin]]))

    autoCompleteCoins = Utils.filterMoveToBeginning(autoCompleteCoins, ([coin, name]) => DefaultCoins.includes(coin))

    autoCompleteCoins = autoCompleteCoins.slice(0, 4)

    let suggestions = autoCompleteCoins.map(([coin, name]) => {
        return {
            text: name,
            icon: <img src={"data:image/png;base64," + StoreSingleton.getCoinImageB64(coin)} />,
            coin: coin
        }
    })

    return suggestions
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.text;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => {
    setTimeout(function () {/*debugger*/ }, 1000); return (
        <div>
            {suggestion.icon}
            <span>
                {suggestion.text}
            </span>
        </div>
    )
}

const renderInputComponent = inputProps => {
    return (
        <div>
            <input
                type="text" {...Utils.filterDictKeys(inputProps, k => !["curCoin"].includes(k))}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                autoFocus={true}
                style={{
                    background: inputProps.curCoin ? `url(data:image/png;base64,${StoreSingleton.getCoinImageB64(inputProps.curCoin)}) no-repeat scroll 10px 10px, linear-gradient( #0C1117 100%, #0C1117 100%)` : "#0C1117",
                    paddingLeft: inputProps.curCoin ? "52px" : "25px",
                    paddingRight: inputProps.curCoin ? "0" : "27px" // To ensure width stays constant
                }}
            />
        </div>
    )
}

interface IProps {
    isOpen: boolean,
    onRequestClose: () => void
}
interface IState {
}

const customStyles = {
    overlay: {
        zIndex: 200,
        backgroundColor: "rgb(12, 17, 23, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        backgroundColor: "transparent",
        position: "initial",
        inset: "0",
        padding: "0",
        border: "0",
        overflow: "unset"
    }
}

export default class AddWalletModal extends React.Component<IProps, IState> {
    state: {
        value: string,
        suggestions: Array<any>
    }
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            suggestions: []
        }
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = (event, { suggestion }) => {
        //suggestion.execute()
        //this.setState({ value: '' })
    }

    closeAndReset = () => {
        this.props.onRequestClose()
        this.setState({
            value: '',
            suggestions: [],
        })
    }

    onChange = (event, { newValue }) => {
        this.setState({ value: newValue })
    }

    curHighlightedSelection = null
    onSuggestionHighlighted = ({ suggestion }) => {
        this.curHighlightedSelection = suggestion
    }

    getCurCoin() {
        const curCoinIdx = CoinNames.findIndex(c => c.toLowerCase() === this.state.value.toLowerCase())
        let curCoin = ""
        if (curCoinIdx >= 0) {
            curCoin = CoinSymbols[curCoinIdx]
        }

        return curCoin
    }

    curAmount = 1
    tryAddWallet() {
        let curCoin = this.getCurCoin()
        if (!curCoin) {
            toast.notify(`Could not add wallet, invalid coin name.`, { type: "error", title: "Error adding wallet" })
            return
        }

        StoreSingleton.addBalanceSmart(curCoin, this.curAmount)
        this.closeAndReset()
    }

    render() {
        if (this.props.isOpen) {
            try {
                document.body.classList.add("fixedBodyScroll")
            } catch {/* Server side rendering */ }
        }
        else {
            try {
                document.body.classList.remove("fixedBodyScroll")
            } catch {/* Server side rendering */ }
        }



        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Type a coin...',
            value,
            onChange: this.onChange,
            curCoin: this.getCurCoin()
        };

        return (
            <div>
                <ReactModal isOpen={this.props.isOpen} onRequestClose={this.closeAndReset} style={customStyles} ariaHideApp={false}>
                    <ToastContainer align={"right"} />
                    <div className={css.container}>
                        <div className={css.container__header}>
                            <h2>Add Wallet</h2>
                            <IonIcon className={css.container__headerIcon} name="close-outline" onClick={this.closeAndReset} />
                        </div>
                        <div className={css.container__body}>
                            <form className={css.container__bodyInputs} onSubmit={() => this.tryAddWallet()}>
                                <InputNumber defaultValue={1.00} className={css.rsInputNumber + " " + css.container__bodyInputsNumber} min={0} onChange={amt => this.curAmount = Number(amt) || 1} />
                                <Autosuggest
                                    className={css.container__bodyInputsAutosuggest}
                                    suggestions={suggestions}
                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                    getSuggestionValue={getSuggestionValue}
                                    renderInputComponent={renderInputComponent}
                                    renderSuggestion={renderSuggestion}
                                    onSuggestionSelected={this.onSuggestionSelected}
                                    onSuggestionHighlighted={this.onSuggestionHighlighted}
                                    inputProps={inputProps}
                                    highlightFirstSuggestion={true}
                                    theme={AutosuggestTheme}
                                />
                                <input type="submit" style={{display: "none"}} />
                            </form>
                            <div className={css.container__bodySubmitButtons}>
                                <a onClick={() => this.props.onRequestClose()}>Cancel</a>
                                <a onClick={() => this.tryAddWallet()}>Add wallet</a>
                            </div>
                        </div>
                    </div>
                </ReactModal>
            </div>
        )
    }
}