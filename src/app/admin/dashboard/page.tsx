'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setClientToken, setAdminToken } from '@/lib/helpers';
import apiClient from '@/lib/api-client';
import { Users, CreditCard, Clock, MessageSquare, Shield } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminDashboard() {
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const tasksRes: any = await apiClient.get('/tasks');
      setTasks(tasksRes.tasks || []);

      const ticketsRes: any = await apiClient.get('/tickets');
      setTickets(ticketsRes.tickets || []);

      // Pull customer registry from mock storage
      const rawDb = sessionStorage.getItem('growth_agency_db');
      if (rawDb) {
        const parsed = JSON.parse(rawDb);
        setCustomers(parsed.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Helper token generator to switch roles in the browser
  const generateMockJWTForRole = (role: 'client' | 'admin', username: string, planTier = 'business_pro') => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: username,
      username,
      name: username === 'client' ? 'Giva Jewellers' : 'Operator Staff',
      role,
      permissions: ['all'],
      planTier,
      exp: Math.floor(Date.now() / 1000) + 86400
    }));
    return `${header}.${payload}.signature`;
  };

  const handleDevRoleSwitch = (role: 'client' | 'admin') => {
    if (role === 'client') {
      const token = generateMockJWTForRole('client', 'client');
      setClientToken(token);
      toast.success('Authenticated as CLIENT. Redirecting to portal...');
      setTimeout(() => {
        router.push('/client/dashboard');
      }, 1000);
    } else {
      const token = generateMockJWTForRole('admin', 'admin');
      setAdminToken(token);
      toast.success('Authenticated as ADMIN. Reloading workspace...');
      setTimeout(() => {
        fetchAdminData();
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-slate-500">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Loading operator dashboard...
      </div>
    );
  }

  const clientsCount = customers.filter(c => c.role === 'client').length;
  const reviewTasksCount = tasks.filter(t => t.status === 'review').length;
  const openTicketsCount = tickets.filter(t => t.status === 'Open').length;

  return (
    <div className="space-y-6">
      <ToastContainer theme="colored" />

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">Operator Control Desk</h2>
          <p className="text-xs text-slate-500 mt-0.5">Growth Immortals Agency Operations</p>
        </div>
      </div>

      <div className="space-y-6 animate-fade-in text-slate-900 dark:text-slate-100">
        {/* Quick statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Clients</p>
              <p className="text-lg font-black mt-0.5">{clientsCount}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total MRR</p>
              <p className="text-lg font-black mt-0.5">₹11,997/mo</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Awaiting Reviews</p>
              <p className="text-lg font-black mt-0.5">{reviewTasksCount}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111118] flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Open Tickets</p>
              <p className="text-lg font-black mt-0.5">{openTicketsCount}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
