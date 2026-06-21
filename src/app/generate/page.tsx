"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { IndustrySelector } from "@/components/IndustrySelector";
import TradeSelector from "@/components/TradeSelector";
import { RAMSForm } from "@/components/RAMSForm";
import { cn } from "@/lib/cn";

type Step = "industry" | "selecting" | "filling";

const STEPS = [
  { key: "industry", label: "Industry" },
  { key: "selecting", label: "Trades" },
  { key: "filling", label: "Details" },
] as const;

function StepBreadcrumb({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="border-b border-[#1e3a6e] bg-[#0f2040]/50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = step.key === current;
          return (
            <div key={step.key} className="flex items-center">
              <div className={cn(
                "flex items-center gap-2 text-xs font-semibold transition-colors",
                active ? "text-white" : done ? "text-blue-400" : "text-slate-600"
              )}>
                <span className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-colors",
                  active
                    ? "bg-blue-600 border-blue-600 text-white"
                    : done
                    ? "bg-blue-600/20 border-blue-600/40 text-blue-400"
                    : "bg-transparent border-slate-700 text-slate-600"
                )}>
                  {done ? "✓" : i + 1}
                </span>
                {step.label}
              </div>
              {i < STEPS.length - 1 && (
                <span className="mx-3 text-slate-700 text-xs">›</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const [step, setStep] = useState<Step>("industry");
  const [industryType, setIndustryType] = useState<string>("");
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);

  const handleIndustrySelected = (industry: string) => {
    setIndustryType(industry);
    setStep("selecting");
  };

  const handleTradesSelected = (trades: string[]) => {
    setSelectedTrades(trades);
    setStep("filling");
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <Navbar variant="app" />
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
            industryFilter={industryType}
            onTradesSelected={handleTradesSelected}
          />
        )}
        {step === "filling" && (
          <RAMSForm
            selectedTrades={selectedTrades}
            industryType={industryType}
          />
        )}
      </motion.div>
    </div>
  );
}
