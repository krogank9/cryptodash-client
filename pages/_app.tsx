import Head from 'next/head'
import '../styles/global.scss'
import React, { Component } from 'react';

import NavBar from '../components/NavBar/NavBar'
import SideBar from '../components/SideBar/SideBar'

import StoreSingleton from '../store/CryptodashStoreSingleton'
import LoginModal from '../components/LoginModal/LoginModal'

interface IProps {
  Component: React.ElementType,
  pageProps: {[k:string]: any}
}

class App extends React.Component<IProps> {
  state = {
    toggleHamburger: false,
    loginModalOpen: false
  }

  constructor(props) {
    super(props)
    StoreSingleton.setToggleLoginModalCallback(this.toggleLoginModalCallback)
  }

  toggleHamburgerCallback = () => {
    this.setState({
      toggleHamburger: !this.state.toggleHamburger,
    })
  }

  toggleLoginModalCallback = (setVal) => {
    if(typeof setVal !== "boolean")
      setVal = !this.state.loginModalOpen
    this.setState({loginModalOpen: setVal})
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <div className="container">
        <Head>
          <title>Cryptodash</title>
          <link rel="icon" href="/favicon.ico" />
          {/* Eat the 300kb to prevent FOUT. In the future might remove bold to save a bit and fetch that after. */}
          <link rel="stylesheet" href="/webfonts/nunito-stylesheet.css"></link>
        </Head>
  
        <header>
          <NavBar toggleHamburgerCallback={this.toggleHamburgerCallback}/>
          <SideBar toggled={this.state.toggleHamburger}/>
        </header>
  
        <main className={"content "+(this.state.toggleHamburger? "content_sideBarToggled":"")}>
          <LoginModal isOpen={this.state.loginModalOpen} onRequestClose={() => this.toggleLoginModalCallback(false)} />
          <Component {...pageProps}/>
        </main>
      </div>
    )
  }
}

export default App