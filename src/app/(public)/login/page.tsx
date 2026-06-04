'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, AlertCircle, ArrowRight, Lock, Mail, User, Phone, Sparkles, Check } from 'lucide-react';
import { setPublicToken, getPublicToken } from '@/lib/helpers';
import apiClient from '@/lib/api-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

export default function PublicLoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  
  // Shared Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false);

  useEffect(() => {
    if (getPublicToken()) {
      setAlreadyLoggedIn(true);
    }
  }, []);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email address and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response: any = await apiClient.post('/auth/login', {
        username: email.trim(),
        password,
        role: 'public'
      });

      if (response.success) {
        setPublicToken(response.token);
        router.replace('/');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email address or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all registration fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response: any = await apiClient.post('/auth/register', {
        name: name.trim(),
        username: email.trim(),
        password,
        phoneNumber: phone.trim()
      });

      if (response.success) {
        setPublicToken(response.token);
        router.replace('/');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Choose a different email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signin') {
      handleSignIn();
    } else {
      handleRegister();
    }
  };

  const handleTabChange = (tab: 'signin' | 'register') => {
    setError('');
    setActiveTab(tab);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address to reset your password.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    toast.success(`A password reset link has been simulated to ${email.trim()}!`, {
      position: 'top-center',
      autoClose: 4000
    });
  };

  const handleGoogleLogin = () => {
    toast.info('Google OAuth checkout is simulated for this demo platform.', {
      position: 'top-center',
      autoClose: 3000
    });
  };

  if (alreadyLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#06090e]">
        <ToastContainer theme="colored" />
        <div className="w-full max-w-md bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white font-sans">You are already signed in</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
            You are authenticated on the GrowthHub platform.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full h-11 bg-gradient-to-r from-pink-600 via-violet-600 to-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
          >
            Return to Storefront
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full bg-slate-50 dark:bg-[#06090e] transition-colors duration-200">
      <ToastContainer theme="colored" />
      
      {/* Left Column: marketing/features (desktop only) */}
      <div className="hidden lg:flex lg:w-[33%] xl:w-[28%] bg-slate-900 text-white p-12 flex-col justify-center relative overflow-hidden border-r border-white/5 shrink-0">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(219,39,119,0.12),transparent_60%),radial-gradient(circle_at_50%_70%,rgba(99,102,241,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="relative z-10 space-y-8 my-auto">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase tracking-wider w-fit">
            <Sparkles size={11} className="animate-pulse" />
            Growth Platform
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl xl:text-3xl font-black leading-tight bg-gradient-to-br from-white via-slate-100 to-pink-400 bg-clip-text text-transparent font-sans">
              Accelerate Your Business
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Pay one fixed monthly amount and get all your digital tasks completed under a single dashboard.
            </p>
          </div>

          <ul className="space-y-4 pt-4 text-xs text-slate-300">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={11} className="stroke-[3]" />
              </div>
              <span className="leading-relaxed"><strong>Unlimited Requests</strong>: Websites, design assets, and copy.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={11} className="stroke-[3]" />
              </div>
              <span className="leading-relaxed"><strong>Dedicated Workspace</strong>: Track ongoing operator tasks in real-time.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={11} className="stroke-[3]" />
              </div>
              <span className="leading-relaxed"><strong>No Long-term Contracts</strong>: Flat-rate pricing. Cancel anytime.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column: auth card centering */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Glow effect on the right background to make it beautiful */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(219,39,119,0.04),transparent_50%)] pointer-events-none" />

        <div className="w-full max-w-md bg-white/60 dark:bg-[#111118]/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-pink-500/5 dark:hover:shadow-pink-500/10 relative z-10">
          
          {/* Logo only on mobile/tablet (since desktop shows it on the left) */}
          <div className="flex flex-col items-center text-center lg:hidden mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 via-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-2">
              <Sparkles size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Growth<span className="text-pink-600 dark:text-pink-400">Hub</span>
            </h2>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {activeTab === 'signin'
                ? 'Sign in to access your subscription deliverables workspace.'
                : 'Create an account to purchase a growth plan.'}
            </p>
          </div>

          {/* Dynamic Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
            <button
              type="button"
              onClick={() => handleTabChange('signin')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-md ring-1 ring-slate-200/50 dark:ring-white/5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-md ring-1 ring-slate-200/50 dark:ring-white/5'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-700 dark:text-red-400 text-xs animate-fade-in shadow-sm">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {activeTab === 'register' && (
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                    <User size={14} />
                  </span>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Amit Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full h-11 pl-9 pr-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-800 dark:text-slate-100 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                  <Mail size={14} />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full h-11 pl-9 pr-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-800 dark:text-slate-100 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                />
              </div>
            </div>

            {activeTab === 'register' && (
              <div>
                <label htmlFor="phone" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                    <Phone size={14} />
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 99999 88888"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="w-full h-11 pl-9 pr-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-800 dark:text-slate-100 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                {activeTab === 'signin' && (
                  <a
                    href="#"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-bold text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
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

            {activeTab === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                    <Lock size={14} />
                  </span>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full h-11 pl-9 pr-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-800 dark:text-slate-100 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-pink-600 via-violet-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all mt-6"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : activeTab === 'signin' ? (
                <>
                  <LogIn size={14} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800/80"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800/80"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-11 border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Secure Authentication Footer */}
          <div className="border-t border-slate-200/50 dark:border-white/5 pt-4 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1 font-sans">
              <span>🔒</span> Secure 256-bit SSL Encrypted Connection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
