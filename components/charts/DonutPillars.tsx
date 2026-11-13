"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PILLAR_COLORS, TOOLTIP_STYLE } from "@/lib/palette";

type D = { id: number; name: string; usdM: number; pct: number };
export function DonutPillars({ data, dark = false }: { data: D[]; dark?: boolean }) {
  const sub = dark ? "text-white/60" : "text-muted-foreground";
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="relative h-56 w-56 shrink-0" role="img" aria-label="Donut chart of stated pillar investment">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="usdM" nameKey="name" innerRadius="64%" outerRadius="100%" paddingAngle={2} stroke="none" startAngle={90} endAngle={-270} animationDuration={900}>
              {data.map((d) => <Cell key={d.id} fill={PILLAR_COLORS[d.id]} />)}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`US$${Number(v).toLocaleString()} million`, "Stated amount"]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-semibold tracking-tight">US$10bn</div>
          <div className={`text-[11px] ${sub}`}>stated pillar total<br />(computed)</div>
        </div>
      </div>
      <ul className="w-full space-y-1.5 text-sm">
        {data.map((d) => (
          <li key={d.id} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: PILLAR_COLORS[d.id] }} />
            <span className="flex-1 truncate">{d.name}</span>
            <span className={`tabular-nums ${sub}`}>{d.usdM >= 1000 ? `${d.usdM / 1000}bn` : `${d.usdM}m`} · {d.pct}%</span>
          </li>))}
      </ul>
    </div>
  );
}
