import { Card, Notice, SectionHead } from '../components/ui'
import { BRAND, PASS_SUPPLY } from '../config/brand'
import { BMC_TOKEN } from '../config/contracts'
import { ExplorerLink } from '../components/ui'

/** Official links are published by the owner. Nothing is invented here. */
const SOCIALS: { name: string; url: string | null }[] = [
  { name: 'Telegram', url: null },
  { name: 'X (Twitter)', url: null },
]

const FAQ: { q: string; a: string }[] = [
  {
    q: 'What is BMC?',
    a: 'BMC Illuminati (BMC) is an ERC-20 token on Ethereum mainnet. Its contract address is shown in the footer and on the dashboard. The ecosystem uses the existing token only; no new token is created.',
  },
  {
    q: 'What is a BMC PASS?',
    a: `A BMC PASS is one of ${PASS_SUPPLY.total} ERC-721 collectibles. ${PASS_SUPPLY.genesis} are Genesis and ${PASS_SUPPLY.standard} are Standard. Minting burns BMC, so each PASS permanently removes BMC from circulation.`,
  },
  {
    q: 'Why is minting, staking or swapping disabled?',
    a: 'Each action opens only after its contract or liquidity route is deployed, reviewed and verified. Until then the site shows the rules and “Coming soon” instead of a live button, so nobody can send funds to an unverified address.',
  },
  {
    q: 'Do I earn a guaranteed yield from staking?',
    a: 'No. Rewards are paid only in BMC from pools the operator funds. There is no fixed APY and no new BMC issuance. If a pool is empty, nothing is paid.',
  },
  {
    q: 'What does burning IMD get me?',
    a: 'Voluntary burns get you nothing but a smaller IMD supply. Customisation and privilege burns unlock website-only cosmetics or documented non-financial community roles. None of it changes the metadata of a PASS.',
  },
]

export function CommunityPage() {
  return (
    <>
      <section className="section">
        <div className="section-head">
          <h1 style={{ fontSize: 'var(--text-xl)' }}>Community</h1>
          <p>Project information, announcements, official channels and the safety basics every collector should know.</p>
        </div>
        <div className="grid grid-2">
          <Card>
            <h3>About the project</h3>
            <p>
              {BRAND.name} is the encrypted gateway to the BMC ecosystem: a {PASS_SUPPLY.total}-piece PASS collection, an ETH/BMC
              swap, three staking options and an IMD burn center, all on Ethereum mainnet.
            </p>
            <p className="caption">
              BMC token: <ExplorerLink address={BMC_TOKEN} />
            </p>
          </Card>
          <Card>
            <h3>Announcements</h3>
            <p>No announcements yet. Contract deployments, verified routes and mint dates will be posted here first.</p>
          </Card>
          <Card>
            <h3>Official channels</h3>
            <ul className="small muted">
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.name}
                    </a>
                  ) : (
                    <span>
                      {s.name}: not yet published by the owner
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <p className="caption">
              Only links listed here are official. Treat any other account claiming to be BMC Illuminati as unverified.
            </p>
          </Card>
          <Card>
            <h3>Collector education</h3>
            <ul className="small muted">
              <li>A PASS is a token in your wallet. Whoever controls the wallet controls the PASS.</li>
              <li>Genesis art is hosted on IPFS; Standard art is generated on-chain. Both are readable by any marketplace.</li>
              <li>Mystery mints are random. A preview on this site is never a promise of rarity.</li>
              <li>Burned BMC and IMD are gone permanently. Nobody can reverse a burn.</li>
            </ul>
          </Card>
        </div>
      </section>

      <section className="section" aria-labelledby="safety">
        <SectionHead title="Wallet safety" id="safety" />
        <Notice title="This site will never ask for your seed phrase or private key" tone="danger">
          <p>
            Anyone who asks for them is trying to steal from you. The site only requests a wallet connection, a network switch
            to Ethereum mainnet and, when a feature is live, a transaction you confirm in your own wallet.
          </p>
        </Notice>
        <div className="grid grid-3">
          <Card compact>
            <h4>Approve only what you spend</h4>
            <p>Set token approvals to the exact amount. Revoke old approvals you no longer use.</p>
          </Card>
          <Card compact>
            <h4>Check the address</h4>
            <p>Compare the BMC contract in your wallet with the one in the footer before any transaction.</p>
          </Card>
          <Card compact>
            <h4>Stay on chain ID 1</h4>
            <p>The site warns when your wallet is on another network. Do not bridge or send funds elsewhere.</p>
          </Card>
        </div>
      </section>

      <section className="section" aria-labelledby="faq">
        <SectionHead title="Frequently asked questions" id="faq" />
        <div className="stack">
          {FAQ.map((f) => (
            <details className="faq" key={f.q}>
              <summary>{f.q}</summary>
              <div>{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
