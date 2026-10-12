import type { ReactNode } from 'react'
import { EXPLORER, INTEGRATIONS, type Integration, type IntegrationKey } from '../config/contracts'

export function Card({
  children,
  tone,
  compact,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  tone?: 'mystic' | 'legend'
  compact?: boolean
  className?: string
  as?: 'div' | 'section' | 'article' | 'li'
}) {
  const cls = ['card', tone ? `card-tone-${tone}` : '', compact ? 'card-compact' : '', className].join(' ')
  return <Tag className={cls}>{children}</Tag>
}

export function Stat({
  label,
  value,
  note,
  tone,
}: {
  label: string
  value: ReactNode
  note?: ReactNode
  tone?: 'cyber' | 'legend' | 'accent'
}) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${tone ?? ''}`}>{value}</span>
      {note ? <span className="stat-note">{note}</span> : null}
    </div>
  )
}

export function Badge({
  children,
  tone,
}: {
  children: ReactNode
  tone?: 'soon' | 'live' | 'legend' | 'mystic' | 'danger'
}) {
  return <span className={`badge ${tone ? `badge-${tone}` : ''}`}>{children}</span>
}

export function Notice({
  title,
  children,
  tone,
}: {
  title: string
  children: ReactNode
  tone?: 'warn' | 'danger'
}) {
  return (
    <div className={`notice ${tone ? `notice-${tone}` : ''}`} role="note">
      <strong>{title}</strong>
      {children}
    </div>
  )
}

/** Standard "not yet verified" block for a gated integration. */
export function ComingSoon({ integration, extra }: { integration: IntegrationKey; extra?: ReactNode }) {
  const i: Integration = INTEGRATIONS[integration]
  return (
    <Notice title={`${i.label}: coming soon`}>
      <p>{i.note}</p>
      {i.job ? (
        <p className="caption">
          Development job <code className="break">{i.job}</code>
        </p>
      ) : null}
      {extra}
    </Notice>
  )
}

export function SectionHead({ title, children, id }: { title: string; children?: ReactNode; id?: string }) {
  return (
    <div className="section-head">
      <h2 id={id}>{title}</h2>
      {children}
    </div>
  )
}

export function ExplorerLink({ address, label }: { address: string; label?: string }) {
  return (
    <a href={`${EXPLORER}/address/${address}`} target="_blank" rel="noopener noreferrer" className="break mono">
      {label ?? address}
    </a>
  )
}

export function Progress({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <span style={{ width: `${pct}%` }} />
    </div>
  )
}
