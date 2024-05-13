import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { rpcMap, ChainIds, NETWORK_CHAIN_ID, switchChain, getLastSelectedChainId } from '../utils'
// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { PortisConnector } from '@web3-react/portis-connector'

// import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
// import UNISWAP_LOGO_URL from '../assets/svg/logo.svg'

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL
// const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
// const PORTIS_ID = process.env.REACT_APP_PORTIS_ID
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID ?? ''

export { NETWORK_CHAIN_ID }

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL }
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [2140, 2141, 123666]
})

export const walletconnect = new WalletConnectConnector({
  defaultChainId: getLastSelectedChainId() ?? NETWORK_CHAIN_ID,
  options: { projectId, optionalChains: ChainIds, rpcMap, showQrModal: true },
  switchChain
})

// mainnet only
// export const fortmatic = new FortmaticConnector({
//   apiKey: FORMATIC_KEY ?? '',
//   chainId: 1
// })

// // mainnet only
// export const portis = new PortisConnector({
//   dAppId: PORTIS_ID ?? '',
//   networks: [1]
// })

// // mainnet only
// export const walletlink = new WalletLinkConnector({
//   url: NETWORK_URL,
//   appName: 'OnenessSwap',
//   appLogoUrl: UNISWAP_LOGO_URL
// })
