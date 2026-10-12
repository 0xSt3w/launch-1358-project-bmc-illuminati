import { useAccount, useBalance, useReadContracts } from 'wagmi'
import { BMC_TOKEN, CHAIN_ID, ERC20_ABI } from '../config/contracts'

/** Live BMC token facts read from Ethereum mainnet plus the connected wallet's balances. */
export function useBmc() {
  const { address } = useAccount()
  const base = { address: BMC_TOKEN, abi: ERC20_ABI, chainId: CHAIN_ID } as const
  const token = useReadContracts({
    contracts: [
      { ...base, functionName: 'name' },
      { ...base, functionName: 'symbol' },
      { ...base, functionName: 'decimals' },
      { ...base, functionName: 'totalSupply' },
    ],
    query: { staleTime: 60_000 },
  })
  const balance = useReadContracts({
    contracts: address ? [{ ...base, functionName: 'balanceOf', args: [address] }] : [],
    query: { enabled: Boolean(address), staleTime: 15_000 },
  })
  const eth = useBalance({ address, chainId: CHAIN_ID, query: { enabled: Boolean(address) } })

  const [name, symbol, decimals, totalSupply] = token.data ?? []
  return {
    isLoading: token.isLoading,
    isError: token.isError,
    name: name?.result as string | undefined,
    symbol: (symbol?.result as string | undefined) ?? 'BMC',
    decimals: (decimals?.result as number | undefined) ?? 18,
    totalSupply: totalSupply?.result as bigint | undefined,
    bmcBalance: balance.data?.[0]?.result as bigint | undefined,
    ethBalance: eth.data?.value,
    address,
  }
}
