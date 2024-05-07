import { useCallback, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { NETWORKs } from 'utils'

export default function useSwitchNetwork(): {
  switchNetwork: (chainId: string) => void
  pending: any
} {
  const { library } = useActiveWeb3React()

  const [pending, setPending] = useState<any>()

  const switchNetwork = useCallback(
    (chainId: string) => {
      const [network, method] = [NETWORKs[chainId], 'wallet_addEthereumChain']
      if (network && library?.provider?.request) {
        setPending(chainId)
        const req = {
          method,
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
        library.provider
          .request(req)
          .then(() => {
            setPending(false)
          })
          .catch(async err => {
            const msg = err.message ?? ''
            if (!msg.includes('already pending')) {
              if (msg.includes(method)) {
                try {
                  // @ts-ignore
                  await window.ethereum.request(req)
                } catch {}
              }
              setPending(false)
            }
          })
      }
    },
    [library]
  )

  return { switchNetwork, pending }
}
