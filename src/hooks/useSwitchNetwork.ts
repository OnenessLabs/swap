import { useCallback, useState } from 'react'
import { useActiveWeb3React } from 'hooks'
import { switchChain } from 'utils'

export default function useSwitchNetwork(): {
  switchNetwork: (chainId: string) => void
  pending: any
} {
  const { library } = useActiveWeb3React()

  const [pending, setPending] = useState<any>()

  const switchNetwork = useCallback(
    (chainId: string) => {
      setPending(chainId)
      switchChain(library?.provider, chainId)
        .then(() => {
          setPending(false)
        })
        .catch(async err => {
          const msg = err.message ?? ''
          if (!msg.includes('already pending')) {
            if (msg.includes('wallet_addEthereumChain') || msg.includes('wallet_switchEthereumChain')) {
              try {
                // @ts-ignore
                await window.ethereum.request(req)
              } catch {}
            }
            setPending(false)
          }
        })
    },
    [library]
  )

  return { switchNetwork, pending }
}
