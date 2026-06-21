"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 320, damping: 32, delay },
});

const COMPLIANCE_BADGES = [
  "CDM 2015",
  "COSHH 2002",
  "RIDDOR 2013",
  "PUWER 1998",
  "LOLER 1998",
];

const STATS = [
  { value: "9", label: "Industry Types" },
  { value: "130+", label: "Trade Activities" },
  { value: "CDM 2015", label: "Compliant Output" },
  { value: "PDF & Word", label: "Export Formats" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Layers,
    title: "Choose Industry & Trades",
    desc: "Select your company type — groundworks, electrical, scaffolding, plumbing, demolition or more — then pick from 130+ specific trade activities.",
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Enter Project Details",
    desc: "Add your company, site address, supervisor, plant, operatives and emergency contacts in a guided 5-step form. Or upload a scope document and we'll pre-fill it.",
  },
  {
    step: "03",
    icon: Download,
    title: "Generate & Export",
    desc: "Our AI produces a fully detailed, trade-specific RAMS document. Download instantly as a professional PDF or Word file.",
  },
];

const FEATURES = [
  {
    icon: Cpu,
    title: "AI-Powered Generation",
    desc: "Claude AI writes trade-specific hazard identifications, control measures, and method statements for each selected activity.",
  },
  {
    icon: Layers,
    title: "Trade-Specific Content",
    desc: "9 industry types and 130+ specific activities — groundworks, electrical, scaffolding, plumbing, demolition and more. Every RAMS is tailored to your exact scope.",
  },
  {
    icon: FileText,
    title: "Professional PDF Output",
    desc: "Cover page, risk matrix, running headers, signature blocks, CONFIDENTIAL watermark — ready to hand to a principal contractor.",
  },
  {
    icon: ShieldCheck,
    title: "CDM 2015 Compliant",
    desc: "Covers all major UK H&S regulations: COSHH, RIDDOR, PUWER, LOLER, Work at Height, Confined Spaces and more.",
  },
  {
    icon: UploadCloud,
    title: "Upload Scope Documents",
    desc: "Upload your PDF or DOCX tender specification and we'll extract the project details automatically, saving you time.",
  },
  {
    icon: BookOpen,
    title: "Regulation Currency Checker",
    desc: "Checks each UK regulation against legislation.gov.uk to flag amendments — so your RAMS is never based on outdated law.",
  },
];

const REGULATIONS = [
  "CDM 2015",
  "Health & Safety at Work Act 1974",
  "COSHH 2002",
  "PUWER 1998",
  "LOLER 1998",
  "RIDDOR 2013",
  "Work at Height 2005",
  "Confined Spaces 1997",
  "Manual Handling 1992",
  "Noise at Work 2005",
  "Control of Vibration 2005",
  "Electricity at Work 1989",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-slate-100">
      <Navbar variant="marketing" />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">

          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-700/40 bg-blue-950/60 text-blue-300 mb-8">
              <ShieldCheck className="w-3.5 h-3.5" />
              CDM 2015 Compliant · AI Powered · Instant PDF Export
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white mb-6"
          >
            Professional RAMS Documents
            <br />
            <span className="text-blue-400">Generated in Minutes</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered Risk Assessments &amp; Method Statements for UK groundworks and
            civil engineering. Trade-specific, legally compliant, instantly downloadable.
          </motion.p>

          <motion.div
            {...fadeUp(0.22)}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
          >
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/40 text-sm"
            >
              Generate RAMS Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl border border-white/10 transition-colors text-sm"
            >
              See How It Works
            </a>
          </motion.div>

          <motion.div
            {...fadeUp(0.28)}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {COMPLIANCE_BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold border border-blue-800/50 bg-blue-950/40 text-blue-400 rounded-full uppercase tracking-wider"
              >
                <CheckCircle2 className="w-3 h-3" />
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section className="border-y border-[#1e3a6e] bg-[#0f2040]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Three steps to a compliant RAMS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.1 }}
                className="relative"
              >
                <p className="text-7xl font-black text-blue-600/10 leading-none select-none mb-2">
                  {step}
                </p>
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-lg shadow-blue-900/30"
            >
              Start Generating Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section id="features" className="py-24 border-t border-[#1e3a6e]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Everything you need to produce a compliant RAMS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 300, damping: 30, delay: i * 0.07 }}
                className="bg-[#0f2040] border border-[#1e3a6e] rounded-2xl p-6 hover:border-blue-700/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regulations Covered ─────────────────────────────── */}
      <section className="py-20 border-t border-[#1e3a6e] bg-[#0f2040]/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Compliance</p>
            <h2 className="text-2xl font-black text-white tracking-tight">
              UK regulations covered in every RAMS
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {REGULATIONS.map((reg) => (
              <span
                key={reg}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-slate-700 bg-slate-900/60 text-slate-400 rounded-full"
              >
                <HardHat className="w-3 h-3 text-blue-500/70" />
                {reg}
              </span>
            ))}
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            Use the{" "}
            <Link href="/regulations" className="text-blue-500 hover:text-blue-400 transition-colors">
              Regulation Currency Checker
            </Link>{" "}
            to verify each regulation is still current.
          </p>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-24 border-t border-[#1e3a6e]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-900/40">
              <HardHat className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Ready to generate your RAMS?
            </h2>
            <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto leading-relaxed">
              No subscription. No login required. Start generating compliant RAMS documents
              in under 5 minutes.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold rounded-xl transition-colors shadow-xl shadow-blue-900/40"
            >
              Generate RAMS Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
