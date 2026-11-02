import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-900 tracking-tight text-sm">
              NextData Assignment 3
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-xs text-slate-500">
              State, Middleware, ISR & Optimization
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              SSG: /products
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              SSR: /products/[id]
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">
              ISR: /news
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono">
              Protected CSR: /dashboard
            </span>
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Next.js Developer Assignment.
          </p>
        </div>
      </div>
    </footer>
  );
}
