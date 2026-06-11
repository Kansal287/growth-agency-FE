'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { CheckCircle2, Clock, Check } from 'lucide-react';

export default function ClientDashboard() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get("/auth/me");
      if (response.status === 200 && response.data && response.data.success) {
        setUserInfo(response.data.data);
      }

      const tasksRes: any = await apiClient.get('/tasks');
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading portal records...
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Workspace Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Client Portal for {userInfo?.name || 'Growth HUB'}
          </p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in">
        {/* Profile Card & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118]">
            <h3 className="text-base font-bold mb-2">Welcome back, {userInfo?.name}!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Your digital growth team is actively building out your campaigns. Monitor progress below.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 pt-4 border-t border-gray-100 dark:border-white/5">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Plan</p>
                <p className="text-sm font-bold text-pink-600 dark:text-pink-400">
                  {userInfo?.subscription?.planName || 'Active Workspace'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Deliverables Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-24 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Onboarding Checklist</p>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 line-through">Subscribe & Pay</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 line-through">Input Brand Colors</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 line-through">Upload Assets & Logo</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Check size={12} />
              Account Setup Complete
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
