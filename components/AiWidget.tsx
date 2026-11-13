"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Expand, Sparkles, X } from "lucide-react";
import { AiChat } from "@/components/AiChat";

/** Floating assistant available on every page. Stays mounted so the conversation survives navigation. */
export function AiWidget() {
  const [open, setOpen] = useState(false); const path = usePathname();
  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("ask-budget", h); return () => window.removeEventListener("ask-budget", h);
  }, []);
  if (path === "/ai") return null; // the full page already has the chat

  return (
    <>
      <div role="dialog" aria-label="Ask the Budget assistant" aria-hidden={!open}
        className={`fixed bottom-20 right-4 z-50 flex h-[min(640px,calc(100vh-7rem))] w-[min(420px,calc(100vw-2rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl transition duration-200 sm:right-6 ${open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}`}>
        <div className="flex items-center gap-2 bg-[#101C2C] px-4 py-3 text-[#F8F7F3]">
          <Sparkles className="h-4 w-4 text-[#D5A62E]" />
          <div className="flex-1 leading-tight"><div className="text-sm font-semibold">Ask the Budget</div><div className="text-[11px] text-white/60">Answers cite the speech</div></div>
          <Link href="/ai" aria-label="Open full page" className="rounded p-1.5 hover:bg-white/10"><Expand className="h-4 w-4" /></Link>
          <button onClick={() => setOpen(false)} aria-label="Close assistant" className="rounded p-1.5 hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        <div className="min-h-0 flex-1 p-4"><AiChat compact listen /></div>
      </div>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? "Close assistant" : "Ask the Budget"}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-[#D5A62E] px-4 py-3 text-sm font-semibold text-[#101C2C] shadow-lg transition hover:scale-105 sm:right-6">
        {open ? <X className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}<span className="hidden sm:inline">{open ? "Close" : "Ask the Budget"}</span>
      </button>
    </>
  );
}
