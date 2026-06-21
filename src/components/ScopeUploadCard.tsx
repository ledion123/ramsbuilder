"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Loader2, CheckCircle2, AlertTriangle, X, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { cn } from "@/lib/cn";
import type { RAMSInput } from "@/lib/types";

const STORAGE_KEY = "scope_card_dismissed";
const ALLOWED_EXTS = [".pdf", ".docx", ".txt"];
const MAX_BYTES = 10 * 1024 * 1024;

type UploadState =
  | { status: "idle" }
  | { status: "dragging" }
  | { status: "uploading" }
  | { status: "done"; warnings: string[] }
  | { status: "error"; message: string };

interface Props {
  onExtracted: (data: Partial<RAMSInput>) => void;
}

const fadeSlide = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 340, damping: 28 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

export function ScopeUploadCard({ onExtracted }: Props) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [dismissed, setDismissed] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [uploadLabel, setUploadLabel] = useState("Reading document…");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Read dismiss preference from localStorage after mount
  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {}
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  };

  const undismiss = () => {
    setDismissed(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  const validateFile = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return `"${file.name}" is not supported. Please upload a PDF, DOCX, or TXT file.`;
    }
    if (file.size > MAX_BYTES) {
      return `File exceeds the 10 MB limit (${(file.size / 1_000_000).toFixed(1)} MB).`;
    }
    return null;
  };

  const processFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setState({ status: "error", message: validationError });
      return;
    }

    setState({ status: "uploading" });
    setUploadLabel("Reading document…");

    // Shift label after 2s to indicate Claude is running
    labelTimerRef.current = setTimeout(() => {
      setUploadLabel("Extracting work details…");
    }, 2000);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract-scope", {
        method: "POST",
        body: formData,
      });

      if (labelTimerRef.current) {
        clearTimeout(labelTimerRef.current);
        labelTimerRef.current = null;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Server error ${res.status}`);
      }

      const { data, warnings } = await res.json() as {
        data: Partial<RAMSInput>;
        warnings: string[];
      };

      onExtracted(data);
      setState({ status: "done", warnings: warnings ?? [] });
    } catch (err) {
      if (labelTimerRef.current) {
        clearTimeout(labelTimerRef.current);
        labelTimerRef.current = null;
      }
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Extraction failed. Please try again.",
      });
    }
  }, [onExtracted]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setState({ status: "idle" });
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (state.status === "idle") setState({ status: "dragging" });
  };

  const handleDragLeave = () => {
    if (state.status === "dragging") setState({ status: "idle" });
  };

  // Dismissed view — just a small link
  if (dismissed) {
    return (
      <motion.button
        type="button"
        onClick={undismiss}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-3 flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-400 transition-colors"
      >
        <UploadCloud className="w-3.5 h-3.5" />
        Upload scope of works document
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="mb-4 relative"
    >
      {/* Dismiss button */}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss upload card"
        className="absolute top-3 right-3 z-10 text-slate-600 hover:text-slate-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <AnimatePresence mode="wait" initial={false}>

        {/* ── Idle / Dragging ── */}
        {(state.status === "idle" || state.status === "dragging") && (
          <motion.div
            key="idle"
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "border border-dashed rounded-xl px-6 py-5 flex items-center gap-5 transition-colors",
              state.status === "dragging"
                ? "border-blue-600 bg-blue-600/5"
                : "border-[#1e3a6e] bg-[#0a1628] hover:border-blue-600/40"
            )}
          >
            <motion.div
              animate={state.status === "dragging" ? { scale: 1.1 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center flex-shrink-0"
            >
              <UploadCloud className="w-5 h-5 text-blue-400" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200">
                Quick Start — Upload Scope Document
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                PDF, DOCX or TXT · Max 10 MB · We&apos;ll pre-fill the form for you
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#0f2040] border border-[#1e3a6e] text-slate-300 hover:text-white hover:border-blue-600/50 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Browse files
            </button>
          </motion.div>
        )}

        {/* ── Uploading ── */}
        {state.status === "uploading" && (
          <motion.div
            key="uploading"
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border border-[#1e3a6e] rounded-xl px-6 py-5 flex items-center gap-4 bg-[#0a1628]"
          >
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
            <AnimatePresence mode="wait">
              <motion.p
                key={uploadLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-sm text-slate-300"
              >
                {uploadLabel}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Done ── */}
        {state.status === "done" && (
          <motion.div
            key="done"
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border border-green-600/30 rounded-xl px-6 py-4 bg-green-600/5"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-400">
                  Form pre-filled — review each step before generating.
                </p>
                {state.warnings.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowWarnings((v) => !v)}
                    className="mt-1.5 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {showWarnings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {state.warnings.length} field{state.warnings.length > 1 ? "s" : ""} could not be extracted
                  </button>
                )}
                <AnimatePresence>
                  {showWarnings && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2 space-y-1 overflow-hidden"
                    >
                      {state.warnings.map((w, i) => (
                        <li key={i} className="text-xs text-amber-300/80">• {w}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <button
                type="button"
                onClick={() => setState({ status: "idle" })}
                className="flex-shrink-0 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Error ── */}
        {state.status === "error" && (
          <motion.div
            key="error"
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border border-red-500/30 rounded-xl px-6 py-4 bg-red-500/5"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-400">{state.message}</p>
              </div>
              <button
                type="button"
                onClick={() => setState({ status: "idle" })}
                className="flex-shrink-0 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
