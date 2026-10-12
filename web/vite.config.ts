import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Social crawlers need a public absolute image URL. Until the publisher supplies
// an actual address, keep the local PNG; never invent a hostname or CID.
const publicUrl = process.env.VITE_SHARE_IMAGE_URL || process.env.VITE_SITE_URL
let shareImageUrl = './og.png'
if (publicUrl) {
  const url = new URL(publicUrl)
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('Use a public HTTPS URL without credentials, query or fragment for share metadata.')
  }
  shareImageUrl = process.env.VITE_SHARE_IMAGE_URL
    ? url.href
    : new URL('og.png', `${url.href.replace(/\/$/, '')}/`).href
}

// base './' keeps every asset URL relative so the export works on an IPFS
// gateway subpath, an eth.limo name or a plain file server.
export default defineConfig({
  plugins: [react(), {
    name: 'public-share-image',
    transformIndexHtml(html) {
      const escaped = shareImageUrl.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
      return html.replaceAll('content="./og.png"', `content="${escaped}"`)
    },
  }],
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
})
