"use client";
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Indicator, PointKind } from "@/data/types";
import { citeText } from "@/lib/source";

export const KIND_COLOR: Record<PointKind, string> = { reported: "#5B6B82", target: "#D5A62E", ambition: "#087A4B" };
export const KIND_LABEL: Record<PointKind, string> = { reported: "Reported figure", target: "Target", ambition: "Longer-term ambition" };

export function IndicatorChart({ ind }: { ind: Indicator }) {
  const data = ind.points.map((p) => ({ ...p, v: p.value ?? 0, missing: p.value === null }));
  return (
    <div>
      <div className="h-64" role="img" aria-label={`${ind.name} chart`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.12} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} />
            <YAxis tick={{ fontSize: 11 }} />
            <ReferenceLine y={0} stroke="currentColor" opacity={0.4} />
            <Tooltip cursor={{ fill: "currentColor", opacity: 0.06 }} content={({ active, payload }) => {
              if (!active || !payload?.length) return null; const p = payload[0].payload as (typeof data)[number];
              return (
                <div className="rounded-md border bg-card p-2 text-xs shadow">
                  <div className="font-medium">{p.label}</div>
                  <div>{p.missing ? p.display : `${p.display ?? p.value}${ind.unit === "months" ? " months" : "%"}`} · {KIND_LABEL[p.kind]}</div>
                  {p.note && <div className="text-muted-foreground">{p.note}</div>}
                  <div className="font-mono text-muted-foreground">{citeText([p.para])}</div>
                </div>);
            }} />
            <Bar dataKey="v" radius={[3, 3, 0, 0]}>
              {data.map((d, i) => <Cell key={i} fill={KIND_COLOR[d.kind]} fillOpacity={d.missing ? 0.15 : 1} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {(Object.keys(KIND_COLOR) as PointKind[]).map((k) => (
          <li key={k} className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: KIND_COLOR[k] }} />{KIND_LABEL[k]}</li>))}
        {data.some((d) => d.missing) && <li>Faint bar = stated in words only (see tooltip)</li>}
      </ul>
    </div>
  );
}
