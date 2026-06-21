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

const appLinks = [
  { label: "Generate RAMS", href: "/generate" },
  { label: "Regulations", href: "/regulations" },
  { label: "Home", href: "/" },
];

function pageLabel(pathname: string) {
  if (pathname === "/generate") return "Generate RAMS";
  if (pathname === "/preview") return "Preview Document";
  if (pathname === "/regulations") return "Regulations";
  return "App";
}

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
              <HardHat className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-white font-black text-sm tracking-tight">
              RAMS<span className="text-blue-400">Generator</span>
            </span>
          </Link>

          {/* Marketing nav — desktop */}
          {variant === "marketing" && (
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
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

          {/* App nav — desktop breadcrumb */}
          {variant === "app" && (
            <nav className="hidden md:flex items-center gap-4 text-xs text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-slate-300">{pageLabel(pathname)}</span>
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

            {/* Mobile hamburger — both variants */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden text-slate-400 hover:text-white transition-colors p-1 rounded"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer — shared for both variants */}
      <div className="md:hidden overflow-hidden">
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="border-t border-[#1e3a6e] bg-[#0a1628]"
            >
              <nav
                className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3"
                aria-label="Mobile navigation"
              >
                {variant === "marketing" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest pb-1">
                      Currently: {pageLabel(pathname)}
                    </div>
                    {appLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-300 hover:text-white transition-colors py-1 border-b border-[#1e3a6e]/40 last:border-0"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default Navbar;
