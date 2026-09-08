"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/auth";
import { Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("bilalrauf.ds@gmail.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegister) {
        const res = await registerUser({ name, email, password });
        if (!res.success) {
          setError(res.error || "Failed to register");
          setLoading(false);
          return;
        }

        setSuccess("Account created successfully! Signing in...");
        // Automatically sign in after register
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          setError("Account created, but could not auto-sign in. Please log in.");
          setIsRegister(false);
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          setError("Invalid email or password");
        } else {
          router.push("/");
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo & Name */}
        <div className="flex items-center justify-center gap-1.5 select-none mb-6">
          <div className="relative flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#0284C7]"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="18" cy="18" r="6" fill="#0284C7" />
              <ellipse
                cx="18"
                cy="18"
                rx="14"
                ry="5.5"
                stroke="#0284C7"
                strokeWidth="2.4"
                strokeLinecap="round"
                transform="rotate(-38 18 18)"
              />
              <ellipse
                cx="18"
                cy="18"
                rx="14"
                ry="5.5"
                stroke="#38BDF8"
                strokeWidth="2.4"
                strokeDasharray="20 40"
                strokeLinecap="round"
                transform="rotate(-38 18 18)"
              />
            </svg>
          </div>
          <span className="text-[26px] font-bold tracking-tight text-[#0F172A] -ml-0.5 font-poppins">
            rbitask
          </span>
        </div>

        <h2 className="text-center text-xl font-bold text-[#0F172A] font-poppins">
          {isRegister ? "Create your account" : "Sign in to your workspace"}
        </h2>
        <p className="mt-2 text-center text-xs font-medium text-[#64748B]">
          {isRegister ? "Already have an account?" : "Don't have an account yet?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
              setSuccess(null);
            }}
            className="text-[#2563EB] hover:underline font-semibold cursor-pointer"
          >
            {isRegister ? "Sign In" : "Register now"}
          </button>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E2E8F0] rounded-[5px] sm:px-10 space-y-6">
          {/* Error / Success Notifications */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-[5px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-[5px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Bilal Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 pl-9 pr-3.5 border border-[#CBD5E1] rounded-[5px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-9 pr-3.5 border border-[#CBD5E1] rounded-[5px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-9 pr-3.5 border border-[#CBD5E1] rounded-[5px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-medium rounded-[5px] flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{isRegister ? "Create Account" : "Sign In"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="pt-4 border-t border-[#F1F5F9] text-center">
            <span className="text-[11px] text-[#94A3B8]">
              Platform Administrator: <strong>bilalrauf.ds@gmail.com</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
