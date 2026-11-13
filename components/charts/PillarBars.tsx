"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PillarBars({ data }: { data: { name: string; usdM: number; pct: number }[] }) {
  return (
    <div className="h-72" role="img" aria-label="Stated investment by pillar, US$ millions">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" opacity={0.12} />
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1000}bn`} />
          <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v: number, _n, p) => [`US$${v.toLocaleString()} million (${(p.payload as { pct: number }).pct}% of stated pillar total)`, "Stated"]} />
          <Bar dataKey="usdM" fill="#D5A62E" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
