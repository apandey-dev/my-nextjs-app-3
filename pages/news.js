import Head from 'next/head';

/**
 * Task 4 — Incremental Static Regeneration (ISR)
 *
 * Route: /news
 *
 * Why Incremental Static Regeneration?
 * ISR gives us the best of both worlds: the ultra-fast CDN speed of Static Site Generation (SSG)
 * combined with the freshness of Server-Side Rendering (SSR).
 *
 * With `revalidate: 10`:
 * 1. Next.js generates static HTML during build or first request.
 * 2. When requests arrive within 10 seconds, the cached static HTML is served instantly.
 * 3. When a request arrives AFTER 10 seconds, Next.js still serves the cached version immediately,
 *    while triggering a background regeneration in the cloud.
 * 4. Once regenerated successfully, Next.js swaps out the cache for all subsequent visitors.
 */
export async function getStaticProps() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');

    if (!res.ok) {
      throw new Error(`Public API returned status: ${res.status}`);
    }

    const posts = await res.json();

    return {
      props: {
        posts: Array.isArray(posts) ? posts : [],
        lastUpdated: new Date().toISOString(),
        error: null,
      },
      // Re-generate the page in the background at most once every 10 seconds
      revalidate: 10,
    };
  } catch (err) {
    console.error('Error fetching news in getStaticProps:', err.message);
    return {
      props: {
        posts: [],
        lastUpdated: new Date().toISOString(),
        error: 'Failed to retrieve news updates at regeneration time.',
      },
      revalidate: 10,
    };
  }
}

export default function NewsPage({ posts, lastUpdated, error }) {
  // Format readable timestamp
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      })
    : 'Recently';

  return (
    <>
      <Head>
        <title>Tech Updates & News (ISR) | NextData</title>
        <meta
          name="description"
          content="Demonstrating Next.js Incremental Static Regeneration (ISR) with 10-second background revalidation."
        />
      </Head>

      <section className="space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Incremental Static Regeneration (ISR)
              </span>
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                revalidate: 10s
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Platform News & Updates
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Demonstrating static page regeneration on edge CDN nodes. Cached HTML is served instantly;
              updates re-render in the background after the 10-second interval upon subsequent requests.
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
              Last Regenerated
            </span>
            <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200 inline-block mt-1">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Educational Note Banner */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <span className="text-base font-bold text-amber-600">ℹ</span>
          <div>
            <span className="font-semibold block mb-0.5">How ISR Revalidation Works:</span>
            Revalidation is event-driven by HTTP requests, not an automated browser timer.
            The first visitor after 10 seconds triggers the background rebuild. Refreshing the browser
            after regeneration displays the freshly baked static HTML.
            <span className="text-amber-700 block mt-1 italic">
              Note: Articles are sourced from JSONPlaceholder demonstration posts for educational evaluation.
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-semibold">Notice: {error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && posts.length === 0 && (
          <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
            <p className="text-slate-600 text-sm">No updates currently available.</p>
          </div>
        )}

        {/* News Cards Grid */}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono uppercase font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                      Bulletin #{post.id}
                    </span>
                    <span>Sample Feed</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 capitalize leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {post.body}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Incremental Cache Ready</span>
                  <span className="font-semibold text-slate-700">&bull; Static Edge</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
