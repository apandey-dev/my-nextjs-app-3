import { verifyAuthToken, AUTH_COOKIE_NAME } from '../../../lib/auth';

/**
 * GET /api/auth/me
 * Verifies the incoming cookie token and returns current user info.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    return res.status(200).json({ authenticated: false, user: null });
  }

  const payload = await verifyAuthToken(token);

  if (!payload) {
    return res.status(200).json({ authenticated: false, user: null });
  }

  return res.status(200).json({
    authenticated: true,
    user: {
      name: payload.name,
      email: payload.email,
    },
  });
}
