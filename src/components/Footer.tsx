import Link from "next/link";
import { HardHat, ShieldCheck } from "lucide-react";

const complianceBadges = ["CDM 2015", "COSHH 2002", "RIDDOR 2013", "PUWER 1998"];

export function Footer() {
  return (
    <footer className="bg-[#070e1c] border-t border-[#1e3a6e]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <HardHat className="w-[16px] h-[16px] text-white" />
              </div>
              <span className="text-white font-black text-sm tracking-tight">
                RAMS<span className="text-blue-400">Generator</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              AI-powered RAMS document generation for UK construction subcontractors across all trade disciplines.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {complianceBadges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-blue-900/60 text-blue-400/80 bg-blue-950/30"
                >
                  <ShieldCheck className="w-2.5 h-2.5" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Col 2 — Links */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Tool</p>
            <ul className="space-y-2">
              {[
                { label: "Generate RAMS", href: "/generate" },
                { label: "Regulations Checker", href: "/regulations" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Features", href: "/#features" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Compliance */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Compliance</p>
            <ul className="space-y-2">
              <li className="text-xs text-slate-500">Built for UK construction subcontractors</li>
              <li className="text-xs text-slate-500">9 industries — groundworks, electrical, scaffolding &amp; more</li>
              <li className="text-xs text-slate-500">CDM 2015 compliant output</li>
              <li className="text-xs text-slate-500">Covers COSHH, PUWER, LOLER, RIDDOR, WAH 2005</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1e3a6e]/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} RAMS Generator. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 text-center sm:text-right">
            Not a substitute for professional health &amp; safety advice. Always consult a qualified H&amp;S professional.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
