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
  Lock,
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

function SectionLabel({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "green" }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className={`block w-5 h-[2px] rounded-full ${color === "green" ? "bg-emerald-500" : "bg-blue-500"}`} />
      <span className={`text-[11px] font-black uppercase tracking-[0.18em] ${color === "green" ? "text-emerald-400" : "text-blue-400"}`}>
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
    <div className="min-h-screen bg-[#060d18] text-slate-100 font-[var(--font-space-grotesk)]">
      <Navbar variant="marketing" />

      {/* ═══════════ HERO ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[500px] -translate-x-1/2 -translate-y-1/3"
          style={{ background: "radial-gradient(ellipse at center, rgba(37,99,235,0.14) 0%, transparent 70%)" }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-center">

            {/* Left — text */}
            <div>
              <motion.div {...up(0)}>
                <SectionLabel>UK Construction · CDM 2015 · Free</SectionLabel>
              </motion.div>

              <motion.h1 {...up(0.07)}
                className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-black tracking-[-0.02em] leading-[1.04] text-white mb-6">
                Professional RAMS documents,{" "}
                <span className="text-blue-400">generated in minutes.</span>
              </motion.h1>

              <motion.p {...up(0.13)}
                className="text-slate-400 text-[1.05rem] leading-[1.75] max-w-lg mb-9">
                CDM 2015 compliant risk assessments &amp; method statements built for UK
                subcontractors — trade-specific, legally sound, ready for principal contractor
                approval on the first submission.
              </motion.p>

              <motion.div {...up(0.18)} className="flex flex-wrap gap-3 mb-11">
                <Link href="/generate"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-[0_4px_24px_rgba(37,99,235,0.30)] hover:shadow-[0_6px_32px_rgba(37,99,235,0.42)] hover:-translate-y-0.5">
                  Generate RAMS — it&apos;s free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="#how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-slate-300 text-sm font-semibold rounded-lg border border-[#1e3a6e] bg-[#0a1628] hover:border-blue-700/50 hover:bg-[#0f2040] transition-all">
                  How it works
                  <ChevronDown className="w-4 h-4" />
                </a>
              </motion.div>

              <motion.div {...up(0.22)} className="flex flex-wrap gap-2">
                {["CDM 2015", "COSHH 2002", "PUWER 1998", "LOLER 1998", "RIDDOR 2013"].map(b => (
                  <span key={b}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-blue-300 border border-blue-900/70 bg-blue-950/50 rounded uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    {b}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — RAMS document preview */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, x: 28 }}
              animate={reduce ? undefined : { opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26, delay: 0.18 }}
              className="hidden lg:block"
            >
              {/* Outer floating frame */}
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.18) 0%, transparent 70%)", filter: "blur(20px)" }} />

                <div className="relative bg-[#0d1f3c] border border-[#1e3a6e] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

                  {/* Doc header bar */}
                  <div className="flex items-center justify-between px-5 py-3 bg-blue-700 border-b border-blue-600/50">
                    <div className="flex items-center gap-2">
                      <HardHat className="w-4 h-4 text-white" />
                      <span className="text-xs font-black text-white tracking-tight">RISK ASSESSMENT & METHOD STATEMENT</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-blue-300" />
                      <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Confidential</span>
                    </div>
                  </div>

                  {/* Project metadata */}
                  <div className="px-5 py-3 border-b border-[#1e3a6e] bg-[#0a1628]">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {[
                        ["Company", "Apex Groundworks Ltd"],
                        ["Project", "Elm Road, Solihull"],
                        ["Principal Contractor", "Balfour Beatty Plc"],
                        ["Supervisor", "J. Smith — SSSTS"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">{label}</p>
                          <p className="text-[11px] font-semibold text-slate-300 leading-snug">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk assessment rows */}
                  <div className="px-5 pt-4 pb-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Risk Assessment</p>
                    <div className="space-y-2">
                      {[
                        { ref: "RA-01", hazard: "Excavation collapse ≥1.2m", pre: 15, post: 4, preLabel: "HIGH", postLabel: "LOW", control: "Shoring + confined space protocol" },
                        { ref: "RA-02", hazard: "Buried services strike", pre: 12, post: 4, preLabel: "HIGH", postLabel: "LOW", control: "CAT scan + Permit to Dig" },
                        { ref: "RA-03", hazard: "Plant/pedestrian conflict", pre: 9, post: 3, preLabel: "MED", postLabel: "LOW", control: "Banksman + exclusion zone" },
                      ].map((row) => (
                        <div key={row.ref} className="bg-[#060d18] rounded-lg border border-[#1e3a6e]/60 p-3">
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex items-start gap-2">
                              <span className="text-[10px] font-black text-blue-500 mt-0.5 flex-shrink-0">{row.ref}</span>
                              <p className="text-[11px] font-semibold text-slate-300 leading-tight">{row.hazard}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">{row.pre}</span>
                              <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{row.post}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-500 pl-7">{row.control}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Method statement strip */}
                  <div className="mx-5 mb-4 rounded-lg border border-[#1e3a6e]/60 bg-[#060d18] p-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Method Statement</p>
                    <div className="space-y-1">
                      {["CAT scan & trial holes to locate buried services", "Establish exclusion zone & traffic management", "Excavate with shoring installed progressively"].map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[10px] font-black text-blue-600/60 flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                          <p className="text-[10px] text-slate-400 leading-snug">{step}</p>
                        </div>
                      ))}
                      <p className="text-[10px] text-slate-600 pt-1">+ 7 further steps generated automatically…</p>
                    </div>
                  </div>

                  {/* Footer badges */}
                  <div className="px-5 py-3 bg-[#0a1628] border-t border-[#1e3a6e] flex items-center gap-3 flex-wrap">
                    {["CDM 2015", "COSHH 2002", "PUWER 1998"].map(b => (
                      <span key={b} className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />{b}
                      </span>
                    ))}
                    <span className="ml-auto text-[9px] text-slate-600">Rev 0 · Generated in 47 seconds</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════ CAPABILITY STRIP ════════════════════════════ */}
      <div className="border-y border-[#1e3a6e]/60 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-10 gap-y-2">
          {[
            "9 trade disciplines",
            "130+ specific activities",
            "PDF & Word export",
            "No login required",
            "Free to use",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════ HOW IT WORKS ════════════════════════════════ */}
      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...view()}>
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
              Three steps to a compliant RAMS
            </h2>
            <p className="text-slate-500 text-sm max-w-lg leading-relaxed mb-14">
              No H&S degree required. Answer a few questions about your job, and we handle the rest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ n, icon: Icon, title, body }, i) => (
              <motion.div key={n} {...view(i * 0.1)}
                className="relative p-7 bg-[#0a1628] border border-[#1e3a6e] rounded-2xl hover:border-blue-700/50 hover:bg-[#0d1f3c] transition-all group">
                {/* Step number watermark */}
                <p className="text-[5rem] font-black leading-none text-blue-600/10 group-hover:text-blue-600/15 transition-colors select-none mb-1">
                  {n}
                </p>
                <Icon className="w-5 h-5 text-blue-400 mb-4" />
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...view(0.32)} className="mt-10 flex items-center gap-5">
            <Link href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)]">
              Start generating — free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-slate-600">No account needed · Under 5 minutes</span>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TRADE COVERAGE ══════════════════════════════ */}
      <section className="py-24 sm:py-32 border-t border-[#1e3a6e]/60 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...view()} className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 mb-12">
            <div>
              <SectionLabel>Trade Coverage</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
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
                className="group flex items-center gap-4 px-5 py-4 bg-[#0d1f3c] border border-[#1e3a6e] rounded-xl hover:border-blue-600/60 hover:bg-[#0f2244] transition-all cursor-default">
                <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white leading-snug truncate">{label}</p>
                  <p className="text-[10px] font-bold text-blue-500/70 mt-0.5 uppercase tracking-wider">{reg}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          <motion.div {...view(0.4)} className="mt-10">
            <Link href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-blue-400 border border-blue-800/60 bg-blue-950/40 rounded-lg hover:bg-blue-900/30 hover:border-blue-600/50 transition-all">
              Select your trade and start
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURES ════════════════════════════════════ */}
      <section id="features" className="py-24 sm:py-32 border-t border-[#1e3a6e]/60">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...view()} className="mb-12">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white max-w-xl">
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
                  className="p-7 bg-[#0a1628] border border-[#1e3a6e] rounded-2xl hover:border-blue-700/50 transition-all flex flex-col">
                  <span className="inline-block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-5 px-2.5 py-1 border border-blue-800/60 rounded bg-blue-950/50 self-start">
                    {tag}
                  </span>
                  <Icon className="w-6 h-6 text-blue-400 mb-4" />
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </div>

            {/* 4 small features */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {[
                { icon: FileText, title: "Professional PDF", body: "Cover page, risk matrix, headers, CONFIDENTIAL watermark, sign-off block." },
                { icon: UploadCloud, title: "Scope upload", body: "Upload PDF/DOCX tender spec and we auto-fill project details." },
                { icon: BookOpen, title: "Regulation checker", body: "Cross-references legislation.gov.uk to flag amendments." },
                { icon: AlertTriangle, title: "Trade-detected hazards", body: "AI auto-detects trades from your description and adds relevant hazards." },
              ].map(({ icon: Icon, title, body }, i) => (
                <motion.div key={title} {...view(0.1 + i * 0.06)}
                  className="flex items-start gap-4 p-5 bg-[#0a1628] border border-[#1e3a6e] rounded-xl hover:border-blue-700/40 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPLIANCE ══════════════════════════════════ */}
      <section className="py-20 border-t border-[#1e3a6e]/60 bg-[#0a1628]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 items-start">
            <motion.div {...view()}>
              <SectionLabel color="green">Compliance</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
                UK regulations covered in every RAMS
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                Every document references the specific regulations that apply to your scope — not a blanket list of every H&S law ever published.
              </p>
              <Link href="/regulations"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                Check regulation currency
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <motion.div {...view(0.1)} className="flex flex-wrap gap-2">
              {REGS.map((reg) => (
                <span key={reg}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 border border-[#1e3a6e] bg-[#0d1f3c] rounded-lg hover:border-blue-700/40 hover:text-slate-300 transition-colors">
                  <ShieldCheck className="w-3 h-3 text-emerald-500/70 flex-shrink-0" />
                  {reg}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 border-t border-[#1e3a6e]/60">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div {...view()}
            className="relative overflow-hidden rounded-2xl border border-[#1e3a6e] bg-[#0d1f3c] p-10 lg:p-14">
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 60% 80% at 100% 50%, rgba(37,99,235,0.10) 0%, transparent 70%)" }} />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-7 shadow-[0_8px_24px_rgba(37,99,235,0.35)]">
                  <HardHat className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
                  Ready to generate your first RAMS?
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  No subscription. No login. No generic templates. Generate a principal
                  contractor-ready RAMS document in under 5 minutes — free.
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end gap-4">
                <Link href="/generate"
                  className="inline-flex items-center gap-2.5 px-9 py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-[0_4px_28px_rgba(37,99,235,0.32)] hover:shadow-[0_6px_36px_rgba(37,99,235,0.44)] hover:-translate-y-0.5">
                  Generate RAMS Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-xs text-slate-600">
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
