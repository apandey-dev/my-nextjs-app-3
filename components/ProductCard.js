import Link from 'next/link';
import Image from 'next/image';

/**
 * Reusable Product Card Component with next/image Optimization (Task 3)
 *
 * Implements:
 * - Next.js Image component with responsive sizing
 * - Lazy loading for below-the-fold catalog items (priority={false})
 * - Clean aspect ratio container preventing layout shifts (CLS)
 * - Accessible alt tags
 */
export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <article className="group bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:border-slate-400 hover:shadow-md">
      {/* Product Image Container with consistent aspect ratio */}
      <div className="relative w-full h-56 p-6 bg-white flex items-center justify-center border-b border-slate-100 overflow-hidden">
        <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
          <Image
            src={product.image}
            alt={product.title || 'Product Image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain"
            loading="lazy"
            priority={false}
          />
        </div>
        {product.category && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-slate-100 text-slate-600 rounded">
            {product.category}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
            {product.title}
          </h2>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.rating && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <span className="text-amber-500 font-semibold">★ {product.rating.rate}</span>
                <span>({product.rating.count})</span>
              </span>
            )}
          </div>
        </div>

        {/* View Details Link with Next.js prefetch */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <Link
            href={`/products/${product.id}`}
            prefetch={true}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-900 hover:text-white rounded transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
