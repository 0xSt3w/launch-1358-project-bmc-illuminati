import { test } from 'node:test'
import assert from 'node:assert/strict'

let revision = 0
async function renderMetadata(settings = {}) {
  const keys = ['VITE_SITE_URL', 'VITE_SHARE_IMAGE_URL']
  const previous = Object.fromEntries(keys.map(key => [key, process.env[key]]))
  try {
    for (const key of keys) {
      if (settings[key] === undefined) delete process.env[key]
      else process.env[key] = settings[key]
    }
    const { default: config } = await import(`../vite.config.ts?test=${revision++}`)
    const plugin = config.plugins.find(plugin => plugin.name === 'public-share-image')
    return plugin.transformIndexHtml('<meta property="og:image" content="./og.png"><meta name="twitter:image" content="./og.png"><script src="./assets/app.js"></script>')
  } finally {
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key]
      else process.env[key] = previous[key]
    }
  }
}

test('unpublished export retains its local PNG and relative runtime assets', async () => {
  const html = await renderMetadata()
  assert.equal((html.match(/content="\.\/og.png"/g) || []).length, 2)
  assert.match(html, /src="\.\/assets\/app.js"/)
})

test('publisher site base produces absolute OG and Twitter images, including subpaths', async () => {
  const html = await renderMetadata({ VITE_SITE_URL: 'https://publisher.example.test/site' })
  assert.equal((html.match(/content="https:\/\/publisher\.example\.test\/site\/og.png"/g) || []).length, 2)
  assert.match(html, /src="\.\/assets\/app.js"/)
})

test('independently published image URL takes precedence over the site base', async () => {
  const html = await renderMetadata({ VITE_SITE_URL: 'https://publisher.example.test', VITE_SHARE_IMAGE_URL: 'https://images.example.test/share.png' })
  assert.equal((html.match(/content="https:\/\/images\.example\.test\/share.png"/g) || []).length, 2)
})

test('reject unsafe public metadata URLs', async () => {
  for (const url of ['http://publisher.example.test/', 'https://user:password@publisher.example.test/', 'https://publisher.example.test/?token=test', 'https://publisher.example.test/#fragment', 'not a URL']) {
    await assert.rejects(() => renderMetadata({ VITE_SITE_URL: url }))
  }
})
