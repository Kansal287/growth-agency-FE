'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { 
  CheckCircle2, 
  Clock, 
  Check, 
  Globe, 
  Share2, 
  TrendingUp, 
  FolderOpen, 
  MessageSquare,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

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
        Loading workspace dashboard...
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progressPercent = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 75; // default fallback if 0 tasks

  // Demo stats for quick metrics
  const quickStats = [
    {
      label: 'Website Status',
      value: 'Development Phase',
      icon: <Globe className="text-blue-500" size={16} />,
      link: '/client/website',
      color: 'border-blue-100 dark:border-blue-950/40 bg-blue-50/30 dark:bg-blue-950/10'
    },
    {
      label: 'Social Approvals',
      value: '2 Pending Review',
      icon: <Share2 className="text-amber-500" size={16} />,
      link: '/client/social-media',
      color: 'border-amber-100 dark:border-amber-950/40 bg-amber-50/30 dark:bg-amber-950/10'
    },
    {
      label: 'Generated Leads',
      value: '482 Contacts',
      icon: <TrendingUp className="text-emerald-500" size={16} />,
      link: '/client/leads',
      color: 'border-emerald-100 dark:border-emerald-950/40 bg-emerald-50/30 dark:bg-emerald-950/10'
    },
    {
      label: 'Support Tickets',
      value: '0 Open Tickets',
      icon: <MessageSquare className="text-indigo-500" size={16} />,
      link: '/client/support',
      color: 'border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/30 dark:bg-indigo-950/10'
    }
  ];

  // Demo Activity Logs list
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Meta ads campaign set live & active',
      timestamp: '2 hours ago',
      category: 'Leads',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'act-2',
      title: 'Social post calendar for next week uploaded for review',
      timestamp: '1 day ago',
      category: 'Social',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    },
    {
      id: 'act-3',
      title: 'Feedback registered on Homepage styling layout',
      timestamp: '2 days ago',
      category: 'Website',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    },
    {
      id: 'act-4',
      title: 'Logo guidelines assets successfully saved to project drive',
      timestamp: '4 days ago',
      category: 'Assets',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Workspace Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Client Portal for {userInfo?.name || 'Growth HUB'}
          </p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
        
        {/* Profile and Onboarding Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left profile block */}
          <div className="md:col-span-2 p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118]">
            <h3 className="text-base font-bold mb-2">Welcome back, {userInfo?.name || 'Partner'}!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Your digital growth team is actively building out your brand assets, managing social copy reviews, and monitoring analytics. Track campaigns or speak with support directly using the tabs on the left.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 pt-4 border-t border-gray-100 dark:border-white/5">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Plan</p>
                <p className="text-sm font-bold text-pink-600 dark:text-pink-400 mt-0.5">
                  {userInfo?.subscription?.planName || 'Enterprise Growth Plan'}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Project Deliverables Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <span className="text-xs font-bold shrink-0">{progressPercent}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right onboarding state checklist */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Onboarding Checklist</p>
              <div className="space-y-2 mt-3">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 line-through">Subscribe & Plan Pick</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 line-through">Input Brand Guidelines</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 line-through">Upload Logos & Media Assets</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-4">
              <Check size={12} />
              Account Verification Complete
            </div>
          </div>
        </div>

        {/* Quick Section Metrics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, i) => (
            <Link 
              key={i} 
              href={stat.link}
              className={`p-5 rounded-2xl border ${stat.color} hover:border-pink-500/40 dark:hover:border-pink-400/40 hover:shadow-lg transition-all duration-200 group flex items-start justify-between cursor-pointer`}
            >
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">{stat.label}</p>
                <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{stat.value}</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#151922] shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Stream & Brand Colors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Stream */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118]">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Clock size={16} className="text-pink-500" />
              Recent Deliverable Activity
            </h3>
            
            <div className="relative border-l border-gray-100 dark:border-white/5 pl-4 ml-2.5 space-y-6">
              {recentActivities.map((act) => (
                <div key={act.id} className="relative">
                  {/* Timeline Node Dot */}
                  <span className="absolute -left-[22.5px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-white dark:bg-[#111118]">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${act.color}`}>
                        {act.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1">
                      {act.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Assets / Guidelines */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] space-y-4">
            <h3 className="text-sm font-bold mb-1 flex items-center gap-2">
              <FolderOpen size={16} className="text-pink-500" />
              Brand Assets Saved
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Saved Colors</p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 bg-pink-600" title="Primary: #db2777" />
                  <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 bg-indigo-600" title="Secondary: #4f46e5" />
                  <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 bg-[#0f172a]" title="Dark Accent: #0f172a" />
                  <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 bg-slate-100" title="Light Accent: #f1f5f9" />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-slate-400 uppercase font-semibold mb-2">Corporate logo</p>
                <div className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/2">
                  <span className="text-xs font-semibold truncate max-w-[120px]">brand_logo_main.png</span>
                  <Link href="/client/assets" className="text-[10px] text-pink-600 dark:text-pink-400 hover:underline font-bold flex items-center gap-0.5">
                    View
                    <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
