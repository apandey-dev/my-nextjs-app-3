import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

export default function HomePage() {
  const { user, isAuthenticated } = useUser();
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Client-side fetch to /api/hello demonstrating custom API Route integration
  useEffect(() => {
    let isMounted = true;

    async function fetchApiMessage() {
      try {
        setApiLoading(true);
        setApiError(null);

        const res = await fetch('/api/hello');
        if (!res.ok) {
          throw new Error(`API responded with status: ${res.status}`);
        }
        const data = await res.json();

        if (isMounted) {
          setApiData(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch from /api/hello:', err);
          setApiError(err.message || 'Unable to communicate with API route');
        }
      } finally {
        if (isMounted) {
          setApiLoading(false);
        }
      }
    }

    fetchApiMessage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>NextData Assignment 3 | State, Middleware & Optimization</title>
        <meta
          name="description"
          content="Production-ready demonstration of Next.js Pages Router: Context API, Middleware, Image Optimization, ISR, SSG, SSR, and CSR."
        />
      </Head>

      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-sky-600" />
            Next.js Assignment 3 · Advanced Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            State Management, Middleware & Optimization
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A production-quality demonstration incorporating React <span className="font-semibold text-slate-800">Context API</span> global state,
            cryptographic <span className="font-semibold text-slate-800">Middleware</span> route protection,
            <span className="font-semibold text-slate-800"> Incremental Static Regeneration</span> (ISR),
            and comprehensive <span className="font-semibold text-slate-800">next/image</span> optimization.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              prefetch={true}
              className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-sm transition-colors"
            >
              Browse Products (SSG) &rarr;
            </Link>
            <Link
              href="/news"
              prefetch={true}
              className="px-6 py-3 text-sm font-semibold text-slate-800 bg-amber-100/70 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors"
            >
              Live News (ISR) &rarr;
            </Link>
            <Link
              href="/dashboard"
              prefetch={true}
              className="px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Protected Dashboard &rarr;
            </Link>
          </div>
        </section>

        {/* Global State User Banner if Logged In */}
        {isAuthenticated && user && (
          <section className="bg-sky-50 border border-sky-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-sky-950">Active Global User: {user.name}</p>
                <p className="text-xs text-sky-700 font-mono">{user.email}</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              prefetch={true}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-sky-700 hover:bg-sky-800 rounded-md transition-colors"
            >
              Enter Protected Dashboard &rarr;
            </Link>
          </section>
        )}

        {/* Custom API Route Showcase (Preserved Feature) */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Custom API Route Demo
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                Live Response from <code className="text-base font-mono text-slate-700">/api/hello</code>
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              pages/api/hello.js
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            Dynamically fetched on client mount via <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">fetch(&apos;/api/hello&apos;)</code>:
          </p>

          <div className="mt-4 p-5 rounded-lg bg-slate-900 text-slate-100 font-mono text-sm relative">
            {apiLoading && (
              <div className="flex items-center space-x-3 text-slate-400 py-1" data-testid="api-loading">
                <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Fetching message from /api/hello...</span>
              </div>
            )}

            {apiError && (
              <div className="text-rose-400 py-1" data-testid="api-error">
                <span>Error: {apiError}</span>
              </div>
            )}

            {!apiLoading && !apiError && apiData && (
              <div className="space-y-1" data-testid="api-response">
                <div className="text-xs text-slate-400">// 200 OK — JSON payload</div>
                <div className="text-emerald-400 font-medium">
                  {JSON.stringify(apiData, null, 2)}
                </div>
                <div className="pt-2 text-xs text-slate-400 border-t border-slate-800">
                  Extracted message: <span className="text-white font-semibold">&ldquo;{apiData.message}&rdquo;</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Architectural Strategies Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Rendering & Architectural Patterns
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: SSG */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  SSG Catalog
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  Products Page
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Static HTML pre-rendered at build time with <code className="font-mono text-slate-800">getStaticProps</code> and optimized images.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100">
                <Link
                  href="/products"
                  prefetch={true}
                  className="text-xs font-semibold text-slate-900 hover:text-sky-600 transition-colors"
                >
                  Visit /products &rarr;
                </Link>
              </div>
            </div>

            {/* Card 2: SSR */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                  SSR Dynamic
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  Product Details
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Rendered at request-time with <code className="font-mono text-slate-800">getServerSideProps</code>, priority image loading, and validation.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100">
                <Link
                  href="/products/1"
                  prefetch={true}
                  className="text-xs font-semibold text-slate-900 hover:text-sky-600 transition-colors"
                >
                  Inspect Item #1 &rarr;
                </Link>
              </div>
            </div>

            {/* Card 3: ISR */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                  ISR 10s Revalidate
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  News & Updates
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Incremental Static Regeneration on edge nodes via <code className="font-mono text-slate-800">revalidate: 10</code> with background rebuilds.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100">
                <Link
                  href="/news"
                  prefetch={true}
                  className="text-xs font-semibold text-slate-900 hover:text-sky-600 transition-colors"
                >
                  Open /news &rarr;
                </Link>
              </div>
            </div>

            {/* Card 4: Middleware + CSR */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                  Middleware + CSR
                </span>
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  Protected Feed
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Guarded by signed cookie middleware; auto-polls live posts with SWR every 10 seconds.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100">
                <Link
                  href="/dashboard"
                  prefetch={true}
                  className="text-xs font-semibold text-slate-900 hover:text-sky-600 transition-colors"
                >
                  Enter /dashboard &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
