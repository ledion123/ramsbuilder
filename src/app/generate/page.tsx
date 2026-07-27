"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, ClipboardList } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { IndustrySelector } from "@/components/IndustrySelector";
import TradeSelector from "@/components/TradeSelector";
import { RAMSForm } from "@/components/RAMSForm";
import { RAMSRiskEditor } from "@/components/RAMSRiskEditor";
import { QuickGeneratePanel } from "@/components/QuickGeneratePanel";
import { cn } from "@/lib/cn";
import type { RAMSDocument } from "@/lib/types";

type Mode = "express" | "manual";
type Step = "industry" | "selecting" | "filling" | "review";

const STEPS = [
  { key: "industry", label: "Industry" },
  { key: "selecting", label: "Trades" },
  { key: "filling", label: "Details" },
  { key: "review", label: "Review" },
] as const;

function StepBreadcrumb({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = step.key === current;
          return (
            <div key={step.key} className="flex items-center">
              <div className={cn(
                "flex items-center gap-2 text-xs font-semibold transition-colors",
                active ? "text-slate-900" : done ? "text-blue-600" : "text-slate-400"
              )}>
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors",
                  active
                    ? "bg-[#1a2e4a] border-[#1a2e4a] text-white"
                    : done
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-100 border-slate-300 text-slate-400"
                )}>
                  {done ? "✓" : i + 1}
                </span>
                {step.label}
              </div>
              {i < STEPS.length - 1 && (
                <span className="mx-3 text-slate-300 text-xs">›</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("express");
  const [step, setStep] = useState<Step>("industry");
  const [industryTypes, setIndustryTypes] = useState<string[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [generatedDoc, setGeneratedDoc] = useState<RAMSDocument | null>(null);

  const handleIndustrySelected = (industries: string[]) => {
    setIndustryTypes(industries);
    setStep("selecting");
  };

  const handleTradesSelected = (trades: string[]) => {
    setSelectedTrades(trades);
    setStep("filling");
  };

  const handleGenerated = (doc: RAMSDocument) => {
    setGeneratedDoc(doc);
    setStep("review");
  };

  const handleConfirmed = (doc: RAMSDocument) => {
    try {
      localStorage.setItem("rams_document", JSON.stringify(doc));
    } catch {
      try {
        sessionStorage.setItem("rams_document", JSON.stringify(doc));
      } catch { /* ignore */ }
    }
    router.push("/preview");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="app" />

      {/* Mode toggle */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-1 py-2">
          <button
            onClick={() => setMode("express")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-colors",
              mode === "express"
                ? "bg-[#1a2e4a] text-white"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            AI Express
          </button>
          <button
            onClick={() => setMode("manual")}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-colors",
              mode === "manual"
                ? "bg-[#1a2e4a] text-white"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            )}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Step-by-step
          </button>
        </div>
      </div>

      {mode === "express" ? (
        <motion.div
          key="express"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
        >
          <QuickGeneratePanel />
        </motion.div>
      ) : (
        <>
          <StepBreadcrumb current={step} />
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {step === "industry" && (
              <IndustrySelector onIndustrySelected={handleIndustrySelected} />
            )}
            {step === "selecting" && (
              <TradeSelector
                industryFilter={industryTypes}
                onTradesSelected={handleTradesSelected}
              />
            )}
            {step === "filling" && (
              <RAMSForm
                selectedTrades={selectedTrades}
                industryType={industryTypes.join(", ")}
                onBack={() => setStep("selecting")}
                onGenerated={handleGenerated}
              />
            )}
            {step === "review" && generatedDoc && (
              <RAMSRiskEditor
                doc={generatedDoc}
                onConfirm={handleConfirmed}
                onBack={() => setStep("filling")}
              />
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
