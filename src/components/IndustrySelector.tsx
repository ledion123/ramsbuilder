"use client";

import { motion } from "framer-motion";
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
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="mb-10 text-center"
      >
        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Step 1 of 3</p>
        <h1 className="text-3xl font-black text-white tracking-tight mb-3">
          What type of work does your company do?
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Select your trade discipline — we&apos;ll show the relevant activities and generate a RAMS specific to your industry.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRIES.map(({ id, label, description, icon: Icon, regBadge }, i) => (
          <motion.button
            key={id}
            type="button"
            onClick={() => onIndustrySelected(id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32, delay: i * 0.05 }}
            whileHover={{ scale: 1.02, borderColor: "rgba(37,99,235,0.6)" }}
            whileTap={{ scale: 0.98 }}
            className="group text-left p-5 bg-[#0f2040] border border-[#1e3a6e] rounded-2xl hover:border-blue-600/50 hover:bg-[#0f2040] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/40"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-snug mb-1">{label}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
                <span className="inline-block mt-3 text-[10px] font-bold px-2 py-0.5 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded uppercase tracking-wider">
                  {regBadge}
                </span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default IndustrySelector;
