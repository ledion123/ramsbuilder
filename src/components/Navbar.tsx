"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HardHat, Menu, X, ArrowRight, ShieldCheck } from "lucide-react";

interface NavbarProps {
  variant?: "marketing" | "app";
}

const marketingLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Regulations", href: "/regulations" },
];

export function Navbar({ variant = "marketing" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e3a6e] bg-[#0a1628]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-900/40 group-hover:bg-blue-500 transition-colors">
              <HardHat className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <span className="text-white font-black text-sm tracking-tight">
              RAMS<span className="text-blue-400">Generator</span>
            </span>
          </Link>

          {/* Marketing nav — desktop */}
          {variant === "marketing" && (
            <nav className="hidden md:flex items-center gap-6">
              {marketingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* App nav — desktop: show current section */}
          {variant === "app" && (
            <nav className="hidden md:flex items-center gap-4 text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-slate-300 capitalize">
                {pathname === "/generate" ? "Generate RAMS"
                  : pathname === "/preview" ? "Preview Document"
                  : pathname === "/regulations" ? "Regulations"
                  : ""}
              </span>
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {variant === "marketing" && (
              <>
                <Link
                  href="/regulations"
                  className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Check regs
                </Link>
                <Link
                  href="/generate"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Generate RAMS
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}

            {variant === "app" && (
              <Link
                href="/generate"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-lg border border-blue-600/20 transition-colors"
              >
                New RAMS
              </Link>
            )}

            {/* Mobile hamburger */}
            {variant === "marketing" && (
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && variant === "marketing" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            style={{ overflow: "hidden" }}
            className="md:hidden border-t border-[#1e3a6e] bg-[#0a1628]"
          >
            <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3">
              {marketingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-slate-300 hover:text-white transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/generate"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Generate RAMS Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
