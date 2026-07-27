"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, X, FileText, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import type { RAMSDocument, RAMSInput } from "@/lib/types";

const ALLOWED_EXTS = [".pdf", ".docx", ".txt"];
const MAX_BYTES = 10 * 1024 * 1024;

type State =
  | { status: "idle" }
  | { status: "dragging" }
  | { status: "extracting" }
  | { status: "generating" }
  | { status: "error"; message: string };

export function QuickGeneratePanel() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<State>({ status: "idle" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const busy = state.status === "extracting" || state.status === "generating";

  const validateFile = (f: File): string | null => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) return `"${f.name}" is not supported. Upload PDF, DOCX, or TXT.`;
    if (f.size > MAX_BYTES) return `File exceeds 10 MB limit.`;
    return null;
  };

  const pickFile = useCallback((f: File) => {
    const err = validateFile(f);
    if (err) { setState({ status: "error", message: err }); return; }
    setFile(f);
    setState({ status: "idle" });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState({ status: "idle" });
    const f = e.dataTransfer.files[0];
    if (f) pickFile(f);
  }, [pickFile]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) pickFile(f);
    e.target.value = "";
  };

  const generate = async () => {
    if (!text.trim() && !file) {
      setState({ status: "error", message: "Paste a description or upload a scope document." });
      return;
    }

    setState({ status: "extracting" });

    const form = new FormData();
    if (text.trim()) form.append("text", text.trim());
    if (file) form.append("file", file);

    // Single round-trip: extract + fill defaults + generate all happen server-side
    setState({ status: "generating" });

    let res: Response;
    try {
      res = await fetch("/api/quick-generate", { method: "POST", body: form });
    } catch {
      setState({ status: "error", message: "Network error — please check your connection." });
      return;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { error?: string };
      setState({ status: "error", message: body.error ?? "Generation failed." });
      return;
    }

    const { document, input } = await res.json() as { document: RAMSDocument; input: RAMSInput };

    try {
      localStorage.setItem("rams_document", JSON.stringify(document));
      localStorage.setItem("rams_input", JSON.stringify(input));
    } catch {
      try {
        sessionStorage.setItem("rams_document", JSON.stringify(document));
        sessionStorage.setItem("rams_input", JSON.stringify(input));
      } catch {
        setState({ status: "error", message: "Could not save document locally. Please try again." });
        return;
      }
    }

    router.push("/preview");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Zap className="w-3.5 h-3.5" />
          AI Express — no form required
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Describe the works</h2>
        <p className="text-slate-500 text-sm">
          Paste a project description or upload a scope document. AI will extract all the details and generate a complete RAMS.
        </p>
      </div>

      <div className="space-y-4">
        {/* Text input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={busy}
          rows={6}
          placeholder="e.g. Excavation for foul drainage installation, 2.5m deep in soft ground. Site on London Road, E1. Principal contractor: Skanska. Works include installation of 225mm PVC-U pipes and precast manholes. Operatives: 3. Supervisor: John Smith. Start date: 01/09/2026. Duration: 2 weeks."
          className={cn(
            "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-[#1a2e4a] focus:border-transparent resize-none",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex-1 h-px bg-slate-200" />
          or upload a scope document
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* File drop zone */}
        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <span className="text-sm text-slate-700 flex-1 truncate">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              disabled={busy}
              className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setState({ status: "dragging" }); }}
            onDragLeave={() => setState({ status: "idle" })}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 cursor-pointer transition-colors",
              state.status === "dragging"
                ? "border-[#1a2e4a] bg-slate-50"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
              busy && "pointer-events-none opacity-50"
            )}
          >
            <UploadCloud className="w-8 h-8 text-slate-300" />
            <p className="text-sm text-slate-500">
              Drop PDF, DOCX, or TXT here, or <span className="text-[#1a2e4a] font-medium">browse</span>
            </p>
            <p className="text-xs text-slate-400">Max 10 MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={onFileInput}
        />

        {/* Error */}
        {state.status === "error" && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {state.message}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={generate}
          disabled={busy}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-colors",
            busy
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-[#1a2e4a] hover:bg-[#243d62]"
          )}
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {state.status === "extracting" ? "Reading document…" : "Generating RAMS…"}
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Generate RAMS
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400">
          AI will fill in any missing details with placeholder values you can edit later in the preview.
        </p>
      </div>
    </div>
  );
}
