import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Task 2 (Preserved) — Product Details Page (Server-Side Rendering / SSR)
 *
 * Uses `getServerSideProps` to fetch individual product details per incoming request.
 * Implements next/image optimization with `priority={true}` for above-the-fold hero image.
 */
export async function getServerSideProps(context) {
  const { id } = context.params;

  if (!id || isNaN(Number(id))) {
    return {
      props: {
        product: null,
        error: `Invalid product identifier "${id}". Product IDs must be numeric.`,
      },
    };
  }

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!res.ok) {
      return {
        props: {
          product: null,
          error: `Product #${id} could not be found (Status ${res.status}).`,
        },
      };
    }

    const text = await res.text();
    if (!text || text.trim() === '') {
      return {
        props: {
          product: null,
          error: `Product #${id} does not exist in the catalog.`,
        },
      };
    }

    const product = JSON.parse(text);

    if (!product || !product.id) {
      return {
        props: {
          product: null,
          error: `Product #${id} does not exist in the catalog.`,
        },
      };
    }

    return {
      props: {
        product,
        error: null,
      },
    };
  } catch (err) {
    console.error(`Error in getServerSideProps for product ${id}:`, err.message);
    return {
      props: {
        product: null,
        error: 'An unexpected error occurred while fetching product details. Please try again.',
      },
    };
  }
}

export default function ProductDetailPage({ product, error }) {
  const pageTitle = product
    ? `${product.title} | NextData`
    : 'Product Not Found | NextData';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            product
              ? product.description.slice(0, 160)
              : 'Product details page rendered server-side on demand.'
          }
        />
      </Head>

      <div className="space-y-6">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/products"
            prefetch={true}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <span className="mr-1 group-hover:-translate-x-0.5 transition-transform">
              &larr;
            </span>
            Back to Products Catalog
          </Link>
          <span className="text-xs uppercase tracking-widest font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Server-Side Rendered (SSR)
          </span>
        </div>

        {/* Error / Not Found State */}
        {error && (
          <div className="bg-white rounded-lg border border-red-200 p-8 text-center max-w-xl mx-auto my-12">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Product Unavailable
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {error}
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                prefetch={true}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}

        {/* Product Details Layout */}
        {product && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
              {/* Product Image Section with Next.js Image Optimization */}
              <div className="relative w-full h-80 sm:h-96 bg-white flex items-center justify-center p-6 border border-slate-100 rounded-lg">
                <div className="relative w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    priority={true}
                  />
                </div>
              </div>

              {/* Product Info Section */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 rounded">
                      {product.category}
                    </span>
                    {product.rating && (
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <span className="text-amber-500">★</span>
                        <span>{product.rating.rate}</span>
                        <span className="text-slate-400">({product.rating.count} reviews)</span>
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                    {product.title}
                  </h1>

                  <div className="mt-4 text-2xl font-bold text-slate-900">
                    ${Number(product.price).toFixed(2)}
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Description
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-600">
                    <p className="font-semibold text-slate-800">
                      Request-Time Rendering Note:
                    </p>
                    <p className="mt-0.5">
                      This page was rendered on the server during this specific HTTP request
                      using Next.js <code className="font-mono text-slate-800">getServerSideProps</code>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
