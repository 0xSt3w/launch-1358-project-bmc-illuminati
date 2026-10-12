import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

/**
 * Wallet configuration.
 *
 * Only the injected connector (MetaMask, Rabby, Coinbase Wallet extension,
 * Brave, …) is enabled. WalletConnect needs a project id owned by the
 * requester; add `walletConnect({ projectId })` here once supplied.
 *
 * The RPC used for reads defaults to viem's public mainnet endpoint and can be
 * overridden at build time with `VITE_RPC_URL`.
 */
const rpcUrl = import.meta.env.VITE_RPC_URL as string | undefined

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(rpcUrl || undefined, { batch: true }),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}
