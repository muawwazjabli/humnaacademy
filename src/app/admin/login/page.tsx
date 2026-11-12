"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password view state
  const [forgotMode, setForgotMode] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials or unauthorized account.");
        return;
      }

      router.replace(redirectPath.startsWith("/admin") ? redirectPath : "/admin/dashboard");
    } catch {
      setError("Network error. Please verify your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send reset instructions.");
        return;
      }
      setResetMessage(data.message);
    } catch {
      setError("Unable to reach authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A261E] via-[#123F32] to-[#081d16] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-stars opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Back to public site */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-cream/80 hover:text-brand-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Humna Academy</span>
          </Link>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-[11px] font-semibold border border-brand-gold/30">
            <ShieldCheck className="w-3 h-3" />
            <span>Protected Portal</span>
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-[#0b231b] rounded-3xl shadow-2xl border border-brand-gold/30 p-7 sm:p-9 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto ring-2 ring-brand-gold/50 shadow-lg bg-white">
              <Image
                src="/logo.jpg"
                alt="Humna Academy"
                width={64}
                height={64}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                {forgotMode ? "Reset Admin Password" : "Administrator Sign In"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {forgotMode
                  ? "Enter your registered administrator email to receive a password reset link."
                  : "Authorized personnel only. Protected by Firebase Authentication & RBAC."}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{resetMessage}</span>
            </div>
          )}

          {forgotMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 block">
                  Administrator Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@humnaacademy.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-deep to-brand-emerald text-white font-bold text-sm shadow-lg hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Send Password Reset Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setError(null);
                  setResetMessage(null);
                }}
                className="w-full text-center text-xs font-semibold text-brand-emerald dark:text-brand-gold hover:underline pt-1"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@humnaacademy.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-emerald-800 bg-gray-50 dark:bg-[#081d16] text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-brand-emerald focus:ring-brand-emerald"
                  />
                  <span>Keep me signed in (7 days)</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotMode(true);
                    setError(null);
                  }}
                  className="font-semibold text-brand-emerald dark:text-brand-gold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-deep to-brand-emerald text-white font-bold text-sm shadow-lg shadow-brand-emerald/25 hover:opacity-95 disabled:opacity-60 flex items-center justify-center gap-2 transition-all"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{loading ? "Signing In..." : "Sign In to Admin Panel"}</span>
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] text-brand-cream/60">
          Humna Academy Secure Administration System • Protected by Firebase Authentication
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A261E] flex items-center justify-center text-white text-sm">
          Loading login...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
