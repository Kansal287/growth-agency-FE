"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api-client";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export default function PublicLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = () => {
    setError("");
    setLoading(true);
    try {
      window.location.href = `${API_BASE_URL}/auth/google`;
    } catch (err: any) {
      setError("Failed to initiate Google login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#06090e] overflow-hidden transition-colors duration-200">

      {/* Decorative Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Glassmorphic Container Card */}
        <div className="w-full bg-white/60 dark:bg-[#111118]/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 space-y-8 transition-all duration-300 hover:shadow-pink-500/5 dark:hover:shadow-pink-500/10">
          {/* Top Branding Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 group transition-transform duration-300 hover:scale-105">
              <div className="absolute inset-0 rounded-2xl bg-pink-500/20 animate-ping opacity-75 group-hover:animate-none pointer-events-none" />
              <Sparkles size={20} className="text-white relative z-10" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              Growth<span className="text-pink-600 dark:text-pink-400">Hub</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-sm">
              Your subscription-based growth dashboard. Securely connect your account to track assets and
              request services.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/30 rounded-2xl text-red-700 dark:text-red-400 text-xs animate-fade-in shadow-sm">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Centered Actions Area */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 disabled:opacity-50 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-pink-500" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Secure SSL Badge Footer */}
          <div className="border-t border-slate-200/50 dark:border-white/5 pt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-sans">
            <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
            <span>Secure 256-bit SSL Encrypted Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
