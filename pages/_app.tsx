import Head from 'next/head'
import '../styles/global.scss'
import React, { Component } from 'react';

import NavBar from '../components/NavBar/NavBar'
import SideBar from '../components/SideBar/SideBar'

interface IProps {
  Component: React.ElementType,
  pageProps: {[k:string]: any}
}
interface IState {
  toggleHamburger: boolean,
}

class App extends React.Component<IProps, IState> {
  state = {
    toggleHamburger: false
  }

  toggleHamburgerCallback = () => {
    this.setState({
      toggleHamburger: !this.state.toggleHamburger
    })
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <div className="container">
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
          {/* Eat the 300kb to prevent FOUT. In the future might remove bold to save a bit and fetch that after. */}
          <link rel="stylesheet" href="/webfonts/nunito-stylesheet.css"></link>
        </Head>
  
        <header>
          <NavBar toggleHamburgerCallback={this.toggleHamburgerCallback}/>
          <SideBar toggled={this.state.toggleHamburger}/>
        </header>
  
        <main className={"content "+(this.state.toggleHamburger? "content_sideBarToggled":"")}>
          <Component {...pageProps}/>
        </main>
      </div>
    )
  }
}

export default App