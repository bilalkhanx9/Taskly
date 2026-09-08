"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerUser, sendOtpAction } from "@/actions/auth";
import { createWorkspace } from "@/actions/workspace";
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
  ArrowLeft,
  LogIn,
  Search,
  Plus,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
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

  // Auth & Onboarding steps:
  // "signup" | "verify" | "signin" | "onboarding-1" | "onboarding-2" | "onboarding-3"
  const [authStep, setAuthStep] = useState<
    "signup" | "verify" | "signin" | "onboarding-1" | "onboarding-2" | "onboarding-3"
  >(initialMode);

  // Sign up Form state
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

  // Onboarding Step 1 state
  const [workspaceName, setWorkspaceName] = useState("Orbitask Team");
  const [workspaceUrl, setWorkspaceUrl] = useState("orbitask-team");
  const [workspaceDesc, setWorkspaceDesc] = useState("A workspace for managing Orbitask projects");
  const [workspaceLogo, setWorkspaceLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Onboarding Step 2 state
  const [workType, setWorkType] = useState("Brand Strategy & Positioning");
  const [currentFocus, setCurrentFocus] = useState("Creating an Email Marketing Workflow");
  const [openWorkTypeDropdown, setOpenWorkTypeDropdown] = useState(false);
  const [openFocusDropdown, setOpenFocusDropdown] = useState(false);

  // Onboarding Step 3 state
  const [industry, setIndustry] = useState("E-Commerce & Retail");
  const [teamSize, setTeamSize] = useState("");
  const [openIndustryDropdown, setOpenIndustryDropdown] = useState(false);
  const [openTeamSizeDropdown, setOpenTeamSizeDropdown] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Carousel slide state:
  // 0 = Overview Dashboard (Screenshot 2 of Onboarding)
  // 1 = Kanban Board (Screenshot 3 of Onboarding)
  // 2 = Planner Table
  // 3 = Galaxy View (Screenshot 1 of Onboarding)
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

  // Ensure all dropdowns are strictly closed whenever authStep changes
  useEffect(() => {
    setOpenWorkTypeDropdown(false);
    setOpenFocusDropdown(false);
    setOpenIndustryDropdown(false);
    setOpenTeamSizeDropdown(false);
  }, [authStep]);

  // Handle Sign Up Submission -> sends real OTP via Resend & transitions to Verification
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

    try {
      // Send real OTP email via Resend
      const otpRes = await sendOtpAction({ email, name: fullName });
      setVerificationCode(otpRes.code);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimerSeconds(28);
      setCanResend(false);
      setAuthStep("verify");
      setActiveSlide(1); // Advance carousel to slide 2 as in screenshot 2

      if (otpRes.isEmailSent) {
        setSuccess(`Verification code sent to ${email}! Please check your inbox.`);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to dispatch verification code. Please try again.");
    } finally {
      setLoading(false);
    }
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

  const handleResend = async () => {
    if (!canResend) return;
    setError(null);
    try {
      const otpRes = await sendOtpAction({ email, name: fullName });
      setVerificationCode(otpRes.code);
      setTimerSeconds(28);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);
      if (otpRes.isEmailSent) {
        setSuccess(`A new 6-digit verification code has been sent to ${email}!`);
      } else {
        setSuccess("A new 6-digit verification code has been generated!");
      }
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError("Failed to resend code. Please try again.");
    }
  };

  // Verify and complete registration -> transitions to Onboarding Step 1
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

      // Sign in and establish session
      await signIn("credentials", {
        email: email || "LucasBennett2002@gmail.com",
        password: password || "password123",
        redirect: false,
      });

      // Transition to Onboarding Step 1: Create a new workspace!
      setSuccess("Email verified successfully!");
      setTimeout(() => {
        setSuccess(null);
        setAuthStep("onboarding-1");
        setActiveSlide(3); // Galaxy View matching Screenshot 1
      }, 500);
    } catch (err: any) {
      console.error(err);
      // Fallback graceful transition to onboarding
      setAuthStep("onboarding-1");
      setActiveSlide(3);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Logo Upload in Step 1
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setWorkspaceLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1 -> Step 2
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenWorkTypeDropdown(false);
    setOpenFocusDropdown(false);
    setAuthStep("onboarding-2");
    setActiveSlide(0); // Overview slide matching Screenshot 2
  };

  // Step 2 -> Step 3
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenIndustryDropdown(false);
    setOpenTeamSizeDropdown(false);
    setAuthStep("onboarding-3");
    setActiveSlide(1); // Kanban slide matching Screenshot 3
  };

  // Final Step Finish & Launch
  const handleFinishOnboarding = async () => {
    try {
      if (workspaceName.trim()) {
        await createWorkspace(workspaceName.trim());
      }
    } catch (err) {
      console.error("Workspace save notice:", err);
    }
    router.push("/workspace");
    router.refresh();
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
    setOtpDigits(verificationCode.split(""));
    verifyAndComplete(verificationCode);
  };

  // 4 Carousel Slides data matching screenshots
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
    {
      title: "See every task’s priority and status at a glance with the Galaxy View.",
      quote:
        "“It takes 20 years to build a reputation and five minutes to ruin it. If you think about that, you'll do things differently.”",
    },
  ];

  const isOnboarding =
    authStep === "onboarding-1" || authStep === "onboarding-2" || authStep === "onboarding-3";

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-inter selection:bg-blue-100 selection:text-blue-900">
      {/* ================= LEFT COLUMN: AUTH & ONBOARDING FORMS ================= */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-8 sm:py-12">
        {/* Top Bar (Brand Logo or Onboarding Top Bar) */}
        <div>
          {!isOnboarding ? (
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
          ) : (
            <div className="flex items-center justify-between mb-8 sm:mb-10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (authStep === "onboarding-3") {
                      setAuthStep("onboarding-2");
                      setActiveSlide(0);
                    } else if (authStep === "onboarding-2") {
                      setAuthStep("onboarding-1");
                      setActiveSlide(3);
                    } else if (authStep === "onboarding-1") {
                      setAuthStep("verify");
                      setActiveSlide(1);
                    }
                  }}
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors p-1 cursor-pointer"
                  title="Go back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <Link href="/" className="inline-flex items-center gap-1.5 select-none">
                  <div className="relative flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-[#0284C7]"
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
                  <span className="text-[20px] font-bold tracking-tight text-[#0F172A] -ml-0.5 font-poppins">
                    rbitask
                  </span>
                </Link>
              </div>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                Skip and start
              </button>
            </div>
          )}
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

          {/* ================= SCREEN 2: EMAIL VERIFICATION CODE ================= */}
          {authStep === "verify" && (
            <div className="animate-in fade-in duration-300">
              {/* Quick autofill helper for easy testing */}
              <div className="mb-4 flex items-center justify-between p-2.5 bg-blue-50/80 border border-blue-200 rounded-[5px] text-[11px] font-medium text-[#1E40AF]">
                <span>Active OTP: <strong className="font-mono tracking-wider">{verificationCode}</strong></span>
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

              {/* Verify Manual Button */}
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

          {/* ================= ONBOARDING STEP 1: CREATE A NEW WORKSPACE ================= */}
          {authStep === "onboarding-1" && (
            <div className="animate-in fade-in duration-300">
              <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#0F172A] font-poppins leading-tight mb-2">
                Create a new workspace
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] mb-5">
                Your Orbitask account has been successfully verified. Next, provide your organization's
                name and address to proceed.
              </p>

              {/* Logo Upload Avatar */}
              <div className="flex flex-col items-center justify-center my-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-18 h-18 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] cursor-pointer hover:bg-blue-100 transition-all shadow-xs relative overflow-hidden group"
                  title="Click to upload workspace logo"
                >
                  {workspaceLogo ? (
                    <img
                      src={workspaceLogo}
                      alt="Workspace Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-[#2563EB]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  )}
                </div>
                <p className="text-[11px] font-medium text-[#64748B] mt-2 flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#94A3B8] text-[9px] font-bold text-[#64748B]">
                    i
                  </span>
                  Upload your workspace logo or image
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Form */}
              <form onSubmit={handleStep1Next} className="space-y-4">
                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-colors">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#334155] flex items-center">
                    Workspace Name<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => {
                      setWorkspaceName(e.target.value);
                      setWorkspaceUrl(e.target.value.toLowerCase().trim().replace(/\s+/g, "-"));
                    }}
                    placeholder="ex: Orbitask Team"
                    className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                    required
                  />
                </div>

                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-colors">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#334155] flex items-center">
                    Custom workspace URL
                  </label>
                  <input
                    type="text"
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    placeholder="ex: your-workspace"
                    className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] p-0"
                  />
                </div>

                <div className="relative border border-[#CBD5E1] rounded-[5px] px-3.5 pt-2.5 pb-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-colors">
                  <label className="absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium text-[#334155] flex items-center">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={workspaceDesc}
                    onChange={(e) => setWorkspaceDesc(e.target.value)}
                    placeholder="ex: A workspace for managing Orbitask projects"
                    className="w-full bg-transparent border-0 outline-none text-xs sm:text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8] p-0 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium rounded-[5px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-6"
                >
                  Next
                </button>
              </form>

              {/* Progress Bar (Step 1/3: 33%) */}
              <div className="w-full bg-slate-200 h-1.5 rounded-[5px] mt-8 overflow-hidden">
                <div className="bg-[#2563EB] h-1.5 rounded-[5px] w-1/3 transition-all duration-300" />
              </div>
            </div>
          )}

          {/* ================= ONBOARDING STEP 2: GETTING YOUR WORKSPACE READY ================= */}
          {authStep === "onboarding-2" && (
            <div className="animate-in fade-in duration-300">
              <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#0F172A] font-poppins leading-tight mb-2">
                Getting your workspace ready
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] mb-8">
                Answer a few quick questions so we can personalize your Orbitask experience.
              </p>

              <div className="space-y-5">
                {/* Dropdown 1: What type of work do you manage? */}
                <div className="relative z-20">
                  <div
                    onClick={() => {
                      setOpenWorkTypeDropdown(!openWorkTypeDropdown);
                      setOpenFocusDropdown(false);
                    }}
                    className={`relative border rounded-[5px] px-3.5 pt-3 pb-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      openWorkTypeDropdown
                        ? "border-[#2563EB] ring-1 ring-[#2563EB]"
                        : "border-[#CBD5E1] hover:border-slate-400"
                    }`}
                  >
                    <label className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium ${
                      openWorkTypeDropdown ? "text-[#2563EB]" : "text-[#334155]"
                    }`}>
                      What type of work do you manage?
                    </label>
                    <span className="text-xs sm:text-sm font-medium text-[#0F172A]">{workType}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openWorkTypeDropdown ? "text-[#2563EB] rotate-180" : "text-[#64748B]"
                      }`}
                    />
                  </div>

                  {openWorkTypeDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setOpenWorkTypeDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#CBD5E1] rounded-[5px] shadow-xl z-40 py-1 text-xs sm:text-sm font-medium">
                        {[
                          "Brand Strategy & Positioning",
                          "Engineering & Software Development",
                          "Product Management & UI/UX",
                          "Sales & Marketing Operations",
                          "Customer Support & Success",
                        ].map((option) => (
                          <div
                            key={option}
                            onClick={() => {
                              setWorkType(option);
                              setOpenWorkTypeDropdown(false);
                            }}
                            className={`px-3.5 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors ${
                              workType === option
                                ? "text-[#2563EB] font-semibold bg-blue-50/60"
                                : "text-[#0F172A]"
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Dropdown 2 (What are you currently working on?) */}
                <div className="relative z-10">
                  <div
                    onClick={() => {
                      setOpenFocusDropdown(!openFocusDropdown);
                      setOpenWorkTypeDropdown(false);
                    }}
                    className={`relative border rounded-[5px] px-3.5 pt-3 pb-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      openFocusDropdown
                        ? "border-[#2563EB] ring-1 ring-[#2563EB]"
                        : "border-[#CBD5E1] hover:border-slate-400"
                    }`}
                  >
                    <label className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium ${
                      openFocusDropdown ? "text-[#2563EB]" : "text-[#334155]"
                    }`}>
                      What are you currently working on?
                    </label>
                    <span className="text-xs sm:text-sm font-medium text-[#0F172A]">
                      {currentFocus}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openFocusDropdown ? "text-[#2563EB] rotate-180" : "text-[#64748B]"
                      }`}
                    />
                  </div>

                  {/* Floating Absolute Dropdown menu with click-outside backdrop */}
                  {openFocusDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setOpenFocusDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#CBD5E1] rounded-[5px] shadow-xl z-40 py-1 text-xs sm:text-sm font-medium">
                        {[
                          "Creating an Email Marketing Workflow",
                          "Optimizing SEO and Website Content",
                          "Developing New Marketing Collateral",
                          "Launching a Social Media Campaign",
                        ].map((item) => {
                          const isSelected = currentFocus === item;
                          return (
                            <div
                              key={item}
                              onClick={() => {
                                setCurrentFocus(item);
                                setOpenFocusDropdown(false);
                              }}
                              className={`px-3.5 py-2.5 cursor-pointer transition-colors ${
                                isSelected
                                  ? "text-[#2563EB] font-semibold bg-blue-50/70"
                                  : "text-[#0F172A] hover:bg-slate-50"
                              }`}
                            >
                              {item}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleStep2Next}
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium rounded-[5px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-6"
                >
                  Next
                </button>
              </div>

              {/* Progress Bar (Step 2/3: 66%) */}
              <div className="w-full bg-slate-200 h-1.5 rounded-[5px] mt-8 overflow-hidden">
                <div className="bg-[#2563EB] h-1.5 rounded-[5px] w-2/3 transition-all duration-300" />
              </div>
            </div>
          )}

          {/* ================= ONBOARDING STEP 3: PREPARING YOUR WORKSPACE ================= */}
          {authStep === "onboarding-3" && (
            <div className="animate-in fade-in duration-300">
              <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#0F172A] font-poppins leading-tight mb-2">
                Preparing your workspace
              </h1>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] mb-8">
                Great, you're here to manage {workType.split("&")[0].trim() || "Support"} and are
                currently working on {currentFocus}.
              </p>

              <div className="space-y-5">
                {/* Dropdown 1: Industry */}
                <div className="relative z-20">
                  <div
                    onClick={() => {
                      setOpenIndustryDropdown(!openIndustryDropdown);
                      setOpenTeamSizeDropdown(false);
                    }}
                    className={`relative border rounded-[5px] px-3.5 pt-3 pb-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      openIndustryDropdown
                        ? "border-[#2563EB] ring-1 ring-[#2563EB]"
                        : "border-[#CBD5E1] hover:border-slate-400"
                    }`}
                  >
                    <label className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium ${
                      openIndustryDropdown ? "text-[#2563EB]" : "text-[#334155]"
                    }`}>
                      What is your company industry?
                    </label>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        !industry || industry === "Select company industry" ? "text-[#94A3B8]" : "text-[#0F172A]"
                      }`}
                    >
                      {industry || "Select company industry"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openIndustryDropdown ? "text-[#2563EB] rotate-180" : "text-[#64748B]"
                      }`}
                    />
                  </div>

                  {openIndustryDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setOpenIndustryDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#CBD5E1] rounded-[5px] shadow-xl z-40 py-1 text-xs sm:text-sm font-medium max-h-48 overflow-y-auto">
                        {[
                          "Technology & Software",
                          "E-Commerce & Retail",
                          "Finance & Fintech",
                          "Healthcare & Medical",
                          "Marketing & Creative Agency",
                          "Education & Training",
                          "Other",
                        ].map((ind) => (
                          <div
                            key={ind}
                            onClick={() => {
                              setIndustry(ind);
                              setOpenIndustryDropdown(false);
                            }}
                            className={`px-3.5 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors ${
                              industry === ind
                                ? "text-[#2563EB] font-semibold bg-blue-50/60"
                                : "text-[#0F172A]"
                            }`}
                          >
                            {ind}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Dropdown 2 (Team size) */}
                <div className="relative z-10">
                  <div
                    onClick={() => {
                      setOpenTeamSizeDropdown(!openTeamSizeDropdown);
                      setOpenIndustryDropdown(false);
                    }}
                    className={`relative border rounded-[5px] px-3.5 pt-3 pb-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                      openTeamSizeDropdown
                        ? "border-[#2563EB] ring-1 ring-[#2563EB]"
                        : "border-[#CBD5E1] hover:border-slate-400"
                    }`}
                  >
                    <label className={`absolute -top-2.5 left-3 bg-white px-1 text-[11px] font-medium ${
                      openTeamSizeDropdown ? "text-[#2563EB]" : "text-[#334155]"
                    }`}>
                      What are you currently working on?
                    </label>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        teamSize ? "text-[#0F172A]" : "text-[#94A3B8]"
                      }`}
                    >
                      {teamSize || "Select team size"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openTeamSizeDropdown ? "text-[#2563EB] rotate-180" : "text-[#64748B]"
                      }`}
                    />
                  </div>

                  {/* Floating Absolute Dropdown menu with click-outside backdrop */}
                  {openTeamSizeDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setOpenTeamSizeDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#CBD5E1] rounded-[5px] shadow-xl z-40 py-1 text-xs sm:text-sm font-medium">
                        {[
                          "1 Just me",
                          "2–5 team members",
                          "6–10 team members",
                          "10+ team members",
                        ].map((size) => {
                          const isSelected = teamSize === size;
                          return (
                            <div
                              key={size}
                              onClick={() => {
                                setTeamSize(size);
                                setOpenTeamSizeDropdown(false);
                              }}
                              className={`px-3.5 py-2.5 cursor-pointer transition-colors ${
                                isSelected
                                  ? "text-[#2563EB] font-semibold bg-blue-50/70"
                                  : "text-[#0F172A] hover:bg-slate-50"
                              }`}
                            >
                              {size}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFinishOnboarding}
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium rounded-[5px] flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-6"
                >
                  Next
                </button>
              </div>

              {/* Progress Bar (Step 3/3: 100%) */}
              <div className="w-full bg-slate-200 h-1.5 rounded-[5px] mt-8 overflow-hidden">
                <div className="bg-[#2563EB] h-1.5 rounded-[5px] w-full transition-all duration-300" />
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

      {/* ================= RIGHT COLUMN: BLUE CAROUSEL & PERSPECTIVE UI MOCKUPS ================= */}
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
              {slides[activeSlide]?.title || slides[0].title}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/80 leading-relaxed mb-6 italic">
              {slides[activeSlide]?.quote || slides[0].quote}
            </p>

            {/* Pagination Pill Dots */}
            <div className="flex items-center gap-1.5 mb-8">
              {[0, 1, 2, 3].map((i) => {
                const isActive = activeSlide === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom Perspective Floating Dashboard Mockups */}
          <div className="relative z-10 w-full flex items-center justify-center -mb-24 xl:-mb-28">
            <div className="w-full max-w-[640px] bg-white rounded-[14px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border border-white/60 p-4 text-[#0F172A] transform rotate-[-4deg] scale-[0.96] hover:rotate-0 hover:scale-[1.0] transition-all duration-500 origin-bottom-left">
              {/* SLIDE 0: Overview Dashboard (Screenshot 2 of Onboarding) */}
              {activeSlide === 0 && (
                <div className="space-y-4">
                  {/* Top Header inside mockup */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-4">
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

              {/* SLIDE 1: Development Tasks Kanban Board (Screenshot 3 of Onboarding) */}
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

              {/* SLIDE 2: Development Planner Table */}
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
                  </div>
                </div>
              )}

              {/* SLIDE 3: Galaxy View (Screenshot 1 of Onboarding) */}
              {activeSlide === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-[#0284C7] flex items-center justify-center text-white text-[9px] font-bold">
                          O
                        </div>
                        <span className="text-xs font-bold font-poppins text-[#0F172A]">
                          Development Tasks
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-[#64748B]">
                        <span>Kanban</span>
                        <span>Table</span>
                        <span>Timeline</span>
                        <span className="text-[#2563EB] border-b-2 border-[#2563EB] pb-0.5 font-semibold">
                          Galaxy View
                        </span>
                        <span>Archive</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#64748B]">UI Team</span>
                      <span className="text-[10px] text-[#64748B]">Ux Team</span>
                      <div className="h-5 px-1.5 bg-blue-50 text-[#2563EB] rounded-[4px] text-[9px] font-semibold flex items-center gap-1">
                        + Add Board
                      </div>
                    </div>
                  </div>

                  {/* Galaxy View Radar Diagram */}
                  <div className="relative w-full h-56 bg-slate-50/40 rounded-[8px] flex items-center justify-center overflow-hidden border border-slate-100">
                    <svg className="w-full h-full" viewBox="0 0 400 220">
                      {/* Outer Orbit: Low Priority */}
                      <circle
                        cx="200"
                        cy="110"
                        r="95"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="305"
                        y="106"
                        fill="#94A3B8"
                        fontSize="8"
                        fontWeight="600"
                        fontFamily="sans-serif"
                      >
                        Low Priority
                      </text>

                      {/* Middle Orbit: Mid Priority */}
                      <circle
                        cx="200"
                        cy="110"
                        r="68"
                        fill="none"
                        stroke="#BFDBFE"
                        strokeWidth="1.5"
                      />
                      <text
                        x="272"
                        y="106"
                        fill="#3B82F6"
                        fontSize="8"
                        fontWeight="600"
                        fontFamily="sans-serif"
                      >
                        Mid Priority
                      </text>

                      {/* Inner Orbit: High Priority */}
                      <circle
                        cx="200"
                        cy="110"
                        r="42"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2"
                      />
                      <text
                        x="245"
                        y="106"
                        fill="#1D4ED8"
                        fontSize="8"
                        fontWeight="700"
                        fontFamily="sans-serif"
                      >
                        High Priority
                      </text>

                      {/* Connecting line from high-priority task node to callout */}
                      <line
                        x1="170"
                        y1="82"
                        x2="135"
                        y2="55"
                        stroke="#F43F5E"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />

                      {/* Outer orbital nodes */}
                      <circle cx="295" cy="110" r="4.5" fill="#10B981" stroke="white" strokeWidth="1.5" />
                      <circle cx="105" cy="110" r="4.5" fill="#6366F1" stroke="white" strokeWidth="1.5" />

                      {/* Middle orbital node */}
                      <circle cx="200" cy="178" r="4.5" fill="#F59E0B" stroke="white" strokeWidth="1.5" />

                      {/* High priority orbital node */}
                      <circle cx="170" cy="82" r="5" fill="#E11D48" stroke="white" strokeWidth="2" />

                      {/* Central Planet */}
                      <circle cx="200" cy="110" r="16" fill="#2563EB" />
                      <ellipse
                        cx="200"
                        cy="110"
                        rx="22"
                        ry="7"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        transform="rotate(-30 200 110)"
                      />
                    </svg>

                    {/* Floating Task Callout Card */}
                    <div className="absolute top-3 left-14 bg-white/95 backdrop-blur-sm border border-rose-200 rounded-[5px] p-2 shadow-lg text-[10px] space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#0F172A]">Task Name</span>
                        <span className="px-1 py-0.2 bg-rose-50 text-rose-600 rounded text-[8px] font-bold">
                          P1
                        </span>
                      </div>
                      <div className="text-[9px] text-[#64748B] flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-rose-500" />
                        <span>Deadline: 2 Days Left</span>
                      </div>
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
