import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();

  // Navigation items required by Assignment 3
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'News (ISR)', path: '/news' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <Link
            href="/"
            prefetch={true}
            className="flex items-center space-x-2 text-slate-900 group transition-colors"
          >
            <div className="w-8 h-8 rounded border border-slate-900 bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider group-hover:bg-slate-800">
              A3
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base tracking-tight text-slate-900">
                NextData
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                Pages Router · V3
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  prefetch={true}
                  className={`px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Status & Authentication Controls (Dynamic Display) */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="block text-xs font-semibold text-slate-900 leading-none" data-testid="navbar-user-name">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 rounded-md transition-colors"
                  title="Sign out of current session"
                  data-testid="navbar-logout-btn"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                prefetch={true}
                className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
                data-testid="navbar-login-link"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                prefetch={true}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="block text-xs font-semibold text-slate-900">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                prefetch={true}
                onClick={() => setIsOpen(false)}
                className="block text-center py-2 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 rounded"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
