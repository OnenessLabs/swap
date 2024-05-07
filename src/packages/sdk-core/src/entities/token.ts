import invariant from 'tiny-invariant'
import validateAndParseAddress from '../utils/validateAndParseAddress'
import { ChainId } from '../constants'
import { Currency } from './currency'
import DEFAULT_TOKEN_LIST from '@uniswap/default-token-list'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string

  public constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

type TokenFn = (symbol: string, chainId: ChainId) => any
export const getToken: TokenFn = (symbol: string, chainId: ChainId) =>
  DEFAULT_TOKEN_LIST.tokens.find((token: any) => token.chainId === chainId && token.symbol === symbol)

export const getTokenAddress: TokenFn = (...args) => getToken(...args)
export const getTokenObject: TokenFn = (...args) => {
  const token = getToken(...args)
  return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name)
}

export const WETH: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: getTokenObject('WBTC', ChainId.MAINNET),
  [ChainId.ONENESSTEST]: getTokenObject('WBTC', ChainId.ONENESSTEST),
  [ChainId.ONENESSDEV]: getTokenObject('WBTC', ChainId.ONENESSDEV)
}
