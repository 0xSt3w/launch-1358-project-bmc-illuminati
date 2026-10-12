import type { Address } from 'viem'

/**
 * Every on-chain integration the site can talk to.
 *
 * Only the BMC token is verified today. Everything else stays `null` until the
 * requester supplies a deployed, reviewed address. A `null` entry disables the
 * matching financial action in the UI and shows a "Coming soon" state instead.
 * Never fill a slot with a test or placeholder address.
 */
export const CHAIN_ID = 1 as const
export const CHAIN_NAME = 'Ethereum Mainnet'
export const EXPLORER = 'https://etherscan.io'

/** BMC Illuminati (BMC), 18 decimals. Read from chain, not assumed. */
export const BMC_TOKEN: Address = '0x38224239f2BDae357D47cb864BC533d7f72dF961'

export interface Integration {
  /** Deployed contract address once verified, otherwise null. */
  address: Address | null
  /** Human label used in UI copy. */
  label: string
  /** Development job on the IMD network that will deliver this contract. */
  job?: string
  /** Why it is unset, shown in "Coming soon" states. */
  note: string
}

export const INTEGRATIONS = {
  pass: {
    address: null,
    label: 'BMC PASS (ERC-721)',
    job: '2aa0f8fa-379e-459b-a814-480f8c428c4f',
    note: 'Minting opens once the PASS contract is deployed and verified.',
  },
  tokenStaking: {
    address: null,
    label: 'BMC token staking',
    job: 'fa117565-998a-4aaa-ad09-233e642d4c1e',
    note: 'Opens once the staking contracts are deployed, reviewed and funded.',
  },
  passStaking: {
    address: null,
    label: 'BMC PASS staking',
    job: 'fa117565-998a-4aaa-ad09-233e642d4c1e',
    note: 'Opens once the staking contracts are deployed, reviewed and funded.',
  },
  combinedStaking: {
    address: null,
    label: 'Combined staking bonus',
    job: 'fa117565-998a-4aaa-ad09-233e642d4c1e',
    note: 'Opens once the bonus pool is deployed, reviewed and funded.',
  },
  imdToken: {
    address: null,
    label: 'IMD token',
    note: 'The official IMD contract, network and burn mechanism must be verified before burns open.',
  },
  swapRoute: {
    address: null,
    label: 'ETH/BMC swap route',
    note: 'No verified liquidity route was found on Uniswap V2 or V3 for BMC/WETH. Swaps stay disabled until an established DEX route is verified.',
  },
} satisfies Record<string, Integration>

export type IntegrationKey = keyof typeof INTEGRATIONS

export function isVerified(key: IntegrationKey): boolean {
  return INTEGRATIONS[key].address !== null
}

/** Minimal ERC-20 ABI: everything the site reads from BMC. */
export const ERC20_ABI = [
  { type: 'function', name: 'name', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
] as const
