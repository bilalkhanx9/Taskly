"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Users,
  Shield,
  Building2,
  Sparkles,
  Layers,
  Globe2,
  Mail,
  HelpCircle,
  FolderKanban,
  Star,
  Quote,
} from "lucide-react";

export default function LandingPage() {
  // Billing toggle: monthly or annually
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

  // FAQ open index state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: "How does the 14-day free trial work?",
      a: "You get full access to all Orbitask Pro features for 14 days without entering any credit card. At the end of the trial, you can choose a paid plan or automatically continue on our free starter tier.",
    },
    {
      q: "Can I upgrade or downgrade my plan anytime?",
      a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your workspace account settings. Changes take effect immediately.",
    },
    {
      q: "Is my data secure and encrypted?",
      a: "Absolutely. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We utilize PostgreSQL databases and Cloudflare R2 enterprise storage with regular automated backups.",
    },
    {
      q: "Do you offer team training or custom onboarding?",
      a: "Yes! Our Enterprise plan includes dedicated white-glove onboarding, live team training webinars, and a dedicated customer success manager.",
    },
    {
      q: "Can I connect third-party integrations?",
      a: "Yes, Orbitask integrates seamlessly with Slack, Google Drive, Figma, GitHub, Jira, and offers REST APIs and webhooks for custom pipelines.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers/invoicing for annual Enterprise agreements.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-inter selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* ================= 1. HEADER / NAVBAR ================= */}
      <header className="w-full border-b border-[#F1F5F9] bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 select-none">
            <div className="relative flex items-center justify-center">
              <svg
                className="w-9 h-9 text-[#0284C7]"
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

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#475569]">
            <Link href="/" className="text-[#2563EB] transition-colors">
              Home
            </Link>
            <a href="#features" className="hover:text-[#2563EB] transition-colors">
              Features
            </a>
            <a href="#contact" className="hover:text-[#2563EB] transition-colors">
              Contact
            </a>
            <a href="#pricing" className="hover:text-[#2563EB] transition-colors">
              Pricing
            </a>
          </nav>

          {/* Right: Auth Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-medium text-[#475569] hover:text-[#0F172A] transition-colors px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-[5px] flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#F1F5F9]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Call to Action */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#0F172A] font-poppins leading-[1.12]">
              A simple project <br />
              management tool <br />
              <span className="text-[#2563EB]">to manage anything!</span>
            </h1>

            <p className="text-sm font-medium text-[#64748B] leading-relaxed max-w-lg">
              Keep your projects, tasks, and teams organized, all in one central place.
              Built for modern high-performance teams who value clarity and speed.
            </p>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href="/login"
                  className="h-11 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-[5px] flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/workspace"
                  className="h-11 px-5 border border-[#CBD5E1] hover:bg-slate-50 text-[#334155] text-xs font-medium rounded-[5px] flex items-center gap-2 transition-colors"
                >
                  <FolderKanban className="w-4 h-4 text-[#2563EB]" />
                  <span>Explore Demo Workspace</span>
                </Link>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-medium text-[#94A3B8] pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>No credit card required. Free 14-day trial included.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Circular Graphic with Dashboard Widgets (Exact match to screenshot) */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] flex items-center justify-center">
              {/* Deep Blue Circular Background Backing */}
              <div className="absolute inset-4 rounded-full bg-[#2563EB] shadow-2xl opacity-95 flex items-center justify-center overflow-hidden">
                {/* Organic wavy contour background */}
                <svg
                  className="w-full h-full opacity-25"
                  viewBox="0 0 400 400"
                  fill="none"
                >
                  <path
                    d="M-50 100 C80 50 180 150 280 100 C380 50 450 120 500 80"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M-50 200 C80 150 180 250 280 200 C380 150 450 220 500 180"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M-50 300 C80 250 180 350 280 300 C380 250 450 320 500 280"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Floating Dashboard Card 1: Top Right Task & Donut Chart */}
              <div className="absolute top-2 right-0 w-[200px] sm:w-[220px] bg-white rounded-[5px] p-3.5 shadow-xl border border-[#E2E8F0] z-20 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                  <span className="text-[11px] font-medium text-[#0F172A]">Task Velocity</span>
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-[5px]">
                    +24%
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  {/* Mini Donut Gauge SVG */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E2E8F0" strokeWidth="4" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="4"
                        strokeDasharray="88"
                        strokeDashoffset="26"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[10px] font-bold font-poppins text-[#0F172A]">72%</span>
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-[#64748B] block">Completed Tasks</span>
                    <span className="text-xs font-bold text-[#0F172A] block">18 / 25 Tasks</span>
                  </div>
                </div>
              </div>

              {/* Floating Dashboard Card 2: Bottom Right Milestone Checklist */}
              <div className="absolute bottom-2 right-2 w-[210px] sm:w-[230px] bg-white rounded-[5px] p-3.5 shadow-xl border border-[#E2E8F0] z-20">
                <span className="text-[11px] font-medium text-[#0F172A] block pb-2 border-b border-[#F1F5F9]">
                  Milestone Sprint
                </span>
                <div className="mt-2.5 space-y-2 text-[10px] text-[#475569]">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-blue-500 flex items-center justify-center text-white text-[8px]">
                      ✓
                    </div>
                    <span>Design System Tokens</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[3px] bg-blue-500 flex items-center justify-center text-white text-[8px]">
                      ✓
                    </div>
                    <span>PostgreSQL Docker Sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[3px] border border-[#CBD5E1]" />
                    <span>Cloudflare R2 Bucket</span>
                  </div>
                </div>
              </div>

              {/* Floating Dashboard Card 3: Top Left Main Project Overview */}
              <div className="absolute -left-2 top-10 w-[210px] sm:w-[240px] bg-white rounded-[5px] p-4 shadow-2xl border border-[#E2E8F0] z-30">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-[5px] bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0284C7]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-[#0F172A]">Orbitask Core</h4>
                    <span className="text-[10px] text-[#94A3B8]">Active Workspace</span>
                  </div>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-[#64748B]">Project Progress</span>
                    <span className="text-[#2563EB] font-bold">84%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full w-[84%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. TRUSTED BY BRANDS BANNER ================= */}
      <section className="py-10 bg-[#F8FAFC]/70 border-b border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-6">
          <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
            Trusted by global teams and scaling enterprises worldwide
          </p>
          <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap opacity-65 grayscale hover:grayscale-0 transition-all">
            <span className="text-base sm:text-lg font-bold font-poppins text-[#334155] tracking-tight">
              airbnb
            </span>
            <span className="text-base sm:text-lg font-extrabold font-poppins text-[#334155] tracking-wider">
              NETFLIX
            </span>
            <span className="text-base sm:text-lg font-bold font-poppins text-[#334155]">
              Pinterest
            </span>
            <span className="text-base sm:text-lg font-semibold font-poppins text-[#334155]">
              Google
            </span>
            <span className="text-base sm:text-lg font-bold font-poppins text-[#334155]">
              amazon
            </span>
            <span className="text-base sm:text-lg font-bold font-poppins text-[#334155] tracking-widest">
              UBER
            </span>
          </div>
        </div>
      </section>

      {/* ================= 4. MAIN FEATURES SECTION ================= */}
      <section id="features" className="py-20 lg:py-24 border-b border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-poppins">
              Main Features
            </h2>
            <p className="text-xs font-medium text-[#64748B] max-w-xl mx-auto mt-2.5 leading-relaxed">
              The intuitive features built for teams to collaborate, track work and achieve goals fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-7 rounded-[5px] border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow text-center group">
              <div className="w-12 h-12 rounded-[5px] bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] font-poppins">
                Automated Workflows
              </h3>
              <p className="text-xs font-medium text-[#64748B] mt-2.5 leading-relaxed">
                Set up automated triggers, rules, and recurring tasks to eliminate routine busywork without writing code.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-7 rounded-[5px] border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow text-center group">
              <div className="w-12 h-12 rounded-[5px] bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] font-poppins">
                Task Collaboration
              </h3>
              <p className="text-xs font-medium text-[#64748B] mt-2.5 leading-relaxed">
                Assign tasks with clear owners, share real-time updates, and keep everyone aligned on milestones.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-7 rounded-[5px] border border-[#E2E8F0] shadow-xs hover:shadow-md transition-shadow text-center group">
              <div className="w-12 h-12 rounded-[5px] bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A] font-poppins">
                Smart Analytics
              </h3>
              <p className="text-xs font-medium text-[#64748B] mt-2.5 leading-relaxed">
                Get real-time insights into velocity, sprint completion rates, and bottlenecks with visual reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. SHOWCASE 1: WORK TOGETHER (ORBITAL GRAPHIC) ================= */}
      <section className="py-20 lg:py-24 border-b border-[#F1F5F9] bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Concentric Orbit Collaboration Graphic */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] flex items-center justify-center">
              {/* Concentric orbital rings */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#CBD5E1]" />
              <div className="absolute inset-10 sm:inset-14 rounded-full border border-[#E2E8F0]" />
              <div className="absolute inset-20 sm:inset-28 rounded-full border border-dashed border-blue-200" />

              {/* Center User Avatar */}
              <div className="relative z-10 w-14 h-14 rounded-full border-2 border-white shadow-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Team Lead"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Orbiting Avatar 1 (Top Left) */}
              <div className="absolute top-8 left-8 w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden z-10">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Member"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Orbiting Avatar 2 (Bottom Left) */}
              <div className="absolute bottom-10 left-12 w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden z-10">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Member"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Orbiting Badge (Right) */}
              <div className="absolute right-4 top-24 bg-[#2563EB] text-white text-[11px] font-medium px-3 py-1.5 rounded-[5px] shadow-md z-10">
                <span>UX Sprint</span>
              </div>

              {/* Floating Task Node Card */}
              <div className="absolute top-12 left-28 bg-white border border-[#E2E8F0] shadow-md p-2.5 rounded-[5px] z-20 text-[10px] space-y-1">
                <span className="font-bold text-[#0F172A] block">Sprint Feedback</span>
                <span className="text-emerald-600 block">✓ Approved by Bilal Khan</span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-poppins">
              Work together
            </h2>
            <p className="text-xs font-medium text-[#64748B] leading-relaxed max-w-lg">
              Keep your distributed team synchronized across time zones with real-time collaborative boards, instant task status updates, and threaded discussions.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-[5px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. SHOWCASE 2: EASY MANAGE PROGRESS (MULTI-LINE CHART & STATS) ================= */}
      <section className="py-20 lg:py-24 border-b border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Chart Mockup Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[5px] border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] font-poppins">Sprint Progress</h4>
                  <span className="text-[10px] text-[#94A3B8]">Overview of Weekly Velocity</span>
                </div>
                <span className="text-[10px] font-medium bg-blue-50 text-[#2563EB] px-2 py-1 rounded-[5px]">
                  Realtime
                </span>
              </div>

              {/* Multi-line Wave SVG Graph */}
              <div className="pt-6 pb-2">
                <svg className="w-full h-44" viewBox="0 0 360 160" fill="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="360" y2="30" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="70" x2="360" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="110" x2="360" y2="110" stroke="#F1F5F9" strokeWidth="1" />
                  <line x1="0" y1="150" x2="360" y2="150" stroke="#F1F5F9" strokeWidth="1" />

                  {/* Cyan Curve */}
                  <path
                    d="M10 120 C60 60 120 130 180 50 C240 100 300 30 350 40"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Orange Curve */}
                  <path
                    d="M10 140 C70 120 130 40 200 90 C260 70 300 120 350 70"
                    stroke="#F97316"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Blue Main Curve */}
                  <path
                    d="M10 100 C50 140 110 80 170 110 C230 40 290 80 350 20"
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#F1F5F9] text-[10px] font-medium text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Done
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" /> In Progress
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" /> In Review
                </span>
              </div>
            </div>
          </div>

          {/* Right: Content & Numerical Stats */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-poppins leading-snug">
              Easy manage progress <br />
              your project
            </h2>
            <p className="text-xs font-medium text-[#64748B] leading-relaxed max-w-lg">
              Track sprint velocity, milestone completion, and workload distribution with intuitive charts and proactive milestone alerts.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-[#F1F5F9]">
              <div>
                <span className="text-2xl font-bold text-[#0F172A] font-poppins block">99.9%</span>
                <span className="text-[11px] font-medium text-[#64748B] mt-0.5 block">Uptime SLA</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#0F172A] font-poppins block">2M+</span>
                <span className="text-[11px] font-medium text-[#64748B] mt-0.5 block">Tasks Closed</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-[#0F172A] font-poppins block">120K+</span>
                <span className="text-[11px] font-medium text-[#64748B] mt-0.5 block">Active Users</span>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/login"
                className="h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-[5px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Explore Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. SHOWCASE 3: INTEGRATIONS ORBIT PLATFORM ================= */}
      <section className="py-20 lg:py-24 border-b border-[#F1F5F9] bg-[#FAFAFC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <div className="relative w-full max-w-lg mx-auto h-[260px] sm:h-[320px] flex items-center justify-center">
            {/* Concentric Orbit Paths */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#CBD5E1]" />
            <div className="absolute inset-8 sm:inset-12 rounded-full border border-[#E2E8F0]" />

            {/* Center Content */}
            <div className="relative z-10 text-center max-w-xs space-y-2">
              <span className="inline-block text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-[5px] tracking-wide uppercase font-poppins">
                Integrations
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-poppins">
                Manage tasks in one platform
              </h3>
              <p className="text-[11px] font-medium text-[#64748B]">
                Connect your favorite tools and streamline workflows in a unified ecosystem.
              </p>
            </div>

            {/* Floating Integration Badges */}
            <div className="absolute top-2 left-1/4 w-8 h-8 rounded-[5px] bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-xs font-bold text-red-500">
              M
            </div>
            <div className="absolute bottom-4 left-1/3 w-8 h-8 rounded-[5px] bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-xs font-bold text-amber-500">
              ▲
            </div>
            <div className="absolute top-8 right-1/4 w-8 h-8 rounded-[5px] bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-xs font-bold text-purple-600">
              #
            </div>
            <div className="absolute bottom-6 right-1/3 w-8 h-8 rounded-[5px] bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center text-xs font-bold text-[#2563EB]">
              in
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. SHOWCASE 4: POWERFUL ANALYTICS BAR CHART ================= */}
      <section className="py-20 lg:py-24 border-b border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-poppins leading-snug">
              Visualize your project <br />
              with powerful analytics
            </h2>
            <p className="text-xs font-medium text-[#64748B] leading-relaxed max-w-lg">
              Gain actionable clarity with multi-dimensional bar charts, milestone breakdown distributions, and team velocity metrics to hit every critical deadline.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="h-10 px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-[5px] inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>See All Features</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Bar Chart Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[5px] border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <h4 className="text-sm font-bold text-[#0F172A] font-poppins">Monthly Velocity</h4>
                <span className="text-[10px] font-medium text-[#64748B]">Year 2026</span>
              </div>

              {/* Bar Chart Display */}
              <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
                {[
                  { h1: 45, h2: 70, h3: 30 },
                  { h1: 60, h2: 85, h3: 50 },
                  { h1: 30, h2: 60, h3: 40 },
                  { h1: 80, h2: 95, h3: 65 },
                  { h1: 55, h2: 75, h3: 45 },
                  { h1: 70, h2: 90, h3: 60 },
                  { h1: 85, h2: 100, h3: 75 },
                  { h1: 65, h2: 80, h3: 50 },
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex items-end justify-center gap-1 h-full">
                    <div
                      className="w-2 bg-[#38BDF8] rounded-t-[2px]"
                      style={{ height: `${col.h1}%` }}
                    />
                    <div
                      className="w-2 bg-[#2563EB] rounded-t-[2px]"
                      style={{ height: `${col.h2}%` }}
                    />
                    <div
                      className="w-2 bg-amber-400 rounded-t-[2px]"
                      style={{ height: `${col.h3}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 pt-3 border-t border-[#F1F5F9] text-[10px] font-medium text-[#64748B]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Sprints
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Tasks
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Bugs Fixed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. PRICING & PLANS ================= */}
      <section id="pricing" className="py-20 lg:py-24 border-b border-[#F1F5F9] bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-poppins">
              Pricing & Plans
            </h2>
            <p className="text-xs font-medium text-[#64748B] max-w-md mx-auto mt-2 leading-relaxed">
              Transparent plans crafted for freelancers, growing teams, and enterprises.
            </p>

            {/* Monthly / Annually Toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span
                className={`text-xs font-medium ${
                  billingCycle === "monthly" ? "text-[#0F172A]" : "text-[#94A3B8]"
                }`}
              >
                Monthly
              </span>
              <button
                type="button"
                onClick={() =>
                  setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")
                }
                className="w-12 h-6 bg-[#2563EB] p-1 rounded-full relative transition-colors cursor-pointer"
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    billingCycle === "annually" ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-medium ${
                  billingCycle === "annually" ? "text-[#0F172A]" : "text-[#94A3B8]"
                }`}
              >
                Annually <span className="text-[#2563EB] font-bold text-[11px]">(Save 20%)</span>
              </span>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Card 1: Starter / Free */}
            <div className="bg-white rounded-[5px] border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-[5px] bg-slate-100 text-[#475569] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] font-poppins">Free Starter</h3>
                  <p className="text-[11px] font-medium text-[#64748B] mt-1">
                    Perfect for individuals and small tests.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-3xl font-bold text-[#0F172A] font-poppins">$0</span>
                  <span className="text-xs text-[#94A3B8] font-medium ml-1">/ month</span>
                </div>
                <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5 text-xs font-medium text-[#475569]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Up to 3 Active Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Standard Kanban Boards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>2GB Cloud Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Community Support</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/login"
                  className="w-full h-10 border border-[#CBD5E1] hover:bg-slate-50 text-[#334155] text-xs font-medium rounded-[5px] flex items-center justify-center transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Card 2: Pro (Highlighted in Blue) */}
            <div className="bg-[#2563EB] text-white rounded-[5px] p-7 shadow-xl flex flex-col justify-between text-left relative transform md:-translate-y-2">
              <span className="absolute -top-3 right-6 bg-amber-400 text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-[5px] uppercase font-poppins tracking-wider shadow-sm">
                Most Popular
              </span>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-[5px] bg-white/15 text-white flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-poppins">Pro Plan</h3>
                  <p className="text-[11px] font-medium text-white/80 mt-1">
                    Best for scaling teams and active projects.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-3xl font-bold text-white font-poppins">
                    {billingCycle === "monthly" ? "$19" : "$15"}
                  </span>
                  <span className="text-xs text-white/75 font-medium ml-1">/ month</span>
                </div>
                <div className="pt-4 border-t border-white/20 space-y-2.5 text-xs font-medium text-white/90">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Unlimited Projects & Workspaces</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Advanced Velocity Analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>50GB Cloudflare R2 Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Team Roles & Permissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Priority 24/7 Support</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/login"
                  className="w-full h-10 bg-white hover:bg-slate-100 text-[#2563EB] text-xs font-bold rounded-[5px] flex items-center justify-center transition-colors shadow-sm"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </div>

            {/* Card 3: Enterprise */}
            <div className="bg-white rounded-[5px] border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between text-left">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-[5px] bg-slate-100 text-[#475569] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A] font-poppins">Enterprise</h3>
                  <p className="text-[11px] font-medium text-[#64748B] mt-1">
                    Custom security, SLA, and dedicated infrastructure.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-3xl font-bold text-[#0F172A] font-poppins">
                    {billingCycle === "monthly" ? "$49" : "$39"}
                  </span>
                  <span className="text-xs text-[#94A3B8] font-medium ml-1">/ month</span>
                </div>
                <div className="pt-4 border-t border-[#F1F5F9] space-y-2.5 text-xs font-medium text-[#475569]">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Dedicated Success Manager</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>99.99% Uptime Guarantee SLA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Unlimited Cloud Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>SSO, SAML & Custom Audit Logs</span>
                  </div>
                </div>
              </div>
              <div className="pt-8">
                <Link
                  href="/login"
                  className="w-full h-10 border border-[#CBD5E1] hover:bg-slate-50 text-[#334155] text-xs font-medium rounded-[5px] flex items-center justify-center transition-colors"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. WORK FROM ANYWHERE WORLD MAP & TESTIMONIAL ================= */}
      <section className="py-20 lg:py-24 border-b border-[#F1F5F9] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center space-y-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-poppins">
              Work from <span className="text-[#2563EB]">Anywhere</span>
            </h2>
            <p className="text-xs font-medium text-[#64748B] max-w-md mx-auto mt-2 leading-relaxed">
              Connect. Collaborate. Create — no matter where you are in the world.
            </p>
          </div>

          {/* World Map Container with Floating Nodes */}
          <div className="relative w-full max-w-4xl mx-auto min-h-[300px] flex items-center justify-center">
            {/* World Map Outline SVG */}
            <svg
              className="w-full h-64 sm:h-80 opacity-30 text-slate-300"
              viewBox="0 0 1000 500"
              fill="currentColor"
            >
              <path d="M150 120 Q180 90 220 120 T300 150 T250 220 T150 180 Z" />
              <path d="M220 260 Q260 250 280 320 T240 420 T200 340 Z" />
              <path d="M460 100 Q520 80 580 120 T540 200 T480 180 Z" />
              <path d="M480 220 Q540 200 560 300 T500 380 T460 280 Z" />
              <path d="M650 120 Q750 90 850 140 T880 240 T750 220 T660 180 Z" />
              <path d="M780 320 Q840 300 860 380 T800 420 T760 360 Z" />
            </svg>

            {/* Pin 1: North America */}
            <div className="absolute top-12 left-16 sm:left-36 w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden z-10">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Dev"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Pin 2: Europe */}
            <div className="absolute top-10 right-32 sm:right-72 w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden z-10">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Designer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Pin 3: Asia */}
            <div className="absolute top-20 right-12 sm:right-28 w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden z-10">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Engineer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Center Floating Testimonial Quote Card */}
            <div className="absolute bg-white rounded-[5px] border border-[#E2E8F0] shadow-xl p-6 max-w-sm sm:max-w-md mx-auto z-20 text-center space-y-3">
              <div className="relative w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden mx-auto -mt-10">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="James Wilson"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs font-medium text-[#334155] leading-relaxed italic">
                “Orbitask transformed how our distributed team executes sprints. We cut delivery cycles by 35% in just two months.”
              </p>
              <div>
                <h4 className="text-xs font-bold text-[#0F172A]">James Wilson</h4>
                <span className="text-[10px] text-[#64748B]">Lead Engineering Director at TechFlow</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 11. FAQ ACCORDION SECTION ================= */}
      <section className="py-20 lg:py-24 border-b border-[#F1F5F9] bg-[#FAFAFC]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-poppins">
              Frequently Asked Questions
            </h2>
            <p className="text-xs font-medium text-[#64748B] max-w-md mx-auto mt-2 leading-relaxed">
              Everything you need to know about the product, billing, and team onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[5px] border border-[#E2E8F0] p-4 text-left transition-all hover:border-[#2563EB]/60 cursor-pointer"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xs font-medium text-[#0F172A] leading-snug">
                    {item.q}
                  </h4>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
                  )}
                </div>

                {openFaq === idx && (
                  <p className="text-[11px] font-medium text-[#64748B] mt-2.5 pt-2 border-t border-[#F1F5F9] leading-relaxed animate-in fade-in duration-200">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 12. PRE-FOOTER NEWSLETTER & LINKS ================= */}
      <footer id="contact" className="pt-16 pb-12 bg-white border-t border-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-1.5 select-none">
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
              </svg>
              <span className="text-lg font-bold tracking-tight text-[#0F172A] font-poppins">
                Orbitask
              </span>
            </div>

            <p className="text-xs font-medium text-[#64748B] leading-relaxed max-w-sm">
              The modern workspace and project management platform built for velocity, team focus, and seamless collaboration.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing!");
              }}
              className="flex items-center gap-2 pt-2 max-w-xs"
            >
              <input
                type="email"
                required
                placeholder="Enter your email..."
                className="w-full h-9 px-3 border border-[#CBD5E1] rounded-[5px] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
              <button
                type="submit"
                className="h-9 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium rounded-[5px] shrink-0 transition-colors shadow-xs cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Nav Links Columns */}
          <div className="md:col-span-2 space-y-3 text-left">
            <span className="text-xs font-bold text-[#0F172A] font-poppins block">Product</span>
            <ul className="space-y-2 text-xs font-medium text-[#64748B]">
              <li><a href="#features" className="hover:text-[#2563EB]">Features</a></li>
              <li><a href="#pricing" className="hover:text-[#2563EB]">Pricing</a></li>
              <li><Link href="/workspace" className="hover:text-[#2563EB]">Workspace Demo</Link></li>
              <li><a href="#features" className="hover:text-[#2563EB]">Integrations</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3 text-left">
            <span className="text-xs font-bold text-[#0F172A] font-poppins block">Company</span>
            <ul className="space-y-2 text-xs font-medium text-[#64748B]">
              <li><a href="#contact" className="hover:text-[#2563EB]">About Us</a></li>
              <li><a href="#contact" className="hover:text-[#2563EB]">Careers</a></li>
              <li><a href="#contact" className="hover:text-[#2563EB]">Press</a></li>
              <li><a href="#contact" className="hover:text-[#2563EB]">Contact</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3 text-left">
            <span className="text-xs font-bold text-[#0F172A] font-poppins block">Legal</span>
            <ul className="space-y-2 text-xs font-medium text-[#64748B]">
              <li><a href="#" className="hover:text-[#2563EB]">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#2563EB]">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#2563EB]">Security</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3 text-left">
            <span className="text-xs font-bold text-[#0F172A] font-poppins block">Platform</span>
            <ul className="space-y-2 text-xs font-medium text-[#64748B]">
              <li><Link href="/login" className="hover:text-[#2563EB]">Admin Portal</Link></li>
              <li><Link href="/login" className="hover:text-[#2563EB]">Login</Link></li>
              <li><Link href="/login" className="hover:text-[#2563EB]">Register</Link></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* ================= 13. BOTTOM COPYRIGHT BAR (BLUE BAR IN SCREENSHOT) ================= */}
      <div className="w-full bg-[#2563EB] text-white py-4 px-6 sm:px-8 border-t border-blue-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px]">
              O
            </div>
            <span className="font-poppins font-bold tracking-tight">Orbitask</span>
            <span className="text-white/70 ml-2">© 2026 Orbitask Inc. All rights reserved.</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-white/80">
            <a href="#" className="hover:text-white transition-colors" title="Twitter / X">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="LinkedIn">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="Facebook">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors" title="GitHub">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
