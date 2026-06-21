"use client";

import { useEffect, useState } from "react";
import { RAMSPreview } from "@/components/RAMSPreview";
import type { RAMSDocument } from "@/lib/types";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { HardHat, Loader2 } from "lucide-react";

export default function PreviewPage() {
  const [data, setData] = useState<(RAMSDocument & { _source?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rams_document");
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar variant="app" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navbar variant="app" />
        <div className="flex items-center justify-center flex-col gap-4 min-h-[60vh]">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
            <HardHat className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-white font-semibold">No RAMS document found</h1>
          <p className="text-slate-500 text-sm">Return to the form and generate a document first.</p>
          <Link
            href="/generate"
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Generate RAMS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar variant="app" />
      <RAMSPreview data={data} />
    </div>
  );
}
