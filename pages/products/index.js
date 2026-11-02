import Head from 'next/head';
import ProductCard from '../../components/ProductCard';

/**
 * Task 1 (Preserved) — Products Page (Static Site Generation / SSG)
 *
 * Uses `getStaticProps` to pre-render the product catalog at build time
 * from fakestoreapi.com/products.
 */
export async function getStaticProps() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');

    if (!res.ok) {
      throw new Error(`Fake Store API returned status: ${res.status}`);
    }

    const products = await res.json();

    return {
      props: {
        products: Array.isArray(products) ? products : [],
        error: null,
      },
    };
  } catch (err) {
    console.error('Error in getStaticProps on /products:', err.message);
    return {
      props: {
        products: [],
        error: 'Failed to fetch products at build time. Please check your network connection or try again later.',
      },
    };
  }
}

export default function ProductsPage({ products, error }) {
  return (
    <>
      <Head>
        <title>Products Catalog (SSG) | NextData</title>
        <meta
          name="description"
          content="Browse our product catalog pre-rendered at build time using Next.js Static Site Generation (SSG)."
        />
      </Head>

      <section className="space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Static Site Generation (SSG)
              </span>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Product Catalog
              </h1>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Source: fakestoreapi.com
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600 max-w-2xl leading-relaxed">
            This catalog is pre-rendered once at build time via{' '}
            <code className="text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono">
              getStaticProps
            </code>
            . Optimized Next.js images with lazy loading are utilized across the grid.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-3">
            <svg
              className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold">Unable to load products</p>
              <p className="mt-1 text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && products.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-lg border border-slate-200">
            <p className="text-base font-semibold text-slate-900">No products available</p>
            <p className="mt-1 text-sm text-slate-500">
              The product catalog is currently empty.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
