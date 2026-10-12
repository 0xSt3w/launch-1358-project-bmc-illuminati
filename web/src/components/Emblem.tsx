import { BRAND } from '../config/brand'

type Variant = 'logo' | 'pyramid'

/**
 * Brand mark. Renders the official image when `BRAND.officialImages` is on and
 * the file exists under public/brand; otherwise a code-drawn vector emblem
 * (a triangle with an all-seeing eye) so the layout never ships a broken image.
 */
export function Emblem({
  variant = 'logo',
  className = '',
  animated = false,
  title,
}: {
  variant?: Variant
  className?: string
  animated?: boolean
  title?: string
}) {
  if (BRAND.officialImages) {
    const src = variant === 'logo' ? BRAND.images.logo : BRAND.images.pyramid
    return <img src={src} alt={title ?? ''} className={className} />
  }
  const green = variant === 'pyramid'
  const stroke = green ? 'var(--color-accent)' : 'var(--color-mystic)'
  const inner = green ? 'var(--color-cyber)' : 'var(--color-cyber)'
  return (
    <svg
      viewBox="0 0 120 120"
      className={`emblem ${animated ? 'emblem-animated' : ''} ${className}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={`g-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={stroke} />
          <stop offset="1" stopColor={inner} />
        </linearGradient>
      </defs>
      <path
        d="M60 10 L110 100 H10 Z"
        fill="none"
        stroke={`url(#g-${variant})`}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M60 32 L92 90 H28 Z" fill="none" stroke={stroke} strokeWidth="1.5" opacity="0.5" />
      <ellipse cx="60" cy="70" rx="22" ry="12" fill="none" stroke="var(--color-legend)" strokeWidth="4" />
      <circle className="eye-pupil" cx="60" cy="70" r="7" fill={stroke} />
      <circle cx="63" cy="67" r="2" fill="#fff" />
    </svg>
  )
}
