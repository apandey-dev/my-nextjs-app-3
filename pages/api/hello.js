/**
 * Custom Next.js API Route (Preserved from Assignment 2)
 * Handles GET /api/hello and returns a greeting JSON payload.
 */
export default function handler(req, res) {
  res.status(200).json({
    message: "Hello from Next.js API Route!"
  });
}
