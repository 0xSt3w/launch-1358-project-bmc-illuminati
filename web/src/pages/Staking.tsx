import { Card, ComingSoon, Notice, SectionHead, Stat } from '../components/ui'
import { Emblem } from '../components/Emblem'
import { NetworkGuard } from '../components/WalletButton'
import { PASS_WEIGHTS, REWARD_SPLIT } from '../config/brand'
import { isVerified, type IntegrationKey } from '../config/contracts'
import { useBmc } from '../lib/bmc'
import { fmtToken } from '../lib/format'

function StakeCard({
  integration,
  title,
  children,
  tone,
}: {
  integration: IntegrationKey
  title: string
  children: React.ReactNode
  tone?: 'mystic' | 'legend'
}) {
  const live = isVerified(integration)
  return (
    <Card tone={tone}>
      <h3>{title}</h3>
      {children}
      <div className="grid grid-2">
        <Stat label="Staked" value={live ? '—' : 'Coming soon'} />
        <Stat label="Claimable rewards" value={live ? '—' : 'Coming soon'} />
        <Stat label="Pool funding" value={live ? '—' : 'Coming soon'} />
        <Stat label="Program ends" value={live ? '—' : 'Coming soon'} />
      </div>
      <div className="row">
        <button type="button" className="btn btn-primary btn-sm" disabled={!live}>
          Stake
        </button>
        <button type="button" className="btn btn-secondary btn-sm" disabled={!live}>
          Claim rewards
        </button>
        <button type="button" className="btn btn-secondary btn-sm" disabled={!live}>
          Withdraw
        </button>
      </div>
    </Card>
  )
}

export function StakingPage() {
  const bmc = useBmc()
  return (
    <>
      <section className="section">
        <div className="section-head">
          <h1 className="heading-with-emblem" style={{ fontSize: 'var(--text-xl)' }}><Emblem variant="logo" />Staking</h1>
          <p>
            Lock BMC, BMC PASSes or both and earn BMC from pools the operator funds in advance.
          </p>
        </div>
        <NetworkGuard />
        <div className="grid grid-2">
          <Card compact>
            <Stat label="Your BMC balance" value={bmc.address ? `${fmtToken(bmc.bmcBalance, bmc.decimals)} BMC` : 'Connect wallet'} tone="accent" />
          </Card>
          <Card compact>
            <Stat label="Your PASS balance" value="Coming soon" note="Read from the verified PASS contract" />
          </Card>
        </div>
        {!isVerified('tokenStaking') ? <ComingSoon integration="tokenStaking" /> : null}
        <div className="grid grid-3">
          <StakeCard integration="tokenStaking" title="1 · BMC token staking">
            <p>Stake BMC and earn BMC rewards from a funded pool. Withdraw any time the contract allows.</p>
          </StakeCard>
          <StakeCard integration="passStaking" title="2 · BMC PASS staking" tone="mystic">
            <p>Stake eligible passes. Each PASS earns by its reward weight: Standard 1×, up to Legendary Genesis #1 at 5×.</p>
          </StakeCard>
          <StakeCard integration="combinedStaking" title="3 · Combined staking" tone="legend">
            <p>Stake BMC and at least one PASS for up to 20% additional reward weight, limited by a funded bonus pool.</p>
          </StakeCard>
        </div>
      </section>

      <section className="section" aria-labelledby="weights">
        <SectionHead title="PASS reward weights" id="weights" />
        <div className="table-wrap" role="region" aria-labelledby="weights" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Tier</th>
                <th scope="col">Weight</th>
                <th scope="col">Passes</th>
                <th scope="col">How it is assigned</th>
              </tr>
            </thead>
            <tbody>
              {PASS_WEIGHTS.map((w) => (
                <tr key={w.tier}>
                  <th scope="row" style={{ background: 'none', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                    {w.tier}
                  </th>
                  <td className="num">{w.weight}</td>
                  <td className="num">{w.count}</td>
                  <td style={{ whiteSpace: 'normal' }}>{w.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="allocation">
        <SectionHead title="Proposed reward allocation" id="allocation">
          <p>Suggested program duration: 12 months. The final split is set when the pools are funded.</p>
        </SectionHead>
        <div className="grid grid-4">
          {REWARD_SPLIT.map((r) => (
            <Card compact key={r.label}>
              <Stat label={r.label} value={`${r.pct}%`} tone={r.label === 'Reserve' ? undefined : 'cyber'} />
            </Card>
          ))}
        </div>
        <Notice title="No guaranteed yield" tone="warn">
          <p>
            Rewards are paid only from BMC the operator deposits into each pool. If a pool is not funded, staking opens
            nothing and pays nothing. No new BMC is issued and no APY is guaranteed. Check the funded amount shown on each card before staking.
          </p>
        </Notice>
      </section>
    </>
  )
}
