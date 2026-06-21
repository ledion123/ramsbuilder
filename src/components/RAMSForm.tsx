"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion, type Transition, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";
import type { RAMSInput } from "@/lib/types";
import Link from "next/link";
import { ScopeUploadCard } from "@/components/ScopeUploadCard";
import {
  HardHat,
  Building2,
  Shovel,
  Truck,
  Users,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Company & Project", icon: Building2 },
  { id: 2, label: "Works Description", icon: Shovel },
  { id: 3, label: "Plant & Equipment", icon: Truck },
  { id: 4, label: "Operatives", icon: Users },
  { id: 5, label: "Sign-Off & Hazards", icon: AlertTriangle },
];

const STEP_FIELDS: Record<number, (keyof RAMSInput)[]> = {
  1: ["company_name", "company_address", "project_name", "site_address", "principal_contractor"],
  2: ["activity", "supervisor", "start_date", "duration"],
  3: ["plant_and_equipment"],
  4: ["operatives"],
  5: ["nearest_hospital", "emergency_contact", "prepared_by", "prepared_by_position"],
};

// ── Motion variants ──────────────────────────────────────────────

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

const stepTransition: Transition = { type: "spring", stiffness: 380, damping: 36, mass: 0.8 };

// Height-free: opacity + y only (no layout property animation)
const bannerVariants: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 28 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

// Height-free: opacity + x only (no height animation = no layout thrash)
const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 360, damping: 32 } },
  exit: { opacity: 0, x: 12, transition: { duration: 0.15 } },
};

// ── Sub-components ───────────────────────────────────────────────

function Label({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
      {children}
      {required && <span aria-hidden="true" className="text-blue-400 ml-0.5">*</span>}
      {required && <span className="sr-only"> (required)</span>}
    </label>
  );
}

// SVG chevron for select
const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

function Input({
  className,
  error,
  id,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const inputId = id ?? props.name;
  return (
    <div>
      <input
        {...props}
        id={inputId}
        aria-required={required || undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-slate-100 text-sm placeholder-slate-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50",
          "transition-colors",
          error ? "border-red-500/70" : "border-slate-700",
          className
        )}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function Textarea({
  className,
  error,
  id,
  required,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  const inputId = id ?? props.name;
  return (
    <div>
      <textarea
        {...props}
        id={inputId}
        aria-required={required || undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={cn(
          "w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-slate-100 text-sm placeholder-slate-600",
          "focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50",
          "transition-colors resize-none",
          error ? "border-red-500/70" : "border-slate-700",
          className
        )}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  className,
  error,
  id,
  required,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  const inputId = id ?? props.name;
  return (
    <div>
      <select
        {...props}
        id={inputId}
        aria-required={required || undefined}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        style={{ backgroundImage: CHEVRON_SVG, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
        className={cn(
          "w-full bg-slate-950 border rounded-lg px-3 py-2.5 text-slate-100 text-sm appearance-none pr-8",
          "focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50",
          "transition-colors",
          error ? "border-red-500/70" : "border-slate-700",
          className
        )}
      >
        {children}
      </select>
      {error && (
        <p id={`${inputId}-error`} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>;
}

function SectionCard({
  title,
  children,
  index = 0,
}: {
  title: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 320, damping: 30 }}
      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
    >
      <div className="bg-slate-800/40 px-6 py-3 flex items-center gap-3 border-b border-slate-800">
        <div className="w-px h-4 bg-blue-600 flex-shrink-0" />
        <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.15em]">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────────

interface RAMSFormProps {
  selectedTrades?: string[];
  industryType?: string;
  onBack?: () => void;
}

export function RAMSForm({ selectedTrades = [], industryType = "", onBack }: RAMSFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefilled, setPrefilled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const defaultValues: RAMSInput = {
    company_name: "",
    company_address: "",
    company_reg: "",
    company_phone: "",
    company_email: "",
    project_name: "",
    site_address: "",
    principal_contractor: "",
    activity: "",
    supervisor: "",
    start_date: "",
    duration: "",
    revision: "Rev 0",
    plant_and_equipment: [{ item: "" }],
    operatives: "",
    nearest_hospital: "",
    emergency_contact: "",
    prepared_by: "",
    prepared_by_position: "",
    additional_hazards: "",
  };

  const {
    register,
    control,
    trigger,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RAMSInput>({
    defaultValues,
    mode: "onTouched",
  });

  const handleScopeExtracted = (partial: Partial<RAMSInput>) => {
    reset({
      ...defaultValues,
      ...partial,
      plant_and_equipment:
        partial.plant_and_equipment?.length
          ? partial.plant_and_equipment
          : defaultValues.plant_and_equipment,
    });
    setPrefilled(true);
    setStep(1);
    setDirection(1);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "plant_and_equipment",
  });

  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[step];
    if (fieldsToValidate.length > 0) {
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;
    }
    if (step === 3) {
      const valid = await trigger("plant_and_equipment");
      if (!valid) return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const handleBack = () => {
    if (step === 1 && onBack) {
      onBack();
      return;
    }
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const onSubmit = async (data: RAMSInput) => {
    setIsGenerating(true);
    setError(null);
    try {
      const payload: RAMSInput = {
        ...data,
        selected_trades: selectedTrades.length > 0 ? selectedTrades : undefined,
        industry_type: industryType || undefined,
      };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Generation failed");
      }
      const rams = await res.json();
      try {
        localStorage.setItem("rams_document", JSON.stringify(rams));
        localStorage.setItem("rams_input", JSON.stringify(data));
      } catch {
        // localStorage unavailable (private browsing / quota exceeded) — continue to preview via state
        console.warn("localStorage unavailable, passing via sessionStorage");
        try {
          sessionStorage.setItem("rams_document", JSON.stringify(rams));
          sessionStorage.setItem("rams_input", JSON.stringify(data));
        } catch {
          setError("Could not save document locally. Please use the download buttons on the next page.");
          setIsGenerating(false);
          return;
        }
      }
      router.push("/preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      {/* ── Hero Header ── */}
      <motion.header
        initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-b border-[#1e3a6e] bg-[#0a1628]"
      >
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start gap-5">
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.6, opacity: 0 }}
              animate={shouldReduceMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.05 }}
              className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/40"
            >
              <HardHat className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                RAMS Generator
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-lg">
                CDM 2015 compliant Risk Assessment &amp; Method Statement generator for UK
                groundworks and civil engineering.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {["CDM 2015", "COSHH 2002", "RIDDOR 2013", "PUWER 1998"].map((badge, i) => (
                  <motion.span
                    key={badge}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="text-[10px] font-bold px-2.5 py-1 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded uppercase tracking-widest"
                  >
                    {badge}
                  </motion.span>
                ))}
                <Link
                  href="/regulations"
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:text-slate-300 transition-colors ml-1 uppercase tracking-widest"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Check regulations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Scope Upload Card ── */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-5">
        <ScopeUploadCard onExtracted={handleScopeExtracted} />
        <AnimatePresence>
          {prefilled && (
            <motion.div
              variants={shouldReduceMotion ? undefined : bannerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mb-4 flex items-center gap-2.5 px-4 py-2.5 bg-blue-600/10 border border-blue-600/30 rounded-lg"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <p className="text-xs text-blue-300">
                Fields pre-filled from your document — review each step before generating.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {selectedTrades.length > 0 && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="mb-4 p-4 bg-[#0f2040] border border-[#1e3a6e] rounded-xl"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Selected Trades ({selectedTrades.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {selectedTrades.map((trade) => (
                <span
                  key={trade}
                  className="text-[10px] px-2 py-0.5 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-full"
                >
                  {trade.length > 36 ? trade.slice(0, 36) + "…" : trade}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Progress Stepper ── */}
      <div className="border-b border-[#1e3a6e] bg-[#0f2040]">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="relative flex items-start justify-between">
            {/* Track line — use scaleX transform instead of animating width */}
            <div className="absolute top-4 left-4 right-4 h-px bg-[#1e3a6e]">
              <motion.div
                className="absolute inset-y-0 left-0 w-full bg-blue-600 origin-left"
                animate={{ scaleX: progressPct / 100 }}
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            </div>
            {STEPS.map((s) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="relative flex flex-col items-center gap-2 z-10">
                  <motion.button
                    type="button"
                    onClick={() => {
                      if (done) {
                        setDirection(-1);
                        setStep(s.id);
                      }
                    }}
                    animate={active ? { scale: 1.15 } : { scale: 1 }}
                    whileTap={done ? { scale: 0.92 } : undefined}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    aria-current={active ? "step" : undefined}
                    aria-label={`Step ${s.id}: ${s.label}${done ? " (completed)" : active ? " (current)" : ""}`}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-colors duration-200",
                      active && "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/40 ring-4 ring-blue-600/20",
                      done && "bg-green-600 border-green-600 text-white cursor-pointer hover:bg-green-500",
                      !active && !done && "bg-[#0a1628] border-[#1e3a6e] text-slate-600"
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {done ? (
                        <motion.span key="check" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 500, damping: 25 }}>
                          <CheckCircle2 className="w-4 h-4" />
                        </motion.span>
                      ) : (
                        <motion.span key="num" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                          {s.id}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                  <span className={cn(
                    "text-[10px] font-semibold text-center leading-tight hidden sm:block max-w-[72px]",
                    active ? "text-white" : done ? "text-green-500" : "text-slate-600"
                  )}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={shouldReduceMotion ? undefined : stepVariants}
              transition={shouldReduceMotion ? { duration: 0 } : stepTransition}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {/* Step 1: Company & Project */}
              {step === 1 && (
                <div className="space-y-6">
                  <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
                    <h2 className="text-2xl font-black text-white">Company &amp; Project Details</h2>
                    <p className="text-sm text-slate-500 mt-1.5">Your company information and the project you&apos;re working on.</p>
                  </motion.div>

                  <SectionCard title="Subcontractor Company" index={1}>
                    <FieldGroup>
                      <div>
                        <Label required htmlFor="company_name">Company Name</Label>
                        <Input {...register("company_name", { required: "Company name is required" })} id="company_name" required aria-required="true" placeholder="e.g. Apex Groundworks Ltd" error={errors.company_name?.message} />
                      </div>
                      <div>
                        <Label required htmlFor="company_address">Company Address</Label>
                        <Textarea {...register("company_address", { required: "Company address is required" })} id="company_address" required aria-required="true" rows={2} placeholder="e.g. Unit 4, Industrial Estate, Birmingham, B1 1AA" error={errors.company_address?.message} />
                      </div>
                      <Grid2>
                        <div>
                          <Label htmlFor="company_reg">Company Registration No.</Label>
                          <Input {...register("company_reg")} id="company_reg" placeholder="e.g. 12345678" />
                        </div>
                        <div>
                          <Label htmlFor="revision">Document Revision</Label>
                          <Select {...register("revision")} id="revision">
                            {["Rev 0", "Rev 1", "Rev 2", "Rev 3", "Rev 4", "Rev 5"].map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </Select>
                        </div>
                      </Grid2>
                      <Grid2>
                        <div>
                          <Label htmlFor="company_phone">Company Phone</Label>
                          <Input {...register("company_phone")} id="company_phone" type="tel" placeholder="e.g. 0121 000 0000" />
                        </div>
                        <div>
                          <Label htmlFor="company_email">Company Email</Label>
                          <Input {...register("company_email")} id="company_email" type="email" placeholder="e.g. safety@apexgroundworks.co.uk" />
                        </div>
                      </Grid2>
                    </FieldGroup>
                  </SectionCard>

                  <SectionCard title="Project Information" index={2}>
                    <FieldGroup>
                      <Grid2>
                        <div>
                          <Label required htmlFor="project_name">Project Name</Label>
                          <Input {...register("project_name", { required: "Project name is required" })} id="project_name" required aria-required="true" placeholder="e.g. Elm Road Housing Development" error={errors.project_name?.message} />
                        </div>
                        <div>
                          <Label required htmlFor="principal_contractor">Principal Contractor</Label>
                          <Input {...register("principal_contractor", { required: "Principal contractor is required" })} id="principal_contractor" required aria-required="true" placeholder="e.g. Balfour Beatty Plc" error={errors.principal_contractor?.message} />
                        </div>
                      </Grid2>
                      <div>
                        <Label required htmlFor="site_address">Site Address</Label>
                        <Textarea {...register("site_address", { required: "Site address is required" })} id="site_address" required aria-required="true" rows={2} placeholder="e.g. Elm Road, Solihull, West Midlands, B92 7HJ" error={errors.site_address?.message} />
                      </div>
                    </FieldGroup>
                  </SectionCard>
                </div>
              )}

              {/* Step 2: Works Description */}
              {step === 2 && (
                <div className="space-y-6">
                  <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
                    <h2 className="text-2xl font-black text-white">Works Description</h2>
                    <p className="text-sm text-slate-500 mt-1.5">Describe the works in detail — the more specific, the better your RAMS document will be.</p>
                  </motion.div>

                  <SectionCard title="Activity Details" index={1}>
                    <FieldGroup>
                      <div>
                        <Label required htmlFor="activity">Activity Description</Label>
                        <p className="text-xs text-slate-500 mb-2">Describe exactly what work is being done, including depth, ground conditions, proximity to roads, and any special circumstances.</p>
                        <Textarea
                          {...register("activity", {
                            required: "Activity description is required",
                            minLength: { value: 30, message: "Please describe the works in more detail (minimum 30 characters)" },
                          })}
                          id="activity"
                          required
                          aria-required="true"
                          rows={5}
                          placeholder="e.g. Excavation for foul drainage installation, 2.5m deep in soft ground (clay). Works adjacent to live carriageway. Installation of 225mm diameter PVC-U pipes with precast concrete manholes at 30m intervals. Backfilling with selected granular fill, compaction, and temporary tarmac reinstatement."
                          error={errors.activity?.message}
                        />
                      </div>
                      <Grid2>
                        <div>
                          <Label required htmlFor="supervisor">Site Supervisor</Label>
                          <Input {...register("supervisor", { required: "Supervisor name is required" })} id="supervisor" required aria-required="true" placeholder="e.g. John Smith" error={errors.supervisor?.message} />
                        </div>
                        <div>
                          <Label required htmlFor="start_date">Planned Start Date</Label>
                          <Input type="date" {...register("start_date", { required: "Start date is required" })} id="start_date" required aria-required="true" error={errors.start_date?.message} />
                        </div>
                      </Grid2>
                      <div>
                        <Label required htmlFor="duration">Planned Duration</Label>
                        <Input {...register("duration", { required: "Duration is required" })} id="duration" required aria-required="true" placeholder="e.g. 5 working days" error={errors.duration?.message} />
                      </div>
                    </FieldGroup>
                  </SectionCard>
                </div>
              )}

              {/* Step 3: Plant & Equipment */}
              {step === 3 && (
                <div className="space-y-6">
                  <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
                    <h2 className="text-2xl font-black text-white">Plant &amp; Equipment</h2>
                    <p className="text-sm text-slate-500 mt-1.5">List all plant and equipment to be used on site.</p>
                  </motion.div>

                  <SectionCard title="Equipment List" index={1}>
                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {fields.map((field, index) => (
                          <motion.div key={field.id} variants={listItemVariants} initial="hidden" animate="visible" exit="exit" className="flex gap-2">
                            <div className="flex-1">
                              <Input
                                {...register(`plant_and_equipment.${index}.item`, { required: "Item name is required" })}
                                id={`plant_and_equipment_${index}_item`}
                                placeholder={index === 0 ? "e.g. 360° excavator (5t), Doosan DX57W" : index === 1 ? "e.g. Forward tip dumper (6t)" : "e.g. Vibratory plate compactor"}
                                error={errors.plant_and_equipment?.[index]?.item?.message}
                              />
                            </div>
                            {fields.length > 1 && (
                              <motion.button
                                type="button"
                                onClick={() => remove(index)}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.92 }}
                                aria-label={`Remove item ${index + 1}`}
                                className="flex-shrink-0 w-10 h-10 rounded-lg border border-slate-700 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-500/50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </motion.button>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <motion.button type="button" onClick={() => append({ item: "" })} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }} className="mt-4 flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                      <Plus className="w-4 h-4" />
                      Add another item
                    </motion.button>
                  </SectionCard>

                  <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ delay: 0.12, type: "spring", stiffness: 320, damping: 30 }} className="px-4 py-3 bg-[#0f2040] border border-[#1e3a6e] rounded-xl">
                    <p className="text-xs text-slate-500">
                      <span className="text-slate-400 font-semibold">Tip:</span> Include make, model and capacity where known. Common examples: 360° excavator, forward tip dumper, vibratory plate compactor, hydraulic breaker, dewatering pump, generator.
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Step 4: Operatives */}
              {step === 4 && (
                <div className="space-y-6">
                  <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
                    <h2 className="text-2xl font-black text-white">Operatives</h2>
                    <p className="text-sm text-slate-500 mt-1.5">Describe the number and roles of operatives working on this activity.</p>
                  </motion.div>

                  <SectionCard title="Workforce Details" index={1}>
                    <div>
                      <Label required htmlFor="operatives">Number and Roles</Label>
                      <p className="text-xs text-slate-500 mb-2">List the number of operatives and their roles/competencies.</p>
                      <Textarea
                        {...register("operatives", { required: "Operatives information is required" })}
                        id="operatives"
                        required
                        aria-required="true"
                        rows={4}
                        placeholder="e.g. 1 × CPCS A59 plant operator (360° excavator), 2 × groundworkers (CSCS blue card), 1 × site supervisor (SSSTS)"
                        error={errors.operatives?.message}
                      />
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* Step 5: Sign-Off & Additional Hazards */}
              {step === 5 && (
                <div className="space-y-6">
                  <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 320, damping: 30 }}>
                    <h2 className="text-2xl font-black text-white">Sign-Off &amp; Site Hazards</h2>
                    <p className="text-sm text-slate-500 mt-1.5">Emergency contacts, document sign-off details, and any additional site-specific hazards.</p>
                  </motion.div>

                  <SectionCard title="Emergency &amp; Sign-Off Details" index={1}>
                    <FieldGroup>
                      <div>
                        <Label required htmlFor="nearest_hospital">Nearest Hospital (Name &amp; Address)</Label>
                        <Input
                          {...register("nearest_hospital", { required: "Nearest hospital is required" })}
                          id="nearest_hospital"
                          required
                          aria-required="true"
                          placeholder="e.g. Queen Elizabeth Hospital, Mindelsohn Way, Birmingham B15 2TH"
                          error={errors.nearest_hospital?.message}
                        />
                      </div>
                      <div>
                        <Label required htmlFor="emergency_contact">Emergency Contact on Site</Label>
                        <Input
                          {...register("emergency_contact", { required: "Emergency contact is required" })}
                          id="emergency_contact"
                          required
                          aria-required="true"
                          placeholder="e.g. John Smith — 07700 900123"
                          error={errors.emergency_contact?.message}
                        />
                      </div>
                      <Grid2>
                        <div>
                          <Label required htmlFor="prepared_by">Prepared By (Name)</Label>
                          <Input
                            {...register("prepared_by", { required: "Prepared by name is required" })}
                            id="prepared_by"
                            required
                            aria-required="true"
                            placeholder="e.g. John Smith"
                            error={errors.prepared_by?.message}
                          />
                        </div>
                        <div>
                          <Label required htmlFor="prepared_by_position">Position / Role</Label>
                          <Input
                            {...register("prepared_by_position", { required: "Position is required" })}
                            id="prepared_by_position"
                            required
                            aria-required="true"
                            placeholder="e.g. Site Supervisor / H&S Coordinator"
                            error={errors.prepared_by_position?.message}
                          />
                        </div>
                      </Grid2>
                    </FieldGroup>
                  </SectionCard>

                  <SectionCard title="Additional Hazards / Notes" index={2}>
                    <Textarea
                      {...register("additional_hazards")}
                      id="additional_hazards"
                      rows={5}
                      placeholder="e.g. Ground contamination suspected from former petrol station. Known asbestos in ground — CLASP programme survey required. Works adjacent to live gas main (500mm medium pressure). Overhead power lines at 4m clearance..."
                    />
                  </SectionCard>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        variants={shouldReduceMotion ? undefined : bannerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="alert"
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"
                      >
                        <p className="text-sm text-red-400">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, type: "spring", stiffness: 320, damping: 30 }}
                    className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4"
                  >
                    <p className="text-sm text-blue-300">
                      <span className="font-semibold">Ready to generate your RAMS?</span> Click the button below to produce your CDM 2015 compliant document. This may take up to 30 seconds if using AI generation.
                    </p>
                  </motion.div>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="mt-8 pt-6 border-t border-[#1e3a6e]">
                {step === STEPS.length ? (
                  <div className="space-y-3">
                    <motion.button
                      type="submit"
                      disabled={isGenerating}
                      whileHover={!isGenerating ? { scale: 1.01 } : undefined}
                      whileTap={!isGenerating ? { scale: 0.98 } : undefined}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-base font-bold transition-colors shadow-lg shadow-blue-900/30"
                    >
                      {isGenerating ? (
                        <><Loader2 className="w-5 h-5 animate-spin" />Generating RAMS Document…</>
                      ) : (
                        <><HardHat className="w-5 h-5" />Generate RAMS Document<ArrowRight className="w-5 h-5 ml-auto" /></>
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-[#0f2040] border border-[#1e3a6e] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      whileHover={{ x: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        "text-slate-400 hover:text-white hover:bg-[#0f2040] border border-[#1e3a6e]"
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {step === 1 && onBack ? "Back to Trades" : "Back"}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </form>
      </main>
    </div>
  );
}
