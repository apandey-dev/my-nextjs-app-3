# NextData — Assignment 3: State Management, Middleware & Optimization

A clean, production-grade Next.js web application built with the Pages Router, demonstrating Context API global state, cryptographic route protection with Middleware, Incremental Static Regeneration (ISR), and Next.js image optimization.

## Technologies Used

- Next.js 14 (Pages Router, JavaScript)
- React 18 (Context API, Hooks)
- Tailwind CSS
- Mali Font (Google Fonts)
- SWR (Stale-While-Revalidate data fetching)
- Web Crypto API (HMAC-SHA256 signed token authentication)
- Jest & React Testing Library (Local automated testing)

## Main Features

- **Global State Management**: React Context (`UserContext`) tracking logged-in user state dynamically across the entire app with zero prop drilling.
- **Middleware Route Protection**: Next.js `middleware.js` intercepting requests to `/dashboard`, verifying cryptographically signed HTTP-only cookie tokens before granting access, and redirecting unauthenticated requests to `/login`.
- **Incremental Static Regeneration (ISR)**: Dedicated `/news` route pre-rendering posts via `getStaticProps` with `revalidate: 10` for cloud background regeneration.
- **Image Optimization**: All images powered by `next/image` with responsive sizing, `remotePatterns` configuration, and lazy loading for below-the-fold assets.
- **Navigation Optimization**: Built with `next/link` and `prefetch={true}` on key routes with active route indicators and responsive mobile menus.
- **Preserved Core Routes**: Maintained `/` (Homepage), `/products` (SSG), `/products/[id]` (SSR), and `/api/hello` (Custom API Route).

## Main Project Files

- `context/UserContext.js` — Global user context and `useUser()` custom hook
- `middleware.js` — Edge runtime route protection for `/dashboard`
- `lib/auth.js` — Cryptographic token signing and verification using Web Crypto API
- `pages/login.js` — Educational authentication form with validation
- `pages/news.js` — ISR news page with `revalidate: 10`
- `pages/dashboard.js` — Protected real-time feed with SWR 10-second polling
- `pages/products/index.js` — SSG product catalog
- `pages/products/[id].js` — SSR single-product detail page
- `pages/api/auth/login.js` — Generates signed HTTP-only authentication cookie
- `pages/api/auth/logout.js` — Clears authentication cookie
- `pages/api/auth/me.js` — Validates current cookie session
- `components/Navbar.js` — Responsive navigation displaying dynamic user state
- `components/ProductCard.js` — Optimized card component using `next/image`

## Screenshots

<!-- Add your screenshots below -->
- *Homepage (`/`)*
- *Product Catalog (`/products`)*
- *Product Details (`/products/[id]`)*
- *News Page (`/news`)*
- *Login Page (`/login`)*
- *Protected Dashboard (`/dashboard`)*
