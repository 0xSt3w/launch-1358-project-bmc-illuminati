import { formatUnits } from 'viem'

/** 1234567 → "1,234,567". Plain numbers, no abbreviations, so beginners can read them. */
export function fmtInt(n: number | bigint): string {
  return new Intl.NumberFormat('en-US').format(n)
}

/** Format a token amount from base units, trimming to a readable precision. */
export function fmtToken(value: bigint | undefined, decimals = 18, maxFraction = 2): string {
  if (value === undefined) return '—'
  const asNumber = Number(formatUnits(value, decimals))
  if (!Number.isFinite(asNumber)) return formatUnits(value, decimals)
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: maxFraction }).format(asNumber)
}

export function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

/** Mint schedule maths shared by the PASS page and the dashboard. */
export const MINT_PLAN = {
  early: { count: 40, priceBmc: 1_000_000 },
  mystery: { count: 460, priceBmc: 350_000 },
}

export function burnForMints(minted: number): number {
  const m = Math.max(0, Math.min(500, Math.floor(minted)))
  const early = Math.min(m, MINT_PLAN.early.count)
  const mystery = m - early
  return early * MINT_PLAN.early.priceBmc + mystery * MINT_PLAN.mystery.priceBmc
}

export function priceForNextMint(minted: number): number {
  return minted < MINT_PLAN.early.count ? MINT_PLAN.early.priceBmc : MINT_PLAN.mystery.priceBmc
}
