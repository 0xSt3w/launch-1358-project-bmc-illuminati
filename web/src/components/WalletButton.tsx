import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { CHAIN_ID, CHAIN_NAME } from '../config/contracts'
import { shortAddress } from '../lib/format'

/**
 * Connect / disconnect with the injected wallet and a mainnet guard.
 * Never asks for seed phrases or approvals: connection only.
 */
export function WalletButton({ compact = false }: { compact?: boolean }) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connectors, connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: switching } = useSwitchChain()
  const injected = connectors[0]
  const wrongChain = isConnected && chainId !== CHAIN_ID

  if (isConnected && address) {
    return (
      <div className="row" style={{ gap: 'var(--space-2)' }}>
        {wrongChain ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => switchChain({ chainId: CHAIN_ID })}
            disabled={switching}
          >
            {switching ? 'Switching…' : `Switch to ${CHAIN_NAME}`}
          </button>
        ) : null}
        <span className="wallet-pill" title={address}>
          <span className={`dot ${wrongChain ? 'warn' : ''}`} aria-hidden="true" />
          <span className="visually-hidden">{wrongChain ? 'Connected to the wrong network: ' : 'Connected: '}</span>
          {shortAddress(address)}
        </span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="stack" style={{ gap: 'var(--space-1)' }}>
      <button
        type="button"
        className={`btn btn-secondary ${compact ? 'btn-sm' : ''}`}
        onClick={() => injected && connect({ connector: injected })}
        disabled={isPending || !injected}
      >
        {isPending ? 'Connecting…' : 'Connect wallet'}
      </button>
      {error ? (
        <span className="field-error" role="status">
          Unable to connect. Open your wallet extension and try again.
        </span>
      ) : null}
    </div>
  )
}

/** Inline banner for pages with on-chain actions. */
export function NetworkGuard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  if (!isConnected || chainId === CHAIN_ID) return null
  return (
    <div className="notice notice-warn" role="alert">
      <strong>Wrong network</strong>
      <p>
        This site only works on {CHAIN_NAME} (chain ID {CHAIN_ID}). Switch networks in your wallet to continue.
      </p>
    </div>
  )
}
