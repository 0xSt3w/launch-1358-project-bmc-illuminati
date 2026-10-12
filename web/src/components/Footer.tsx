import { BRAND } from '../config/brand'
import { BMC_TOKEN, CHAIN_NAME } from '../config/contracts'
import { Link, ROUTES } from '../lib/router'
import { ExplorerLink } from './ui'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="stack">
          <strong style={{ color: 'var(--color-text)' }}>{BRAND.nameUpper}</strong>
          <span>{BRAND.slogan}</span>
          <span className="caption">
            BMC token on {CHAIN_NAME}: <ExplorerLink address={BMC_TOKEN} />
          </span>
          <span className="caption">
            Nothing on this site is financial advice. Rewards come only from funded pools; no APY is guaranteed.
          </span>
        </div>
        <nav aria-label="Footer">
          <ul>
            {ROUTES.map((r) => (
              <li key={r.path}>
                <Link to={r.path}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
