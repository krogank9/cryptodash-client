import CoinNameMap from '../../static_data/coin_id_map.json'
import Utils from '../../Utils'

// Coins with numbers in their name mess up the search results.
// When you type "add 1" it thinks you are trying to add the coin "1337" instead of suggesting for example BTC or ETH.
// In a real application we would have to handle these odd edge cases (<1% obscure coins) gracefully by making our algorithm considerably more robust.
// But due to time and patience constraints we decide to pretend we live in a perfect world where no coin name contains a number:
const CoinNameMapNoNumbers = Utils.filterDictKeys(CoinNameMap, (k,v) => !(/\d/.test(k)) && !(/\d/.test(v)))
import DefaultCoins from '../../static_data/default_coins.json'
const CoinSymbols = Object.keys(CoinNameMapNoNumbers)
const CoinNames = CoinSymbols.map(s => CoinNameMapNoNumbers[s])

import Router from 'next/router'
import StoreSingleton from '../../store/CryptodashStoreSingleton'

const MAX_SUGGESTIONS = 5

function filterMoveToBeginning(arr, cb) {
    let addToBeginning = []
    arr = arr.filter(el => {
        if(cb(el)) {
            addToBeginning.push(el)
            return false
        }
        else
            return true
    })
    return addToBeginning.concat(arr)
}

function getMatchLenWord(str, word) {
    str = str.toLowerCase()
    let matchLen = 0
    for(let i = 0; i < str.length; i++) {
        // Not a valid match unless starts/ends with either space or start/end of string
        if(str.charAt(i - 1).trim().length === 1)
            continue

        let thisMatchLen = 0        
        for(let j = 0; j < word.length && j + i < str.length; j++) {
            if(word.charAt(j) === str.charAt(j + i))
                thisMatchLen++
            else
                break
        }

        // Not a valid match unless starts/ends with either space or start/end of string
        if(!str.charAt(i + thisMatchLen).trim())
            matchLen = Math.max(matchLen, thisMatchLen)

        if(matchLen === word.length)
            break
    }
    return matchLen
}

const dynamicHints = {
    number: (str) => {
        let args = {
            isHinted: false,
            foundExactMatch: false,
            number: 1
        }

        str.split(" ").filter(w => w.length > 0).forEach(word => {
            if(!isNaN(word) && Number(word) !== 0) {
                args = {
                    ...args,
                    isHinted: true,
                    foundExactMatch: true,
                    number: Number(word)
                }
            }
        })

        return args
    },
    coin: (str) => {
        let coinSuggestions = []

        CoinSymbols.forEach((symbol, i) => {
            const matchLen = getMatchLenWord(str, symbol)
            if(matchLen === symbol.length) {
                coinSuggestions.push({symbol: symbol, isExactMatch: true})
            }
            else if(matchLen > 0) {
                coinSuggestions.push({symbol: symbol, isExactMatch: false})
            }
        })

        CoinNames.forEach((name, i) => {
            const matchLen = getMatchLenWord(str, name.toLowerCase())
            if(matchLen === name.length) {
                coinSuggestions.push({symbol: CoinSymbols[i], isExactMatch: true})
            }
            else if(matchLen > 0) {
                coinSuggestions.push({symbol: CoinSymbols[i], isExactMatch: false})
            }
        })

        const isHinted = coinSuggestions.length > 0

        if(coinSuggestions.length === 0) {
            coinSuggestions = coinSuggestions.concat(StoreSingleton.walletData.map(w => ({symbol: w.coin, isExactMatch: false})))
            coinSuggestions = coinSuggestions.concat(DefaultCoins.filter(c => !coinSuggestions.some(cs => cs.symbol === c)).map(c => ({symbol: c, isExactMatch: false}))).slice(0, MAX_SUGGESTIONS)
        }

        coinSuggestions = filterMoveToBeginning(coinSuggestions, (cs) => StoreSingleton.walletData.find(w => w.coin === cs.symbol))
        coinSuggestions = filterMoveToBeginning(coinSuggestions, (cs) => StoreSingleton.selectedCoin.coin === cs.symbol)

        return {
            isHinted: isHinted,
            foundExactMatch: coinSuggestions.length >= 1 && coinSuggestions[0].isExactMatch,
            coins: [...new Set(coinSuggestions.map(cs => cs.symbol))] // May be dupes because of checking both coin names & symbols, remove those
        }
    },
}

function parseHints(hints, definiteHints, str) {
    str = str.toLowerCase()
    let allHints = hints.map(h => ({hint: h.toLowerCase(), definite: false})).concat(definiteHints.map(h => ({hint: h.toLowerCase(), definite: true})))

    let args = {
        isHinted: false,
        isDefiniteHinted: false,
        textHintsMatched: []
    }

    allHints.forEach(({hint, definite}) => {
        // Dynamic hints: {coin}, {number}
        if(hint.startsWith("{")) {
            const hintName = hint.replace("{", "").replace("}", "")
            const dynamicHintResult = dynamicHints[hintName](str)
            args = {
                ...args, ...dynamicHintResult,
                isHinted: args.isHinted || dynamicHintResult.isHinted,
                isDefiniteHinted: args.isDefiniteHinted || (definite && dynamicHintResult.isHinted & dynamicHintResult.foundExactMatch)
            }
        }
        // Normal textual hint
        else {
            let matchLen = getMatchLenWord(str, hint)
            
            args = {
                ...args,
                textHintsMatched: args.textHintsMatched.concat(matchLen > 0 ? hint : []),
                isHinted: args.isHinted || matchLen > 0,
                isDefiniteHinted: args.isDefiniteHinted || (matchLen === hint.length && definite)
            }
        }
    })

    return args
}

const actions = [
    {
        name: "Add coin",
        // Add coin balance to wallet
        getSuggestions: ({coins, number, textHintsMatched}) => {
            return coins.map(c => {
                let opPrefix = "Add"
                if((textHintsMatched.includes("subtract") && !textHintsMatched.includes("add")) || number < 0) {
                    number = -Math.abs(number)
                    opPrefix = "Subtract"
                }
                return {
                    text: `${opPrefix} ${Math.abs(number)} ${c.toUpperCase()}`,
                    execute: () => StoreSingleton.addBalanceSmart(c, number),
                }
            })
        },
        definiteHints: ["Add", "Subtract", "{number}"],
        hints: ["{coin}"]
    },
    {
        // Open Overview page
        name: "Overview",
        getSuggestions: () => [{
            text: "Overview",
            execute: () => Router.push(`/`),
        }],
        definiteHints: ["Overview"],
    },
    {
        // Open Analyze page
        name: "Analyze",
        getSuggestions: ({coins, number}) => {
            return coins.map(c => {
                return {
                    text: `Analyze ${c.toUpperCase()}`,
                    execute: () => Router.push(`/analyze/${coins[0]}`)
                }
            })
        },
        definiteHints: ["Analyze"],
        hints: ["{coin}"]
    },
    {
        name: "Remove coin",
        // Remove coin from a wallet
        getSuggestions: ({coins}) => {
            return coins.filter(c => StoreSingleton.walletData.find(w => w.coin === c)).map(c => {
                return {
                    text: `Remove all ${c.toUpperCase()}`,
                    execute: () => StoreSingleton.removeWalletForCoin(coins[0]),
                }
            })
        },
        definiteHints: ["Remove"],
        hints: ["{coin}"]
    },
]

export default function getSuggestions(text) {
    const parseHintsResults = actions.map(a => parseHints(a.hints || [], a.definiteHints || [], text))
    let actionArgs = parseHintsResults.filter(p => p.isHinted)
    let candidateActions = actions.filter((_, i) => parseHintsResults[i].isHinted)

    const definiteHintedIdx = actionArgs.findIndex(args => args.isDefiniteHinted)
    if(definiteHintedIdx > -1) {
        actionArgs = [actionArgs[definiteHintedIdx]]
        candidateActions = [candidateActions[definiteHintedIdx]]
    }

    let suggestionsPer = Math.max(1, Math.floor(MAX_SUGGESTIONS / candidateActions.length))
    let suggestions = []

    candidateActions.forEach((action, i) => {
        suggestions = suggestions.concat(action.getSuggestions(actionArgs[i]).slice(0, suggestionsPer))
    })

    suggestions = filterMoveToBeginning(suggestions, (s) => s.text.toLowerCase().startsWith(text))

    return suggestions.slice(0, MAX_SUGGESTIONS)
}