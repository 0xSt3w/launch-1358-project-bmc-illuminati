import { useState } from 'react'
import { Badge, Card, ComingSoon, Notice, SectionHead, Stat } from '../components/ui'
import { NetworkGuard } from '../components/WalletButton'
import { isVerified } from '../config/contracts'

interface Buyback {
  date: string
  boughtImd: string
  burnedImd: string
  buyTx: string
  burnTx: string
}

/** Filled by the operator from verified transactions. Empty until the first manual buyback. */
const BUYBACKS: Buyback[] = []

export function BurnsPage() {
  const imdLive = isVerified('imdToken')
  const [amount, setAmount] = useState('')
  const [confirm, setConfirm] = useState(false)
  const n = Number(amount)
  const amountError = amount !== '' && (!Number.isFinite(n) || n <= 0)

  return (
    <>
      <section className="section">
        <div className="section-head">
          <Badge tone="danger">Burns are permanent</Badge>
          <h1 style={{ fontSize: 'var(--text-xl)' }}>IMD Burn Center</h1>
          <p>
            Four ways IMD leaves circulation. Every burn here is disabled until the official IMD contract, its network and its
            burn mechanism are verified and recorded in the site configuration.
          </p>
        </div>
        <NetworkGuard />
        {!imdLive ? <ComingSoon integration="imdToken" /> : null}
        <div className="grid grid-2">
          <Card>
            <Badge tone="danger">1 · Voluntary burn</Badge>
            <h3>Burn IMD permanently</h3>
            <p>Choose an amount of IMD to send to the verified burn mechanism. It can never be recovered.</p>
            <div className="field">
              <label htmlFor="burn-amount">Amount to burn</label>
              <div className="input-group">
                <input
                  id="burn-amount"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(',', '.'))}
                  aria-invalid={amountError || undefined}
                  aria-describedby={amountError ? 'burn-amount-error' : 'burn-amount-help'}
                  disabled={!imdLive}
                />
                <span className="token-chip">IMD</span>
              </div>
              {amountError ? (
                <span id="burn-amount-error" className="field-error">
                  Enter an amount greater than zero.
                </span>
              ) : (
                <span id="burn-amount-help" className="field-help">
                  Burning is irreversible. Double-check the amount.
                </span>
              )}
            </div>
            <label className="row" style={{ gap: 'var(--space-2)', minHeight: 44 }}>
              <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} disabled={!imdLive} />
              <span className="small">I understand burned IMD is gone forever</span>
            </label>
            <button type="button" className="btn btn-primary" disabled={!imdLive || !confirm || amountError || amount === ''}>
              Burn IMD
            </button>
          </Card>
          <Card tone="mystic">
            <Badge tone="mystic">2 · PASS customisation</Badge>
            <h3>Unlock frames, badges and themes</h3>
            <p>
              Burn IMD to unlock optional website profile frames, animated badges and visual themes. These live on this site
              only and never modify immutable PASS metadata.
            </p>
            <Stat label="Unlocked items" value={imdLive ? '—' : 'Coming soon'} />
            <button type="button" className="btn btn-secondary btn-sm" disabled={!imdLive}>
              Browse unlockables
            </button>
          </Card>
          <Card>
            <Badge tone="legend">3 · Community privileges</Badge>
            <h3>Roles, badges and events</h3>
            <p>
              Burn IMD for documented non-financial community roles, badges and event eligibility. Privileges carry no
              financial value and are listed publicly before they open.
            </p>
            <Stat label="Available privileges" value={imdLive ? '—' : 'Coming soon'} />
            <button type="button" className="btn btn-secondary btn-sm" disabled={!imdLive}>
              View privileges
            </button>
          </Card>
          <Card>
            <Badge>4 · Manual buyback &amp; burn</Badge>
            <h3>Operator buyback</h3>
            <p>
              BMC transaction fees accumulate in the operator&rsquo;s existing main wallet. The operator manually allocates
              funds, buys IMD through a verified DEX route and manually burns it. No automation, no treasury withdrawals, no
              private-key access from this site.
            </p>
            <a href="#buybacks" className="small">
              See the buyback dashboard
            </a>
          </Card>
        </div>
      </section>

      <section className="section" aria-labelledby="buybacks">
        <SectionHead title="Buyback dashboard" id="buybacks">
          <p>Purchased IMD and burned IMD are listed separately. Bought is not burned until its burn transaction confirms.</p>
        </SectionHead>
        <div className="grid grid-3">
          <Card compact>
            <Stat label="IMD purchased (verified)" value={BUYBACKS.length ? '—' : 'Coming soon'} tone="cyber" />
          </Card>
          <Card compact>
            <Stat label="IMD burned (verified)" value={BUYBACKS.length ? '—' : 'Coming soon'} tone="accent" />
          </Card>
          <Card compact>
            <Stat label="Completed buybacks" value={BUYBACKS.length} />
          </Card>
        </div>
        {BUYBACKS.length === 0 ? (
          <Notice title="No verified buybacks yet">
            <p>
              The first manual buyback will appear here with its purchase transaction, burn transaction and explorer links
              once the operator records it.
            </p>
          </Notice>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">IMD bought</th>
                  <th scope="col">IMD burned</th>
                  <th scope="col">Transactions</th>
                </tr>
              </thead>
              <tbody>
                {BUYBACKS.map((b) => (
                  <tr key={b.buyTx}>
                    <td>{b.date}</td>
                    <td className="num">{b.boughtImd}</td>
                    <td className="num">{b.burnedImd}</td>
                    <td>
                      <a href={`https://etherscan.io/tx/${b.buyTx}`} target="_blank" rel="noopener noreferrer">
                        Purchase
                      </a>{' '}
                      ·{' '}
                      <a href={`https://etherscan.io/tx/${b.burnTx}`} target="_blank" rel="noopener noreferrer">
                        Burn
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
