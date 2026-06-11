'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, Bell, LogOut, User, ChevronDown, Sun, Moon, Sparkles } from 'lucide-react';
import { getSessionUserInfo, clearAdminToken } from '@/lib/helpers';
import apiClient from '@/lib/api-client';

interface NavbarProps {
  type: 'admin' | 'client';
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Navbar({ type, onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [roleText, setRoleText] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (type === 'admin') {
      // const userInfo = getSessionUserInfo('admin');
      // if (userInfo) {
      //   setName(userInfo.name);
      //   setRoleText('Operator Admin');
      // } else {
      //   setName('Agency Operator');
      //   setRoleText('Staff');
      // }
    } else {
      // client dashboard user profile check
      const fetchClientProfile = async () => {
        try {
          const response = await apiClient.get("/auth/me");
          if (response.status === 200 && response.data && response.data.success) {
            const user = response.data.data;
            setName(user.name);
            setRoleText(user.subscription ? `Client: ${user.subscription.planName || 'Active Subscriber'}` : 'Guest User');
          } else {
            setName('Business Client');
            setRoleText('Pro Plan');
          }
        } catch (err) {
          setName('Business Client');
          setRoleText('Pro Plan');
        }
      };
      fetchClientProfile();
    }
  }, [type]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = async () => {
    if (type === 'admin') {
      clearAdminToken();
      router.push('/admin');
    } else {
      try {
        await apiClient.post("/auth/logout");
      } catch (err) {
        console.error("Logout error:", err);
      }
      router.push('/login');
    }
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3 bg-white/80 dark:bg-[#09090e]/80 border-b border-gray-200 dark:border-white/10 backdrop-blur-xl transition-colors duration-200">
      
      {/* Mobile Drawer Trigger */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 lg:hidden transition-all"
        aria-label="Toggle sidebar"
      >
        <Menu size={19} />
      </button>

      {/* Agency Branding */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-pink-500 via-rose-600 to-indigo-600 flex items-center justify-center">
          <Sparkles size={14} className="text-white animate-pulse" />
        </div>
        <span className="font-semibold text-slate-900 dark:text-white text-[15px] tracking-tight hidden sm:block">
          Growth<span className="text-pink-600 dark:text-pink-400">Hub</span>
        </span>
      </div>

      <div className="flex-1" />

      {/* Utility Toolbar */}
      <div className="flex items-center gap-1.5">
        
        {/* Dark/Light mode toggler */}
        {mounted ? (
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        ) : (
          <div className="w-8 h-8" />
        )}

        {/* Notifications mock icon */}
        <button
          className="relative p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-all"
          aria-label="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-pink-500 rounded-full ring-2 ring-white dark:ring-[#09090e]" />
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1" />

        {/* User Account Settings Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center text-white text-[11px] font-semibold shadow-sm shrink-0">
              {initials}
            </div>

            <div className="hidden sm:flex flex-col items-start min-w-0 leading-tight">
              <span className="text-[13px] font-medium text-slate-800 dark:text-slate-100 truncate max-w-28">
                {name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-32">
                {roleText}
              </span>
            </div>

            <ChevronDown
              size={13}
              className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 ${showUserMenu ? 'rotate-180' : ''}`}
            />
          </button>

          {/* User actions list */}
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-[#111118] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none mb-1">{name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-none">{roleText}</p>
              </div>

              <div className="p-1">
                <button
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <User size={14} className="text-slate-400" />
                  My Settings
                </button>
              </div>

              <div className="p-1 border-t border-gray-100 dark:border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left font-medium"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
