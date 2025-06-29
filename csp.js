// csp.js (ES Module format)
import crypto from 'crypto';

export const generateCsp = () => {
  const production = process.env.NODE_ENV === 'production';
  const nonce = crypto.randomBytes(16).toString('base64');
  
  const csp = [
    `default-src 'self'`,
    `script-src 'self' ${production ? '' : `'nonce-${nonce}'`}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `connect-src 'self' https://api-inference.huggingface.co`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`
  ].join('; ');

  return { csp, nonce };
};

// Export as default
export default generateCsp;