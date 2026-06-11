"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sparkles, Sun, Moon, LogIn, Menu, X, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import apiClient from "@/lib/api-client";

interface User {
  id: string;
  googleId?: string;
  email: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  onboarding?: any;
  subscription?: any;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkSession = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        if (response.status === 200 && response.data && response.data.success) {
          setIsLoggedIn(true);
          setUser(response.data.data);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && pathname === "/login") {
      router.replace("/");
    }
  }, [isLoggedIn, pathname, router]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsLoggedIn(false);
    setUser(null);
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    window.location.reload();
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", "/");
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
            <Link
              href="/"
              onClick={handleHomeClick}
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-all cursor-pointer mr-1"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {isLoggedIn && user ? (
              <div className="relative hidden md:block" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-white/10"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold font-sans">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown size={14} className="text-slate-500 dark:text-slate-400" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-60 origin-top-right bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-sans">
                        Signed in as
                      </p>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/10"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold font-sans shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate font-sans">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-sans">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="px-1.5 py-1.5 space-y-0.5">
                      {user.subscription && (
                        <Link
                          href="/client/dashboard"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all font-sans"
                        >
                          <LayoutDashboard size={14} />
                          Client Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer text-left focus:outline-none font-sans"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
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
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 py-2.5 transition-colors border-b border-gray-100 dark:border-white/5"
              >
                Contact
              </Link>

              {/* User Account Section inside Mobile Menu */}
              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/5">
                {isLoggedIn && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 flex items-center justify-center text-white text-base font-bold font-sans shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate font-sans">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-sans">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="px-1.5 space-y-0.5">
                      {user.subscription && (
                        <Link
                          href="/client/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all font-sans"
                        >
                          <LayoutDashboard size={15} />
                          Client Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 transition-all cursor-pointer text-left focus:outline-none font-sans"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="px-1.5">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-xl text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/10 hover:text-pink-700 dark:hover:text-pink-300 transition-all font-sans"
                    >
                      <LogIn size={15} />
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Page Body Offset by Header height */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Public Footer */}
      {pathname !== "/login" && (
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
