// Interaction and export checks that need no browser.
// Run from web/: `npm test` (Node 22, --experimental-strip-types for the TS imports).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const { burnForMints, priceForNextMint, fmtInt, shortAddress } = await import('../src/lib/format.ts')
const { readHash, ROUTES } = await import('../src/lib/router-core.ts')

test('mint schedule: first 40 burn 1,000,000 BMC, the rest 350,000 BMC', () => {
  assert.equal(priceForNextMint(0), 1_000_000)
  assert.equal(priceForNextMint(39), 1_000_000)
  assert.equal(priceForNextMint(40), 350_000)
  assert.equal(burnForMints(0), 0)
  assert.equal(burnForMints(40), 40_000_000)
  assert.equal(burnForMints(500), 201_000_000)
  assert.equal(burnForMints(600), 201_000_000, 'clamped to the 500 supply')
})

test('formatting helpers', () => {
  assert.equal(fmtInt(201_000_000), '201,000,000')
  assert.equal(shortAddress('0x38224239f2BDae357D47cb864BC533d7f72dF961'), '0x3822…F961')
})

test('hash router resolves every nav route and falls back to home', () => {
  for (const r of ROUTES) assert.equal(readHash(`#${r.path}`), r.path)
  assert.equal(readHash(''), '/')
  assert.equal(readHash('#/nope'), '/')
  assert.equal(readHash('#/pass?x=1'), '/pass')
  assert.deepEqual(
    ROUTES.map((r) => r.label),
    ['Home', 'BMC PASS', 'Swap', 'Staking', 'IMD Burns', 'Dashboard', 'Community'],
  )
})

test('committed export has relative assets and share metadata', () => {
  const dist = join(here, '..', '..', 'dist')
  const html = readFileSync(join(dist, 'index.html'), 'utf8')
  assert.match(html, /<title>BMC Illuminati/)
  assert.match(html, /rel="icon"[^>]*href="\.\/favicon\.svg"/)
  assert.match(html, /name="description"/)
  assert.match(html, /property="og:title"/)
  assert.match(html, /property="og:image" content="\.\/og\.svg"/)
  for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    assert.ok(m[1].startsWith('./') || m[1].startsWith('#'), `asset URL must be relative: ${m[1]}`)
  }
  for (const m of html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)) {
    assert.ok(existsSync(join(dist, m[1])), `referenced asset exists: ${m[1]}`)
  }
})
