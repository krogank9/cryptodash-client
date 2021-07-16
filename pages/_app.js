import Head from 'next/head'
import '../styles/global.scss'

import NavBar from '../components/NavBar/NavBar'
import SideBar from '../components/SideBar/SideBar'

export default function App({ Component, pageProps }) {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        {/* Eat the 300kb to prevent FOUT. In the future might remove bold to save a bit and fetch that after. */}
        <link rel="stylesheet" href="/webfonts/nunito-stylesheet.css"></link>
      </Head>

      <header>
        <NavBar/>
        <SideBar/>
      </header>

      <main>
        <Component {...pageProps} className={"content"}/>
      </main>

      <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
      <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
    </div>
  )
}