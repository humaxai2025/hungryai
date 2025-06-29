import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import generateCsp from './csp'

const { csp, nonce } = generateCsp()

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['transform-remove-console', { exclude: ['error', 'warn'] }
        ]
      }
    })
  ],
  server: {
    headers: {
      "Content-Security-Policy": csp
    }
  }
})