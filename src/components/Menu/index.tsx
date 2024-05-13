import React, { useRef, useEffect } from 'react'
import { Code, Info, MessageCircle, PieChart, Check } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleModal } from '../../state/application/hooks'
import { getChartsLink, NETWORKs } from '../../utils'
import arrowDown from '../../assets/svg/arrow-down.svg'
import useSwitchNetwork from 'hooks/useSwitchNetwork'
import Loader from 'components/Loader'
import { useWalletModalToggle } from 'state/application/hooks'

import { ExternalLink } from '../../theme'
// import { ButtonPrimary } from '../Button'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  column-gap: 0.5em;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 8.125rem;
  background-color: ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 35px;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    top: -17.25rem;
  `};
`

const MenuOptions = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5em;
  flex: 1;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
    background-color: ${({ theme }) => theme.bg4};
  }
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
    background-color: ${({ theme }) => theme.bg4};
  }
  > svg {
    margin-right: 8px;
  }
`

const CODE_LINK = 'https://github.com/OnenessLabs'

export default function Menu() {
  const { chainId } = useActiveWeb3React()

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)
  // const openClaimModal = useToggleModal(ApplicationModal.ADDRESS_CLAIM)

  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <MenuFlyout>
          <MenuItem id="link" href="https://onenesslabs.io/">
            <Info size={14} />
            About
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK}>
            <Code size={14} />
            Code
          </MenuItem>
          <MenuItem id="link" href="https://discord.gg/onenesslabs">
            <MessageCircle size={14} />
            Discord
          </MenuItem>
          <MenuItem id="link" href={getChartsLink(chainId)}>
            <PieChart size={14} />
            Analytics
          </MenuItem>
          {/* {account && (
            <ButtonPrimary onClick={openClaimModal} padding="8px 16px" width="100%" borderRadius="12px" mt="0.5rem">
              Claim OST
            </ButtonPrimary>
          )} */}
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}

export const NetworkSelector = () => {
  const { error, chainId } = useWeb3React()
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  let [network, supported] = [{ name: 'Wrong Network', chainId: '' }, false]
  if (!error && chainId && NETWORKs[chainId]) {
    supported = true
    network = NETWORKs[chainId]
  }
  const networks = Object.entries(NETWORKs)
  const { switchNetwork, pending } = useSwitchNetwork()
  const selectNetwork = (reqChainId: string) => {
    if (+reqChainId !== chainId) switchNetwork(reqChainId)
    else toggle()
  }
  useEffect(() => {
    if (!pending && open) {
      toggle()
      setTimeout(() => {
        if (!account) toggleWalletModal()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending])

  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.NETWORK_SELECT)
  const toggle = useToggleModal(ApplicationModal.NETWORK_SELECT)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      {chainId && (
        <StyledMenuButton
          onClick={toggle}
          style={{
            fontWeight: 600,
            background: supported ? 'none' : '#FD4040',
            color: supported ? '#ab9127' : '#eee'
          }}
        >
          {network?.name}
          <img src={pending ? arrowDown : arrowDown} style={{ transform: open ? 'rotate(180deg)' : '' }} alt="" />
        </StyledMenuButton>
      )}

      {open && (
        <MenuFlyout>
          {networks.map(([id, { name }], i) => (
            <MenuOptions key={id} onClick={() => selectNetwork(id)}>
              {name}
              {network?.chainId && network?.chainId === id ? (
                <Check size="14" />
              ) : pending === id ? (
                <Loader />
              ) : (
                <Loader style={{ visibility: 'hidden' }} />
              )}
            </MenuOptions>
          ))}
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
