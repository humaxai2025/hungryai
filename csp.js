// Generate nonces for strict CSP
const crypto = require('crypto')

const generateCsp = () => {
  const production = process.env.NODE_ENV === 'production'

  // Generate random nonce
  const nonce = crypto.randomBytes(16).toString('base64')

  // Note: In production, we use a hash-based CSP
  const csp = []
  csp.push(`default-src 'self'`)
  csp.push(`script-src 'self' ${production ? '' : `'nonce-${nonce}'`}`)
  csp.push(`style-src 'self' 'unsafe-inline'`)
  csp.push(`img-src 'self' data:`)
  csp.push(`font-src 'self'`)
  csp.push(`connect-src 'self' https://api-inference.huggingface.co`)
  csp.push(`base-uri 'self'`)
  csp.push(`form-action 'self'`)
  csp.push(`frame-ancestors 'none'`)

  return { csp: csp.join('; '), nonce }
}

module.exports = generateCsp