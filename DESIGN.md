# BMC Illuminati design system

## Overview

A dark Ethereum ecosystem site for new collectors and existing BMC holders. The
existing Matrix/triangle-eye direction is retained: green code, restrained glow,
glass-like cards, clearly labelled unavailable actions and readable explanations.
Home has the cinematic hero; the other six pages use a compact heading followed
by forms, statistics or educational cards. Configuration status belongs next to
its data or in a shared notice, not in a badge above every heading.

The source of truth is `web/src/styles.css`; page composition is under
`web/src/pages/`. The current images are labelled vector placeholders. Official
image slots are in `web/src/config/brand.ts`; actual artwork has not been supplied.

## Colors

Components use semantic CSS variables, referencing the existing hex primitives.

| Token | Value / primitive | Use |
| --- | --- | --- |
| `--color-bg` | `#05070b` | Page background |
| `--color-bg-elevated` | `#0a0e16` | Fields, segmented controls |
| `--color-surface` | `rgba(16,22,36,.72)` | Cards |
| `--color-surface-hover` | `rgba(24,32,51,.85)` | Hover and selected controls |
| `--color-border` / `--color-border-strong` | `rgba(154,166,181,.16)` / `.32` | Structure / controls |
| `--color-text` | `#e8edf2` | Headings and primary text |
| `--color-text-secondary`, `--color-text-muted` | `#9aa6b5` | Body copy, captions and notes |
| `--color-accent` / `--color-accent-strong` | `#00ff88` / `#00b862` | Main actions and interaction states |
| `--color-text-on-accent` | `#05070b` | Text on green buttons |
| `--color-mystic` / `--color-mystic-soft` | `#9b4dff` / `#c39bff` | PASS/mystery decoration / readable rarity text |
| `--color-cyber`, `--color-focus` | `#00d4ff` | Data accents and keyboard focus |
| `--color-legend` / `--color-legend-soft` | `#d4af37` / `#e9cf7a` | Genesis/Legendary and warning details |
| `--color-danger` | `#ff6b6b` | Irreversible actions and errors |

Caption contrast uses the brighter existing gray. Measured examples and the
limits of gradient/canvas checks are in `docs/validation.md`; contrast is not
assumed from a token alone. This is one dark theme, with no theme selector.

## Typography

System sans: `'SF Pro Text', ui-sans-serif, system-ui, -apple-system, 'Segoe UI',
Roboto, Helvetica, Arial, sans-serif`. System mono: `'SF Mono', ui-monospace,
Menlo, Consolas, 'Liberation Mono', monospace`. There are no downloaded fonts or
font dependencies. The browser chooses the available face; Inter and JetBrains
Mono are not claimed to load. CSS weights are 400, 600 and 700.

The six primary size tokens are `--text-xs` 13px (captions/stat labels),
`--text-sm` 15px (navigation/cards/buttons), `--text-md` 17px (body/h4),
`--text-lg` 22px (h3/stats), `--text-xl` 30px (h2/inner-page h1), and
`--text-display: clamp(2.25rem, 7vw, 3.75rem)` (Home h1, 36–60px).
Existing control exceptions remain 16px for `.input` and 20px for amount fields;
`.mono` is .92em and placeholder SVG glyphs use their own viewBox sizes.

Body line-height is 1.55, headings 1.1. Paragraphs use `--measure: 65ch` and
`text-wrap: pretty`; headings balance their lines. H1 tracking is -.02em, h2 and
stats -.01em. The brand uses .04em; the slogan .12em and the cinematic intro .2em.
Numbers use tabular digits. Contract links can wrap, and full wallet addresses
remain in the pill's title. Captions differ by size, not low contrast.

## Layout

Spacing uses a 4px base: `--space-1/2/3/4/6/8/12/16` = 4/8/12/16/24/32/48/64px.
`.container` is at most `--content-max: 72rem` (1152px), with 16px side margins,
increasing to 32px at 48rem. `.page` has 48px gaps and 32px top padding, rising to
48px at 48rem. `.section` has 24px gaps. `.row` is wrapping flex; `.stack` is grid.

`.grid-2/3/4` auto-fit columns with minimums of 18/15/12rem, capped at 100% to allow
mobile reflow. The Home hero becomes two columns at 56rem. Desktop navigation
starts at 64rem; below that the labelled menu button opens the mobile links and
wallet controls. The desktop toggle is hidden with `.icon-btn.nav-toggle` so
`.icon-btn` cannot override it. Header content can wrap when network-switch
controls need more space, with utilities aligned to the end. A still-open mobile
nav is also hidden at desktop widths.

Amount fields set `flex: 1; width: 0; min-width: 0` inside the flex input group, so
intrinsic input width cannot enlarge the card grid. Tables scroll inside their
own wrapper; the staking reward table is a named, focusable region. Page overflow
was checked at 320, 390, 768, 1024 and 1440 CSS px, including connected wallets at
320, 390, 1024 and 1440. This is browser emulation, not physical-device testing.

## Elevation & Depth

The decorative grid, canvas and radial glows are fixed at layer 0 with
`pointer-events: none`. Page content sits at 1, the sticky header at 20, the intro
at 50 and the skip link at 100. The header uses an 80%-opaque black surface and
14px backdrop blur. Cards use an inset highlight plus a 12px/40px dark shadow and
thin gradient border masks. Green, purple and gold glow tokens are 24px blurs at
.35 opacity. `.ecosystem-background` is a noninteractive .08-opacity image layer
behind the Home ecosystem section, rendered only when official images are enabled.

## Shapes

`--radius-sm/md/lg/pill` = 8px / 14px / 22px / 999px. Cards use 22px (compact 14px),
fields and segmented groups 14px, inset segmented buttons 10px. Buttons, wallet
pills and badges are rounded. Borders communicate control and selected states;
the repeated triangle-eye language lives in `components/Emblem.tsx` and SVG assets.

## Components

- `components/ui.tsx`: `Card` (compact, mystic, legend), `Stat` (optional note and
  accent/cyber/legend value), `Badge` (soon/live/legend/mystic/danger), `Notice`,
  `ComingSoon`, `SectionHead`, `ExplorerLink`, `Progress`. Keep badges beside data
  or in the Home trust row. `ComingSoon` carries one integration explanation;
  internal development IDs belong in documentation. `SectionHead` IDs support
  focusable in-page destinations without adding them to the Tab sequence.
- `components/WalletButton.tsx`: connect/pending/error/disconnect and network
  switch controls. Both indicators read the connector's chain via `useAccount()`;
  `NetworkGuard` provides a text alert on an unsupported chain. The transport
  stays on Mainnet. These controls never request transaction approval.
- `components/Header.tsx`: hash links, current-page state, mobile toggle with
  `aria-expanded`, Escape close and focus return. `App.tsx` moves focus to main
  on route changes; its skip link focuses/scrolls within the existing route.
  Burns similarly focuses its buyback heading without changing the route hash.
- `components/Emblem.tsx`: decorative vector or supplied image, `logo`/`pyramid`
  variants, optional informative title. Small heading/header marks are 36px.
  Home's fallback title explicitly says placeholder. Official image branches
  require the files and `officialImages: true`; they are not verified artwork yet.
- CSS buttons: primary green, secondary border and ghost, with small/block
  variants. Disabled financial actions use native `disabled` and nearby reasons.
  Inputs have bound labels, inline errors and `aria-describedby`. Segmented
  controls are native buttons with `aria-pressed`. FAQs use native details/summary.
- `Intro` is 3.2 seconds, once per session, skippable by button/Enter/Escape.
  `MatrixRain` is decorative and pauses when the tab is hidden. Reduced motion
  removes both; CSS floating triangles, pupil pulses and entrance effects are
  inside `prefers-reduced-motion: no-preference`. Interaction easing is
  `cubic-bezier(.2,0,0,1)` with 150ms navigation transitions.

## Do's and Don'ts

Start an additional page with `.section`, `SectionHead`, and the existing grid
primitives; register its hash route in `lib/router-core.ts` and `App.tsx`. Reuse
semantic tokens, native labelled controls and the existing weights. Keep the
primary action near the heading on mobile and retain empty/unverified states.

Do not enable a financial action by filling an unverified address slot. Do not
invent activity, APY, official art or social links. Do not restore full-width
badges above headings, repeated coming-soon cards, a fourth font weight, or
intrinsic-width amount fields. Background effects must not intercept controls.

Design review uses Jakub Krehel's **Better Interface** (MIT), pinned commit
`267330e1adfc66a718fb65fa6918c1f06d0a689e`. Documentation structure follows the
adapted **Impeccable** method by Paul Bakaus (Apache-2.0), pinned commit
`9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. See `docs/design-guidance-LICENSE.txt`
for the retained license notices.
