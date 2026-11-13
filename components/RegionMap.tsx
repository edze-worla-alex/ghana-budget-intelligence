"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COMMITMENTS } from "@/data/commitments";
import { REGION_SHAPES } from "@/data/ghana-map";
import type { RegionId, Sector } from "@/data/types";
import { fmtMoney } from "@/lib/format";
import { SECTOR_COLOR, STATUS_COLOR, TOOLTIP_STYLE } from "@/lib/palette";
import { GhanaMap, type RegionStat } from "@/components/GhanaMap";
import { SourceChip } from "@/components/SourceChip";
import { Badge } from "@/components/ui/badge";

const SECTORS = [...new Set(COMMITMENTS.map((c) => c.sector))] as Sector[];
const IDS = Object.keys(REGION_SHAPES) as RegionId[];

export function RegionMap() {
  const [sector, setSector] = useState<Sector | "all">("all");
  const [sel, setSel] = useState<RegionId | null>(null);
  const rows = useMemo(() => COMMITMENTS.filter((c) => sector === "all" || c.sector === sector), [sector]);

  const stats = useMemo(() => Object.fromEntries(IDS.map((id) => {
    const items = rows.filter((c) => c.regions.includes(id));
    return [id, { count: items.length, inferredOnly: items.length > 0 && items.every((c) => c.locationBasis === "inferred"), sectors: [...new Set(items.map((c) => c.sector))] } satisfies RegionStat];
  })) as Record<RegionId, RegionStat>, [rows]);
  const max = Math.max(1, ...IDS.map((id) => stats[id].count));
  const ranking = IDS.map((id) => ({ id, name: REGION_SHAPES[id].name, n: stats[id].count })).filter((r) => r.n > 0).sort((a, b) => b.n - a.n);
  const named = ranking.length; const national = rows.filter((c) => c.locationBasis === "national");
  const shown = sel ? rows.filter((c) => c.regions.includes(sel)) : [];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat v={`${named} / 16`} l="regions named in a commitment" /><Stat v={String(rows.length - national.length)} l="commitments with a named location" /><Stat v={String(national.length)} l="national (no region named)" />
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by sector">
        {(["all", ...SECTORS] as const).map((s) => (
          <button key={s} onClick={() => setSector(s)} aria-pressed={sector === s}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${sector === s ? "border-[#D5A62E] bg-[#D5A62E]/15 font-medium" : "text-muted-foreground hover:text-foreground"}`}>
            {s !== "all" && <span className="h-2 w-2 rounded-full" style={{ background: SECTOR_COLOR[s] }} />}{s === "all" ? "All sectors" : s}</button>))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,500px)_1fr]">
        <div className="rounded-2xl border bg-card p-4">
          <GhanaMap stats={stats} max={max} selected={sel} onSelect={setSel} />
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">Fewer<span className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--map-fill) 32%, transparent), var(--map-fill))" }} />More commitments</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm bg-[var(--map-fill)]" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.5) 0 2px, transparent 2px 5px)" }} />location inferred only</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Shading shows how many announced commitments name a region, not money. Outlines are a schematic vector map, not a survey boundary.</p>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border bg-card p-5" aria-live="polite">
            {!sel ? (
              <>
                <h2 className="font-semibold">Select a region</h2>
                <p className="mt-1 text-sm text-muted-foreground">Hover or tab through the map, then click a region for its announced projects, disclosed amounts and source paragraphs. Or pick one from the ranking.</p>
                <div className="mt-3 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ranking} layout="vertical" margin={{ left: 8, right: 16 }}>
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "currentColor" }} /><YAxis type="category" dataKey="name" width={96} interval={0} tick={{ fontSize: 11, fill: "currentColor" }} />
                      <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "currentColor", opacity: 0.06 }} formatter={(v) => [`${v} commitments`, ""]} />
                      <Bar dataKey="n" radius={[0, 4, 4, 0]} onClick={(_, i) => setSel(ranking[i].id)} className="cursor-pointer">{ranking.map((r) => <Cell key={r.id} fill="#087A4B" />)}</Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div><h2 className="text-xl font-semibold">{REGION_SHAPES[sel].name} Region</h2><p className="text-sm text-muted-foreground">{shown.length} announced commitment{shown.length === 1 ? "" : "s"}{sector !== "all" && ` in ${sector}`}</p></div>
                  <button onClick={() => setSel(null)} aria-label="Clear selection" className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
                </div>
                {!shown.length && <p className="mt-3 text-sm text-muted-foreground">No commitment in this selection names this region in the speech. National commitments may still apply.</p>}
                <ul className="mt-4 space-y-3">
                  {shown.map((c) => (
                    <li key={c.id} className="rounded-xl border p-3" style={{ borderLeft: `4px solid ${SECTOR_COLOR[c.sector]}` }}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{c.title}</span>
                        {c.locationBasis === "inferred" && <Badge variant="secondary" title="The speech names a corridor or zone, not this region. Mapped by us; flagged for review.">location inferred</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                      <div className="mt-2 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-2">
                        <div><span className="text-muted-foreground">Amount: </span><strong>{c.amount ? fmtMoney(c.amount) : "not stated"}</strong></div>
                        <div><span className="text-muted-foreground">{c.target ? "Target: " : c.start ? "Starts: " : "Date: "}</span>{c.target ?? c.start ?? "not stated"}</div>
                        <div className="flex items-center gap-1.5"><span className="text-muted-foreground">Status: </span><span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLOR[c.status] }} />{c.status} <span className="text-muted-foreground">(announced)</span></div>
                        <div><span className="text-muted-foreground">Sector: </span>{c.sector}</div>
                      </div>
                      {c.amountScope && <p className="mt-1 text-xs text-muted-foreground">{c.amountScope}{c.regions.length > 1 && c.amount ? `. Shared across ${c.regions.length} regions; not a regional split.` : ""}</p>}
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><SourceChip paras={c.paras.slice(0, 4)} /><Link href={`/tracker?open=${c.id}`} className="text-xs text-muted-foreground hover:text-foreground">Open in tracker <ArrowUpRight className="inline h-3 w-3" /></Link></div>
                    </li>))}
                </ul>
              </>
            )}
          </div>

          {national.length > 0 && (
            <details className="rounded-2xl border bg-card p-4 text-sm">
              <summary className="cursor-pointer font-medium">{national.length} national commitments (no region named)</summary>
              <ul className="mt-3 space-y-1.5 text-muted-foreground">{national.map((c) => <li key={c.id} className="flex items-start gap-2"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: SECTOR_COLOR[c.sector] }} /><span><span className="text-foreground">{c.title}</span> · {c.sector}</span></li>)}</ul>
            </details>)}
        </div>
      </div>
    </div>
  );
}
const Stat = ({ v, l }: { v: string; l: string }) => <div className="rounded-2xl border bg-card p-4"><div className="text-2xl font-semibold tabular-nums">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>;
