import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Assignment 3 Global Layout Component
 * Configured with wide desktop container (max-w-7xl 2xl:max-w-[1536px]) and balanced padding.
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
