import { serialize } from 'cookie';
import { AUTH_COOKIE_NAME } from '../../../lib/auth';

/**
 * POST /api/auth/logout
 * Clears the HTTP-only authentication cookie from the client's browser.
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  // Clear cookie by setting expiration to a past date
  const cookie = serialize(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
