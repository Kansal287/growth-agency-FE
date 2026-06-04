'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, AlertCircle, ArrowLeft, LogIn, Lock, User, Shield } from 'lucide-react';
import { setAdminToken, getAdminToken } from '@/lib/helpers';
import apiClient from '@/lib/api-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getAdminToken()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter your credentials.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response: any = await apiClient.post('/auth/login', {
        username: username.trim(),
        password,
        role: 'admin'
      });

      if (response.success) {
        setAdminToken(response.token);
        router.replace('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid admin console credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090e] dark:bg-[#04060a] p-4 transition-colors duration-200 relative overflow-hidden">
      {/* Admin specific background design */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.06),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.05),transparent_40%)] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0f131a]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-indigo-500/5 relative z-10">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 shadow-inner">
            <Shield size={22} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-white font-sans">Admin Console</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xs">
            Sign in to manage global pipelines, deliverables, and client records.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-950/40 border border-red-900/30 rounded-2xl text-red-400 text-xs animate-fade-in shadow-sm">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Operator Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <User size={14} />
              </span>
              <input
                id="username"
                type="text"
                required
                placeholder="e.g. admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full h-11 pl-9 pr-3 bg-slate-900/50 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 transition-all hover:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock size={14} />
              </span>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full h-11 pl-9 pr-3 bg-slate-900/50 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-100 transition-all hover:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 hover:opacity-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all mt-6"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authorizing Operator...
              </>
            ) : (
              <>
                <LogIn size={14} />
                Access Console
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center flex flex-col items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft size={13} />
            Back to Public Website
          </a>

          {/* Demo credential block */}
          <div className="w-full p-3 bg-slate-900/30 border border-slate-800/80 rounded-xl text-[10px] text-slate-400 text-left leading-normal">
            <p className="font-bold mb-1 uppercase tracking-wider text-[9px] text-slate-500">Operator Access Credentials:</p>
            <p>Username: <code className="text-indigo-400 font-mono">admin</code></p>
            <p>Password: <code className="text-indigo-400 font-mono">password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
