'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle, ArrowLeft, Lock, User, Sparkles } from 'lucide-react';
import { setClientToken, getClientToken } from '@/lib/helpers';
import apiClient from '@/lib/api-client';

export default function ClientLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getClientToken()) {
      router.replace('/client/dashboard');
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
        role: 'client'
      });

      if (response.success) {
        setClientToken(response.token);
        router.replace('/client/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid client portal credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b12] p-4 transition-colors duration-200 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(219,39,119,0.04),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.04),transparent_40%)] pointer-events-none" />

      <div className="w-full max-w-md bg-white/60 dark:bg-[#111118]/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-pink-500/5 dark:hover:shadow-pink-500/10 relative z-10">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-3 shadow-inner">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans">Client Workspace</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed max-w-xs">
            Log in to view active subscription deliverables and campaigns.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-700 dark:text-red-400 text-xs animate-fade-in shadow-sm">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="username" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Client Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                <User size={14} />
              </span>
              <input
                id="username"
                type="text"
                required
                placeholder="e.g. client"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full h-11 pl-9 pr-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-800 dark:text-slate-100 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
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
                className="w-full h-11 pl-9 pr-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-800 dark:text-slate-100 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-pink-600 via-violet-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all mt-6"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Accessing Workspace...
              </>
            ) : (
              <>
                <LogIn size={14} />
                Access Portal
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 text-center flex flex-col items-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
          >
            <ArrowLeft size={13} />
            Back to Public Website
          </a>

          {/* Demo credential block */}
          <div className="w-full p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-white/5 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 text-left leading-normal">
            <p className="font-bold mb-1 uppercase tracking-wider text-[9px] text-slate-400">Demo Credentials:</p>
            <p>Username: <code className="text-pink-600 font-mono">client</code></p>
            <p>Password: <code className="text-pink-600 font-mono">password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
