"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardCheck, Download, FileText, Layers, LayoutDashboard, LineChart, Map as MapIcon, Menu, Sparkles, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { group: "Explore", items: [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/pillars", label: "New Economy", icon: Layers },
    { href: "/indicators", label: "Indicators", icon: LineChart },
    { href: "/map", label: "Regional map", icon: MapIcon }] },
  { group: "Accountability", items: [{ href: "/tracker", label: "Promise vs Progress", icon: ClipboardCheck }] },
  { group: "Tools", items: [
    { href: "/ai", label: "Ask the Budget", icon: Sparkles },
    { href: "/data", label: "Data & downloads", icon: Download }] },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b bg-[#101C2C] px-4 py-3 text-[#F8F7F3] lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="rounded p-1 hover:bg-white/10"><Menu className="h-5 w-5" /></button>
        <span className="inline-block h-4 w-1 bg-[#D5A62E]" /><span className="text-sm font-semibold">Ghana Budget Intelligence 2027</span>
      </div>
      {open && <button aria-label="Close menu" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#101C2C] text-[#F8F7F3] transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`} aria-label="Sidebar">
        <div className="flex h-1 shrink-0"><span className="flex-1 bg-[#CE1126]" /><span className="flex-1 bg-[#D5A62E]" /><span className="flex-1 bg-[#087A4B]" /></div>
        <div className="flex items-start justify-between px-5 pb-4 pt-6">
          <Link href="/" className="block leading-tight">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#D5A62E]">Ghana</span>
            <span className="block text-lg font-semibold">Budget Intelligence</span>
            <span className="block text-xs text-white/50">2027 Budget Speech</span>
          </Link>
          <button className="rounded p-1 hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-4 w-4" /></button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2" aria-label="Main">
          {NAV.map((g) => (
            <div key={g.group}>
              <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{g.group}</div>
              <ul className="space-y-0.5">
                {g.items.map(({ href, label, icon: Icon }) => {
                  const active = href === "/" ? path === "/" : path.startsWith(href);
                  return (
                    <li key={href}>
                      <Link href={href} aria-current={active ? "page" : undefined}
                        className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"}`}>
                        {active && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded bg-[#D5A62E]" />}
                        <Icon className={`h-4 w-4 ${active ? "text-[#D5A62E]" : "text-white/50 group-hover:text-white/80"}`} />{label}
                      </Link>
                    </li>);
                })}
              </ul>
            </div>))}
        </nav>

        <div className="space-y-3 border-t border-white/10 p-4">
          <a href="/budget-speech.pdf" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-white/60 hover:text-white"><FileText className="h-3.5 w-3.5" />Read the speech (PDF)</a>
          <div className="flex items-center justify-between"><span className="text-[11px] text-white/40">Independent explainer</span><ThemeToggle className="text-white hover:bg-white/10 hover:text-white" /></div>
        </div>
      </aside>

      <div className="lg:pl-64">{children}</div>
    </>
  );
}
