"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  Search,
  ChevronDown,
  AlertTriangle,
  Info,
  X,
  ArrowRight,
  HardHat,
} from "lucide-react";

// ── Data ────────────────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
  industryGroup: string;
  trades: string[];
}

const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Excavation & Earthworks",
    industryGroup: "groundworks",
    trades: [
      "General Excavation (open cut)",
      "Deep Excavation (>1.2m — confined space rules apply)",
      "Trench Excavation for Services",
      "Bulk Earthworks & Cut to Fill",
      "Topsoil Strip & Reinstatement",
      "Contaminated Land Excavation",
      "Rock Breaking & Hydraulic Hammer",
      "Excavation Adjacent to Existing Structures",
      "Excavation Near Live Services",
      "Excavation Adjacent to Live Highway",
    ],
  },
  {
    id: 2,
    name: "Drainage & Utilities",
    industryGroup: "groundworks",
    trades: [
      "Foul Water Drainage Installation",
      "Surface Water Drainage Installation",
      "Combined Drainage Systems",
      "SUDS — Soakaways & Attenuation",
      "French Drains & Filter Drains",
      "Precast Manhole Chamber Installation",
      "In-Situ Concrete Manhole Construction",
      "Pipe Laying (clay, PVC, concrete, HDPE)",
      "Duct Installation (telecoms, electric, gas)",
      "Sewer Connection & Live Sewer Tapping",
      "Drainage Inspection & CCTV Survey",
      "Drainage Pressure Testing",
      "Confined Space Entry — Manholes & Chambers",
    ],
  },
  {
    id: 3,
    name: "Highways & Paving",
    industryGroup: "groundworks",
    trades: [
      "Kerb Installation & Foundation",
      "Block Paving",
      "Tarmac & Bituminous Surfacing",
      "Concrete Road Construction",
      "Sub-base & Capping Layer Installation",
      "Road Planing & Milling",
      "Line Marking",
      "Footway Construction",
      "Dropped Kerb Installation",
      "Traffic Management — Chapter 8",
      "Temporary Road Closure Works",
    ],
  },
  {
    id: 4,
    name: "Foundations & Structures",
    industryGroup: "groundworks",
    trades: [
      "Strip Foundations",
      "Pad Foundations",
      "Raft Foundations",
      "Pile Cap Construction",
      "Underpinning Works",
      "Retaining Wall Construction",
      "Gabion Wall Installation",
      "Sheet Piling & King Post Walls",
      "Temporary Works & Propping",
      "Mass Concrete Pours",
      "Reinforced Concrete Works",
    ],
  },
  {
    id: 5,
    name: "Piling",
    industryGroup: "groundworks",
    trades: [
      "CFA (Continuous Flight Auger) Piling",
      "Driven Precast Concrete Piling",
      "Mini Piling",
      "Sheet Piling Installation",
      "Vibrostone Columns",
      "Ground Improvement Works",
    ],
  },
  {
    id: 6,
    name: "Concrete Works",
    industryGroup: "groundworks",
    trades: [
      "Ready Mix Concrete Placement",
      "Concrete Pumping Operations",
      "Formwork & Falsework Erection",
      "Reinforcement Fixing (rebar)",
      "Post-Tension & Pre-stress Works",
      "Concrete Cutting & Breaking",
      "Concrete Scanning (GPR)",
      "Sprayed Concrete (Shotcrete)",
    ],
  },
  {
    id: 7,
    name: "Plant Operations",
    industryGroup: "groundworks",
    trades: [
      "Excavator Operations (up to 5T)",
      "Excavator Operations (5T–20T)",
      "Excavator Operations (20T+)",
      "Dumper Operations (site dumper)",
      "Roller & Compaction Plant",
      "Telehandler Operations",
      "Crane Lifting Operations",
      "Piling Rig Operations",
      "Road Planer Operations",
      "Concrete Pump Operations",
      "Low Loader Transport & Delivery",
    ],
  },
  {
    id: 8,
    name: "Confined Spaces",
    industryGroup: "groundworks",
    trades: [
      "Manhole Entry & Works",
      "Chamber Entry & Connection Works",
      "Culvert Entry & Inspection",
      "Tunnel Works",
      "Below Ground Pump Station Works",
      "Atmospheric Testing Procedures",
      "Confined Space Rescue Plan",
    ],
  },
  {
    id: 9,
    name: "Environmental & Specialist",
    industryGroup: "groundworks",
    trades: [
      "Watercourse Works & Culverting",
      "Dewatering Operations",
      "Ground Contamination Management",
      "Asbestos in Soils (non-licensed)",
      "Japanese Knotweed Management",
      "Environmental Spill Response",
      "Dust & Noise Management Plan",
      "Ecological Protection Measures",
    ],
  },
  {
    id: 10,
    name: "Temporary Works & Site Setup",
    industryGroup: "groundworks",
    trades: [
      "Site Setup & Compound Establishment",
      "Hoarding & Fencing Erection",
      "Welfare Facilities Installation",
      "Temporary Traffic Management",
      "Overhead Line Protection (goal posts)",
      "Underground Service Protection",
      "Site Drainage & Mud Management",
      "Scaffold Erection (subcontracted)",
    ],
  },

  // ── Electrical Installations ─────────────────────────────────────
  {
    id: 11,
    name: "Electrical Installations",
    industryGroup: "electrical",
    trades: [
      "Cable Containment & Trunking Installation",
      "First Fix Wiring & Cable Pulling",
      "Second Fix Wiring & Connection",
      "Consumer Unit & Distribution Board Works",
      "Testing, Inspection & Certification (BS 7671)",
      "EV Charging Point Installation",
      "Fire Alarm System Installation (BS 5839)",
      "Emergency Lighting Installation (BS 5266)",
      "Data, Comms & Structured Cabling",
      "Street Lighting & External Electrical Works",
    ],
  },

  // ── Plumbing, Heating & Gas ──────────────────────────────────────
  {
    id: 12,
    name: "Plumbing, Heating & Gas",
    industryGroup: "plumbing",
    trades: [
      "First Fix Plumbing — Pipework & Drainage",
      "Second Fix Plumbing — Fittings & Commissioning",
      "Gas Installation — Domestic (ACS)",
      "Gas Installation — Commercial & Industrial",
      "Underfloor Heating Systems",
      "Hot & Cold Water System (Legionella Risk)",
      "Boiler & Plant Room Works",
      "Pressurised Systems & Pipework",
      "Sanitary Ware & WC Installation",
      "Pump & Water Treatment Systems",
    ],
  },

  // ── Scaffolding & Temporary Access ──────────────────────────────
  {
    id: 13,
    name: "Scaffolding & Temporary Access",
    industryGroup: "scaffolding",
    trades: [
      "Independent Tube & Fitting Scaffold",
      "System Scaffolding (Kwikstage / Haki)",
      "Birdcage Scaffold",
      "Cantilever & Gantry Scaffold",
      "Facade Retention Scaffold",
      "Slung & Suspended Scaffold",
      "Mobile Tower Scaffold (PASMA)",
      "Inspection & Handover Procedures (NASC TG20)",
      "Scaffold Adaptation & Loading Bay",
      "Scaffold Dismantling & Strike",
    ],
  },

  // ── Building & Structural Works ──────────────────────────────────
  {
    id: 14,
    name: "Building & Structural Works",
    industryGroup: "building",
    trades: [
      "Brickwork & Blockwork",
      "Masonry & Stone Work",
      "Structural Steel Erection",
      "Timber Frame & Roof Structures",
      "Reinforced Concrete Frame Works",
      "Facade & Cladding Subframes",
      "Structural Openings & Lintels",
      "Party Wall Works",
      "Tying-In New to Existing Structure",
      "Groundworks Package (Subcontracted)",
    ],
  },

  // ── Demolition & Strip-Out ───────────────────────────────────────
  {
    id: 15,
    name: "Demolition & Strip-Out",
    industryGroup: "demolition",
    trades: [
      "Soft Strip & Internal Demolition",
      "Structural Demolition — Masonry",
      "Structural Demolition — RC Frame",
      "Controlled Demolition with Plant",
      "Asbestos Survey & Type 3 Sampling",
      "Non-Licensed Asbestos Removal",
      "Licensed Asbestos Removal (R&D)",
      "Lead Paint Removal",
      "Contaminated Material Segregation",
      "Post-Demolition Site Clearance",
    ],
  },

  // ── M&E (Mechanical & Electrical) ───────────────────────────────
  {
    id: 16,
    name: "M&E (Mechanical & Electrical)",
    industryGroup: "me",
    trades: [
      "Ductwork & Air Handling Installation",
      "Ventilation & Extract Systems (HVAC)",
      "Chilled Water & Refrigerant Pipework",
      "BMS & Controls Wiring",
      "LV & HV Electrical Distribution",
      "Generator & UPS Installation",
      "Commissioning & Balancing",
      "Thermal Insulation — Pipework & Ductwork",
      "Domestic Services Coordination",
      "Trace Heating Systems",
    ],
  },

  // ── Roofing & Cladding ───────────────────────────────────────────
  {
    id: 17,
    name: "Roofing & Cladding",
    industryGroup: "roofing",
    trades: [
      "Flat Roofing — Single-Ply Membrane",
      "Flat Roofing — Built-Up Felt",
      "Flat Roofing — Liquid Applied",
      "Pitched Roofing — Tiles & Slates",
      "Pitched Roofing — Metal Sheeting",
      "Standing Seam Metal Roofing",
      "Composite Cladding Panels",
      "Rainscreen Cladding Systems",
      "Leadwork & Flashings",
      "Roof Drainage & Guttering",
    ],
  },

  // ── Internal Fit-Out & Finishes ──────────────────────────────────
  {
    id: 18,
    name: "Internal Fit-Out & Finishes",
    industryGroup: "fitout",
    trades: [
      "Partitioning Systems — Stud & Board",
      "Suspended Ceilings",
      "Raised Access Flooring",
      "Screed & Floor Levelling",
      "Hard Floor — Tiles & Stone",
      "Soft Floor — Carpet & Vinyl",
      "Plastering & Skim Coat",
      "Joinery & Second Fix Carpentry",
      "Decoration & Specialist Finishes",
      "Mezzanine Floor Installation",
    ],
  },
];

const DEEP_EXCAVATION_TRADE = "Deep Excavation (>1.2m — confined space rules apply)";
const CONFINED_SPACE_SUGGESTION = "Confined Space Entry — Manholes & Chambers";
const PILING_CATEGORY_ID = 5;
const CONFINED_SPACE_CATEGORY_ID = 8;

// ── Animation variants ───────────────────────────────────────────

const bannerVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 340, damping: 28 } },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.14 } },
};

const pillVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 400, damping: 22 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.12 } },
};

// ── Helpers ──────────────────────────────────────────────────────

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + "…" : str;
}

// ── Main Component ───────────────────────────────────────────────

interface TradeSelectorProps {
  onTradesSelected: (trades: string[]) => void;
  industryFilter?: string;
}

export default function TradeSelector({ onTradesSelected, industryFilter }: TradeSelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openCategories, setOpenCategories] = useState<Set<number>>(new Set([11, 12, 13, 14, 15, 16, 17, 18, 1]));
  const [search, setSearch] = useState("");
  const shouldReduceMotion = useReducedMotion();

  // ── Derived state ──

  const industryCategories = useMemo(() => {
    if (!industryFilter) return CATEGORIES;
    return CATEGORIES.filter((c) => c.industryGroup === industryFilter);
  }, [industryFilter]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return industryCategories;
    const q = search.toLowerCase();
    return industryCategories.filter((cat) =>
      cat.trades.some((t) => t.toLowerCase().includes(q))
    );
  }, [search, industryCategories]);

  const visibleTradesFor = (cat: Category): string[] => {
    if (!search.trim()) return cat.trades;
    const q = search.toLowerCase();
    return cat.trades.filter((t) => t.toLowerCase().includes(q));
  };

  const selectedInCat = (catId: number): number => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return 0;
    return cat.trades.filter((t) => selected.has(t)).length;
  };

  const showConfinedSpaceBanner = CATEGORIES.find((c) => c.id === CONFINED_SPACE_CATEGORY_ID)
    ?.trades.some((t) => selected.has(t)) ?? false;

  const showDeepExcSuggestion =
    selected.has(DEEP_EXCAVATION_TRADE) && !selected.has(CONFINED_SPACE_SUGGESTION);

  const showPilingBanner = (CATEGORIES.find((c) => c.id === PILING_CATEGORY_ID)?.trades ?? []).some(
    (t) => selected.has(t)
  );

  const electricalTrades = CATEGORIES.filter((c) => c.industryGroup === "electrical").flatMap((c) => c.trades);
  const showElectricalBanner = electricalTrades.some((t) => selected.has(t));

  const scaffoldingTrades = CATEGORIES.filter((c) => c.industryGroup === "scaffolding").flatMap((c) => c.trades);
  const showScaffoldingBanner = scaffoldingTrades.some((t) => selected.has(t));

  const asbestosTrades = ["Asbestos Survey & Type 3 Sampling", "Non-Licensed Asbestos Removal", "Licensed Asbestos Removal (R&D)", "Asbestos in Soils (non-licensed)"];
  const showAsbestosBanner = asbestosTrades.some((t) => selected.has(t));

  const gasTrades = ["Gas Installation — Domestic (ACS)", "Gas Installation — Commercial & Industrial"];
  const showGasBanner = gasTrades.some((t) => selected.has(t));

  // When search is active, auto-expand matching categories
  const isOpen = (catId: number): boolean => {
    if (search.trim()) return filteredCategories.some((c) => c.id === catId);
    return openCategories.has(catId);
  };

  // ── Handlers ──

  const toggle = (trade: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(trade)) next.delete(trade);
      else next.add(trade);
      return next;
    });
  };

  const toggleCategory = (catId: number) => {
    if (search.trim()) return; // don't toggle when search controls open state
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const selectAll = (trades: string[]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      trades.forEach((t) => next.add(t));
      return next;
    });
  };

  const deselectAll = (trades: string[]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      trades.forEach((t) => next.delete(t));
      return next;
    });
  };

  const addSuggestion = () => {
    setSelected((prev) => new Set([...prev, CONFINED_SPACE_SUGGESTION]));
  };

  const removeSelected = (trade: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(trade);
      return next;
    });
  };

  const selectedArray = Array.from(selected);

  return (
    <div className="min-h-screen bg-[#0a1628] pb-40">
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-b border-[#1e3a6e] bg-[#0a1628]"
      >
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-start gap-5">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.05 }}
            className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/40"
          >
            <HardHat className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">
              Select Your Trade Activities
            </h1>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              Choose every trade and activity your team will perform. Your RAMS document will be
              tailored specifically to the activities you select.
            </p>
          </div>
        </div>
      </motion.header>

      {/* ── Body ── */}
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, type: "spring", stiffness: 320, damping: 30 }}
          className="relative"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trades (e.g. drainage, excavation, piling…)"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-colors"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Smart Banners ── */}
        <AnimatePresence>
          {showConfinedSpaceBanner && (
            <motion.div
              key="confined-space-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-start gap-3 px-4 py-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300 leading-snug">
                <span className="font-semibold">Confined space activities selected</span> — your RAMS will
                include confined space entry procedures, atmospheric testing requirements, and rescue plans
                as required by the{" "}
                <span className="font-semibold">Confined Spaces Regulations 1997</span>.
              </p>
            </motion.div>
          )}

          {showDeepExcSuggestion && (
            <motion.div
              key="deep-exc-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-3 px-4 py-3.5 bg-blue-600/10 border border-blue-600/30 rounded-xl"
            >
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 shrink-0" />
              <p className="text-sm text-blue-300 flex-1 leading-snug">
                Deep excavation selected — also consider{" "}
                <span className="font-semibold">&quot;Confined Space Entry — Manholes &amp; Chambers&quot;</span>
              </p>
              <button
                type="button"
                onClick={addSuggestion}
                className="flex-shrink-0 text-xs font-semibold text-blue-400 hover:text-white border border-blue-600/40 hover:border-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                Add trade →
              </button>
            </motion.div>
          )}

          {showPilingBanner && (
            <motion.div
              key="piling-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-start gap-3 px-4 py-3.5 bg-blue-600/10 border border-blue-600/30 rounded-xl"
            >
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300 leading-snug">
                <span className="font-semibold">Piling activities selected</span> — ensure piling
                contractor holds current{" "}
                <span className="font-semibold">CPCS A36 cards</span> and relevant insurance.
              </p>
            </motion.div>
          )}

          {showElectricalBanner && (
            <motion.div
              key="electrical-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-start gap-3 px-4 py-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300 leading-snug">
                <span className="font-semibold">Electrical work selected</span> — all operatives must hold
                current NVQ/C&amp;G qualifications. All work must be tested and certified to{" "}
                <span className="font-semibold">BS 7671:2018 (18th Edition)</span> under{" "}
                <span className="font-semibold">Electricity at Work Regulations 1989</span>.
              </p>
            </motion.div>
          )}

          {showScaffoldingBanner && (
            <motion.div
              key="scaffolding-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-start gap-3 px-4 py-3.5 bg-blue-600/10 border border-blue-600/30 rounded-xl"
            >
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300 leading-snug">
                <span className="font-semibold">Scaffolding work selected</span> — scaffold design must be
                approved by a competent person per{" "}
                <span className="font-semibold">NASC TG20:21 / BS 5975</span>. Tag boards required at
                handover. All erectors must hold{" "}
                <span className="font-semibold">CISRS cards</span>.
              </p>
            </motion.div>
          )}

          {showAsbestosBanner && (
            <motion.div
              key="asbestos-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-start gap-3 px-4 py-3.5 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 leading-snug">
                <span className="font-semibold">Asbestos works selected</span> — an{" "}
                <span className="font-semibold">asbestos survey (CAR 2012, Reg 5)</span> must be completed
                before any demolition or strip-out commences. Licensed work requires a{" "}
                <span className="font-semibold">licensed contractor (HSE Licensed)</span> and 14-day HSE notification.
              </p>
            </motion.div>
          )}

          {showGasBanner && (
            <motion.div
              key="gas-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-start gap-3 px-4 py-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-300 leading-snug">
                <span className="font-semibold">Gas installation selected</span> — all gas work must be
                carried out by{" "}
                <span className="font-semibold">Gas Safe registered operatives only</span> under the{" "}
                <span className="font-semibold">Gas Safety (Installation and Use) Regulations 1998</span>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── No results ── */}
        <AnimatePresence>
          {search.trim() && filteredCategories.length === 0 && (
            <motion.div
              key="no-results"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-10 text-slate-500 text-sm"
            >
              No trades match &quot;<span className="text-slate-300">{search}</span>&quot;
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Categories ── */}
        <div className="space-y-3">
          {filteredCategories.map((cat, catIdx) => {
            const visible = visibleTradesFor(cat);
            const selCount = selectedInCat(cat.id);
            const allVisibleSelected = visible.length > 0 && visible.every((t) => selected.has(t));
            const open = isOpen(cat.id);

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.04, type: "spring", stiffness: 320, damping: 30 }}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              >
                {/* Category header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-800/30 transition-colors group"
                >
                  <div className="w-px h-4 bg-blue-600 flex-shrink-0" />
                  <span className="flex-1 text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {cat.trades.length} trade{cat.trades.length !== 1 ? "s" : ""}
                  </span>
                  {selCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full"
                    >
                      {selCount} selected
                    </motion.span>
                  )}
                  <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 24 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </motion.div>
                </button>

                {/* Trades panel */}
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="panel"
                      initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={shouldReduceMotion ? {} : { height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30, opacity: { duration: 0.15 } }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="border-t border-slate-800 px-5 py-3">
                        {/* Select All / Deselect All */}
                        <div className="flex justify-end mb-3">
                          <button
                            type="button"
                            onClick={() =>
                              allVisibleSelected ? deselectAll(visible) : selectAll(visible)
                            }
                            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {allVisibleSelected ? "Deselect All" : "Select All"}
                          </button>
                        </div>

                        {/* Trade list */}
                        <div className="space-y-0.5">
                          {visible.map((trade) => {
                            const checked = selected.has(trade);
                            return (
                              <label
                                key={trade}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors select-none",
                                  checked
                                    ? "bg-blue-600/10 hover:bg-blue-600/15"
                                    : "hover:bg-slate-800/60"
                                )}
                              >
                                {/* Custom checkbox */}
                                <span
                                  className={cn(
                                    "w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors",
                                    checked
                                      ? "bg-blue-600 border-blue-600"
                                      : "bg-slate-950 border-slate-600"
                                  )}
                                >
                                  {checked && (
                                    <motion.svg
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                      className="w-2.5 h-2.5 text-white"
                                      viewBox="0 0 10 10"
                                      fill="none"
                                    >
                                      <path
                                        d="M1.5 5L4 7.5L8.5 2.5"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </motion.svg>
                                  )}
                                </span>
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={checked}
                                  onChange={() => toggle(trade)}
                                />
                                <span
                                  className={cn(
                                    "text-sm transition-colors leading-snug",
                                    checked ? "text-blue-300 font-medium" : "text-slate-300"
                                  )}
                                >
                                  {trade}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* ── Sticky Bottom Bar ── */}
      <AnimatePresence>
        {selectedArray.length > 0 && (
          <motion.div
            key="bottom-bar"
            initial={shouldReduceMotion ? { opacity: 0 } : { y: 80, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1e3a6e] bg-[#0a1628]/95 backdrop-blur-sm"
          >
            <div className="max-w-4xl mx-auto px-6 py-4 space-y-3">
              {/* Pills row */}
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
                <span className="flex-shrink-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {selectedArray.length} trade{selectedArray.length !== 1 ? "s" : ""}:
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap sm:flex-nowrap">
                  <AnimatePresence mode="popLayout">
                    {selectedArray.map((trade) => (
                      <motion.span
                        key={trade}
                        layout
                        variants={shouldReduceMotion ? {} : pillVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-300 bg-blue-600/15 border border-blue-600/25 rounded-full px-3 py-1"
                      >
                        <span className="max-w-[140px] truncate" title={trade}>
                          {truncate(trade, 28)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSelected(trade)}
                          aria-label={`Remove ${trade}`}
                          className="text-blue-400 hover:text-white transition-colors flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear all
                </button>
                <motion.button
                  type="button"
                  onClick={() => onTradesSelected(selectedArray)}
                  whileHover={!shouldReduceMotion ? { scale: 1.01 } : undefined}
                  whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
                  className="flex items-center gap-2.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-900/30"
                >
                  Continue to RAMS Generator
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
