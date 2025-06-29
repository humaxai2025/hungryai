import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  server: {
    headers: {
      "Content-Security-Policy": 
        process.env.NODE_ENV === 'production'
          ? "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api-inference.huggingface.co; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
          : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api-inference.huggingface.co; base-uri 'self'; form-action 'self'; frame-ancestors 'none';"
    }
  }
});