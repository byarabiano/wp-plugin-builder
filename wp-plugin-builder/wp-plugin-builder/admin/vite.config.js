import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Build to ../build so WP can load admin/build/admin.js
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  base: './',
  build: {
    outDir: path.resolve(__dirname, 'build'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: `admin.js`,
        assetFileNames: `[name].[ext]`,
      }
    }
  },
  server: {
    port: 5173
  }
})
