"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Cpu,
  Download,
  UploadCloud,
  BookOpen,
  CheckCircle2,
  HardHat,
  Layers,
  ClipboardList,
  Zap,
  Building2,
  Flame,
  Home,
  Settings,
  PaintBucket,
  Shovel,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ── Data ────────────────────────────────────────────────────────

const TRADES = [
  { id: "groundworks", label: "Groundworks & Civil Engineering", desc: "Excavation, drainage, piling, earthworks", icon: Shovel, reg: "CDM 2015" },
  { id: "building", label: "Building & Structural Works", desc: "Brickwork, concrete frames, structural steel", icon: Building2, reg: "CDM 2015" },
  { id: "electrical", label: "Electrical Installations", desc: "First & second fix, EV charging, data & comms", icon: Zap, reg: "EaWR 1989" },
  { id: "plumbing", label: "Plumbing, Heating & Gas", desc: "Pipework, boilers, gas installations, HVAC", icon: Flame, reg: "GSIUR 1998" },
  { id: "scaffolding", label: "Scaffolding & Temporary Access", desc: "Tube & fitting, system scaffold, MEWPs", icon: Layers, reg: "WAH 2005" },
  { id: "demolition", label: "Demolition & Strip-Out", desc: "Soft strip, structural demolition, asbestos", icon: HardHat, reg: "CAR 2012" },
  { id: "me", label: "M&E", desc: "Ductwork, HVAC, BMS, LV/HV distribution", icon: Settings, reg: "PUWER 1998" },
  { id: "roofing", label: "Roofing & Cladding", desc: "Flat roofing, pitched, metal cladding", icon: Home, reg: "WAH 2005" },
  { id: "fitout", label: "Internal Fit-Out & Finishes", desc: "Partitions, ceilings, flooring, joinery", icon: PaintBucket, reg: "MHOR 1992" },
];

const PROBLEMS = [
  "Writing a RAMS from scratch takes 3–6 hours — time billed at day-rate, not document-rate.",
  "Generic Word templates miss your specific hazards, plant, and control measures.",
  "Principal contractors reject non-compliant docs. Resubmissions delay your start date.",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Layers,
    title: "Select your trade discipline",
    desc: "Choose from 9 industry types — groundworks, electrical, scaffolding, plumbing, demolition and more. Then pick from 130+ specific trade activities relevant to your exact scope.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Enter your project details",
    desc: "Add company info, site address, supervisor, plant, operatives and emergency contacts. Or upload a scope document and we'll pre-fill it automatically.",
  },
  {
    step: "03",
    icon: Download,
    title: "Generate, download, submit",
    desc: "AI generates a fully detailed, trade-specific RAMS — hazards, control measures, method statement, emergency procedures. Download instantly as PDF or Word.",
  },
];

const FEATURE_PRIMARY = [
  {
    icon: Cpu,
    label: "AI Generation",
    title: "Trade-specific, not generic",
    desc: "Our AI is trained on UK H&S legislation, HSE approved codes of practice, and real-world RAMS that have passed PC scrutiny. Every output is specific to your trade, your scope, and your site conditions — not boilerplate content.",
  },
  {
    icon: ShieldCheck,
    label: "CDM Compliance",
    title: "Ready for principal contractor approval",
    desc: "Every RAMS is checked against CDM 2015 duties, COSHH, PUWER, LOLER, Work at Height, Confined Spaces and RIDDOR. Correct from the first draft — no re-submissions, no delays to your start date.",
  },
];

const FEATURE_SUPPORTING = [
  { icon: FileText, title: "Professional PDF output", desc: "Cover page, risk matrix, running headers, signature block, CONFIDENTIAL watermark." },
  { icon: UploadCloud, title: "Scope document upload", desc: "Upload a PDF or DOCX tender spec and we extract project details automatically." },
  { icon: BookOpen, title: "Regulation currency checker", desc: "Checks each regulation against legislation.gov.uk to flag amendments before you submit." },
  { icon: Download, title: "PDF & Word export", desc: "Download in both formats for digital filing and easy PC submission or email." },
];

const REGULATIONS = [
  "CDM 2015", "HASAWA 1974", "COSHH 2002", "PUWER 1998",
  "LOLER 1998", "RIDDOR 2013", "Work at Height 2005",
  "Confined Spaces 1997", "Manual Handling 1992", "Noise at Work 2005",
  "Control of Vibration 2005", "Electricity at Work 1989",
];

const PREVIEW_ROWS = [
  { activity: "Excavation works ≥1.2m deep", l: 3, s: 4, score: 12, hot: true, control: "Shoring / benching system" },
  { activity: "Confined space entry", l: 2, s: 5, score: 10, hot: true, control: "Permit to work issued" },
  { activity: "Lifting operations (LOLER)", l: 2, s: 4, score: 8, hot: false, control: "LOLER scheme in place" },
];

// ── Component ────────────────────────────────────────────────────

export default function LandingPage() {
  const shouldReduceMotion = useReducedMotion();

  const fadeIn = (delay = 0) => ({
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 18 },
    animate: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 300, damping: 30, delay },
  });

  const inView = (delay = 0) => ({
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 14 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { type: "spring" as const, stiffness: 280, damping: 28, delay },
  });

  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100">
      <Navbar variant="marketing" />

      {/* ══════════════════════════════════════════════════════
          HERO — 2-column, left-aligned
          ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[#1e3a6e]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 90% at 0% 50%, rgba(37,99,235,0.10) 0%, transparent 65%)" }}
        />
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-14 items-center">

            {/* Text */}
            <div className="max-w-2xl">
              <motion.div {...fadeIn(0)}>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-[3px] h-4 rounded-full bg-blue-600 flex-shrink-0" />
                  <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.15em]">
                    UK Construction · CDM 2015 · Free to Use
                  </span>
                </div>
              </motion.div>

              <motion.h1
                {...fadeIn(0.06)}
                className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.03] text-white mb-6"
              >
                Professional RAMS.{" "}
                <span className="text-blue-400">Built for UK subcontractors.</span>
              </motion.h1>

              <motion.p {...fadeIn(0.12)} className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
                Generate CDM 2015 compliant risk assessments &amp; method statements for your specific trade — in under 3 minutes, ready for principal contractor approval.
              </motion.p>

              <motion.div {...fadeIn(0.18)} className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/generate"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/40 text-sm"
                >
                  Generate RAMS Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0f2040] hover:bg-[#152a52] text-slate-300 font-semibold rounded-xl border border-[#1e3a6e] hover:border-blue-700/40 transition-colors text-sm"
                >
                  See how it works
                </a>
              </motion.div>

              <motion.div {...fadeIn(0.24)} className="flex flex-wrap gap-2">
                {["CDM 2015", "COSHH 2002", "RIDDOR 2013", "PUWER 1998", "LOLER 1998"].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold border border-blue-800/50 bg-blue-950/40 text-blue-400 rounded-full uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {badge}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* RAMS document preview card */}
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, x: 20 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.16 }}
              className="hidden lg:block"
            >
              <div className="bg-[#0f2040] border border-[#1e3a6e] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                {/* Doc header */}
                <div className="bg-blue-700 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-black">RAMS — Elm Road, Solihull</span>
                  </div>
                  <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Rev 0</span>
                </div>

                {/* Doc meta */}
                <div className="px-5 pt-3.5 pb-3 border-b border-[#1e3a6e]/60">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Subcontractor</p>
                  <p className="text-xs font-semibold text-white">Apex Groundworks Ltd · J. Smith, Supervisor</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Principal Contractor: Balfour Beatty Plc</p>
                </div>

                {/* Risk matrix excerpt */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Assessment</p>
                    <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />CDM 2015
                    </span>
                  </div>
                  <div className="space-y-2">
                    {PREVIEW_ROWS.map((row) => (
                      <div key={row.activity} className="bg-[#0a1628] rounded-lg p-2.5 border border-[#1e3a6e]/60">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-[11px] font-semibold text-slate-300 leading-snug">{row.activity}</p>
                          <span className={`flex-shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded ${row.hot ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                            {row.score}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600">
                          <span>L:{row.l} × S:{row.s}</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className="text-blue-400">{row.control}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-600 text-center pt-3">
                    + 9 more hazards · Method statement · Emergency procedures
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CAPABILITY STRIP
          ══════════════════════════════════════════════════════ */}
      <section className="border-b border-[#1e3a6e] bg-[#0f2040]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /><strong className="text-white">9</strong>&nbsp;trade disciplines</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /><strong className="text-white">130+</strong>&nbsp;specific activities</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />PDF &amp; Word export</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />No login required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />Free to use</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROBLEM SECTION
          ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#070e1c] border-b border-[#1e3a6e]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 items-start">
            <motion.div {...inView()}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-[3px] h-4 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-[11px] font-black text-red-400 uppercase tracking-[0.15em]">The Problem</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                Sound familiar?
              </h2>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                Subcontractors spend hours writing RAMS that get rejected anyway. There&apos;s a better way.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PROBLEMS.map((desc, i) => (
                <motion.div key={i} {...inView(i * 0.1)} className="p-5 bg-[#0f2040] border border-red-900/30 rounded-xl">
                  <XCircle className="w-5 h-5 text-red-500/70 mb-3 flex-shrink-0" />
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRADE COVERAGE
          ══════════════════════════════════════════════════════ */}
      <section className="py-24 border-b border-[#1e3a6e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...inView()} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-[3px] h-4 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.15em]">Trade Coverage</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Built for the trades that build Britain
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed self-end">
                Each trade profile includes industry-specific hazards, control measures, method statements and the relevant regulations — not generic construction content.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRADES.map(({ id, label, desc, icon: Icon, reg }, i) => (
              <motion.div
                key={id}
                {...inView(i * 0.04)}
                className="group flex items-stretch p-4 bg-[#0f2040] border border-[#1e3a6e] rounded-xl hover:border-blue-700/50 hover:bg-[#112248] transition-colors"
              >
                <div className="w-[3px] rounded-full bg-[#1e3a6e] group-hover:bg-blue-600 transition-colors flex-shrink-0 mr-4 self-stretch" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <p className="text-sm font-bold text-white leading-snug">{label}</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">{desc}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded uppercase tracking-wider">
                    {reg}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...inView(0.35)} className="mt-10">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Select your trade
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-24 bg-[#070e1c] border-b border-[#1e3a6e]/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...inView()} className="mb-14">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-[3px] h-4 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.15em]">How It Works</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Three steps to a compliant RAMS
            </h2>
          </motion.div>

          <div className="space-y-5">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                {...inView(i * 0.1)}
                className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-5 p-7 bg-[#0f2040] border border-[#1e3a6e] rounded-xl hover:border-blue-700/30 transition-colors"
              >
                <div>
                  <p className="text-4xl font-black text-blue-600/15 leading-none mb-3">{step}</p>
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="md:border-l md:border-[#1e3a6e] md:pl-6">
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...inView(0.32)} className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/generate" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm">
              Start now — it&apos;s free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-slate-600">No login required · Under 5 minutes</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES — asymmetric 2 primary + 4 supporting
          ══════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 border-b border-[#1e3a6e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...inView()} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-[3px] h-4 rounded-full bg-blue-600 flex-shrink-0" />
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.15em]">Features</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Everything you need to produce a compliant RAMS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Primary — 2 stacked */}
            <div className="flex flex-col gap-5">
              {FEATURE_PRIMARY.map(({ icon: Icon, label, title, desc }, i) => (
                <motion.div
                  key={title}
                  {...inView(i * 0.08)}
                  className="flex-1 p-7 bg-[#0f2040] border border-[#1e3a6e] rounded-2xl hover:border-blue-700/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-[3px] h-4 rounded-full bg-blue-600 flex-shrink-0" />
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{label}</span>
                  </div>
                  <Icon className="w-6 h-6 text-blue-400 mb-4" />
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Supporting — 2×2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FEATURE_SUPPORTING.map(({ icon: Icon, title, desc }, i) => (
                <motion.div
                  key={title}
                  {...inView(0.1 + i * 0.07)}
                  className="p-5 bg-[#0f2040] border border-[#1e3a6e] rounded-xl hover:border-blue-700/40 transition-colors"
                >
                  <Icon className="w-4 h-4 text-blue-400 mb-3" />
                  <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          REGULATIONS
          ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#070e1c] border-b border-[#1e3a6e]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 items-start">
            <motion.div {...inView()}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-[3px] h-4 rounded-full bg-blue-600 flex-shrink-0" />
                <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.15em]">Compliance</span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-3">
                UK regulations covered in every RAMS
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">
                Every document references the specific regulations that apply to your scope of works — not a blanket list of every H&S law ever written.
              </p>
              <Link
                href="/regulations"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Check regulation currency
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <motion.div {...inView(0.1)} className="flex flex-wrap gap-2">
              {REGULATIONS.map((reg) => (
                <span
                  key={reg}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-700 bg-slate-900/60 text-slate-400 rounded-full"
                >
                  <HardHat className="w-3 h-3 text-blue-500/70 flex-shrink-0" />
                  {reg}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA — horizontal split
          ══════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...inView()}
            className="bg-[#0f2040] border border-[#1e3a6e] rounded-2xl p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-900/40">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-4">
                Ready to generate your RAMS?
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                No subscription. No login required. Start generating compliant, principal-contractor-ready RAMS documents in under 5 minutes. Free to use.
              </p>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <Link
                href="/generate"
                className="inline-flex items-center gap-2 px-9 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl transition-colors shadow-xl shadow-blue-900/40"
              >
                Generate RAMS Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-slate-600">No credit card required · Instant download · PDF &amp; Word</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
