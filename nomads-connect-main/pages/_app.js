import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import { NomadsProvider } from '../context/NomadsContext'

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
    serverUrl='https://g7ywhu8ocsfc.usemoralis.com:2053/server'
    appId='pzWwcygf5CVZ2MA3XEgqxq8snizI54n4pyozkwHU'
    >
      <NomadsProvider>
        <Component {...pageProps} />
      </NomadsProvider>
    </MoralisProvider>
  )
}

export default MyApp
