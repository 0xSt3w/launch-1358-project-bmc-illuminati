import { useEffect, useRef, useState } from 'react'
import { BRAND } from '../config/brand'
import { Link, ROUTES, type RoutePath } from '../lib/router'
import { Emblem } from './Emblem'
import { WalletButton } from './WalletButton'

export function Header({ route }: { route: RoutePath }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Close the mobile menu after navigating and on Escape.
  useEffect(() => setOpen(false), [route])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const links = ROUTES.map((r) => (
    <li key={r.path}>
      <Link to={r.path} className="nav-link" aria-current={route === r.path ? 'page' : undefined}>
        {r.label}
      </Link>
    </li>
  ))

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${BRAND.name} home`}>
          <Emblem variant="logo" animated />
          <span>{BRAND.nameUpper}</span>
        </Link>
        <nav className="nav-desktop" aria-label="Main">
          <ul>{links}</ul>
        </nav>
        <div className="header-actions">
          <div className="nav-desktop">
            <WalletButton compact />
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="icon-btn nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-nav" className="nav-mobile container" aria-label="Main">
          <ul>{links}</ul>
          <div style={{ marginBlockStart: 'var(--space-3)' }}>
            <WalletButton />
          </div>
        </nav>
      ) : null}
    </header>
  )
}
