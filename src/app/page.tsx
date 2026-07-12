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
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ── Static data ──────────────────────────────────────────────────

const TRADES = [
  { id: "groundworks", label: "Groundworks & Civil", icon: Shovel, reg: "CDM 2015" },
  { id: "building", label: "Building & Structural", icon: Building2, reg: "CDM 2015" },
  { id: "electrical", label: "Electrical", icon: Zap, reg: "EaWR 1989" },
  { id: "plumbing", label: "Plumbing, Heating & Gas", icon: Flame, reg: "GSIUR 1998" },
  { id: "scaffolding", label: "Scaffolding", icon: Layers, reg: "WAH 2005" },
  { id: "demolition", label: "Demolition", icon: HardHat, reg: "CAR 2012" },
  { id: "me", label: "M&E", icon: Settings, reg: "PUWER 1998" },
  { id: "roofing", label: "Roofing & Cladding", icon: Home, reg: "WAH 2005" },
  { id: "fitout", label: "Internal Fit-Out", icon: PaintBucket, reg: "MHOR 1992" },
];

const STEPS = [
  {
    n: "01",
    icon: Layers,
    title: "Choose your trade",
    body: "Select from 9 industry disciplines and 130+ specific trade activities tailored to your scope of works.",
  },
  {
    n: "02",
    icon: ClipboardList,
    title: "Enter project details",
    body: "Fill in a guided 5-step form — or upload a scope document and we'll pre-fill everything automatically.",
  },
  {
    n: "03",
    icon: Download,
    title: "Generate & export",
    body: "AI produces a CDM-compliant RAMS with risk matrix, method statement and emergency procedures. Download as PDF or Word.",
  },
];

const REGS = [
  "CDM 2015", "HASAWA 1974", "COSHH 2002", "PUWER 1998",
  "LOLER 1998", "RIDDOR 2013", "Work at Height 2005",
  "Confined Spaces 1997", "Manual Handling 1992",
  "Noise at Work 2005", "Control of Vibration 2005",
  "Electricity at Work 1989",
];

// ── Sub-components ───────────────────────────────────────────────

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className={`block w-5 h-[2px] rounded-full ${light ? "bg-amber-400" : "bg-amber-500"}`} />
      <span className={`text-[11px] font-black uppercase tracking-[0.18em] ${light ? "text-amber-300" : "text-amber-600"}`}>
        {children}
      </span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────

export default function LandingPage() {
  const reduce = useReducedMotion();

  const up = (d = 0) => ({
    initial: reduce ? undefined : { opacity: 0, y: 22 },
    animate: reduce ? undefined : { opacity: 1, y: 0 },
    transition: { type: "spring" as const, stiffness: 280, damping: 28, delay: d },
  });

  const view = (d = 0) => ({
    initial: reduce ? undefined : { opacity: 0, y: 18 },
    whileInView: reduce ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { type: "spring" as const, stiffness: 260, damping: 26, delay: d },
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-[var(--font-space-grotesk)]">
      <Navbar variant="marketing" />

      {/* ═══════════ HERO ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center">

            {/* Left — text */}
            <div>
              <motion.div {...up(0)}>
                <SectionLabel>UK Construction · CDM 2015 · Free</SectionLabel>
              </motion.div>

              <motion.h1 {...up(0.07)}
                className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-black tracking-[-0.02em] leading-[1.04] text-slate-900 mb-6">
                Professional RAMS documents,{" "}
                <span className="text-amber-500">generated in minutes.</span>
              </motion.h1>

              <motion.p {...up(0.13)}
                className="text-slate-600 text-[1.05rem] leading-[1.75] max-w-lg mb-9">
                CDM 2015 compliant risk assessments &amp; method statements built for UK
                subcontractors — trade-specific, legally sound, ready for principal contractor
                approval on the first submission.
              </motion.p>

              <motion.div {...up(0.18)} className="flex flex-wrap gap-3 mb-11">
                <Link href="/generate"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition-all shadow-[0_4px_24px_rgba(245,158,11,0.30)] hover:shadow-[0_6px_32px_rgba(245,158,11,0.40)] hover:-translate-y-0.5">
                  Generate RAMS — it&apos;s free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all">
                  How it works
                  <ChevronDown className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div {...up(0.22)} className="flex flex-wrap gap-2">
                {["CDM 2015", "COSHH 2002", "PUWER 1998", "LOLER 1998", "RIDDOR 2013"].map(b => (
                  <span key={b}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-blue-700 border border-blue-200 bg-blue-50 rounded uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    {b}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — 3-step flow diagram */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, x: 28 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.18 }}
              className="hidden lg:block"
            >
              <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                {/* Header */}
                <div className="bg-[#1a2e4a] px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <HardHat className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white tracking-wide uppercase">RAMS Generator</p>
                    <p className="text-[10px] text-slate-300">CDM 2015 compliant · free</p>
                  </div>
                </div>

                {/* Steps */}
                <div className="p-6 space-y-0">
                  {[
                    { n: "1", icon: Layers, title: "Select your trade & activities", sub: "9 disciplines · 130+ activities" },
                    { n: "2", icon: ClipboardList, title: "Fill in 5 guided project steps", sub: "Company · scope · operatives · sign-off" },
                    { n: "3", icon: Download, title: "Download CDM-compliant RAMS", sub: "PDF & Word · risk matrix · sign-off block" },
                  ].map(({ n, icon: Icon, title, sub }, i, arr) => (
                    <div key={n}>
                      <div className="flex items-start gap-4 py-5">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-[#1a2e4a] flex items-center justify-center shadow-sm">
                            <span className="text-xs font-black text-white">{n}</span>
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <p className="text-sm font-bold text-slate-900">{title}</p>
                          </div>
                          <p className="text-xs text-slate-500">{sub}</p>
                        </div>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="ml-4 flex items-center gap-3 pb-1">
                          <div className="w-px h-5 bg-slate-200 ml-[17px]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Link href="/generate"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition-colors">
                    Generate RAMS — it&apos;s free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-center text-[10px] text-slate-400 mt-2">No account · No credit card · Instant download</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════ CAPABILITY STRIP ════════════════════════════ */}
      <div className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-10 gap-y-2">
          {[
            "9 trade disciplines",
            "130+ specific activities",
            "PDF & Word export",
            "No login required",
            "Free to use",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════ HOW IT WORKS ════════════════════════════════ */}
      <section id="how-it-works" className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...view()}>
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4">
              Three steps to a compliant RAMS
            </h2>
            <p className="text-slate-500 text-sm max-w-lg leading-relaxed mb-14">
              No H&S degree required. Answer a few questions about your job, and we handle the rest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ n, icon: Icon, title, body }, i) => (
              <motion.div key={n} {...view(i * 0.1)}
                className="relative p-7 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all group shadow-sm">
                {/* Step number watermark */}
                <p className="text-[5rem] font-black leading-none text-[#1a2e4a]/5 group-hover:text-[#1a2e4a]/8 transition-colors select-none mb-1">
                  {n}
                </p>
                <Icon className="w-5 h-5 text-[#1a2e4a] mb-4" />
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...view(0.32)} className="mt-10 flex items-center gap-5">
            <Link href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition-all">
              Start generating — free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-slate-400">No account needed · Under 5 minutes</span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TRADE COVERAGE ══════════════════════════════ */}
      <section className="py-24 sm:py-32 border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...view()} className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 mb-12">
            <div>
              <SectionLabel>Trade Coverage</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Built for the trades that build Britain
              </h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed self-end max-w-md">
              Each profile includes industry-specific hazards, control measures, and method
              statements — not content copy-pasted from a generic construction template.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TRADES.map(({ id, label, icon: Icon, reg }, i) => (
              <motion.div key={id} {...view(i * 0.04)}
                className="group flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-xl hover:border-amber-300 hover:shadow-sm transition-all cursor-default shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors">
                  <Icon className="w-4 h-4 text-[#1a2e4a] group-hover:text-amber-600 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-snug truncate">{label}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{reg}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          <motion.div {...view(0.4)} className="mt-10">
            <Link href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#1a2e4a] border border-slate-300 bg-white rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm">
              Select your trade and start
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES ════════════════════════════════════ */}
      <section id="features" className="py-24 sm:py-32 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...view()} className="mb-12">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 max-w-xl">
              Everything needed for a compliant RAMS — in one place
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* 2 large features */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: Cpu,
                  tag: "AI Generation",
                  title: "Trade-specific, not boilerplate",
                  body: "Our AI is trained on UK H&S legislation, HSE approved codes of practice, and real-world RAMS that have passed PC scrutiny. Every hazard and control measure is specific to your exact scope and trade.",
                },
                {
                  icon: ShieldCheck,
                  tag: "CDM Compliance",
                  title: "Principal contractor-ready, first time",
                  body: "Every document is checked against CDM 2015 duties, COSHH, PUWER, LOLER, Work at Height and Confined Spaces. Correct from the first draft — no re-submissions, no start-date delays.",
                },
              ].map(({ icon: Icon, tag, title, body }, i) => (
                <motion.div key={title} {...view(i * 0.08)}
                  className="p-7 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all flex flex-col shadow-sm">
                  <span className="inline-block text-[10px] font-black text-blue-700 uppercase tracking-widest mb-5 px-2.5 py-1 border border-blue-200 rounded bg-blue-50 self-start">
                    {tag}
                  </span>
                  <Icon className="w-6 h-6 text-[#1a2e4a] mb-4" />
                  <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </div>

            {/* 4 small features */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {[
                { icon: FileText, title: "Professional PDF", body: "Cover page, risk matrix, revision history, sign-off block — print-ready." },
                { icon: UploadCloud, title: "Scope upload", body: "Upload PDF/DOCX tender spec and we auto-fill project details." },
                { icon: BookOpen, title: "Regulation checker", body: "Cross-references legislation.gov.uk to flag amendments." },
                { icon: AlertTriangle, title: "Trade-detected hazards", body: "AI auto-detects trades from your description and adds relevant hazards." },
              ].map(({ icon: Icon, title, body }, i) => (
                <motion.div key={title} {...view(0.1 + i * 0.06)}
                  className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-all shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#1a2e4a]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPLIANCE — navy band ══════════════════════ */}
      <section className="py-20 bg-[#1a2e4a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">
            <motion.div {...view()}>
              <SectionLabel light>Compliance</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
                UK regulations covered in every RAMS
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Every document references the specific regulations that apply to your scope — not a blanket list of every H&S law ever published.
              </p>
              <Link href="/regulations"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                Check regulation currency
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <motion.div {...view(0.1)} className="flex flex-wrap gap-2">
              {REGS.map((reg) => (
                <span key={reg}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 border border-white/10 bg-white/5 rounded-lg hover:border-white/20 hover:text-white transition-colors">
                  <ShieldCheck className="w-3 h-3 text-emerald-400/70 flex-shrink-0" />
                  {reg}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...view()}
            className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-10 lg:p-14 shadow-sm">

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1a2e4a] flex items-center justify-center mb-7 shadow-sm">
                  <HardHat className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-4 leading-tight">
                  Ready to generate your first RAMS?
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                  No subscription. No login. No generic templates. Generate a principal
                  contractor-ready RAMS document in under 5 minutes — free.
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-4">
                <Link href="/generate"
                  className="inline-flex items-center gap-2.5 px-9 py-4 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition-all shadow-[0_4px_28px_rgba(245,158,11,0.30)] hover:shadow-[0_6px_36px_rgba(245,158,11,0.40)] hover:-translate-y-0.5">
                  Generate RAMS Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-slate-400">
                  No credit card · PDF &amp; Word included · Instant download
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
