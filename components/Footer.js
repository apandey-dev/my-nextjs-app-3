import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100">
          {/* Brand & Project Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider">
                A3
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-base">
                NextData
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-slate-100">
                Assignment 3
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              State Management (Context API), Route Protection (Middleware with HMAC tokens),
              Image Optimization (next/image), and Incremental Static Regeneration (ISR).
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-900">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" prefetch={true} className="hover:text-slate-900 transition-colors">
                  &rarr; Homepage Overview
                </Link>
              </li>
              <li>
                <Link href="/products" prefetch={true} className="hover:text-slate-900 transition-colors">
                  &rarr; Products (SSG)
                </Link>
              </li>
              <li>
                <Link href="/news" prefetch={true} className="hover:text-slate-900 transition-colors">
                  &rarr; Live News (ISR)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" prefetch={true} className="hover:text-slate-900 transition-colors">
                  &rarr; Protected Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" prefetch={true} className="hover:text-slate-900 transition-colors">
                  &rarr; Sign In / Authentication
                </Link>
              </li>
            </ul>
          </div>

          {/* Architectural Strategies */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-900">
              Features & Architecture
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200 text-emerald-800">
                <span className="font-bold block uppercase text-[10px]">SSG · getStaticProps</span>
                <span className="text-emerald-600">/products</span>
              </div>
              <div className="p-2 rounded bg-blue-50/70 border border-blue-200 text-blue-800">
                <span className="font-bold block uppercase text-[10px]">SSR · getServerSideProps</span>
                <span className="text-blue-600">/products/[id]</span>
              </div>
              <div className="p-2 rounded bg-amber-50/70 border border-amber-200 text-amber-800">
                <span className="font-bold block uppercase text-[10px]">ISR · revalidate: 10s</span>
                <span className="text-amber-600">/news</span>
              </div>
              <div className="p-2 rounded bg-purple-50/70 border border-purple-200 text-purple-800">
                <span className="font-bold block uppercase text-[10px]">Middleware · Protected</span>
                <span className="text-purple-600">/dashboard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} NextData Assignment 3. Built with Next.js Pages Router &amp; Tailwind CSS.
          </p>
          <div className="flex items-center space-x-4 text-slate-500">
            <span>Font: Mali</span>
            <span>&bull;</span>
            <span>Context API · Middleware · ISR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
