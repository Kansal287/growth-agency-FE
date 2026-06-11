'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { getAdminToken } from '@/lib/helpers';
import { adminMenuItems, clientMenuItems } from '@/lib/menuConfig';
import apiClient from '@/lib/api-client';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  type: 'admin' | 'client';
}

export default function ProtectedLayout({ children, type }: ProtectedLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  const menuItems = type === 'admin' ? adminMenuItems : clientMenuItems;

  useEffect(() => {
    if (type === 'admin') {
      const token = getAdminToken();
      if (!token && pathname !== '/admin') {
        router.replace('/admin');
      } else {
        setChecking(false);
      }
    } else {
      // Client session verification via cookie
      const checkSession = async () => {
        try {
          const response = await apiClient.get("/auth/me");
          if (response.status === 200 && response.data && response.data.success) {
            setChecking(false);
          } else {
            router.replace('/login');
          }
        } catch (err) {
          router.replace('/login');
        }
      };
      checkSession();
    }
  }, [router, pathname, type]);

  // Render the admin login page directly without the dashboard sidebar and header shell
  if (type === 'admin' && pathname === '/admin') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b12] transition-colors duration-200">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-pink-100 dark:border-pink-900/30" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-600 dark:border-t-pink-400 animate-spin" />
          </div>
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] transition-colors duration-200">
      <Navbar type={type} isSidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar type={type} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} menuItems={menuItems} />

      {/* Main workspace layout content offset by Navbar (56px / 14) and Sidebar (224px / 56) */}
      <main className="pt-14 lg:pl-56 min-h-screen">
        <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
