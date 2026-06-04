'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { type MenuItem } from '@/lib/menuConfig';
import { getSessionUserInfo } from '@/lib/helpers';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  type: 'admin' | 'client';
}

export default function Sidebar({ isOpen, onClose, menuItems, type }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTabQuery = searchParams.get('tab');
  
  const [permissions, setPermissions] = useState<string[]>([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    const userInfo = getSessionUserInfo(type);
    if (userInfo) {
      setPermissions(userInfo.permissions || []);
      setRole(userInfo.role);
    }
  }, [type]);

  const canSeeMenuItem = (item: MenuItem): boolean => {
    if (item.alwaysVisible) return true;
    if (!item.permission) return true;
    
    // Check if user has permission
    return permissions.includes(item.permission) || permissions.includes('all');
  };

  const visibleItems = menuItems.filter(canSeeMenuItem);

  const isActive = (item: MenuItem) => {
    if (!item.link) return false;
    
    // Exact match for path and query parameters
    const itemUrl = new URL(item.link, 'https://local.test');
    const itemTab = itemUrl.searchParams.get('tab');
    
    if (itemTab) {
      return pathname === itemUrl.pathname && activeTabQuery === itemTab;
    }
    
    return pathname === itemUrl.pathname && !activeTabQuery;
  };

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar drawer Container */}
      <aside
        className={`fixed top-14 left-0 bottom-0 z-40 w-56 bg-white/95 dark:bg-[#0d0d14]/95 border-r border-gray-200 dark:border-white/10 backdrop-blur-xl overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        style={{ scrollbarWidth: 'none' }}
      >
        <nav className="py-4 px-2.5">
          <ul className="space-y-1">
            {visibleItems.map((item, idx) => {
              const active = isActive(item);
              const Icon = item.icon;

              return (
                <li key={item.name} className="relative">
                  <Link
                    href={item.link || '#'}
                    onClick={onClose}
                    className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                      active
                        ? 'bg-pink-500/10 dark:bg-pink-500/15 text-pink-700 dark:text-pink-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-pink-600 dark:bg-pink-400 rounded-r-full" />
                    )}
                    
                    <Icon
                      size={15}
                      className={
                        active
                          ? 'text-pink-600 dark:text-pink-400 shrink-0'
                          : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0 transition-colors'
                      }
                    />
                    
                    <span className="flex-1 truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
