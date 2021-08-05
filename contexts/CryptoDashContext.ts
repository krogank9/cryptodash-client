import React from 'react'

const CryptoDashContext = React.createContext({
    loggedInUser: null,
    "onUserLoggedIn": () => {},
    "onUserLogout": () => {},
    walletData: [
        //{
        //    coin: c,
        //    amount: DefaultCoinAmounts[c],
        //    graph_1d: [[t,v], ...]
        //    graph_1w: [[t,v], ...]
        //    graph_1m: [[t,v], ...]
        //    graph_1y: [[t,v], ...]
        //    graph_all: [[t,v], ...]
        //}, ...
    ],
})

export default CryptoDashContext