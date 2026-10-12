/** Hash routes: static hosting has no server rewrites, so `#/path` is the URL. */
export const ROUTES = [
  { path: '/', label: 'Home' },
  { path: '/pass', label: 'BMC PASS' },
  { path: '/swap', label: 'Swap' },
  { path: '/staking', label: 'Staking' },
  { path: '/burns', label: 'IMD Burns' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/community', label: 'Community' },
] as const

export type RoutePath = (typeof ROUTES)[number]['path']

export function readHash(hash: string): RoutePath {
  const raw = hash.replace(/^#/, '') || '/'
  const path = raw.split('?')[0]
  return (ROUTES.find((r) => r.path === path)?.path ?? '/') as RoutePath
}
