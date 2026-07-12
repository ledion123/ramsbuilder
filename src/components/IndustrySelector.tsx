"use client";

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
} from "lucide-react";

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
  onIndustrySelected: (industryType: string) => void;
}

export function IndustrySelector({ onIndustrySelected }: IndustrySelectorProps) {
  const shouldReduceMotion = useReducedMotion();

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
          Select your trade discipline — we&apos;ll show the relevant activities and generate a RAMS specific to your industry.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {INDUSTRIES.map(({ id, label, description, icon: Icon, regBadge }, i) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => onIndustrySelected(id)}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32, delay: shouldReduceMotion ? 0 : i * 0.04 }}
            whileHover={shouldReduceMotion ? undefined : { y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-stretch gap-0 shadow-sm"
          >
            {/* Left accent bar */}
            <div className="w-[3px] rounded-full bg-slate-200 group-hover:bg-blue-600 transition-colors flex-shrink-0 mr-4 self-stretch" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <p className="text-sm font-bold text-slate-900 leading-snug">{label}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
              <span className="inline-block mt-2.5 text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded uppercase tracking-wider">
                {regBadge}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default IndustrySelector;
