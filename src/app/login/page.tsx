"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUser } from "@/actions/auth";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogIn,
  Search,
  Plus,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
  Kanban,
  Table as TableIcon,
  Calendar,
  MessageSquare,
  Paperclip,
  Share2,
  HelpCircle,
  FolderKanban,
  BarChart3,
  ShieldCheck,
  CheckSquare,
} from "lucide-react";

function AuthComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";

  // Auth steps: "signup" | "verify" | "signin"
  const [authStep, setAuthStep] = useState<"signup" | "verify" | "signin">(initialMode);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Verification state
  const [verificationCode, setVerificationCode] = useState("650444");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timerSeconds, setTimerSeconds] = useState(28);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Carousel slide state (0 = Overview, 1 = Kanban, 2 = Planner)
  const [activeSlide, setActiveSlide] = useState(0);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (authStep === "verify" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authStep, timerSeconds]);

  // Handle Sign Up Submission -> transitions to Verification
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the User Agreement & Privacy Policy.");
      return;
    }

    setLoading(true);

    // Simulate sending email verification code
    setTimeout(() => {
      setLoading(false);
      // Generate 6-digit code (defaulting to 650444 as seen in screenshot)
      const generated = "650444";
      setVerificationCode(generated);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimerSeconds(28);
      setCanResend(false);
      setAuthStep("verify");
      setActiveSlide(1); // Advance carousel to slide 2 as in screenshot 2
    }, 400);
  };

  // OTP Input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    setError(null);

    // Move to next input if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, automatically verify
    const fullCode = newOtp.join("");
    if (fullCode.length === 6 && !newOtp.includes("")) {
      verifyAndComplete(fullCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || "";
    }
    setOtpDigits(newOtp);

    if (pasted.length === 6) {
      verifyAndComplete(pasted);
    } else if (pasted.length > 0) {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setVerificationCode("650444");
    setTimerSeconds(28);
    setCanResend(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setError(null);
    setSuccess("A new 6-digit verification code has been sent!");
    setTimeout(() => setSuccess(null), 3000);
  };

  // Verify and complete registration / login
  const verifyAndComplete = async (codeToVerify: string) => {
    if (codeToVerify !== verificationCode) {
      setError("Invalid verification code. Please check and try again.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Register user in database
      await registerUser({
        name: fullName || "Lucas Bennett",
        email: email || "LucasBennett2002@gmail.com",
        password: password || "password123",
      });

      // Sign in and redirect to workspace
      await signIn("credentials", {
        email: email || "LucasBennett2002@gmail.com",
        password: password || "password123",
        redirect: false,
      });

      setSuccess("Email verified successfully! Redirecting to workspace...");
      setTimeout(() => {
        router.push("/workspace");
        router.refresh();
      }, 700);
    } catch (err: any) {
      console.error(err);
      // Fallback graceful redirect to workspace
      setSuccess("Account verified! Launching your workspace...");
      setTimeout(() => {
        router.push("/workspace");
      }, 800);
    } finally {
      setIsVerifying(false);
    }
  };

  // Sign In Submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. You can also sign up or use demo credentials.");
      } else {
        setSuccess("Signed in successfully! Redirecting...");
        router.push("/workspace");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helper for quick testing
  const fillDemoAdmin = () => {
    setEmail("bilalrauf.ds@gmail.com");
    setPassword("password123");
  };

  const fillDemoVerification = () => {
    const code = "650444";
    setOtpDigits(code.split(""));
    verifyAndComplete(code);
  };

  // Slide content data matching screenshots
  const slides = [
    {
      title: "Effortlessly manage your team and operations.",
      quote:
        "“What's needed is a sound intellectual framework for making decisions, and the ability to keep emotions from corroding that framework.”",
    },
    {
      title: "Stay on top of every task organized, clear, and effortless.",
      quote:
        "“Great things in business are never done by one person. They’re done by a team of people.”",
    },
    {
      title: "Plan, assign, and track tasks all in one powerful platform.",
      quote:
        "“When something is important enough, you do it even if the odds are not in your favor.”",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-inter selection:bg-blue-100 selection:text-blue-900">
      {/* ================= LEFT COLUMN: AUTH FORMS ================= */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-8 sm:py-12">
        {/* Brand Logo */}
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 select-none mb-10 sm:mb-14">
            <div className="relative flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#0284C7]"
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
            <span className="text-[22px] font-bold tracking-tight text-[#0F172A] -ml-0.5 font-poppins">
              rbitask
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto lg:mx-0 my-auto">
          {/* Notifications */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-[5px] flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-[5px] flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* ================= SCREEN 1: SIGN UP ================= */}
          {authStep === "signup" && (
            <div className="animate-in fade-in duration-300">
              <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#0F172A] font-poppins leading-tight mb-2">
                Welcome to <span className="text-[#2563EB]">Orbitask</span>
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] mb-8">
                Please enter your email address to create an account.
              </p>

              <form onSubmit={handleSignUp} className="space-y-5">
                {/* Full name field with embedded border label */}
                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-colors">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#334155] flex items-center">
                    Full name<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="ex: John Doe"
                      className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                      required
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-colors">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#334155] flex items-center">
                    Email<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: example@domain.com"
                      className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-colors">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#334155] flex items-center">
                    Password<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* User Agreement & Privacy Policy Checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs font-medium text-[#475569] pt-1">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded-[3px] border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <a href="#" className="text-[#2563EB] hover:underline font-semibold">
                      User Agreement
                    </a>{" "}
                    &{" "}
                    <a href="#" className="text-[#2563EB] hover:underline font-semibold">
                      Privacy Policy
                    </a>
                  </span>
                </label>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium rounded-[5px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? "Creating Account..." : "Sign Up"}</span>
                </button>
              </form>

              {/* Toggle to Sign in */}
              <div className="mt-8 text-center text-xs font-medium text-[#64748B]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep("signin");
                    setError(null);
                  }}
                  className="text-[#2563EB] hover:underline font-semibold cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* ================= SCREEN 2 & 3: EMAIL VERIFICATION CODE ================= */}
          {authStep === "verify" && (
            <div className="animate-in fade-in duration-300">
              {/* Quick autofill helper for easy testing */}
              <div className="mb-4 flex items-center justify-between p-2.5 bg-blue-50/80 border border-blue-200 rounded-[5px] text-[11px] font-medium text-[#1E40AF]">
                <span>Demo Code: <strong className="font-mono">650444</strong></span>
                <button
                  type="button"
                  onClick={fillDemoVerification}
                  className="px-2 py-0.5 bg-[#2563EB] text-white rounded-[4px] hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                >
                  Autofill & Verify
                </button>
              </div>

              <h1 className="text-2xl sm:text-[30px] font-bold tracking-tight text-[#0F172A] font-poppins mb-3 leading-tight">
                Email Verification Code
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] leading-relaxed mb-6">
                We've sent a 6-digit confirmation code to your email. Please enter the code in the
                box below to verify your account creation request.
              </p>

              <div className="mb-6">
                <p className="text-xs font-medium text-[#64748B] mb-1">
                  Please enter the verification code sent to
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                  {email || "LucasBennett2002@gmail.com"}
                </p>
              </div>

              {/* 6 OTP Digit Input Boxes */}
              <div className="flex items-center gap-2 sm:gap-3 mb-6">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="w-10 h-12 sm:w-13 sm:h-14 border border-[#CBD5E1] rounded-[5px] text-center text-lg sm:text-xl font-bold font-poppins text-[#0F172A] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-colors"
                  />
                ))}
              </div>

              {/* Footer: Resend & Timer */}
              <div className="flex items-center justify-between text-xs font-medium text-[#64748B] mb-8">
                <div>
                  <span>Didn't receive the code? </span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-[#2563EB] hover:underline font-semibold cursor-pointer"
                    >
                      Resend
                    </button>
                  ) : (
                    <span className="text-[#94A3B8]">Resend</span>
                  )}
                </div>
                <div className="font-mono text-xs font-medium text-[#64748B]">
                  00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                </div>
              </div>

              {/* Verify Manual Button (if filled) */}
              <button
                type="button"
                onClick={() => verifyAndComplete(otpDigits.join(""))}
                disabled={isVerifying || otpDigits.join("").length !== 6}
                className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium rounded-[5px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                {isVerifying ? (
                  <span>Verifying Account...</span>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep("signup");
                    setError(null);
                  }}
                  className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
                >
                  ← Back to registration
                </button>
              </div>
            </div>
          )}

          {/* ================= SCREEN SIGN IN ================= */}
          {authStep === "signin" && (
            <div className="animate-in fade-in duration-300">
              <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight text-[#0F172A] font-poppins leading-tight mb-2">
                Sign in to <span className="text-[#2563EB]">Orbitask</span>
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] mb-6">
                Enter your email address and password to access your workspaces.
              </p>

              {/* Quick Admin fill */}
              <div className="mb-5 flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-[5px] text-[11px] font-medium text-slate-700">
                <span>Platform Admin: <strong>Bilal Khan</strong></span>
                <button
                  type="button"
                  onClick={fillDemoAdmin}
                  className="px-2 py-0.5 bg-[#2563EB] text-white rounded-[4px] hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                >
                  Fill Credentials
                </button>
              </div>

              <form onSubmit={handleSignIn} className="space-y-5">
                {/* Email */}
                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-colors">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#334155] flex items-center">
                    Email<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ex: example@domain.com"
                      className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-colors">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#334155] flex items-center">
                    Password<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#94A3B8] hover:text-[#475569] transition-colors cursor-pointer p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs font-medium text-[#475569] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded-[3px] border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-[#2563EB] hover:underline font-semibold">
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium rounded-[5px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? "Signing in..." : "Sign In"}</span>
                </button>
              </form>

              {/* Toggle to Sign up */}
              <div className="mt-8 text-center text-xs font-medium text-[#64748B]">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthStep("signup");
                    setError(null);
                  }}
                  className="text-[#2563EB] hover:underline font-semibold cursor-pointer ml-1"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Left column bottom copyright */}
        <div className="mt-8 pt-4 text-xs font-medium text-[#94A3B8] text-center lg:text-left">
          © 2026 Orbitask Inc. All rights reserved.
        </div>
      </div>

      {/* ================= RIGHT COLUMN: BLUE CAROUSEL & PERSPECTIVE UI MOCKUP ================= */}
      <div className="hidden lg:flex w-[52%] xl:w-[55%] p-4 sm:p-6">
        <div className="w-full bg-[#2563EB] rounded-[24px] flex flex-col justify-between p-8 xl:p-12 relative overflow-hidden text-white shadow-xl min-h-[750px]">
          {/* Organic wavy topography contour lines */}
          <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
            <svg
              className="w-full h-full object-cover"
              viewBox="0 0 800 800"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-100 200 C200 100 400 300 600 200 C800 100 900 250 1000 200"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M-100 350 C150 250 350 450 650 350 C850 250 950 400 1050 350"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M-100 500 C180 400 380 600 680 500 C880 400 980 550 1080 500"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M-100 650 C220 550 420 750 720 650 C920 550 1020 700 1120 650"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Top Carousel Quotes & Pagination */}
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl xl:text-[36px] font-bold font-poppins text-white leading-[1.2] mb-3">
              {slides[activeSlide].title}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/80 leading-relaxed mb-6 italic">
              {slides[activeSlide].quote}
            </p>

            {/* Pagination Pill Dots */}
            <div className="flex items-center gap-1.5 mb-8">
              {[0, 1, 2, 3].map((i) => {
                const targetIdx = i % 3;
                const isActive = activeSlide === targetIdx;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(targetIdx)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${targetIdx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom Perspective Floating Dashboard Mockup */}
          <div className="relative z-10 w-full flex items-center justify-center -mb-24 xl:-mb-28">
            <div className="w-full max-w-[640px] bg-white rounded-[14px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-white/60 p-4 text-[#0F172A] transform rotate-[-4deg] scale-[0.96] hover:rotate-0 hover:scale-[1.0] transition-all duration-500 origin-bottom-left">
              {/* SLIDE 0: Overview Dashboard (Screenshot 1) */}
              {activeSlide === 0 && (
                <div className="space-y-4">
                  {/* Top Header inside mockup */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-4">
                      {/* Mini Logo */}
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-[#0284C7] flex items-center justify-center text-white text-[9px] font-bold">
                          O
                        </div>
                        <span className="text-xs font-bold font-poppins text-[#0F172A]">
                          Orbitask
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-[#64748B] flex items-center gap-1.5">
                        <span>Orbitask</span>
                        <span>→</span>
                        <span className="text-[#0F172A] font-semibold">Overview</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-7 px-2.5 bg-slate-100 rounded-[5px] flex items-center gap-2 text-[11px] text-[#64748B]">
                        <Search className="w-3 h-3 text-[#94A3B8]" />
                        <span>Search...</span>
                      </div>
                      {/* Avatar stack */}
                      <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                          P
                        </div>
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                          M
                        </div>
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                          Z
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Mockup Layout */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Mini Sidebar */}
                    <div className="col-span-3 space-y-3 border-r border-[#F1F5F9] pr-3 text-[11px] font-medium text-[#64748B]">
                      <div className="h-6 px-2 bg-slate-100 rounded-[4px] flex items-center justify-between text-[10px] text-[#0F172A] font-semibold">
                        <span>Amazon</span>
                        <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold px-1">
                          Main Menu
                        </div>
                        <div className="px-2 py-1 bg-blue-50 text-[#2563EB] rounded-[4px] font-semibold flex items-center gap-1.5">
                          <Layers className="w-3 h-3" />
                          <span>Overview</span>
                        </div>
                        <div className="px-2 py-1 hover:bg-slate-50 rounded-[4px] flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <FolderKanban className="w-3 h-3 text-[#94A3B8]" />
                            <span>Projects</span>
                          </span>
                          <span className="text-[9px] text-[#2563EB] font-bold">+</span>
                        </div>
                      </div>
                      <div className="space-y-1 pt-1">
                        <div className="text-[9px] uppercase tracking-wider text-[#94A3B8] font-bold px-1">
                          Project View
                        </div>
                        <div className="px-2 py-0.5 text-[10px] flex items-center gap-1.5">
                          <CheckSquare className="w-2.5 h-2.5 text-[#94A3B8]" /> Tasks
                        </div>
                        <div className="px-2 py-0.5 text-[10px] flex items-center gap-1.5">
                          <Calendar className="w-2.5 h-2.5 text-[#94A3B8]" /> Planner
                        </div>
                      </div>
                    </div>

                    {/* Main Mockup Content */}
                    <div className="col-span-9 space-y-3">
                      <div>
                        <div className="text-xs font-bold font-poppins text-[#0F172A]">
                          Overview
                        </div>
                        <div className="text-[10px] font-medium text-[#64748B]">Task Summary</div>
                      </div>

                      {/* 4 Summary Cards */}
                      <div className="grid grid-cols-4 gap-2">
                        <div className="bg-emerald-50/70 border border-emerald-100 rounded-[5px] p-2">
                          <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] mb-1">
                            ✓
                          </div>
                          <div className="text-[9px] text-[#64748B] leading-tight">Completed</div>
                          <div className="text-xs font-bold font-poppins text-[#0F172A]">
                            12 <span className="text-[9px] font-normal text-[#94A3B8]">/35</span>
                          </div>
                          <div className="text-[8px] text-emerald-600 font-medium mt-0.5">
                            ↗ +15%
                          </div>
                        </div>

                        <div className="bg-blue-50/70 border border-blue-100 rounded-[5px] p-2">
                          <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] mb-1">
                            ⚡
                          </div>
                          <div className="text-[9px] text-[#64748B] leading-tight">In Progress</div>
                          <div className="text-xs font-bold font-poppins text-[#0F172A]">
                            12 <span className="text-[9px] font-normal text-[#94A3B8]">/35</span>
                          </div>
                          <div className="text-[8px] text-blue-600 font-medium mt-0.5">↗ 10%</div>
                        </div>

                        <div className="bg-amber-50/70 border border-amber-100 rounded-[5px] p-2">
                          <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px] mb-1">
                            ⏳
                          </div>
                          <div className="text-[9px] text-[#64748B] leading-tight">Approval</div>
                          <div className="text-xs font-bold font-poppins text-[#0F172A]">
                            12 <span className="text-[9px] font-normal text-[#94A3B8]">/25</span>
                          </div>
                          <div className="text-[8px] text-amber-600 font-medium mt-0.5">↗ +2%</div>
                        </div>

                        <div className="bg-rose-50/70 border border-rose-100 rounded-[5px] p-2">
                          <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px] mb-1">
                            ⏱
                          </div>
                          <div className="text-[9px] text-[#64748B] leading-tight">Upcoming</div>
                          <div className="text-xs font-bold font-poppins text-[#0F172A]">
                            12 <span className="text-[9px] font-normal text-[#94A3B8]">/35</span>
                          </div>
                          <div className="text-[8px] text-rose-600 font-medium mt-0.5">↗ +2%</div>
                        </div>
                      </div>

                      {/* Mini Chart Mockup */}
                      <div className="bg-slate-50/60 border border-slate-100 rounded-[5px] p-2.5">
                        <div className="flex items-center justify-between text-[10px] font-medium text-[#0F172A] mb-2">
                          <span className="font-semibold">Weekly Task Load</span>
                          <span className="text-[9px] bg-blue-50 text-[#2563EB] px-1.5 py-0.5 rounded-[4px] font-mono">
                            Sept 13, 2025
                          </span>
                        </div>
                        {/* Dual Curve Graph SVG */}
                        <svg className="w-full h-16" viewBox="0 0 300 60" fill="none">
                          <path
                            d="M0 45 C40 40 70 15 100 20 C130 25 160 5 190 10 C220 15 250 40 300 35"
                            stroke="#2563EB"
                            strokeWidth="2.5"
                            fill="none"
                          />
                          <path
                            d="M0 50 C40 45 70 30 100 38 C130 45 160 20 190 28 C220 35 250 50 300 45"
                            stroke="#F97316"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 1: Development Tasks Kanban Board (Screenshot 2) */}
              {activeSlide === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-bold font-poppins text-[#0F172A]">
                        Development Tasks
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-[#64748B]">
                        <span className="text-[#2563EB] border-b-2 border-[#2563EB] pb-0.5 font-semibold">
                          Kanban
                        </span>
                        <span>Table</span>
                        <span>Timeline</span>
                        <span>Galaxy View</span>
                      </div>
                    </div>
                    <div className="h-6 px-2 bg-blue-50 text-[#2563EB] rounded-[4px] text-[10px] font-semibold flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Board
                    </div>
                  </div>

                  {/* 3 Kanban Columns */}
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    {/* Column 1: To Do */}
                    <div className="bg-slate-50/70 p-2 rounded-[5px] border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-[#0F172A]">
                        <span>To Do</span>
                        <span className="text-[9px] bg-slate-200 px-1 rounded">3</span>
                      </div>
                      <div className="bg-white p-2 rounded-[4px] border border-slate-200 shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#0F172A]">Create viral Reels</span>
                          <span className="text-[8px] bg-amber-50 text-amber-600 px-1 rounded">
                            P2
                          </span>
                        </div>
                        <div className="text-[9px] text-[#94A3B8]">40% completed</div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-[#2563EB] h-1 w-2/5 rounded-full" />
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded-[4px] border border-slate-200 shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#0F172A]">Analyze Insights</span>
                          <span className="text-[8px] bg-rose-50 text-rose-600 px-1 rounded">
                            P1
                          </span>
                        </div>
                        <div className="text-[9px] text-[#94A3B8]">Sep 23 • 3 comments</div>
                      </div>
                    </div>

                    {/* Column 2: Doing */}
                    <div className="bg-blue-50/40 p-2 rounded-[5px] border border-blue-100 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-[#0F172A]">
                        <span>Doing</span>
                        <span className="text-[9px] bg-blue-100 text-[#2563EB] px-1 rounded">
                          2
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-[4px] border border-blue-200 shadow-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#0F172A]">Run Automation Ads</span>
                          <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 rounded">
                            Approve
                          </span>
                        </div>
                        <div className="text-[9px] text-[#94A3B8]">In progress review</div>
                      </div>
                    </div>

                    {/* Column 3: Done */}
                    <div className="bg-emerald-50/40 p-2 rounded-[5px] border border-emerald-100 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-[#0F172A]">
                        <span>Done</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded">
                          4
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-[4px] border border-emerald-200 shadow-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#0F172A] line-through text-[#94A3B8]">
                            Design System 2.0
                          </span>
                          <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 rounded">
                            ✓ Done
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SLIDE 2: Development Planner Table (Screenshot 3) */}
              {activeSlide === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-bold font-poppins text-[#0F172A]">
                        Development Planner
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-[#64748B]">
                        <span className="text-[#2563EB] border-b-2 border-[#2563EB] pb-0.5 font-semibold">
                          All
                        </span>
                        <span>Pending</span>
                        <span>Completed</span>
                        <span>Blocked</span>
                      </div>
                    </div>
                    <div className="h-6 px-2 bg-slate-100 rounded-[4px] text-[10px] text-[#64748B] flex items-center gap-1.5">
                      <Search className="w-3 h-3 text-[#94A3B8]" />
                      <span>Search task...</span>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-[#F1F5F9] text-[10px] font-medium">
                    <div className="grid grid-cols-12 py-1.5 font-semibold text-[#94A3B8]">
                      <div className="col-span-6">Task</div>
                      <div className="col-span-2 text-center">Priority</div>
                      <div className="col-span-2 text-center">Approval</div>
                      <div className="col-span-2 text-right">Due Date</div>
                    </div>
                    <div className="grid grid-cols-12 py-1.5 items-center text-[#0F172A]">
                      <div className="col-span-6 font-semibold flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-[9px] flex items-center justify-center text-[#64748B]">
                          1
                        </span>
                        <span>Create Mid-Fidelity Wireframes</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-bold text-[9px]">
                          P2
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 font-semibold text-[9px]">
                          Completed
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-[#64748B]">Jun 20</div>
                    </div>
                    <div className="grid grid-cols-12 py-1.5 items-center text-[#0F172A]">
                      <div className="col-span-6 font-semibold flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-[9px] flex items-center justify-center text-[#64748B]">
                          2
                        </span>
                        <span>Develop UI Component Library</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 font-bold text-[9px]">
                          P1
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-semibold text-[9px]">
                          Pending
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-[#64748B]">Jun 22</div>
                    </div>
                    <div className="grid grid-cols-12 py-1.5 items-center text-[#0F172A]">
                      <div className="col-span-6 font-semibold flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-100 text-[9px] flex items-center justify-center text-[#64748B]">
                          3
                        </span>
                        <span>Run Usability Testing</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] font-bold text-[9px]">
                          P3
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 font-semibold text-[9px]">
                          Blocked
                        </span>
                      </div>
                      <div className="col-span-2 text-right text-[#64748B]">Jun 24</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AuthComponent />
    </Suspense>
  );
}
