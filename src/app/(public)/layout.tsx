'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sparkles, Sun, Moon, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { getPublicToken, clearPublicToken } from '@/lib/helpers';
import { usePathname } from 'next/navigation';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!getPublicToken());
  }, []);

  const handleLogout = () => {
    clearPublicToken();
    setIsLoggedIn(false);
    window.location.reload();
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#06090e] transition-colors duration-200">
      {/* Public Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#06090e]/70 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" onClick={handleHomeClick} className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 via-rose-600 to-indigo-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-[16px] tracking-tight">
              Growth<span className="text-pink-600 dark:text-pink-400">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" onClick={handleHomeClick} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Home</Link>
            <Link href="/#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Services</Link>
            <Link href="/#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Pricing</Link>
            <Link href="/#contact" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">Logged in</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 active:bg-pink-800 rounded-xl shadow-sm shadow-pink-200 dark:shadow-none transition-all cursor-pointer"
                >
                  <LogIn size={15} />
                  Login
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 md:hidden transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#06090e]/95 backdrop-blur-md animate-fade-in">
            <nav className="flex flex-col px-4 pt-2 pb-6 space-y-3">
              <Link
                href="/"
                onClick={(e) => {
                  handleHomeClick(e);
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 py-2.5 transition-colors border-b border-gray-100 dark:border-white/5"
              >
                Home
              </Link>
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 py-2.5 transition-colors border-b border-gray-100 dark:border-white/5"
              >
                Services
              </Link>
              <Link
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 py-2.5 transition-colors border-b border-gray-100 dark:border-white/5"
              >
                Pricing
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 py-2.5 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Page Body Offset by Header height */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Public Footer */}
      {pathname !== '/login' && (
        <footer className="bg-white dark:bg-[#090d14] border-t border-gray-200 dark:border-white/10 py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">GrowthHub</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              &copy; 2026 GrowthHub. Premium Subscription-Based Digital Growth Agency. All rights reserved.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
