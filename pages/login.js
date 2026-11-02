import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/UserContext';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { updateUser, isAuthenticated } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, allow quick navigation to dashboard
  if (isAuthenticated && !isSubmitting) {
    const destination = router.query.redirect || '/dashboard';
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-xl border border-slate-200 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Already Signed In</h2>
        <p className="mt-2 text-sm text-slate-600">
          You are currently logged in.
        </p>
        <div className="mt-6">
          <Link
            href={destination}
            prefetch={true}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Go to Dashboard &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side field validations
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate');
      }

      // Update global UserContext
      updateUser(data.user);

      // Redirect to target or dashboard
      const target = router.query.redirect || '/dashboard';
      router.push(target);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | NextData Assignment 3</title>
        <meta
          name="description"
          content="Educational authentication login page with middleware route protection."
        />
      </Head>

      <div className="max-w-md mx-auto my-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="text-center pb-6 border-b border-slate-100">
            <span className="text-xs uppercase tracking-widest font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded border border-sky-200">
              Authentication Demo
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Sign In to NextData
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Enter your details to generate a signed cookie token for route protection.
            </p>
          </div>

          {error && (
            <div className="mt-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Pandey"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In & Access Dashboard'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-[11px] text-slate-500 text-center leading-relaxed">
            <p className="font-semibold text-slate-700">Educational Note:</p>
            <p>
              Submitting signs an HMAC-SHA256 token into an HTTP-only cookie validated
              by Next.js Middleware before granting access to <code className="font-mono text-slate-700">/dashboard</code>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
