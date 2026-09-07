"use client";

import React, { useState } from "react";
import { User } from "@/types/taskflow-v2";
import { 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  Lock, 
  Building2, 
  ShieldCheck, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  User as UserIcon,
  Sparkles
} from "lucide-react";
import { loginUserAction, registerUserAction } from "@/actions/auth-actions";

interface AuthViewsProps {
  initialScreen?: "login" | "register" | "verify" | "forgot" | "reset";
  onLoginSuccess: (user: User, workspace?: any, project?: any) => void;
  onNavigate: (screen: string) => void;
}

export const AuthViews: React.FC<AuthViewsProps> = ({
  initialScreen = "login",
  onLoginSuccess,
  onNavigate
}) => {
  const [screen, setScreen] = useState<"login" | "register" | "verify" | "forgot" | "reset">(initialScreen);
  const [loading, setLoading] = useState(false);
  
  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // Register Form State
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regWorkspaceName, setRegWorkspaceName] = useState("");
  const [regError, setRegError] = useState("");
  
  // Verify State
  const [otpCode, setOtpCode] = useState(["1", "2", "3", "4", "5", "6"]);
  
  // Forgot / Reset
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!email.trim()) {
      setLoginError("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await loginUserAction(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user as User, res.workspaces?.[0]);
      } else {
        setLoginError(res.error || "Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setLoginError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regEmail.includes("@")) {
      setRegError("Please provide a valid email address.");
      return;
    }
    setScreen("verify");
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setLoading(true);

    try {
      const res = await registerUserAction({
        name: regFullName.trim() || regEmail.split("@")[0],
        email: regEmail.trim(),
        password: regPassword || "Password123!",
        workspaceName: regWorkspaceName.trim() || (regFullName.trim() ? `${regFullName.trim()}'s Workspace` : "Main Workspace"),
      });

      if (res.success && res.user) {
        onLoginSuccess(res.user as User, res.workspace, res.project);
      } else {
        setRegError(res.error || "Failed to create account.");
      }
    } catch (err: any) {
      setRegError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--canvas)] flex flex-col justify-between text-[var(--ink)]">
      {/* Top Brand Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)]">
        <div 
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-700)] flex items-center justify-center text-white font-bold text-base shadow-xs">
            T
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--ink)]">Taskly</span>
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[var(--surface-sunken)] border border-[var(--line)] text-[var(--ink-muted)]">v2.0</span>
        </div>
        <button 
          onClick={() => onNavigate("landing")}
          className="text-xs font-medium text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </button>
      </header>

      {/* Center Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-sm p-6 sm:p-8">
          
          {/* ===================== LOGIN SCREEN ===================== */}
          {screen === "login" && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Sign in to Taskly</h1>
                <p className="text-sm text-[var(--ink-muted)] mt-1.5">
                  Enter your email and password to access your workspaces.
                </p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--ink-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="bilalrauf.ds@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)] focus:ring-2 focus:ring-[var(--accent-50)] transition-all placeholder:text-[var(--ink-faint)]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider">
                      Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setScreen("forgot")}
                      className="text-xs text-[var(--accent-700)] hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--ink-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)] focus:ring-2 focus:ring-[var(--accent-50)] transition-all placeholder:text-[var(--ink-faint)]"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[var(--accent-700)] rounded border-[var(--line-strong)] focus:ring-[var(--accent-600)]"
                  />
                  <label htmlFor="remember" className="ml-2 text-xs text-[var(--ink-muted)]">
                    Keep me signed in for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[40px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all focus:outline-none disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Platform Admin Credentials Quick Fill Box */}
              <div className="mt-6 pt-5 border-t border-[var(--line)]">
                <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--ink)] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[var(--accent-700)]" />
                      Platform Administrator
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail("bilalrauf.ds@gmail.com");
                        setPassword("Admin@12345");
                      }}
                      className="px-2 py-0.5 rounded bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white text-[10px] font-bold transition-colors shadow-xs"
                    >
                      Fill Admin ID
                    </button>
                  </div>
                  <div className="text-[11px] text-[var(--ink-body)] space-y-0.5 font-mono bg-white/70 p-2 rounded-lg border border-orange-100">
                    <div>Email: <strong className="text-[var(--ink)]">bilalrauf.ds@gmail.com</strong></div>
                    <div>Pass: <strong className="text-[var(--ink)]">Admin@12345</strong></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-[var(--ink-muted)]">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setScreen("register")}
                  className="text-[var(--accent-700)] font-semibold hover:underline"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}

          {/* ===================== REGISTER SCREEN ===================== */}
          {screen === "register" && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Create an account</h1>
                <p className="text-sm text-[var(--ink-muted)] mt-1.5">
                  Sign up to start organizing projects and tasks with your team.
                </p>
              </div>

              {regError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[var(--ink-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)] transition-all placeholder:text-[var(--ink-faint)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[var(--ink-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)] transition-all placeholder:text-[var(--ink-faint)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Workspace Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[var(--ink-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regWorkspaceName}
                      onChange={(e) => setRegWorkspaceName(e.target.value)}
                      placeholder="e.g. Nova Studio"
                      className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)] transition-all placeholder:text-[var(--ink-faint)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[var(--ink-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)] transition-all placeholder:text-[var(--ink-faint)]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-[40px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    Continue to Email Verification
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-[var(--ink-muted)]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setScreen("login")}
                  className="text-[var(--accent-700)] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* ===================== VERIFY EMAIL SCREEN ===================== */}
          {screen === "verify" && (
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--accent-700)]">
                <Mail className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Verify your work email</h1>
              <p className="text-sm text-[var(--ink-muted)] mt-2">
                We sent a 6-digit confirmation code to{" "}
                <span className="font-semibold text-[var(--ink)]">{regEmail || "user@company.com"}</span>.
              </p>

              {regError && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleVerifySubmit} className="mt-6 space-y-5">
                <div className="flex justify-center gap-2">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-11 h-12 text-center text-lg font-bold bg-[var(--surface-sunken)] border border-[var(--line-strong)] rounded-lg focus:outline-none focus:border-[var(--accent-600)] focus:bg-[var(--surface)] text-[var(--ink)]"
                    />
                  ))}
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                  <span>Confirmation code: <strong>123456</strong></span>
                  <button
                    type="button"
                    onClick={() => setOtpCode(["1", "2", "3", "4", "5", "6"])}
                    className="font-bold underline text-amber-900 hover:text-black"
                  >
                    Auto-Fill 123456
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[40px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account &amp; Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Continue Setup</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-xs text-[var(--ink-muted)]">
                  Didn&apos;t receive code?{" "}
                  <button 
                    type="button" 
                    onClick={() => setOtpCode(["1", "2", "3", "4", "5", "6"])}
                    className="text-[var(--accent-700)] font-semibold hover:underline"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===================== FORGOT PASSWORD ===================== */}
          {screen === "forgot" && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Reset password</h1>
                <p className="text-sm text-[var(--ink-muted)] mt-1.5">
                  Enter your email address to receive password reset instructions.
                </p>
              </div>

              {forgotSent ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--ink)]">Check your inbox</h2>
                    <p className="text-xs text-[var(--ink-muted)] mt-1">
                      We sent recovery instructions to <strong>{forgotEmail}</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreen("login")}
                    className="text-xs text-[var(--accent-700)] font-semibold hover:underline"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotSent(true);
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="bilalrauf.ds@gmail.com"
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[38px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all"
                  >
                    Send Recovery Link
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setScreen("login")}
                  className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}

          {/* ===================== RESET PASSWORD ===================== */}
          {screen === "reset" && (
            <div>
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Reset your password</h1>
                <p className="text-sm text-[var(--ink-muted)] mt-1.5">
                  Enter a secure new password for your account.
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Password reset successfully. Please sign in.");
                  setScreen("login");
                }} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--ink-body)] uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent-600)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-[38px] px-4 bg-[var(--accent-700)] hover:bg-[var(--accent-800)] text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  Save New Password &amp; Sign In
                </button>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[var(--ink-muted)] border-t border-[var(--line)] bg-[var(--surface)]">
        Taskly Work Management System &copy; 2026. Built with Warm Stone aesthetic and production database persistence.
      </footer>
    </div>
  );
};
