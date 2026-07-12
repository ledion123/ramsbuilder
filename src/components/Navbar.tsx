"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HardHat, Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  variant?: "marketing" | "app";
}

const marketingLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
];

const appLinks = [
  { label: "Generate RAMS", href: "/generate" },
  { label: "Home", href: "/" },
];

function pageLabel(pathname: string) {
  if (pathname === "/generate") return "Generate RAMS";
  if (pathname === "/preview") return "Preview Document";
  return "App";
}

export function Navbar({ variant = "marketing" }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-[#1a2e4a] flex items-center justify-center shadow-sm group-hover:bg-[#243d5f] transition-colors">
              <HardHat className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-slate-900 font-black text-sm tracking-tight">
              RAMS<span className="text-blue-600">Generator</span>
            </span>
          </Link>

          {/* Marketing nav — desktop */}
          {variant === "marketing" && (
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              {marketingLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* App nav — desktop breadcrumb */}
          {variant === "app" && (
            <nav className="hidden md:flex items-center gap-4 text-xs text-slate-500" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <span className="text-slate-800 font-medium">{pageLabel(pathname)}</span>
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-2">
            {variant === "marketing" && (
              <>
                <Link
                  href="/generate"
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition-colors shadow-sm"
                >
                  Generate RAMS
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}

            {variant === "app" && (
              <Link
                href="/generate"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2e4a] hover:bg-[#243d5f] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                New RAMS
              </Link>
            )}

            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden text-slate-600 hover:text-slate-900 transition-colors p-1 rounded"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className="md:hidden overflow-hidden">
        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-drawer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="border-t border-slate-200 bg-white"
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
                        className="text-sm text-slate-700 hover:text-slate-900 transition-colors py-1"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      href="/generate"
                      onClick={() => setMobileOpen(false)}
                      className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-lg transition-colors"
                    >
                      Generate RAMS Free
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1">
                      Currently: {pageLabel(pathname)}
                    </div>
                    {appLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="text-sm text-slate-700 hover:text-slate-900 transition-colors py-1 border-b border-slate-100 last:border-0"
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
