import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tip-calculator/',
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    host: true,
    port: 5173
  }
})
