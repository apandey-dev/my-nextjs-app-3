import Head from 'next/head';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useUser } from '../context/UserContext';

/**
 * Task 3 (Preserved & Enhanced) — Protected Dashboard (CSR with SWR)
 *
 * Route: /dashboard
 * Protection: Next.js Middleware verifies the signed auth_token cookie
 * before allowing the browser to load this page.
 *
 * Data Fetching: useSWR polling jsonplaceholder.typicode.com/posts every 10 seconds.
 */

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching posts.');
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export default function DashboardPage() {
  const { user } = useUser();
  const [lastUpdated, setLastUpdated] = useState(null);

  // SWR polling every 10 seconds (10000ms)
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    'https://jsonplaceholder.typicode.com/posts',
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      onSuccess: () => {
        setLastUpdated(new Date());
      },
    }
  );

  useEffect(() => {
    if (data && !lastUpdated) {
      setLastUpdated(new Date());
    }
  }, [data, lastUpdated]);

  return (
    <>
      <Head>
        <title>Protected Dashboard (CSR + SWR) | NextData</title>
        <meta
          name="description"
          content="Real-time post feed protected by Next.js Middleware and powered by SWR polling."
        />
      </Head>

      <section className="space-y-6">
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded border border-purple-200">
                Protected Route · Middleware Verified
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Polls every 10s
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome back{user?.name ? `, ${user.name}` : ''}!
            </h1>

            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              This dashboard is guarded by <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">middleware.js</code>.
              Posts are polled client-side with SWR every 10 seconds (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">refreshInterval: 10000</code>).
            </p>
          </div>

          {/* Action & Status Indicator */}
          <div className="flex flex-col sm:items-end gap-2">
            <button
              onClick={() => mutate()}
              disabled={isValidating}
              className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {isValidating ? (
                <>
                  <svg className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Refreshing...
                </>
              ) : (
                'Manual Refresh'
              )}
            </button>
            {lastUpdated && (
              <span className="text-[11px] text-slate-500 font-mono">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3 py-6" aria-label="Loading posts">
            <div className="p-4 bg-white rounded-lg border border-slate-200 animate-pulse flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200 animate-pulse flex items-center space-x-4">
              <div className="w-8 h-8 bg-slate-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-red-700">
            <h3 className="font-semibold text-base">Error Loading Feed</h3>
            <p className="mt-1 text-sm text-red-600">
              {error.message || 'Failed to retrieve posts from JSONPlaceholder.'}
            </p>
            <button
              onClick={() => mutate()}
              className="mt-3 px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Posts List Layout */}
        {!isLoading && !error && data && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Showing {data.length} live posts</span>
              <span className="font-mono">JSONPlaceholder API</span>
            </div>

            <ul className="divide-y divide-slate-100 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              {data.map((post) => (
                <li
                  key={post.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex items-start gap-4"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-xs font-semibold">
                    #{post.id}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 capitalize leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {post.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
