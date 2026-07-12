import Link from "next/link";
import { HardHat, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mx-auto mb-6">
          <HardHat className="w-8 h-8 text-blue-400" />
        </div>
        <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mb-3">404 — Page Not Found</p>
        <h1 className="text-3xl font-black text-white mb-4">Nothing here on site</h1>
        <p className="text-slate-500 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <Link
            href="/generate"
            className="px-5 py-2.5 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 rounded-lg text-sm font-semibold transition-colors"
          >
            Generate RAMS
          </Link>
        </div>
      </div>
    </div>
  );
}
