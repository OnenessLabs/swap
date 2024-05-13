import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { ROUTER_ADDRESS } from '../constants'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@uniswap/sdk'
import { TokenAddressMap } from '../state/lists/hooks'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export const switchChain = async (provider: any, chainId: number | string, preferAdd = false): Promise<void> => {
  chainId = +chainId
  const network = NETWORKs[chainId]
  if (!network || !provider?.request) return
  const req = {
    method: provider.isWalletConnect ? 'wallet_switchEthereumChain' : 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${(+chainId).toString(16)}`,
        chainName: network.name,
        rpcUrls: [network.rpc],
        nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
        blockExplorerUrls: [network.scan]
        // iconUrls: ['https://raw.githubusercontent.com/OnenessLabs/token-list/main/Tokens/Native/logo.svg']
      }
    ]
  }
  return provider.request(req)
}

const [domain] = ['onenesslabs.io']
type Network = {
  chainId: string
  name: string
  rpc: string
  scan: string
  charts: string
}
export const NETWORKs: { [chainId in ChainId | string | number]: Network } = {
  2140: {
    name: 'Oneness',
    chainId: '2140',
    rpc: `https://rpc.${domain}`,
    scan: `https://scan.${domain}`,
    charts: `https://info.swap.${domain}`
  },
  2141: {
    name: 'Oneness Testnet',
    chainId: '2141',
    rpc: `https://rpc.testnet.${domain}`,
    scan: `https://scan.testnet.${domain}`,
    charts: `https://info.swap.testnet.${domain}`
  },
  123666: {
    name: 'Oneness Devnet',
    chainId: '123666',
    rpc: `https://rpc.devnet.${domain}`,
    scan: `https://scan.devnet.${domain}`,
    charts: `https://info.swap.devnet.${domain}`
  }
}
export const rpcMap = Object.fromEntries(Object.entries(NETWORKs).map(r => [r[0], r[1].rpc]))
export const ChainIds: ChainId[] = Object.keys(NETWORKs).map(r => +r)

export const NETWORK_CHAIN_ID: number = +(process.env.REACT_APP_CHAIN_ID ?? '') || ChainIds[0]

export const getChartsLink = (chainId: ChainId = NETWORK_CHAIN_ID, path = '') => {
  const network = NETWORKs[chainId] || NETWORKs[NETWORK_CHAIN_ID]
  return `${network.charts}${path}`
}

export function getEtherscanLink(
  chainId: ChainId | string,
  data?: string,
  type?: 'transaction' | 'token' | 'address' | 'block'
): string {
  const network = NETWORKs[chainId] || NETWORKs[NETWORK_CHAIN_ID]
  switch (type) {
    case 'transaction': {
      return `${network.scan}/tx/${data}`
    }
    case 'token': {
      return `${network.scan}/token/${data}`
    }
    case 'block': {
      return `${network.scan}/block/${data}`
    }
    case 'address':
    default: {
      return `${network.scan}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI, library, account)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}
