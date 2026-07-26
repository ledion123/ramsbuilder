"use client";

import { useState } from "react";
import { Trash2, Plus, ChevronDown, ChevronUp, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import type { RAMSDocument, RiskAssessmentItem } from "@/lib/types";

interface Props {
  doc: RAMSDocument;
  onConfirm: (doc: RAMSDocument) => void;
  onBack: () => void;
}

const LEVEL_COLOURS: Record<string, string> = {
  High:   "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  Low:    "bg-green-100 text-green-700 border-green-200",
};

function reindex(rows: RiskAssessmentItem[]): RiskAssessmentItem[] {
  return rows.map((r, i) => ({ ...r, ref: `RA-${String(i + 1).padStart(2, "0")}` }));
}

function blankRow(ref: string): RiskAssessmentItem {
  return {
    ref,
    hazard: "",
    description: "",
    who_at_risk: "",
    likelihood_pre: 3, severity_pre: 3, risk_score_pre: 9, risk_level_pre: "Medium",
    control_measures: [""],
    likelihood_post: 1, severity_post: 3, risk_score_post: 3, risk_level_post: "Low",
    legislation_ref: "",
  };
}

function RowCard({
  row,
  onChange,
  onDelete,
}: {
  row: RiskAssessmentItem;
  onChange: (r: RiskAssessmentItem) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(true);

  const setField = <K extends keyof RiskAssessmentItem>(k: K, v: RiskAssessmentItem[K]) =>
    onChange({ ...row, [k]: v });

  const setControl = (i: number, v: string) => {
    const next = [...row.control_measures];
    next[i] = v;
    onChange({ ...row, control_measures: next });
  };

  const addControl = () =>
    onChange({ ...row, control_measures: [...row.control_measures, ""] });

  const deleteControl = (i: number) => {
    const next = row.control_measures.filter((_, j) => j !== i);
    onChange({ ...row, control_measures: next.length ? next : [""] });
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-black text-[#1a2e4a] tracking-wider w-10 shrink-0">{row.ref}</span>
        <input
          value={row.hazard}
          onChange={(e) => setField("hazard", e.target.value)}
          placeholder="Hazard description"
          className="flex-1 text-sm font-semibold text-slate-900 bg-transparent border-0 outline-none focus:ring-0 placeholder:text-slate-400 min-w-0"
        />
        <span className={cn(
          "text-xs font-bold px-2 py-0.5 rounded border shrink-0",
          LEVEL_COLOURS[row.risk_level_pre] ?? LEVEL_COLOURS.Medium
        )}>
          {row.risk_level_pre}
        </span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-slate-400 hover:text-slate-600 shrink-0"
          aria-label={open ? "Collapse" : "Expand"}
        >
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <button
          onClick={onDelete}
          className="text-slate-300 hover:text-red-500 transition-colors shrink-0"
          aria-label="Delete row"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="px-4 py-4 space-y-4">
          {/* Who at risk */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Who is at risk</label>
            <input
              value={row.who_at_risk}
              onChange={(e) => setField("who_at_risk", e.target.value)}
              placeholder="e.g. Operatives, public, adjacent workers"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>

          {/* Control measures */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Control measures</label>
            <div className="space-y-2">
              {row.control_measures.map((c, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="mt-2.5 text-slate-300 text-xs font-bold shrink-0">•</span>
                  <textarea
                    value={c}
                    onChange={(e) => setControl(i, e.target.value)}
                    rows={2}
                    placeholder="Describe a control measure"
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none"
                  />
                  <button
                    onClick={() => deleteControl(i)}
                    disabled={row.control_measures.length === 1}
                    className="mt-2 text-slate-300 hover:text-red-400 disabled:opacity-30 transition-colors"
                    aria-label="Remove control"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addControl}
              className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add control measure
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function RAMSRiskEditor({ doc, onConfirm, onBack }: Props) {
  const [rows, setRows] = useState<RiskAssessmentItem[]>(doc.risk_assessment);

  const updateRow = (i: number, r: RiskAssessmentItem) =>
    setRows((prev) => prev.map((x, j) => (j === i ? r : x)));

  const deleteRow = (i: number) =>
    setRows((prev) => reindex(prev.filter((_, j) => j !== i)));

  const addRow = () =>
    setRows((prev) => {
      const ref = `RA-${String(prev.length + 1).padStart(2, "0")}`;
      return [...prev, blankRow(ref)];
    });

  const handleConfirm = () => onConfirm({ ...doc, risk_assessment: reindex(rows) });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a2e4a]">Review your Risk Assessment</h2>
        <p className="text-slate-500 text-sm mt-1">
          Edit any row before generating your final document. You can change hazards, controls, or delete rows that don&apos;t apply.
        </p>
      </div>

      {/* Row count badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {rows.length} {rows.length === 1 ? "row" : "rows"}
        </span>
      </div>

      {/* Rows */}
      <div className="space-y-3 mb-6">
        {rows.map((row, i) => (
          <RowCard
            key={row.ref}
            row={row}
            onChange={(r) => updateRow(i, r)}
            onDelete={() => deleteRow(i)}
          />
        ))}
      </div>

      {/* Add row */}
      <button
        onClick={addRow}
        className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mb-8"
      >
        <Plus className="w-4 h-4" /> Add risk row
      </button>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to details
        </button>
        <button
          onClick={handleConfirm}
          className="flex items-center gap-2 bg-[#1a2e4a] hover:bg-[#0f1e32] text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Confirm & Generate <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
