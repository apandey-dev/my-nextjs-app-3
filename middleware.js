import { NextResponse } from 'next/server';
import { verifyAuthToken, AUTH_COOKIE_NAME } from './lib/auth';

/**
 * Next.js Middleware for Route Protection
 *
 * Protects /dashboard and nested routes.
 * Cryptographically verifies the HMAC-SHA256 signature and expiration
 * of the authentication token in cookies before granting access.
 * If missing or forged/invalid, redirects cleanly to /login.
 */
export async function middleware(request) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Verify the cryptographic token signature and expiration
  const verifiedUser = token ? await verifyAuthToken(token) : null;

  if (!verifiedUser) {
    const loginUrl = new URL('/login', request.url);
    // Keep redirect parameter so user returns to the requested page post-login
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only match protected routes (do not unnecessarily match public assets or pages)
export const config = {
  matcher: ['/dashboard/:path*'],
};
