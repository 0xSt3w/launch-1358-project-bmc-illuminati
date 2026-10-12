import { useMemo, useState } from 'react'
import { Emblem } from '../components/Emblem'
import { Badge, Card, ComingSoon, Notice, Progress, SectionHead, Stat } from '../components/ui'
import { NetworkGuard } from '../components/WalletButton'
import { PASS_SUPPLY } from '../config/brand'
import { isVerified } from '../config/contracts'
import { useBmc } from '../lib/bmc'
import { burnForMints, fmtInt, fmtToken, priceForNextMint } from '../lib/format'

type Tier = 'legendary' | 'early' | 'mystery'
type Filter = 'all' | Tier

interface Slot {
  n: number
  tier: Tier
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All 500' },
  { key: 'legendary', label: 'Legendary #1' },
  { key: 'early', label: 'Early Genesis' },
  { key: 'mystery', label: 'Mystery (pending reveal)' },
]

export function slotTier(n: number): Tier {
  if (n === 1) return 'legendary'
  if (n <= PASS_SUPPLY.earlyMints) return 'early'
  return 'mystery'
}

const SLOTS: Slot[] = Array.from({ length: PASS_SUPPLY.total }, (_, i) => ({ n: i + 1, tier: slotTier(i + 1) }))
const PAGE = 48

/** Deterministic preview glyph. Real art is revealed by the verified contract after mint. */
function SlotArt({ slot }: { slot: Slot }) {
  const hue = slot.tier === 'legendary' ? 'var(--color-legend)' : slot.tier === 'early' ? 'var(--color-mystic-soft)' : 'var(--color-cyber)'
  const seed = (slot.n * 9301 + 49297) % 233280
  const tilt = (seed % 11) - 5
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d={`M50 14 L${78 + tilt} 70 H${22 - tilt} Z`} fill="none" stroke={hue} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 82 Q50 60 68 82" fill="none" stroke={hue} strokeWidth="2" opacity="0.6" />
      <ellipse cx="50" cy="52" rx="9" ry="5" fill="none" stroke={hue} strokeWidth="1.8" />
      <circle cx="50" cy="52" r="2.6" fill={hue} />
      {slot.tier === 'mystery' ? (
        <text x="50" y="94" textAnchor="middle" fontSize="12" fill={hue} fontFamily="ui-monospace, monospace">
          ?
        </text>
      ) : null}
    </svg>
  )
}

export function PassPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [limit, setLimit] = useState(PAGE)
  const bmc = useBmc()
  const mintLive = isVerified('pass')

  // Nothing has been minted: the contract is not deployed. These values are the known plan, not chain data.
  const minted = 0
  const visible = useMemo(() => SLOTS.filter((s) => filter === 'all' || s.tier === filter), [filter])

  return (
    <>
      <section className="section">
        <div className="section-head">
          <h1 style={{ fontSize: 'var(--text-xl)' }}>BMC PASS</h1>
          <p>
            Exactly {PASS_SUPPLY.total} ERC-721 collectibles: {PASS_SUPPLY.genesis} Genesis and {PASS_SUPPLY.standard} Standard. Every
            mint permanently burns BMC. Minting opens only after the contract is deployed and verified.
          </p>
        </div>
        <NetworkGuard />
        <div className="grid grid-4">
          <Card compact>
            <Stat label="Minted" value={`${fmtInt(minted)} / ${fmtInt(PASS_SUPPLY.total)}`} note="Live count after launch" />
          </Card>
          <Card compact>
            <Stat label="Remaining supply" value={fmtInt(PASS_SUPPLY.total - minted)} tone="cyber" />
          </Card>
          <Card compact>
            <Stat label="Next mint burns" value={`${fmtInt(priceForNextMint(minted))} BMC`} tone="accent" note="First 40 mints" />
          </Card>
          <Card compact>
            <Stat label="BMC burned by minting" value={`${fmtInt(burnForMints(minted))} BMC`} note={`Max ${fmtInt(PASS_SUPPLY.maxBurnBmc)} at mint-out`} />
          </Card>
        </div>
        <div className="stack">
          <Progress value={minted} max={PASS_SUPPLY.total} label="Mint progress" />
          <span className="caption">Mint progress: {minted} of {PASS_SUPPLY.total}. Updates from the verified contract once live.</span>
        </div>
      </section>

      <section className="section" aria-labelledby="mint">
        <SectionHead title="Mint" id="mint" />
        <div className="grid grid-2">
          <Card tone="legend">
            <h3>Mints 1–40: guaranteed Genesis PASS</h3>
            <p>
              Price: {fmtInt(PASS_SUPPLY.earlyPriceBmc)} BMC burned per mint. The first successful buyer receives Legendary
              Genesis #1. Mints 2–40 receive Genesis #2–40.
            </p>
          </Card>
          <Card tone="mystic">
            <h3>Mints 41–500: Mystery PASS</h3>
            <p>
              Price: {fmtInt(PASS_SUPPLY.mysteryPriceBmc)} BMC burned per mint. The verified contract randomly assigns{' '}
              {PASS_SUPPLY.mysteryGenesis} Genesis and {PASS_SUPPLY.standard} Standard without replacement.
            </p>
          </Card>
        </div>
        <Card>
          <h3>Your mint</h3>
          <div className="grid grid-2">
            <Stat label="Your BMC balance" value={bmc.address ? `${fmtToken(bmc.bmcBalance, bmc.decimals)} BMC` : 'Connect wallet'} />
            <Stat label="Your PASS balance" value={mintLive ? '—' : 'Coming soon'} note="Read from the verified contract" />
            <Stat label="Pending reveals" value={mintLive ? '—' : 'Coming soon'} />
            <Stat label="Mint price" value={`${fmtInt(priceForNextMint(minted))} BMC`} tone="accent" />
          </div>
          <button type="button" className="btn btn-primary" disabled aria-describedby="mint-why">
            Mint BMC PASS
          </button>
          <span id="mint-why" className="field-help">
            Minting is disabled until the PASS contract is deployed and verified.
          </span>
        </Card>
        {!mintLive ? <ComingSoon integration="pass" /> : null}
      </section>

      <section className="section" aria-labelledby="legend">
        <SectionHead title="Legendary Genesis #1" id="legend">
          <p>The single most important PASS. It carries a 5× reward weight in PASS staking.</p>
        </SectionHead>
        <Card tone="legend">
          <div className="legend-showcase">
            <div className="pass-art legend" style={{ width: '100%', maxWidth: '14rem' }}>
              <Emblem variant="logo" animated title="Legendary Genesis #1 placeholder emblem" />
            </div>
            <div className="stack">
              <h3>Awarded to the first successful mint</h3>
              <p>
                Genesis artwork is a set of 77 original black-and-gold hooded frogs with a golden third eye and a floating
                golden triangle-eye, hosted on IPFS. The official files are revealed by the contract; the emblem shown here
                is a placeholder until then.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="section" aria-labelledby="gallery">
        <SectionHead title="Gallery" id="gallery">
          <p>
            Preview of all {PASS_SUPPLY.total} slots. Standard artwork is a unique on-chain SVG character per PASS; it exists
            only after the contract is live, so previews show a placeholder glyph.
          </p>
        </SectionHead>
        <div className="segmented" role="group" aria-label="Filter by rarity">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => {
                setFilter(f.key)
                setLimit(PAGE)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="small muted" role="status">
          Showing {fmtInt(Math.min(limit, visible.length))} of {fmtInt(visible.length)} slots
        </p>
        <ul className="gallery" style={{ listStyle: 'none', padding: 0 }}>
          {visible.slice(0, limit).map((s) => (
            <li key={s.n} className="pass-card" style={{ margin: 0 }}>
              <div className={`pass-art ${s.tier === 'legendary' ? 'legend' : s.tier === 'early' ? 'genesis' : ''}`}>
                <SlotArt slot={s} />
              </div>
              <div className="pass-meta">
                <strong>#{s.n}</strong>
                {s.tier === 'legendary' ? (
                  <Badge tone="legend">Legendary</Badge>
                ) : s.tier === 'early' ? (
                  <Badge tone="mystic">Genesis</Badge>
                ) : (
                  <Badge>Mystery</Badge>
                )}
              </div>
            </li>
          ))}
        </ul>
        {limit < visible.length ? (
          <button type="button" className="btn btn-secondary" onClick={() => setLimit((l) => l + PAGE)}>
            Show {fmtInt(Math.min(PAGE, visible.length - limit))} more
          </button>
        ) : null}
        <Notice title="Rarity odds for mystery mints">
          <p>
            460 mystery mints share 37 Genesis and 423 Standard PASSes, drawn without replacement by the contract. No preview
            here is a promise of rarity.
          </p>
        </Notice>
      </section>
    </>
  )
}
