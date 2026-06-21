"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Navbar } from "@/components/Navbar";
import type { RegStatus } from "@/app/api/regulations/check/route";
import {
  HardHat,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

function StatusBadge({ status }: { status: RegStatus["status"] | "idle" | "loading" }) {
  if (status === "idle" || status === "loading") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-500 border border-slate-700">
        —
      </span>
    );
  }
  if (status === "current") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-600/15 text-green-400 border border-green-600/30 font-semibold">
        <CheckCircle2 className="w-3 h-3" />
        Current
      </span>
    );
  }
  if (status === "review") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
        <AlertTriangle className="w-3 h-3" />
        Review needed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 font-semibold">
      <XCircle className="w-3 h-3" />
      Error
    </span>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function RegulationsPage() {
  const [results, setResults] = useState<RegStatus[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/regulations/check", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: RegStatus[] = await res.json();
      setResults(data);
      setCheckedAt(new Date().toLocaleTimeString("en-GB"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check failed");
    } finally {
      setLoading(false);
    }
  };

  const reviewCount = results?.filter((r) => r.status === "review").length ?? 0;
  const errorCount = results?.filter((r) => r.status === "error").length ?? 0;
  const currentCount = results?.filter((r) => r.status === "current").length ?? 0;

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      <Navbar variant="app" />
      {/* Hero Header */}
      <header className="border-b border-slate-800 bg-[#0a1628]">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/40">
              <HardHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                  Regulation Currency Checker
                </h1>
              </div>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Checks each UK regulation cited by this app against{" "}
                <span className="text-slate-300">legislation.gov.uk</span> to detect amendments
                since we last verified. Click through to review any flagged items.
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs mt-4 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to RAMS Generator
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {results && (
              <div className="flex items-center gap-3 text-sm">
                {currentCount > 0 && (
                  <span className="flex items-center gap-1.5 text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {currentCount} current
                  </span>
                )}
                {reviewCount > 0 && (
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {reviewCount} need review
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="flex items-center gap-1.5 text-red-400">
                    <XCircle className="w-3.5 h-3.5" />
                    {errorCount} errors
                  </span>
                )}
                {checkedAt && (
                  <span className="text-slate-600 text-xs">· checked at {checkedAt}</span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={runCheck}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            {loading ? "Checking…" : results ? "Re-check" : "Check Now"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-sm text-red-400">Check failed: {error}</p>
          </div>
        )}

        {/* Info callout */}
        {reviewCount > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <p className="text-sm text-amber-300">
              <span className="font-semibold">Review needed:</span>{" "}
              legislation.gov.uk has updated {reviewCount === 1 ? "this regulation" : `${reviewCount} regulations`} since
              the app was last verified. Click the GOV.UK link for each flagged row to check if the
              change is substantive. If wording or duties have changed, update{" "}
              <code className="text-amber-200 bg-amber-900/30 px-1 rounded">src/lib/generateFromTemplate.ts</code>{" "}
              and set <code className="text-amber-200 bg-amber-900/30 px-1 rounded">lastVerified</code> in{" "}
              <code className="text-amber-200 bg-amber-900/30 px-1 rounded">src/lib/regulations.ts</code> to today.
            </p>
          </div>
        )}

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-800/40 px-6 py-3 flex items-center gap-3 border-b border-slate-800">
            <div className="w-px h-4 bg-blue-600 flex-shrink-0" />
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.15em]">
              Tracked Regulations ({REGULATIONS_COUNT})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Regulation</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest w-28">Short code</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest w-32">Last verified</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest w-36">GOV.UK updated</th>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest w-36">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(results ?? PLACEHOLDER_ROWS).map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "group transition-colors",
                      row.status === "review" && "bg-amber-500/5"
                    )}
                  >
                    <td className="px-5 py-3.5">
                      <a
                        href={row.govukUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm text-slate-200 hover:text-blue-400 transition-colors group/link"
                      >
                        <span className="leading-snug">{row.name}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5 opacity-0 group-hover/link:opacity-100 transition-opacity text-blue-400" />
                      </a>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-slate-400">{row.shortCode}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-400">{formatDate(row.lastVerified)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn(
                        "text-xs",
                        row.govukModified && row.govukModified > row.lastVerified
                          ? "text-amber-400 font-semibold"
                          : "text-slate-400"
                      )}>
                        {row.govukModified ? formatDate(row.govukModified) : (
                          <span className="text-slate-600">{loading ? "…" : "—"}</span>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={results ? row.status : "idle"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referenced British Standards */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-800/40 px-6 py-3 flex items-center gap-3 border-b border-slate-800">
            <div className="w-px h-4 bg-blue-600 flex-shrink-0" />
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.15em]">
              Referenced British Standards
            </h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-500 mb-4">
              These are British Standards (not statutory instruments) — they cannot be checked via legislation.gov.uk.
              Always verify you are using the current edition before starting work.
            </p>
            <div className="space-y-2">
              {[
                { code: "BS 7671:2018+A2:2022", name: "IET Wiring Regulations (18th Edition)", scope: "Electrical installations" },
                { code: "BS 5975:2019+A1:2019", name: "Code of Practice for Temporary Works Procedures", scope: "Temporary works, falsework, propping" },
                { code: "NASC TG20:21", name: "Technical Guidance for scaffolding design and erection", scope: "Scaffold design and erection" },
                { code: "BS 5839-1:2017", name: "Fire Detection and Alarm Systems for Buildings", scope: "Fire alarm installation" },
                { code: "BS 5266-1:2016", name: "Code of Practice for Emergency Lighting", scope: "Emergency lighting installation" },
              ].map(({ code, name, scope }) => (
                <div key={code} className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                  <span className="text-[10px] font-black text-blue-400 bg-blue-600/10 border border-blue-600/20 px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0 mt-0.5">
                    {code}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{name}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{scope}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-3 text-xs text-slate-600 pb-4">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-700" />
          <p>
            Modification dates are fetched live from{" "}
            <a
              href="https://www.legislation.gov.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-400 transition-colors"
            >
              legislation.gov.uk
            </a>
            . A &quot;Review needed&quot; flag means the legislation text was updated after our last
            verified date — it may or may not represent a substantive change to duties. Always read
            the amendment before updating this app.
          </p>
        </div>
      </main>
    </div>
  );
}

// Placeholder rows shown before first check — avoids empty table on load
import { REGULATIONS } from "@/lib/regulations";
const REGULATIONS_COUNT = REGULATIONS.length;
const PLACEHOLDER_ROWS: RegStatus[] = REGULATIONS.map((r) => ({
  id: r.id,
  name: r.name,
  shortCode: r.shortCode,
  govukUrl: `https://www.legislation.gov.uk/${r.govukType}/${r.govukYear}/${r.govukNumber}`,
  lastVerified: r.lastVerified,
  govukModified: null,
  status: "current" as const,
}));
