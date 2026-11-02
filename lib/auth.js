/**
 * Educational Authentication & Token Verification Utility
 *
 * Uses the standard Web Crypto API (crypto.subtle) which is natively supported
 * in both Next.js Edge Runtime (middleware.js) and Node.js API routes (pages/api/auth/*).
 *
 * This provides verifiable, cryptographically signed tokens (HMAC-SHA256)
 * without requiring any heavy third-party dependencies or Node-only binary packages.
 */

const AUTH_COOKIE_NAME = 'auth_token';
const DEFAULT_SECRET = 'nextjs-assignment-3-secure-auth-secret-key-2026';

// Helper to encode string to Uint8Array
function textToBuffer(str) {
  return new TextEncoder().encode(str);
}

// Base64URL encoding/decoding helpers
function base64UrlEncode(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Import or derive CryptoKey for HMAC-SHA256
async function getCryptoKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    textToBuffer(secret || process.env.AUTH_SECRET || DEFAULT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Creates a signed auth token containing user data with expiration.
 * Format: <base64url-payload>.<base64url-hmac-signature>
 */
export async function createAuthToken(user, expiresInSeconds = 86400) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    name: user.name,
    email: user.email,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = base64UrlEncode(textToBuffer(payloadString));

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    textToBuffer(payloadBase64)
  );
  const signatureBase64 = base64UrlEncode(new Uint8Array(signatureBuffer));

  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies a signed auth token.
 * Validates HMAC signature and expiration date.
 * Returns decoded payload on success or null on failure.
 */
export async function verifyAuthToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signatureBase64] = parts;

  try {
    const key = await getCryptoKey();
    const signatureBytes = base64UrlDecode(signatureBase64);

    // Verify HMAC signature
    const isValidSignature = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      textToBuffer(payloadBase64)
    );

    if (!isValidSignature) {
      return null;
    }

    // Decode and validate payload JSON
    const payloadBytes = base64UrlDecode(payloadBase64);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadJson);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
    }

    return payload;
  } catch (err) {
    return null;
  }
}

export { AUTH_COOKIE_NAME };
