import React from 'react'

const CryptoDashContext = React.createContext({
    loggedInUser: null,
    "onUserLoggedIn": () => {},
    "onUserLogout": () => {},
})

export default CryptoDashContext