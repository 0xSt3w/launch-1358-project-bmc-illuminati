import { useState } from 'react'
import { Badge, Card, ComingSoon, Notice, Stat } from '../components/ui'
import { NetworkGuard, WalletButton } from '../components/WalletButton'
import { INTEGRATIONS, isVerified } from '../config/contracts'
import { useBmc } from '../lib/bmc'
import { fmtToken } from '../lib/format'

const SLIPPAGE = ['0.5', '1', '3'] as const

export function SwapPage() {
  const [direction, setDirection] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [slippage, setSlippage] = useState<string>('1')
  const bmc = useBmc()
  const routeLive = isVerified('swapRoute')
  const amountNumber = Number(amount)
  const amountError = amount !== '' && (!Number.isFinite(amountNumber) || amountNumber <= 0)

  const from = direction === 'buy' ? 'ETH' : 'BMC'
  const to = direction === 'buy' ? 'BMC' : 'ETH'

  return (
    <>
      <section className="section">
        <div className="section-head">
          <Badge tone={routeLive ? 'live' : 'soon'}>{routeLive ? 'Route verified' : 'No verified route yet'}</Badge>
          <h1 style={{ fontSize: 'var(--text-xl)' }}>Swap BMC</h1>
          <p>
            Trade ETH and BMC through an established Ethereum DEX. The swap button stays disabled until a verified liquidity
            route is configured. No new token, exchange contract or pool is created here.
          </p>
        </div>
        <NetworkGuard />
        <div className="grid grid-2">
          <Card>
            <div className="row between">
              <h3>Swap</h3>
              <div className="segmented" role="group" aria-label="Direction">
                <button type="button" aria-pressed={direction === 'buy'} onClick={() => setDirection('buy')}>
                  Buy BMC
                </button>
                <button type="button" aria-pressed={direction === 'sell'} onClick={() => setDirection('sell')}>
                  Sell BMC
                </button>
              </div>
            </div>
            <div className="field">
              <label htmlFor="swap-amount">You pay</label>
              <div className="input-group">
                <input
                  id="swap-amount"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(',', '.'))}
                  aria-invalid={amountError || undefined}
                  aria-describedby={amountError ? 'swap-amount-error' : 'swap-amount-help'}
                />
                <span className="token-chip">{from}</span>
              </div>
              {amountError ? (
                <span id="swap-amount-error" className="field-error">
                  Enter an amount greater than zero, using digits and one decimal point.
                </span>
              ) : (
                <span id="swap-amount-help" className="field-help">
                  Balance:{' '}
                  {bmc.address
                    ? direction === 'buy'
                      ? `${fmtToken(bmc.ethBalance, 18, 4)} ETH`
                      : `${fmtToken(bmc.bmcBalance, bmc.decimals)} BMC`
                    : 'connect a wallet'}
                </span>
              )}
            </div>
            <div className="field">
              <span className="field-help" id="swap-receive-label">
                You receive
              </span>
              <div className="input-group" aria-labelledby="swap-receive-label">
                <input readOnly value={routeLive ? '' : '—'} aria-label={`Estimated ${to} received`} />
                <span className="token-chip">{to}</span>
              </div>
            </div>
            <div className="field">
              <span className="field-help" id="slippage-label">
                Slippage tolerance
              </span>
              <div className="segmented" role="group" aria-labelledby="slippage-label">
                {SLIPPAGE.map((s) => (
                  <button key={s} type="button" aria-pressed={slippage === s} onClick={() => setSlippage(s)}>
                    {s}%
                  </button>
                ))}
              </div>
            </div>
            <dl className="kv">
              <div>
                <dt>Live quote</dt>
                <dd>{routeLive ? '—' : 'Coming soon'}</dd>
              </div>
              <div>
                <dt>Price impact</dt>
                <dd>{routeLive ? '—' : 'Coming soon'}</dd>
              </div>
              <div>
                <dt>Network fee</dt>
                <dd>{routeLive ? '—' : 'Coming soon'}</dd>
              </div>
              <div>
                <dt>Max slippage</dt>
                <dd>{slippage}%</dd>
              </div>
            </dl>
            {bmc.address ? (
              <button type="button" className="btn btn-primary btn-block" disabled={!routeLive} aria-describedby="swap-why">
                Swap {from} for {to}
              </button>
            ) : (
              <WalletButton />
            )}
            <span id="swap-why" className="field-help">
              {routeLive ? 'You will confirm the exact amounts in your wallet.' : 'Swaps are disabled: no verified liquidity route.'}
            </span>
            <p className="caption" role="status">
              Transaction status: no transaction started.
            </p>
          </Card>
          <div className="stack">
            <ComingSoon
              integration="swapRoute"
              extra={
                <p className="caption">
                  Checked on 2026-10-12 at Ethereum block 26,173,322: Uniswap V2 factory has no BMC/WETH pair and the Uniswap
                  V3 factory has no BMC/WETH pool at the 0.01%, 0.05%, 0.3% or 1% fee tiers. Other venues were not checked.
                </p>
              }
            />
            <Card>
              <h3>Before you swap</h3>
              <ul className="small muted">
                <li>Only trade on Ethereum mainnet (chain ID 1). The site warns when your wallet is elsewhere.</li>
                <li>Approve only the amount you are selling. Never grant an unlimited approval.</li>
                <li>Start small. Price impact rises quickly in thin pools.</li>
                <li>Check the BMC contract address in your wallet before confirming.</li>
              </ul>
            </Card>
            <Card compact>
              <Stat label="Route" value={INTEGRATIONS.swapRoute.address ?? 'Unset'} note="Configured in src/config/contracts.ts" />
            </Card>
          </div>
        </div>
        <Notice title="What a verified route means">
          <p>
            A route is verified when the pool address, DEX router and token pair are confirmed on-chain and recorded in the
            site configuration. Until then quotes are not shown, so nothing on this page can be mistaken for a live price.
          </p>
        </Notice>
      </section>
    </>
  )
}
