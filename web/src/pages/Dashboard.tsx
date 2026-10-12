import { Badge, Card, ExplorerLink, Notice, SectionHead, Stat } from '../components/ui'
import { PASS_SUPPLY } from '../config/brand'
import { BMC_TOKEN, INTEGRATIONS, isVerified } from '../config/contracts'
import { useBmc } from '../lib/bmc'
import { fmtInt, fmtToken } from '../lib/format'

const SOON = 'Coming soon'

export function DashboardPage() {
  const bmc = useBmc()
  const supply = bmc.isError ? 'Unavailable' : bmc.isLoading ? 'Loading…' : `${fmtToken(bmc.totalSupply, bmc.decimals, 0)} BMC`

  return (
    <>
      <section className="section">
        <div className="section-head">
          <Badge tone="soon">Verified numbers only</Badge>
          <h1 style={{ fontSize: 'var(--text-xl)' }}>Ecosystem dashboard</h1>
          <p>
            Every figure here is read from a verified contract or shown as “Coming soon”. Nothing is estimated or invented.
          </p>
        </div>

        <div className="grid grid-3">
          <Card>
            <h3>BMC token</h3>
            <Stat label="Total supply (live)" value={supply} tone="cyber" />
            <p className="caption">
              <ExplorerLink address={BMC_TOKEN} />
            </p>
          </Card>
          <Card tone="mystic">
            <h3>BMC PASS</h3>
            <Stat label="BMC burned by minting" value={isVerified('pass') ? '—' : SOON} />
            <Stat label="Supply and mint progress" value={isVerified('pass') ? '—' : `0 / ${fmtInt(PASS_SUPPLY.total)} planned`} />
            <Stat label="Max burn at mint-out" value={`${fmtInt(PASS_SUPPLY.maxBurnBmc)} BMC`} note="Fixed by the mint schedule" />
          </Card>
          <Card>
            <h3>Staking</h3>
            <Stat label="Total BMC staked" value={isVerified('tokenStaking') ? '—' : SOON} />
            <Stat label="Passes staked" value={isVerified('passStaking') ? '—' : SOON} />
            <Stat label="Funded rewards" value={isVerified('tokenStaking') ? '—' : SOON} />
          </Card>
          <Card>
            <h3>IMD burned by mechanism</h3>
            <Stat label="Voluntary burns" value={isVerified('imdToken') ? '—' : SOON} />
            <Stat label="PASS customisation" value={isVerified('imdToken') ? '—' : SOON} />
            <Stat label="Community privileges" value={isVerified('imdToken') ? '—' : SOON} />
          </Card>
          <Card>
            <h3>Manual IMD buybacks</h3>
            <Stat label="IMD purchased" value={SOON} />
            <Stat label="IMD burned" value={SOON} />
            <Stat label="History" value="0 records" />
          </Card>
          <Card>
            <h3>Integration status</h3>
            <dl className="kv">
              {(Object.keys(INTEGRATIONS) as (keyof typeof INTEGRATIONS)[]).map((k) => (
                <div key={k}>
                  <dt>{INTEGRATIONS[k].label}</dt>
                  <dd>{isVerified(k) ? <Badge tone="live">Verified</Badge> : <Badge tone="soon">Unset</Badge>}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </section>
      <section className="section" aria-labelledby="method">
        <SectionHead title="How these numbers are produced" id="method" />
        <Notice title="Sources">
          <p>
            BMC supply is read from the token contract on Ethereum through your configured RPC. PASS, staking and IMD figures
            will be read from their contracts once the addresses in the site configuration are verified. Buyback history is
            recorded by the operator from confirmed transactions, each with an explorer link.
          </p>
        </Notice>
      </section>
    </>
  )
}
