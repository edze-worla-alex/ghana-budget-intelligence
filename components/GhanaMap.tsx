"use client";
import { useRef, useState } from "react";
import { MAP_VIEWBOX, REGION_SHAPES } from "@/data/ghana-map";
import type { RegionId } from "@/data/types";

export type RegionStat = { count: number; inferredOnly: boolean; sectors: string[] };

// Tiny regions get an external label with a leader line so they stay readable.
const OFFSET: Partial<Record<RegionId, [number, number]>> = { "greater-accra": [46, 62] };

export function GhanaMap({ stats, max, selected, onSelect }: { stats: Record<RegionId, RegionStat>; max: number; selected: RegionId | null; onSelect: (id: RegionId) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ id: RegionId; x: number; y: number } | null>(null);
  const ids = Object.keys(REGION_SHAPES) as RegionId[];
  const order = [...ids].sort((a, b) => Number(a === selected) - Number(b === selected)); // selected region paints last, on top
  const shade = (n: number) => (n ? { fill: "var(--map-fill)", fillOpacity: 0.32 + (0.63 * n) / Math.max(1, max) } : undefined);

  return (
    <div ref={box} className="relative mx-auto w-full max-w-[470px]">
      <svg viewBox={MAP_VIEWBOX} className="h-auto w-full" role="group" aria-label="Map of Ghana's 16 regions. Select a region to see its announced projects.">
        <defs>
          <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="9" fill="#fff" opacity="0.4" /></pattern>
          <filter id="lift" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.35" /></filter>
        </defs>
        {order.map((id) => {
          const sh = REGION_SHAPES[id]; const st = stats[id]; const sel = selected === id;
          return (
            <g key={id} role="button" tabIndex={0} aria-pressed={sel} aria-label={`${sh.name}: ${st.count} announced commitment${st.count === 1 ? "" : "s"}`}
              onClick={() => onSelect(id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(id); } }}
              onMouseMove={(e) => { const r = box.current!.getBoundingClientRect(); setTip({ id, x: e.clientX - r.left, y: e.clientY - r.top }); }}
              onMouseLeave={() => setTip(null)}
              filter={sel ? "url(#lift)" : undefined}
              className="cursor-pointer outline-none transition [&:focus-visible>path]:stroke-[#D5A62E] [&:focus-visible>path]:stroke-[3] [&:hover>path]:brightness-125">
              {sh.paths.map((d, i) => (
                <path key={i} d={d} className={st.count ? undefined : "fill-muted"} style={shade(st.count)} stroke={sel ? "#D5A62E" : "var(--background)"} strokeWidth={sel ? 3.5 : 1.6} strokeLinejoin="round" />))}
              {st.inferredOnly && sh.paths.map((d, i) => <path key={`h${i}`} d={d} fill="url(#hatch)" pointerEvents="none" />)}
            </g>);
        })}
        {ids.map((id) => {
          const sh = REGION_SHAPES[id]; const n = stats[id].count; const off = OFFSET[id];
          const [x, y] = [sh.label[0] + (off?.[0] ?? 0), sh.label[1] + (off?.[1] ?? 0)];
          return (
            <g key={`t${id}`} pointerEvents="none" fontFamily="inherit" textAnchor="middle">
              {off && <line x1={sh.label[0]} y1={sh.label[1]} x2={x} y2={y - 14} stroke="currentColor" strokeOpacity="0.5" />}
              <text x={x} y={y} fontSize={id === "ahafo" || id === "greater-accra" ? 10 : 12} fontWeight={600} fill={off ? "currentColor" : "#fff"} stroke={off ? "none" : "#101C2C"} strokeWidth={3} paintOrder="stroke" strokeLinejoin="round">{sh.name}</text>
              {n > 0 && <text x={x} y={y + 14} fontSize={11} fontWeight={700} fill={off ? "currentColor" : "#F2D27A"} stroke={off ? "none" : "#101C2C"} strokeWidth={3} paintOrder="stroke">{n}</text>}
            </g>);
        })}
      </svg>
      {tip && (
        <div className="pointer-events-none absolute z-10 w-52 rounded-lg border bg-card p-2.5 text-xs shadow-lg" style={{ left: Math.min(tip.x + 14, 250), top: tip.y + 14 }}>
          <div className="font-semibold">{REGION_SHAPES[tip.id].name}</div>
          <div className="text-muted-foreground">{stats[tip.id].count ? `${stats[tip.id].count} announced commitment${stats[tip.id].count === 1 ? "" : "s"}` : "No commitment names this region"}</div>
          {stats[tip.id].sectors.length > 0 && <div className="mt-1 text-muted-foreground">{stats[tip.id].sectors.slice(0, 4).join(" · ")}</div>}
          <div className="mt-1 text-[10px] text-muted-foreground/80">Click for details</div>
        </div>)}
    </div>
  );
}
