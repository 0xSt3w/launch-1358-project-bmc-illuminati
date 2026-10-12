/**
 * Brand constants and the official image slots.
 *
 * The owner-provided `bmc.jpg` and `BMC IMD.png` were not supplied with this
 * assignment. Until they are dropped into `public/brand/` (see the README
 * there) the site renders the code-drawn `Emblem` component instead of an
 * image. Flip `officialImages` to true after adding the files.
 */
export const BRAND = {
  name: 'BMC Illuminati',
  nameUpper: 'BMC ILLUMINATI',
  slogan: 'KNOW • CREATE • BURN • RISE',
  sloganWords: ['Know', 'Create', 'Burn', 'Rise'],
  subtitle: 'The encrypted gateway to the BMC ecosystem.',
  officialImages: false,
  images: {
    logo: './brand/bmc.jpg',
    pyramid: './brand/bmc-imd.png',
  },
} as const

export const PASS_SUPPLY = {
  total: 500,
  genesis: 77,
  standard: 423,
  earlyMints: 40,
  earlyPriceBmc: 1_000_000,
  mysteryMints: 460,
  mysteryPriceBmc: 350_000,
  mysteryGenesis: 37,
  maxBurnBmc: 201_000_000,
} as const

export const REWARD_SPLIT = [
  { label: 'BMC token staking', pct: 55 },
  { label: 'BMC PASS staking', pct: 25 },
  { label: 'Combined bonus', pct: 15 },
  { label: 'Reserve', pct: 5 },
] as const

export const PASS_WEIGHTS = [
  { tier: 'Standard', weight: '1×', count: 423, note: 'Unique on-chain SVG character' },
  { tier: 'Random Genesis', weight: '2×', count: 37, note: 'Genesis drawn from the mystery mints' },
  { tier: 'Early Genesis', weight: '3×', count: 39, note: 'Genesis #2–40 from the first 40 mints' },
  { tier: 'Legendary Genesis #1', weight: '5×', count: 1, note: 'First successful mint' },
] as const
