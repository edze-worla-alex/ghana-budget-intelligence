import { PILLARS, PROGRAMME } from "@/data/pillars";
import { COMMITMENTS } from "@/data/commitments";
import { REGIONS } from "@/data/regions";
import type { Commitment, RegionId, Sector } from "@/data/types";

/** COMPUTED, not stated: sum of the explicit pillar amounts (pillars 2–8). Pillar 1 has no stated amount. */
export function pillarTotals() {
  const stated = PILLARS.filter((p) => p.amountUSDm !== null);
  const sumUSDm = stated.reduce((s, p) => s + (p.amountUSDm ?? 0), 0);
  return {
    sumUSDm,
    matchesHeadline: sumUSDm === PROGRAMME.totalUSDbn * 1000,
    shares: stated.map((p) => ({ id: p.id, name: p.short, usdM: p.amountUSDm!, pct: +(((p.amountUSDm ?? 0) / sumUSDm) * 100).toFixed(1) })),
  };
}

export const regionIndex = (filter?: { sector?: Sector | "all" }) => {
  const rows = COMMITMENTS.filter((c) => !filter?.sector || filter.sector === "all" || c.sector === filter.sector);
  return REGIONS.map((r) => ({ ...r, items: rows.filter((c) => c.regions.includes(r.id)) }));
};
export const nationalItems = () => COMMITMENTS.filter((c) => c.locationBasis === "national");
export const sectors = (): Sector[] => [...new Set(COMMITMENTS.map((c) => c.sector))];
export const byId = (id: string) => COMMITMENTS.find((c) => c.id === id);
export type { Commitment, RegionId };

/** COMPUTED: commitments per sector (counts of extracted rows, not money). */
export const sectorCounts = () => {
  const m = new Map<string, number>();
  COMMITMENTS.forEach((c) => m.set(c.sector, (m.get(c.sector) ?? 0) + 1));
  return [...m].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

/** COMPUTED: how many commitments cite a start year / target year, from the `start` and `target` text. */
export function deliveryByYear() {
  const yrs = (s?: string) => [...new Set((s ?? "").match(/20\d\d/g) ?? [])].map(Number);
  const m = new Map<number, { y: number; starts: number; targets: number }>();
  const row = (y: number) => m.get(y) ?? m.set(y, { y, starts: 0, targets: 0 }).get(y)!;
  COMMITMENTS.forEach((c) => { yrs(c.start).forEach((y) => row(y).starts++); yrs(c.target).forEach((y) => row(y).targets++); });
  let cum = 0;
  return [...m.values()].sort((a, b) => a.y - b.y).map((r) => ({ ...r, label: String(r.y), cumulative: (cum += r.targets) }));
}
