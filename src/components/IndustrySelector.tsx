"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Shovel,
  Building2,
  Zap,
  Flame,
  Layers,
  HardHat,
  Settings,
  Home,
  PaintBucket,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface Industry {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  regBadge: string;
}

const INDUSTRIES: Industry[] = [
  {
    id: "groundworks",
    label: "Groundworks & Civil Engineering",
    description: "Excavation, drainage, piling, highways, earthworks",
    icon: Shovel,
    regBadge: "CDM 2015",
  },
  {
    id: "building",
    label: "Building & Structural Works",
    description: "Brickwork, concrete frames, structural steel, masonry",
    icon: Building2,
    regBadge: "CDM 2015",
  },
  {
    id: "electrical",
    label: "Electrical Installations",
    description: "First & second fix wiring, distribution, EV, data & comms",
    icon: Zap,
    regBadge: "EaWR 1989",
  },
  {
    id: "plumbing",
    label: "Plumbing, Heating & Gas",
    description: "Pipework, boilers, gas installations, HVAC, legionella",
    icon: Flame,
    regBadge: "GSIUR 1998",
  },
  {
    id: "scaffolding",
    label: "Scaffolding & Temporary Access",
    description: "Tube & fitting, system scaffold, mobile towers, MEWP",
    icon: Layers,
    regBadge: "WAH 2005",
  },
  {
    id: "demolition",
    label: "Demolition & Strip-Out",
    description: "Soft strip, structural demolition, asbestos, contamination",
    icon: HardHat,
    regBadge: "CAR 2012",
  },
  {
    id: "me",
    label: "M&E (Mechanical & Electrical)",
    description: "Ductwork, HVAC, BMS, LV/HV distribution, commissioning",
    icon: Settings,
    regBadge: "PUWER 1998",
  },
  {
    id: "roofing",
    label: "Roofing & Cladding",
    description: "Flat roofing, pitched roofing, metal cladding, leadwork",
    icon: Home,
    regBadge: "WAH 2005",
  },
  {
    id: "fitout",
    label: "Internal Fit-Out & Finishes",
    description: "Partitions, ceilings, flooring, plastering, joinery",
    icon: PaintBucket,
    regBadge: "MHOR 1992",
  },
];

interface IndustrySelectorProps {
  onIndustrySelected: (industryTypes: string[]) => void;
}

export function IndustrySelector({ onIndustrySelected }: IndustrySelectorProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="mb-10 text-center"
      >
        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3">Step 1 of 3</p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
          What type of work does your company do?
        </h1>
        <p className="text-slate-500 text-sm max-w-lg mx-auto">
          Select one or more trade disciplines — you can combine industries (e.g. groundworks + roofing).
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {INDUSTRIES.map(({ id, label, description, icon: Icon, regBadge }, i) => {
          const checked = selected.has(id);
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32, delay: shouldReduceMotion ? 0 : i * 0.04 }}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group text-left p-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-stretch gap-0 shadow-sm border",
                checked
                  ? "bg-blue-50 border-blue-500 shadow-md"
                  : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md"
              )}
            >
              {/* Left accent bar */}
              <div className={cn(
                "w-[3px] rounded-full transition-colors flex-shrink-0 mr-4 self-stretch",
                checked ? "bg-blue-600" : "bg-slate-200 group-hover:bg-blue-400"
              )} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center transition-colors flex-shrink-0",
                    checked ? "bg-blue-100" : "bg-slate-100 group-hover:bg-blue-50"
                  )}>
                    <Icon className={cn(
                      "w-3.5 h-3.5 transition-colors",
                      checked ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600"
                    )} />
                  </div>
                  <p className="text-sm font-bold text-slate-900 leading-snug">{label}</p>
                  {checked && (
                    <span className="ml-auto flex-shrink-0 w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
                <span className={cn(
                  "inline-block mt-2.5 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border",
                  checked
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                )}>
                  {regBadge}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue button */}
      {selected.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <p className="text-xs text-slate-500">
            {selected.size} industr{selected.size === 1 ? "y" : "ies"} selected:{" "}
            <span className="font-semibold text-slate-700">
              {Array.from(selected).map((id) => INDUSTRIES.find((i) => i.id === id)?.label).join(", ")}
            </span>
          </p>
          <button
            type="button"
            onClick={() => onIndustrySelected(Array.from(selected))}
            className="flex items-center gap-2 px-8 py-3 bg-[#1a2e4a] hover:bg-[#243d5f] text-white font-bold rounded-xl transition-colors shadow-sm"
          >
            Continue to Trade Selection
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default IndustrySelector;
