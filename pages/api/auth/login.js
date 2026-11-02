import { serialize } from 'cookie';
import { createAuthToken, AUTH_COOKIE_NAME } from '../../../lib/auth';

/**
 * POST /api/auth/login
 * Validates credentials, signs a verifiable token, and stores it in an HTTP-only cookie.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { name, email } = req.body || {};

    // Basic educational validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        error: 'Please enter a valid name (at least 2 characters).',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        error: 'Please enter a valid email address.',
      });
    }

    const trimmedUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };

    // Generate verifiable signed token (HMAC-SHA256)
    const token = await createAuthToken(trimmedUser);

    // Set secure HTTP-only cookie
    const cookie = serialize(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 1 day
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: trimmedUser,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
}
