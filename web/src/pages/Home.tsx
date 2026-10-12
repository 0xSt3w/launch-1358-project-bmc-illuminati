import { Emblem } from '../components/Emblem'
import { Badge, Card, ComingSoon, ExplorerLink, SectionHead, Stat } from '../components/ui'
import { WalletButton } from '../components/WalletButton'
import { BRAND, PASS_SUPPLY } from '../config/brand'
import { BMC_TOKEN, CHAIN_NAME } from '../config/contracts'
import { useBmc } from '../lib/bmc'
import { fmtInt, fmtToken } from '../lib/format'
import { Link } from '../lib/router'

export function HomePage() {
  const bmc = useBmc()
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title fade-up">
            {BRAND.nameUpper}
          </h1>
          <p className="hero-slogan fade-up">{BRAND.slogan}</p>
          <p className="hero-sub fade-up">{BRAND.subtitle}</p>
          <div className="hero-actions fade-up">
            <Link to="/pass" className="btn btn-primary">
              Explore BMC PASS
            </Link>
            <Link to="/swap" className="btn btn-secondary">
              Swap BMC
            </Link>
            <Link to="/staking" className="btn btn-secondary">
              Explore staking
            </Link>
          </div>
          <div className="hero-trust">
            <Badge tone="live">{CHAIN_NAME}</Badge>
            <Badge tone="live">BMC token verified</Badge>
            <Badge tone="soon">PASS mint coming soon</Badge>
          </div>
        </div>
        <div className="hero-visual">
          <span className="tri" style={{ insetInlineStart: '8%', insetBlockStart: '10%' }} aria-hidden="true" />
          <span className="tri purple" style={{ insetInlineEnd: '10%', insetBlockStart: '20%' }} aria-hidden="true" />
          <span className="tri gold" style={{ insetInlineStart: '18%', insetBlockEnd: '8%' }} aria-hidden="true" />
          <Emblem variant="pyramid" animated title="Glowing green BMC pyramid with an all-seeing eye" />
        </div>
      </section>

      <section className="section" aria-labelledby="how">
        <SectionHead title="How the ecosystem works" id="how">
          <p>Four parts, one token. Everything below runs on Ethereum and pays out only in BMC.</p>
        </SectionHead>
        <div className="grid grid-4">
          <Card>
            <Badge tone="legend">Know</Badge>
            <h3>BMC PASS</h3>
            <p>
              A collection of exactly {PASS_SUPPLY.total} ERC-721 collectibles: {PASS_SUPPLY.genesis} Genesis and{' '}
              {PASS_SUPPLY.standard} Standard. Every mint burns BMC forever.
            </p>
            <Link to="/pass">Explore the PASS collection</Link>
          </Card>
          <Card>
            <Badge tone="live">Create</Badge>
            <h3>Swap BMC</h3>
            <p>Buy or sell BMC with ETH through an established DEX once a verified liquidity route exists.</p>
            <Link to="/swap">Open the swap</Link>
          </Card>
          <Card>
            <Badge tone="danger">Burn</Badge>
            <h3>IMD Burn Center</h3>
            <p>Burn IMD voluntarily, unlock profile customisation and community roles, and track manual buybacks.</p>
            <Link to="/burns">Open the burn center</Link>
          </Card>
          <Card>
            <Badge tone="mystic">Rise</Badge>
            <h3>Staking</h3>
            <p>Stake BMC, stake PASSes, or both, and earn BMC rewards from funded pools. No new BMC is issued.</p>
            <Link to="/staking">Explore staking options</Link>
          </Card>
        </div>
      </section>

      <section className="section" aria-labelledby="wallet">
        <SectionHead title="Connect your wallet" id="wallet">
          <p>
            Connection only shows your balances. The site never asks for a seed phrase, a private key or an
            unlimited approval.
          </p>
        </SectionHead>
        <div className="grid grid-2">
          <Card>
            <h3>Wallet</h3>
            <WalletButton />
            {bmc.address ? (
              <div className="grid grid-2">
                <Stat label="ETH balance" value={`${fmtToken(bmc.ethBalance, 18, 4)} ETH`} />
                <Stat label="BMC balance" value={`${fmtToken(bmc.bmcBalance, bmc.decimals)} ${bmc.symbol}`} tone="accent" />
              </div>
            ) : (
              <p>Connect a browser wallet such as MetaMask or Rabby to see your ETH and BMC balances.</p>
            )}
          </Card>
          <Card>
            <h3>BMC token</h3>
            <Stat
              label="Total supply (live from Ethereum)"
              value={bmc.isError ? 'Unavailable' : bmc.isLoading ? 'Loading…' : `${fmtToken(bmc.totalSupply, bmc.decimals, 0)} BMC`}
              tone="cyber"
              note={bmc.name ? `${bmc.name} (${bmc.symbol})` : undefined}
            />
            <p className="caption">
              Contract <ExplorerLink address={BMC_TOKEN} />
            </p>
          </Card>
        </div>
      </section>

      <section className="section" aria-labelledby="start">
        <SectionHead title="Start here if you are new" id="start" />
        <ol className="step-list">
          <li>
            <div>
              <strong>Get a wallet</strong>
              <span>Install a browser wallet, write the recovery phrase down offline and never share it.</span>
            </div>
          </li>
          <li>
            <div>
              <strong>Hold some ETH on Ethereum mainnet</strong>
              <span>ETH pays network fees. The site checks that your wallet is on chain ID 1.</span>
            </div>
          </li>
          <li>
            <div>
              <strong>Swap ETH for BMC</strong>
              <span>Use the swap page once a verified route is live. Start with a small amount.</span>
            </div>
          </li>
          <li>
            <div>
              <strong>Mint, stake or burn</strong>
              <span>
                A PASS mint burns {fmtInt(PASS_SUPPLY.earlyPriceBmc)} or {fmtInt(PASS_SUPPLY.mysteryPriceBmc)} BMC. Each
                action opens only after its contract is verified.
              </span>
            </div>
          </li>
        </ol>
        <ComingSoon integration="pass" />
      </section>
    </>
  )
}
