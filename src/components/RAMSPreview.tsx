"use client";

import { useState } from "react";
import type { RAMSDocument, RiskAssessmentItem } from "@/lib/types";
import { cn } from "@/lib/cn";
import {
  Download,
  FileText,
  Loader2,
  ArrowLeft,
  Building2,
  Cpu,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

function riskColor(score: number) {
  if (score <= 6) return { bg: "bg-green-600", text: "text-white", border: "border-green-500" };
  if (score <= 14) return { bg: "bg-amber-500", text: "text-white", border: "border-amber-400" };
  return { bg: "bg-red-600", text: "text-white", border: "border-red-500" };
}

function RiskBadge({ score, level }: { score: number; level: string }) {
  const c = riskColor(score);
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold", c.bg, c.text)}>
      {score} {level}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-slate-700 text-white px-4 py-2 rounded font-semibold text-xs uppercase tracking-widest mt-8 mb-4">
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-1.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-semibold text-slate-500 w-40 flex-shrink-0 uppercase tracking-wide">{label}</span>
      <span className="text-xs text-slate-800 flex-1">{value}</span>
    </div>
  );
}

function RiskRow({ item, idx }: { item: RiskAssessmentItem; idx: number }) {
  return (
    <tr className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
      <td className="px-3 py-2 text-xs font-bold text-slate-700 align-top whitespace-nowrap">{item.ref}</td>
      <td className="px-3 py-2 text-xs font-semibold text-slate-800 align-top">{item.hazard}</td>
      <td className="px-3 py-2 text-xs text-slate-600 align-top max-w-xs">{item.description}</td>
      <td className="px-3 py-2 text-xs text-slate-600 align-top">{item.who_at_risk}</td>
      <td className="px-3 py-2 align-top text-center">
        <RiskBadge score={item.risk_score_pre} level={item.risk_level_pre} />
        <div className="text-[10px] text-slate-400 mt-0.5">{item.likelihood_pre}L × {item.severity_pre}S</div>
      </td>
      <td className="px-3 py-2 text-xs text-slate-600 align-top">
        <ul className="space-y-1">
          {item.control_measures.map((cm, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-orange-500 flex-shrink-0 mt-0.5">•</span>
              <span>{cm}</span>
            </li>
          ))}
        </ul>
      </td>
      <td className="px-3 py-2 align-top text-center">
        <RiskBadge score={item.risk_score_post} level={item.risk_level_post} />
        <div className="text-[10px] text-slate-400 mt-0.5">{item.likelihood_post}L × {item.severity_post}S</div>
      </td>
      <td className="px-3 py-2 text-[10px] text-slate-500 align-top">{item.legislation_ref}</td>
    </tr>
  );
}

function ExportButton({
  onClick,
  loading,
  icon: Icon,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  loading: boolean;
  icon: React.ElementType;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary"
          ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-900/30"
          : "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
      )}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

async function triggerDownload(url: string, data: RAMSDocument, filename: string) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

export function RAMSPreview({ data }: { data: RAMSDocument }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [docxLoading, setDocxLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handlePDF = async () => {
    setPdfLoading(true);
    setExportError(null);
    try {
      await triggerDownload("/api/export/pdf", data, `${data.document_ref}.pdf`);
    } catch {
      setExportError("PDF export failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDocx = async () => {
    setDocxLoading(true);
    setExportError(null);
    try {
      await triggerDownload("/api/export/docx", data, `${data.document_ref}.docx`);
    } catch {
      setExportError("Word export failed. Please try again.");
    } finally {
      setDocxLoading(false);
    }
  };

  const isAI = data._source === "ai";
  const ep = data.method_statement.emergency_procedures;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* ── Top bar ── */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              New RAMS
            </Link>
            <span className="text-slate-300">|</span>
            <div>
              <span className="text-sm font-semibold text-slate-900">{data.document_ref}</span>
              <span className="ml-2 text-xs text-slate-400">{data.revision} · {data.date}</span>
            </div>
            {isAI ? (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                <Cpu className="w-3 h-3" /> AI Generated
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                <Building2 className="w-3 h-3" /> Template Generated
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {exportError && (
              <span className="text-xs text-red-600 mr-2">{exportError}</span>
            )}
            <ExportButton onClick={handleDocx} loading={docxLoading} icon={FileText} variant="secondary">
              Export Word
            </ExportButton>
            <ExportButton onClick={handlePDF} loading={pdfLoading} icon={Download}>
              Export PDF
            </ExportButton>
          </div>
        </div>
      </div>

      {/* ── Document ── */}
      <main className="flex-1 py-8 px-4">
        <div className="print-area max-w-5xl mx-auto bg-white rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Cover header */}
          <div className="bg-[#1a2e4a] px-8 py-7 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {data.company.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.company.logo} alt={`${data.company.name} logo`} className="h-12 w-auto object-contain flex-shrink-0" />
              )}
              <div>
                <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.18em] mb-2">Subcontractor</p>
                <h1 className="text-3xl font-black text-white leading-tight">{data.company.name}</h1>
                <p className="text-slate-300 text-xs mt-1">{data.company.address}</p>
                {(data.company.reg || data.company.phone || data.company.email) && (
                  <p className="text-slate-400 text-xs mt-1">
                    {[
                      data.company.reg && `Reg. ${data.company.reg}`,
                      data.company.phone && `Tel: ${data.company.phone}`,
                      data.company.email,
                    ].filter(Boolean).join("  ·  ")}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-amber-400 font-mono text-sm font-bold">{data.document_ref}</p>
              <p className="text-slate-300 text-xs mt-1">{data.revision}</p>
              <p className="text-slate-300 text-xs">{data.date}</p>
            </div>
          </div>

          <div className="px-8 py-2 bg-amber-500">
            <h2 className="text-black font-bold text-center text-sm uppercase tracking-widest py-1">
              Risk Assessment &amp; Method Statement — CDM 2015 Compliant
            </h2>
          </div>

          <div className="px-8 py-6">
            {/* Project details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 mb-4">
              <InfoRow label="Project Name" value={data.project.name} />
              <InfoRow label="Principal Contractor" value={data.project.principal_contractor} />
              <InfoRow label="Site Address" value={data.project.site_address} />
              <InfoRow label="Site Supervisor" value={data.project.supervisor} />
              <InfoRow label="Start Date" value={data.project.start_date} />
              <InfoRow label="Duration" value={data.project.duration} />
              {data.project.working_hours && (
                <InfoRow label="Working Hours" value={data.project.working_hours} />
              )}
              {data.project.po_reference && (
                <InfoRow label="PO / Contract Ref" value={data.project.po_reference} />
              )}
            </div>

            {/* Revision history */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden text-xs">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="px-3 py-1.5 font-semibold text-slate-600 uppercase tracking-wide w-16">Rev</th>
                    <th className="px-3 py-1.5 font-semibold text-slate-600 uppercase tracking-wide w-24">Date</th>
                    <th className="px-3 py-1.5 font-semibold text-slate-600 uppercase tracking-wide">Description</th>
                    <th className="px-3 py-1.5 font-semibold text-slate-600 uppercase tracking-wide w-36">Prepared By</th>
                    <th className="px-3 py-1.5 font-semibold text-slate-600 uppercase tracking-wide w-36">Approved By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="px-3 py-1.5 text-slate-700 font-semibold">{data.revision}</td>
                    <td className="px-3 py-1.5 text-slate-600">{data.sign_off.date_prepared}</td>
                    <td className="px-3 py-1.5 text-slate-600">{data.revision_description ?? "Initial issue"}</td>
                    <td className="px-3 py-1.5 text-slate-600">{data.sign_off.prepared_by}</td>
                    <td className="px-3 py-1.5 text-slate-600">{data.sign_off.approved_by ?? "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scope */}
            <SectionTitle>1. Scope of Works</SectionTitle>
            <p className="text-sm text-slate-700 leading-relaxed">{data.scope_of_works}</p>
            {data.detected_trades && data.detected_trades.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider self-center">Detected trades:</span>
                {data.detected_trades.map((t) => (
                  <span key={t} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">{t}</span>
                ))}
              </div>
            )}

            {/* Legislation */}
            <SectionTitle>2. Applicable Legislation</SectionTitle>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-2/5">Regulation</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Relevance to These Works</th>
                </tr>
              </thead>
              <tbody>
                {data.legislation.map((leg, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-3 py-2 text-xs font-semibold text-slate-700 align-top border-b border-slate-100">{leg.regulation}</td>
                    <td className="px-3 py-2 text-xs text-slate-600 align-top border-b border-slate-100">{leg.relevance}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Risk Assessment */}
            <SectionTitle>3. Risk Assessment — 5×5 Matrix</SectionTitle>
            <p className="text-xs text-slate-400 sm:hidden mb-2 italic">← Scroll right to see full risk assessment →</p>

            <div className="flex gap-4 mb-3">
              {[{ label: "Low", range: "1–6", color: "bg-green-600" }, { label: "Medium", range: "7–14", color: "bg-amber-500" }, { label: "High", range: "15–25", color: "bg-red-600" }].map((r) => (
                <span key={r.label} className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span className={cn("w-3 h-3 rounded", r.color)} />
                  {r.label} ({r.range})
                </span>
              ))}
              <span className="text-xs text-slate-400 ml-auto">Score = Likelihood × Severity</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-14">Ref</th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-32">Hazard</th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-48">Description</th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-24">Who at Risk</th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-20 text-center">Pre-Control</th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Control Measures</th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-20 text-center">Post-Control</th>
                    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-28">Legislation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.risk_assessment.map((item, i) => (
                    <RiskRow key={item.ref} item={item} idx={i} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Method Statement */}
            <SectionTitle>4. Method Statement — Sequence of Works</SectionTitle>
            <div className="space-y-4">
              {data.method_statement.sequence_of_works.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {step.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{step.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Supervision */}
            <SectionTitle>5. Supervision Arrangements</SectionTitle>
            <p className="text-sm text-slate-700 leading-relaxed">{data.method_statement.supervision}</p>

            {/* Emergency procedures */}
            <SectionTitle>6. Emergency Procedures</SectionTitle>
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "First Aid", value: ep.first_aid },
                { label: "Emergency Contacts", value: ep.emergency_contacts },
                { label: "Nearest Hospital", value: ep.nearest_hospital },
                { label: "Evacuation", value: ep.evacuation },
                ...(ep.excavation_collapse ? [{ label: "Excavation Collapse", value: ep.excavation_collapse }] : []),
                ...(ep.confined_space_rescue ? [{ label: "Confined Space Rescue", value: ep.confined_space_rescue }] : []),
                ...(ep.gas_escape ? [{ label: "Gas Escape Procedure", value: ep.gas_escape }] : []),
                ...(ep.ohl_contact ? [{ label: "Overhead Powerline Contact", value: ep.ohl_contact }] : []),
              ].map((item) => (
                <div key={item.label} className="bg-slate-50 border border-slate-200 rounded p-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Plant */}
            <SectionTitle>7. Plant &amp; Equipment</SectionTitle>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-2/5">Item</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Competency / Inspection Requirement</th>
                </tr>
              </thead>
              <tbody>
                {data.method_statement.plant_and_equipment.map((p, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-3 py-2 text-xs font-semibold text-slate-700 border-b border-slate-100 align-top">{p.item}</td>
                    <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{p.requirement}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PPE */}
            <SectionTitle>8. PPE Requirements</SectionTitle>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-1/3">PPE Item</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Standard / Specification</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-24 text-center">Mandatory?</th>
                </tr>
              </thead>
              <tbody>
                {data.method_statement.ppe_requirements.map((p, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-3 py-2 text-xs font-semibold text-slate-700 border-b border-slate-100 align-top">{p.item}</td>
                    <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{p.standard}</td>
                    <td className="px-3 py-2 border-b border-slate-100 align-top text-center">
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded", p.mandatory ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500")}>
                        {p.mandatory ? "YES" : "Where req."}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* COSHH */}
            <SectionTitle>9. COSHH Assessment</SectionTitle>
            <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-1/5">Substance</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-1/4">Health Risk</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Control Measures</th>
                  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-20">Reg.</th>
                </tr>
              </thead>
              <tbody>
                {data.method_statement.coshh_substances.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-3 py-2 text-xs font-semibold text-slate-700 border-b border-slate-100 align-top">{c.substance}</td>
                    <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{c.risk}</td>
                    <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{c.control}</td>
                    <td className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100 align-top">{c.regulation}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* HAVS */}
            {data.havs_assessment.applicable && (
              <>
                <SectionTitle>10. HAVS Assessment</SectionTitle>
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-700 text-white">
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-1/4">Tool</th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-1/3">Vibration Level</th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-1/5">Exposure Limits</th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.havs_assessment.tools.map((h, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="px-3 py-2 text-xs font-semibold text-slate-700 border-b border-slate-100 align-top">{h.tool}</td>
                        <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{h.vibration_level}</td>
                        <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{h.daily_exposure_limit}</td>
                        <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{h.control}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Noise — only render when applicable */}
            {data.noise_assessment.applicable && (
              <>
                <SectionTitle>11. Noise Assessment</SectionTitle>
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-slate-700 text-white">
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-1/3">Noise Source</th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide w-1/5">Approx. Level dB(A)</th>
                      <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide">Control Measures</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.noise_assessment.sources.map((n, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="px-3 py-2 text-xs font-semibold text-slate-700 border-b border-slate-100 align-top">{n.source}</td>
                        <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{n.approximate_db}</td>
                        <td className="px-3 py-2 text-xs text-slate-600 border-b border-slate-100 align-top">{n.control}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* Environmental */}
            <SectionTitle>12. Environmental Controls</SectionTitle>
            <ul className="space-y-2">
              {data.method_statement.environmental_controls.map((ec, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-700">
                  <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                  {ec}
                </li>
              ))}
            </ul>

            {/* Welfare Arrangements */}
            {data.method_statement.welfare_arrangements && (
              <>
                <SectionTitle>13. Welfare Arrangements (CDM 2015 Schedule 2)</SectionTitle>
                <p className="text-sm text-slate-700 leading-relaxed">{data.method_statement.welfare_arrangements}</p>
              </>
            )}

            {/* Sign-off */}
            <SectionTitle>14. Document Sign-Off</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Prepared by (Subcontractor)</p>
                <InfoRow label="Name" value={data.sign_off.prepared_by} />
                <InfoRow label="Position" value={data.sign_off.position} />
                <InfoRow label="Date" value={data.sign_off.date_prepared} />
                {data.sign_off.approved_by && (
                  <>
                    <InfoRow label="Approved By" value={data.sign_off.approved_by} />
                    {data.sign_off.approved_by_position && (
                      <InfoRow label="Approver Role" value={data.sign_off.approved_by_position} />
                    )}
                  </>
                )}
                <div className="mt-4 border-t border-slate-300 pt-3">
                  <p className="text-xs text-slate-400">Signature: ___________________________</p>
                </div>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Reviewed &amp; Approved (Principal Contractor)</p>
                <InfoRow label="Name" value="________________________________" />
                <InfoRow label="Position" value="________________________________" />
                <InfoRow label="Date" value="________________________________" />
                <div className="mt-4 border-t border-slate-300 pt-3">
                  <p className="text-xs text-slate-400">Signature: ___________________________</p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-500 italic">Review Date: {data.sign_off.review_date}</p>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-amber-600">
                <AlertTriangle className="w-3 h-3" />
                <span>This document must be submitted to and approved by {data.project.principal_contractor} before works commence on site.</span>
              </div>
            </div>

            {/* ── Operative Sign-Off Table (CDM 2015 legal requirement) ── */}
            <SectionTitle>15. Operative Sign-Off Register (CDM 2015)</SectionTitle>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              All operatives must sign below to confirm they have read, understood, and will comply with this RAMS before commencing work (CDM 2015, Regulation 15). This register must be retained on site and available for inspection.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-700 text-white">
                    <th className="px-2 py-2 font-semibold uppercase tracking-wide w-10 text-center">No.</th>
                    <th className="px-2 py-2 font-semibold uppercase tracking-wide">Name (Print)</th>
                    <th className="px-2 py-2 font-semibold uppercase tracking-wide">Signature</th>
                    <th className="px-2 py-2 font-semibold uppercase tracking-wide w-24">Date</th>
                    <th className="px-2 py-2 font-semibold uppercase tracking-wide w-36">CSCS / Competency Card No.</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 12 }, (_, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-2 py-3 text-center text-slate-500 border border-slate-200">{i + 1}</td>
                      <td className="px-2 py-3 border border-slate-200"> </td>
                      <td className="px-2 py-3 border border-slate-200"> </td>
                      <td className="px-2 py-3 border border-slate-200"> </td>
                      <td className="px-2 py-3 border border-slate-200"> </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
