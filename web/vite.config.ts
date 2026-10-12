import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps every asset URL relative so the export works on an IPFS
// gateway subpath, an eth.limo name or a plain file server.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
})
