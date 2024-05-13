import { ChainId, JSBI, Percent, Token, WETH, getTokenObject } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

// import { fortmatic, portis, walletconnect, walletlink } from '../connectors'
import { walletconnect } from '../connectors'
import { injected } from '../connectors'

export const ROUTER_ADDRESS = '0xb128A49f1382c942A5Ca3BDa7227cC464D2B08E0'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export { PRELOADED_PROPOSALS } from './proposals'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}
export const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'Oneness',
  [ChainId.ONENESSTEST]: 'Oneness Testnet',
  [ChainId.ONENESSDEV]: 'Oneness Devnet'
}

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: getTokenObject('USDC', ChainId.MAINNET),
  [ChainId.ONENESSTEST]: getTokenObject('USDC', ChainId.ONENESSTEST),
  [ChainId.ONENESSDEV]: getTokenObject('USDC', ChainId.ONENESSDEV)
}
export const USDT: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: getTokenObject('USDT', ChainId.MAINNET),
  [ChainId.ONENESSTEST]: getTokenObject('USDT', ChainId.ONENESSTEST),
  [ChainId.ONENESSDEV]: getTokenObject('USDT', ChainId.ONENESSDEV)
}
export const oUsd: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: getTokenObject('oUsd', ChainId.MAINNET),
  [ChainId.ONENESSTEST]: getTokenObject('oUsd', ChainId.ONENESSTEST),
  [ChainId.ONENESSDEV]: getTokenObject('oUsd', ChainId.ONENESSDEV)
}

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

const UNI_ADDRESS = '0x1bB36FD31bF42b9444f374FE621a2949b4c5e75b'
export const UNI: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'OST', 'Oneness'),
  [ChainId.ONENESSTEST]: new Token(ChainId.ONENESSTEST, UNI_ADDRESS, 18, 'OST', 'Oneness'),
  [ChainId.ONENESSDEV]: new Token(ChainId.ONENESSDEV, UNI_ADDRESS, 18, 'OST', 'OnenessSwap')
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  // [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ONENESSTEST]: [WETH[ChainId.ONENESSTEST]],
  [ChainId.ONENESSDEV]: [WETH[ChainId.ONENESSDEV]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [
    ...WETH_ONLY[ChainId.MAINNET],
    oUsd[ChainId.MAINNET],
    USDC[ChainId.MAINNET],
    USDT[ChainId.MAINNET]
  ]
}

export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  // [ChainId.MAINNET]: {
  //   '0xA948E86885e12Fb09AfEF8C52142EBDbDf73cD18': [new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'OST', 'OnenessSwap')],
  //   '0x561a4717537ff4AF5c687328c0f7E90a319705C0': [new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'OST', 'OnenessSwap')],
  //   [FEI.address]: [TRIBE],
  //   [TRIBE.address]: [FEI],
  //   [FRAX.address]: [FXS],
  //   [FXS.address]: [FRAX],
  //   [WBTC.address]: [renBTC],
  //   [renBTC.address]: [WBTC]
  // }
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  // [ChainId.MAINNET]: {
  //   [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  // }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY
  // [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY
  // [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [WETH[ChainId.MAINNET], USDC[ChainId.MAINNET]],
    [WETH[ChainId.MAINNET], oUsd[ChainId.MAINNET]]
  ],
  [ChainId.ONENESSTEST]: [
    [WETH[ChainId.ONENESSTEST], USDC[ChainId.ONENESSTEST]],
    [WETH[ChainId.ONENESSTEST], oUsd[ChainId.ONENESSTEST]]
  ],
  [ChainId.ONENESSDEV]: [
    [WETH[ChainId.ONENESSDEV], USDC[ChainId.ONENESSDEV]],
    [WETH[ChainId.ONENESSDEV], oUsd[ChainId.ONENESSDEV]]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  }
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5'
  // },
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C'
]
