// Production-export regression checks. Optional external Playwright installation;
// see README. Starts and closes its own local server and browser. No live wallet.
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { resolve, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const root = fileURLToPath(new URL('../../dist/', import.meta.url))
const output = resolve(process.env.BMC_CHECK_OUTPUT || '/tmp/bmc-browser-check')
await mkdir(output, { recursive: true })
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml' }
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  const file = resolve(root, pathname.replace(/^\/preview\//, '') || 'index.html')
  if (!pathname.startsWith('/preview/') || !file.startsWith(root)) { res.writeHead(404).end(); return }
  try { res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream'); res.end(await readFile(file)) }
  catch { res.writeHead(404).end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const base = `http://127.0.0.1:${server.address().port}/preview/`
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] })
const results = { layout: [], wallets: [], interactions: [], resources: [], errors: [], axe: [] }
const routes = { '/': 'BMC ILLUMINATI', '/pass': 'BMC PASS', '/swap': 'Swap BMC', '/staking': 'Staking', '/burns': 'IMD Burn Center', '/dashboard': 'Ecosystem dashboard', '/community': 'Community' }
async function context(options = {}) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', ...options })
  // UI checks deliberately exercise unavailable RPC data; never fabricate quotes.
  await ctx.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort())
  return ctx
}
async function open(page, route) {
  await page.goto(`${base}#${route}`)
  await page.waitForFunction(title => document.querySelector('h1')?.textContent === title, routes[route])
}
function mockWallet({ chain = '0x89', reject = false }) {
  let chainId = chain, accounts = []
  const listeners = new Map()
  window.walletCalls = []
  const emit = (event, value) => (listeners.get(event) || []).forEach(fn => fn(value))
  window.setWalletChain = value => { chainId = value; emit('chainChanged', value) }
  window.ethereum = {
    isMetaMask: true,
    on(event, fn) { listeners.set(event, [...(listeners.get(event) || []), fn]) },
    removeListener(event, fn) { listeners.set(event, (listeners.get(event) || []).filter(x => x !== fn)) },
    async request({ method, params }) {
      window.walletCalls.push({ method, params })
      if (method === 'eth_chainId') return chainId
      if (method === 'eth_accounts') return accounts
      if (method === 'wallet_requestPermissions') {
        if (reject) throw Object.assign(new Error('Rejected by user'), { code: 4001 })
        return [{ parentCapability: 'eth_accounts' }]
      }
      if (method === 'eth_requestAccounts') return accounts = ['0x1111111111111111111111111111111111111111']
      if (method === 'wallet_switchEthereumChain') { window.setWalletChain(params[0].chainId); return null }
      if (method === 'wallet_revokePermissions') return null
      throw Object.assign(new Error('Unexpected wallet request: ' + method), { code: 4200 })
    },
  }
}
try {
  const ctx = await context()
  const page = await ctx.newPage()
  page.on('pageerror', error => results.errors.push(error.message))
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) results.resources.push({ url: response.url(), status: response.status() }) })
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 })
    for (const route of Object.keys(routes)) {
      await open(page, route)
      const layout = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        card: document.querySelector('.grid .card')?.getBoundingClientRect().width,
        input: document.querySelector('.input-group input')?.getBoundingClientRect().width,
        toggle: getComputedStyle(document.querySelector('.nav-toggle')).display,
        kickers: [...document.querySelectorAll('.badge')].filter(el => /^H[1-4]$/.test(el.nextElementSibling?.tagName)).length,
        nestedNotices: document.querySelectorAll('.card .notice').length,
        weights: [...new Set([...document.querySelectorAll('body *')].filter(x => x.textContent?.trim()).map(x => getComputedStyle(x).fontWeight))],
      }))
      results.layout.push({ route, ...layout })
      assert.equal(layout.scrollWidth, width, `${route} overflows at ${width}`)
      assert.equal(layout.kickers, 0, `${route} has a badge above a heading`)
      assert.equal(layout.nestedNotices, 0, `${route} has a notice nested in a card`)
      assert.ok(layout.weights.length <= 3, `${route} has extra font weights`)
      assert.equal(layout.toggle === 'none', width >= 1024)
      if ([390, 1440].includes(width)) await page.screenshot({ path: join(output, `${route === '/' ? 'home' : route.slice(1)}-${width}.png`), fullPage: route === '/staking' })
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await open(page, '/')
  const action = await page.getByRole('link', { name: 'Explore BMC PASS', exact: true }).boundingBox()
  assert.ok(action.y >= 0 && action.y + action.height < 844, 'Home primary action must be on the first mobile screen')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.locator('#mobile-nav').getByRole('link', { name: 'Staking', exact: true }).click()
  await page.waitForFunction(() => document.querySelector('h1')?.textContent === 'Staking')
  assert.equal(await page.locator('#mobile-nav').count(), 0)
  await page.keyboard.press('Tab')
  await page.locator('.skip-link').focus()
  assert.equal(await page.locator('.skip-link').evaluate(el => el.matches(':focus-visible')), true)
  await page.screenshot({ path: join(output, 'skip-link-focus-390.png') })
  await page.keyboard.press('Enter')
  assert.equal(new URL(page.url()).hash, '#/staking')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main')
  await page.getByRole('button', { name: 'Open menu' }).click(); await page.keyboard.press('Escape')
  assert.equal(await page.locator('#mobile-nav').count(), 0)
  assert.equal(await page.getByRole('button', { name: 'Open menu' }).evaluate(el => el === document.activeElement), true)
  results.interactions.push('Mobile navigation, Escape/focus return and keyboard skip link retain the current route')
  await open(page, '/burns')
  await page.getByRole('link', { name: 'See the buyback dashboard' }).focus(); await page.keyboard.press('Enter')
  assert.equal(new URL(page.url()).hash, '#/burns')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'buybacks')
  assert.equal(await page.getByRole('button', { name: 'Burn IMD', exact: true }).isDisabled(), true)
  assert.equal(await page.locator('#burn-amount').isDisabled(), true)
  results.interactions.push('Buyback anchor focuses its heading without losing Burns; burns remain disabled')
  await open(page, '/pass')
  for (const [filter, count] of [['Legendary #1', 1], ['Early Genesis', 39], ['Mystery (pending reveal)', 48], ['All 500', 48]]) {
    await page.getByRole('button', { name: filter, exact: true }).click()
    assert.equal(await page.locator('.gallery > li').count(), count)
  }
  await page.getByRole('button', { name: 'Show 48 more' }).click()
  assert.equal(await page.locator('.gallery > li').count(), 96)
  assert.equal(await page.getByRole('button', { name: 'Mint BMC PASS', exact: true }).isDisabled(), true)
  results.interactions.push('PASS filters, pagination and disabled mint')
  await open(page, '/swap')
  await page.getByRole('button', { name: 'Sell BMC', exact: true }).click()
  assert.deepEqual(await page.locator('.token-chip').allTextContents(), ['BMC', 'ETH'])
  await page.locator('#swap-amount').fill('-1')
  assert.equal(await page.locator('#swap-amount').getAttribute('aria-invalid'), 'true')
  await page.locator('#swap-amount').fill('1,25')
  assert.equal(await page.locator('#swap-amount').inputValue(), '1.25')
  assert.equal(await page.locator('#swap-amount').getAttribute('aria-invalid'), null)
  await page.getByRole('button', { name: '0.5%', exact: true }).click()
  assert.equal(await page.getByRole('button', { name: '0.5%', exact: true }).getAttribute('aria-pressed'), 'true')
  results.interactions.push('Swap direction, amount validation, decimal normalization and slippage')
  await open(page, '/staking')
  for (const button of await page.getByRole('button', { name: /^(Stake|Claim rewards|Withdraw)$/ }).all()) assert.equal(await button.isDisabled(), true)
  await open(page, '/community')
  const faq = page.locator('details').first()
  await faq.locator('summary').focus(); await page.keyboard.press('Enter')
  assert.equal(await faq.getAttribute('open'), '')
  results.interactions.push('All nine staking actions disabled; FAQ opens by keyboard')
  await open(page, '/')
  assert.equal(await page.locator('canvas').count(), 0)
  assert.equal(await page.locator('.intro').count(), 0)
  results.interactions.push('Reduced motion removes the intro and Matrix canvas')
  if (process.env.AXE_MODULE) {
    const { default: AxeBuilder } = await import(process.env.AXE_MODULE)
    for (const route of Object.keys(routes)) {
      await open(page, route)
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      results.axe.push({ route, violations: audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), incomplete: audit.incomplete.map(i => i.id) })
    }
  }
  await ctx.close()
  for (const width of [320, 390, 1024, 1440]) {
    for (const chain of ['0x89', '0x1']) {
      const wallet = await context({ viewport: { width, height: 900 } })
      await wallet.addInitScript(mockWallet, { chain })
      const p = await wallet.newPage(); await open(p, '/swap')
      await p.getByRole('button', { name: 'Connect wallet', exact: true }).first().click()
      await p.locator('.wallet-pill').first().waitFor({ state: 'attached' })
      if (width < 1024) await p.getByRole('button', { name: 'Open menu' }).click()
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth), width, `Connected wallet overflows at ${width}`)
      const wrong = chain !== '0x1'
      assert.equal(await p.getByRole('alert').count(), wrong ? 1 : 0)
      assert.equal(await p.locator('.wallet-pill .dot.warn').count() > 0, wrong)
      assert.equal(await p.getByRole('button', { name: 'Switch to Ethereum Mainnet' }).count() > 0, wrong)
      if (wrong) {
        await p.screenshot({ path: join(output, `wallet-polygon-${width}.png`) })
        await p.getByRole('button', { name: 'Switch to Ethereum Mainnet' }).first().click()
        await p.waitForFunction(() => !document.querySelector('[role="alert"]'))
        assert.ok((await p.evaluate(() => window.walletCalls)).some(c => c.method === 'wallet_switchEthereumChain' && c.params[0].chainId === '0x1'))
      }
      await p.evaluate(() => window.setWalletChain('0x89'))
      await p.getByRole('alert').waitFor()
      await p.evaluate(() => window.setWalletChain('0x1'))
      await p.waitForFunction(() => !document.querySelector('[role="alert"]'))
      assert.equal(await p.getByRole('button', { name: 'Swap ETH for BMC' }).isDisabled(), true)
      const calls = await p.evaluate(() => window.walletCalls)
      assert.ok(calls.every(c => ['wallet_requestPermissions', 'eth_requestAccounts', 'eth_accounts', 'eth_chainId', 'wallet_switchEthereumChain'].includes(c.method)), 'No signatures, approvals or transactions requested')
      await p.getByRole('button', { name: 'Disconnect', exact: true }).first().click()
      await p.waitForFunction(() => !document.querySelector('.wallet-pill'))
      results.wallets.push({ width, chain, warning: wrong, switchAndChainEvents: 'passed', disconnect: 'passed', methods: [...new Set(calls.map(c => c.method))] })
      await wallet.close()
    }
  }
  const rejected = await context()
  await rejected.addInitScript(mockWallet, { reject: true })
  const p = await rejected.newPage(); await open(p, '/swap')
  await p.getByRole('button', { name: 'Connect wallet', exact: true }).first().click()
  await p.getByText('Unable to connect. Open your wallet extension and try again.').first().waitFor()
  assert.equal(await p.locator('.wallet-pill').count(), 0)
  await rejected.close()
  results.interactions.push('Wallet connection rejection shows recovery copy')
  const intro = await context({ reducedMotion: 'no-preference', viewport: { width: 390, height: 844 } })
  const introPage = await intro.newPage(); await introPage.goto(base)
  await introPage.getByRole('button', { name: 'Skip intro' }).click()
  assert.equal(await introPage.locator('.intro').count(), 0)
  await intro.close()
  results.interactions.push('Cinematic intro is skippable')
  assert.deepEqual(results.errors, [])
  assert.deepEqual(results.resources, [])
  for (const audit of results.axe) assert.deepEqual(audit.violations, [], `Axe violations on ${audit.route}`)
  console.log(`Passed ${results.layout.length} route/viewport checks, ${results.wallets.length} wallet scenarios and ${results.interactions.length} interaction groups.`)
  console.log('Axe violations:', results.axe.filter(a => a.violations.length))
} finally {
  await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2))
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
