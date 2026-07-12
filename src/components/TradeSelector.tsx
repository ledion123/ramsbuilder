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
      "Muck Away & Off-Site Waste Disposal",
      "Topsoil Strip & Reinstatement",
      "Contaminated Land Excavation",
      "Rock Breaking & Hydraulic Hammer",
      "Excavation Adjacent to Existing Structures",
      "Excavation Near Live Services",
      "Excavation Adjacent to Live Highway",
      "Trial Holes & Cable Avoidance Works",
      "Hand Digging Around Buried Services",
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
      "Breaking into Existing Manholes",
      "Connecting to Live Sewers",
      "Rainwater Gully Installation (110mm+)",
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
      "Bell Mouth & Road Junction Construction",
      "Breaking Ground for Road Crossings",
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
      "Banksman / Slinger & Signaller",
      "Wacker Plate / Vibrating Compactor Operations",
      "Compressor & Pneumatic Tool Operations",
      "Ride-On Roller Operations",
      "Abrasive Wheels & Cutting Disc Operations",
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
      "UXO (Unexploded Ordnance) Risk Assessment",
      "Protection of Watercourses & OAW Works",
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
      "Working Around Occupied / Live Premises",
    ],
  },

  // ── Beam & Block / Suspended Floors ─────────────────────────────
  {
    id: 19,
    name: "Beam & Block / Suspended Floors",
    industryGroup: "groundworks",
    trades: [
      "Beam & Block Floor Installation",
      "Jetfloor Insulated Ground Floor System",
      "Precast Concrete Suspended Floor",
      "Void Former & In-Situ Ground Bearing Slab",
      "Floor Insulation Installation",
      "DPM (Damp Proof Membrane) Installation",
      "Screed Over Beam & Block",
    ],
  },

  // ── Adoptable Works & S278 ───────────────────────────────────────
  {
    id: 20,
    name: "Adoptable Works & S278",
    industryGroup: "groundworks",
    trades: [
      "S38 Adoptable Road Construction",
      "S278 Off-Site Highway Works",
      "Adoptable Stormwater Drainage (Under Road)",
      "Adoptable Foulwater Drainage (Under Road)",
      "Adoptable Footpath & Verge Construction",
      "Street Light Ducting — Adoptable",
      "Adoptable Parking & Turning Areas",
      "Road Closure for Drainage / Service Connections",
      "Offsite Footpath Construction",
    ],
  },

  // ── Private External Works ───────────────────────────────────────
  {
    id: 21,
    name: "Private External Works",
    industryGroup: "groundworks",
    trades: [
      "Block Paved Driveways & Parking Areas",
      "Tarmac / Macadam Driveways",
      "Paving Slab Installation (Patios & Paths)",
      "Private Rear Footpaths & Patios",
      "Resin Bound Surfacing",
      "Shingle Margins & Gravel Areas",
      "Temporary Tarmac (Drive to Adoptable Road)",
      "Private Street Lighting & Ducting",
      "Sales Parking Area Works",
      "Dropped Kerb & Drive Crossover",
    ],
  },

  // ── Landscaping & Soft Works ─────────────────────────────────────
  {
    id: 22,
    name: "Landscaping & Soft Works",
    industryGroup: "groundworks",
    trades: [
      "Topsoil Spreading & Final Grading",
      "Seeding & Turfing",
      "Tree, Shrub & Hedge Planting",
      "LEAP / LAP Play Area Installation",
      "Boundary Screen & Retaining Wall Construction",
      "Pedestrian Walkway Construction",
      "Free-Issue Topsoil Management & Stockpiling",
      "Imported Topsoil Supply & Spread",
      "Japanese Knotweed / Invasive Species Treatment",
      "Ecological Habitat Protection Works",
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
      "Solar PV System Installation",
      "Isolation & Permit to Work (LOTO — EaWR 1989)",
      "Electrical Work in Confined Spaces",
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
      "Unvented Hot Water Systems (G3 — Approved Doc G)",
      "WRAS-Compliant Water Fittings Installation",
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
      "DPC (Damp Proof Course) Installation",
      "Passive Fire Protection & Compartmentation (Part B)",
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
      "Safety Netting & Edge Protection (BS EN 1263)",
      "Roof Anchor & Fall Arrest System Installation (BS EN 795)",
      "Roof Light & Skylight Installation (Part B / Part N)",
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
      "Fire Door Installation & Certification (BS EN 16034)",
      "Acoustic Partitioning (Building Regs Part E)",
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
  const [scopeText, setScopeText] = useState("");
  const [scopeOpen, setScopeOpen] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);
  const [suggestCount, setSuggestCount] = useState<number | null>(null);
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

  const showUXOBanner = selected.has("UXO (Unexploded Ordnance) Risk Assessment");
  const showOHLBanner = selected.has("Overhead Line Protection (goal posts)");

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

  const handleSuggest = async () => {
    if (!scopeText.trim()) return;
    setIsSuggesting(true);
    setSuggestError(null);
    setSuggestCount(null);
    try {
      const allTrades = industryCategories.flatMap((c) => c.trades);
      const res = await fetch("/api/suggest-trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope: scopeText, availableTrades: allTrades }),
      });
      const data = await res.json() as { trades?: string[]; error?: string };
      if (data.error === "no_api_key") {
        setSuggestError("AI suggestions require an API key — select trades manually below.");
      } else if (data.trades && data.trades.length > 0) {
        selectAll(data.trades);
        setSuggestCount(data.trades.length);
      } else {
        setSuggestError("No matching trades found — try adding more detail to your description.");
      }
    } catch {
      setSuggestError("Could not reach the suggestion service. Select trades manually below.");
    }
    setIsSuggesting(false);
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
    <div className="min-h-screen bg-slate-50 pb-40">
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-b border-slate-200 bg-white"
      >
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-start gap-5">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.05 }}
            className="w-14 h-14 rounded-2xl bg-[#1a2e4a] flex items-center justify-center flex-shrink-0 shadow-sm"
          >
            <HardHat className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
              Select Your Trade Activities
            </h1>
            <p className="text-slate-500 text-sm mt-2 max-w-lg">
              Choose every trade and activity your team will perform. Your RAMS document will be
              tailored specifically to the activities you select.
            </p>
          </div>
        </div>
      </motion.header>

      {/* ── Body ── */}
      <main className="max-w-4xl mx-auto px-6 py-6 space-y-4">

        {/* ── Scope quick-start ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04, type: "spring", stiffness: 320, damping: 30 }}
          className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
        >
          <button
            type="button"
            onClick={() => setScopeOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
          >
            <span className="text-blue-600 text-base">✦</span>
            <span className="flex-1 text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
              Quick-start — describe your scope of works
            </span>
            <span className="text-xs text-slate-500">AI auto-selects trades</span>
            <motion.div
              animate={{ rotate: scopeOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
            >
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {scopeOpen && (
              <motion.div
                key="scope-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30, opacity: { duration: 0.15 } }}
                style={{ overflow: "hidden" }}
              >
                <div className="border-t border-slate-200 px-5 py-4 space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Paste your scope of works, tender description, or job brief. AI will pre-tick the
                    relevant trade activities — you can adjust them below.
                  </p>
                  <textarea
                    value={scopeText}
                    onChange={(e) => { setScopeText(e.target.value); setSuggestError(null); setSuggestCount(null); }}
                    placeholder="e.g. We will be carrying out excavation for adoptable foul and storm drainage, laying 450mm pipes, connecting to an existing manhole, constructing new manholes, then sub-base and tarmac surfacing for the adoptable road…"
                    rows={4}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-colors resize-none"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSuggest}
                      disabled={isSuggesting || !scopeText.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      {isSuggesting ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Analysing…
                        </>
                      ) : (
                        <>Suggest trades <ArrowRight className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                    {suggestCount !== null && !suggestError && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs text-green-400 font-medium"
                      >
                        {suggestCount} trade{suggestCount !== 1 ? "s" : ""} pre-selected ✓
                      </motion.span>
                    )}
                  </div>
                  {suggestError && (
                    <p className="text-xs text-amber-400 leading-snug">{suggestError}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, type: "spring", stiffness: 320, damping: 30 }}
          className="relative"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trades (e.g. drainage, excavation, piling…)"
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition-colors shadow-sm"
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
              className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-snug">
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
              className="flex items-center gap-3 px-4 py-3.5 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 shrink-0" />
              <p className="text-sm text-blue-800 flex-1 leading-snug">
                Deep excavation selected — also consider{" "}
                <span className="font-semibold">&quot;Confined Space Entry — Manholes &amp; Chambers&quot;</span>
              </p>
              <button
                type="button"
                onClick={addSuggestion}
                className="flex-shrink-0 text-xs font-semibold text-blue-600 hover:text-white border border-blue-300 hover:border-blue-600 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors"
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
              className="flex items-start gap-3 px-4 py-3.5 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-snug">
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
              className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-snug">
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
              className="flex items-start gap-3 px-4 py-3.5 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-snug">
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
              className="flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-snug">
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
              className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-snug">
                <span className="font-semibold">Gas installation selected</span> — all gas work must be
                carried out by{" "}
                <span className="font-semibold">Gas Safe registered operatives only</span> under the{" "}
                <span className="font-semibold">Gas Safety (Installation and Use) Regulations 1998</span>.
              </p>
            </motion.div>
          )}

          {showUXOBanner && (
            <motion.div
              key="uxo-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-snug">
                <span className="font-semibold">UXO risk selected</span> — a suitably qualified specialist
                must carry out a geophysical survey before any excavation commences. The hazard must be
                identified in the{" "}
                <span className="font-semibold">Pre-Construction Information (CDM 2015, Reg 4)</span>. Survey
                methodology should follow{" "}
                <span className="font-semibold">BS EN 16991:2018</span>.
              </p>
            </motion.div>
          )}

          {showOHLBanner && (
            <motion.div
              key="ohl-banner"
              variants={shouldReduceMotion ? {} : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl"
            >
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 leading-snug">
                <span className="font-semibold">Overhead powerlines selected</span> — contact with overhead
                lines is the most common cause of electrical fatality on construction sites. Verify safe
                working distances with the DNO before mobilising.{" "}
                <span className="font-semibold">Electricity at Work Regulations 1989</span> and{" "}
                <span className="font-semibold">HSE GS6</span> apply. Exclusion zones and goal-post
                protection must be agreed with the land owner and network operator.
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
              No trades match &quot;<span className="text-slate-700">{search}</span>&quot;
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
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
              >
                {/* Category header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-px h-4 bg-blue-600 flex-shrink-0" />
                  <span className="flex-1 text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                    {cat.name}
                  </span>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {cat.trades.length} trade{cat.trades.length !== 1 ? "s" : ""}
                  </span>
                  {selCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full"
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
                      <div className="border-t border-slate-200 px-5 py-3">
                        {/* Select All / Deselect All */}
                        <div className="flex justify-end mb-3">
                          <button
                            type="button"
                            onClick={() =>
                              allVisibleSelected ? deselectAll(visible) : selectAll(visible)
                            }
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-500 transition-colors"
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
                                    ? "bg-blue-50 hover:bg-blue-100/70"
                                    : "hover:bg-slate-50"
                                )}
                              >
                                {/* Custom checkbox */}
                                <span
                                  className={cn(
                                    "w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors",
                                    checked
                                      ? "bg-blue-600 border-blue-600"
                                      : "bg-white border-slate-300"
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
                                    checked ? "text-blue-700 font-medium" : "text-slate-700"
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
            className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
          >
            <div className="max-w-4xl mx-auto px-6 py-4 space-y-3">
              {/* Pills row */}
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
                <span className="flex-shrink-0 text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">
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
                        className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1"
                      >
                        <span className="max-w-[140px] truncate" title={trade}>
                          {truncate(trade, 28)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSelected(trade)}
                          aria-label={`Remove ${trade}`}
                          className="text-blue-500 hover:text-blue-700 transition-colors flex-shrink-0"
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
                  className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Clear all
                </button>
                <motion.button
                  type="button"
                  onClick={() => onTradesSelected(selectedArray)}
                  whileHover={!shouldReduceMotion ? { scale: 1.01 } : undefined}
                  whileTap={!shouldReduceMotion ? { scale: 0.98 } : undefined}
                  className="flex items-center gap-2.5 px-6 py-2.5 bg-[#1a2e4a] hover:bg-[#243d5f] text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
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
