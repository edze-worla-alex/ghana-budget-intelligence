"use client";
import { useMemo, useState } from "react";
import { REGIONS } from "@/data/regions";
import { COMMITMENTS } from "@/data/commitments";
import type { RegionId, Sector } from "@/data/types";
import { fmtMoney } from "@/lib/format";
import { SourceChip } from "@/components/SourceChip";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
const SECTORS = [...new Set(COMMITMENTS.map((c) => c.sector))] as Sector[];

export function RegionMap() {
  const [sector, setSector] = useState<Sector | "all">("all");
  const [sel, setSel] = useState<RegionId | null>(null);
  const rows = useMemo(() => COMMITMENTS.filter((c) => sector === "all" || c.sector === sector), [sector]);
  const perRegion = (id: RegionId) => rows.filter((c) => c.regions.includes(id));
  const max = Math.max(1, ...REGIONS.map((r) => perRegion(r.id).length));
  const national = rows.filter((c) => c.locationBasis === "national");
  const shown = sel ? perRegion(sel) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div>
        <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by sector">
          {(["all", ...SECTORS] as const).map((s) => (
            <button key={s} onClick={() => setSector(s)} aria-pressed={sector === s}
              className={`rounded-full border px-2.5 py-1 text-xs ${sector === s ? "border-[#D5A62E] bg-[#D5A62E]/15" : "text-muted-foreground hover:text-foreground"}`}>
              {s === "all" ? "All sectors" : s}
            </button>))}
        </div>
        <div className="grid grid-cols-5 gap-1.5" role="list" aria-label="Ghana's 16 regions">
          {REGIONS.map((r) => {
            const n = perRegion(r.id).length;
            return (
              <button key={r.id} role="listitem" onClick={() => setSel(r.id)} aria-pressed={sel === r.id} aria-label={`${r.name}: ${n} commitments`}
                style={{ gridColumn: r.col + 1, gridRow: r.row + 1, background: n ? `rgba(8,122,75,${0.15 + (0.7 * n) / max})` : undefined }}
                className={`flex aspect-square flex-col items-center justify-center rounded-md border p-1 text-center text-[11px] leading-tight transition ${sel === r.id ? "ring-2 ring-[#D5A62E]" : "hover:border-[#D5A62E]"} ${n ? "text-white" : "text-muted-foreground"}`}>
                <span className="font-medium">{r.name}</span><span className="text-base font-semibold">{n}</span>
              </button>);
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Tile shading = number of announced commitments naming the region (not money). Layout is a schematic of Ghana, not a survey map. Items the speech states only as “national” ({national.length}) are listed separately.</p>
      </div>

      <div className="min-h-64 rounded-lg border p-4" aria-live="polite">
        {!sel ? (
          <div>
          <div className="text-sm text-muted-foreground">Select a region to see announced projects, disclosed amounts and source paragraphs.</div>
          <Image src="/images/budget/ghana_regional_map.jpg"  alt="Map of Ghana" width={700} height={700} className="mt-3 w-full h-auto rounded-lg border" />
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold">{REGIONS.find((r) => r.id === sel)!.name} <span className="text-sm font-normal text-muted-foreground">· {shown.length} announced</span></h3>
            {!shown.length && <p className="mt-2 text-sm text-muted-foreground">No commitment in this sector names this region in the speech.</p>}
            <ul className="mt-3 space-y-4">
              {shown.map((c) => (
                <li key={c.id} className="border-t pt-3 first:border-0 first:pt-0">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{c.title}</span><Badge variant="outline">{c.sector}</Badge>
                    {c.locationBasis === "inferred" && <Badge variant="secondary" title="The speech names a corridor or zone, not this region. Mapped by us; flagged for review.">location inferred</Badge>}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                  <p className="mt-1 text-sm">
                    <strong>{c.amount ? fmtMoney(c.amount) : "No amount stated"}</strong>
                    {c.amountScope && <span className="text-muted-foreground"> — {c.amountScope}</span>}
                    {c.regions.length > 1 && c.amount && <span className="text-muted-foreground"> (shared across {c.regions.length} regions; not a regional split)</span>}
                  </p>
                  <div className="mt-1 text-xs text-muted-foreground">{c.target && <>Target: {c.target} · </>}Status: {c.status} (announced) <SourceChip paras={c.paras.slice(0, 3)} /></div>
                </li>))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
