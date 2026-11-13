"use client";
import type { ReactNode } from "react";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, LabelList, Line, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { C, SECTOR_COLORS, TOOLTIP_STYLE } from "@/lib/palette";

const tick = { fontSize: 11, fill: "currentColor" } as const;
const grid = <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.12} />;
const pct = (v: ReactNode) => `${v}%`;
const Center = ({ big, small }: { big: string; small: string }) => (
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
    <div className="text-2xl font-semibold tabular-nums">{big}</div><div className="text-[11px] text-muted-foreground">{small}</div>
  </div>);
const Legendish = ({ items }: { items: { c: string; t: string }[] }) => (
  <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
    {items.map((i) => <li key={i.t} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.c }} />{i.t}</li>)}</ul>);

/** Area + dashed line + shaded target band. Line connects STATED observations only. */
export function InflationBand() {
  const data = [{ l: "End-2022", rep: 54.1 }, { l: "End-2024*", rep: 23.8 }, { l: "End-2025", rep: 5.4 }, { l: "Oct 2026", rep: 5.5, tgt: 5.5 }, { l: "2027 target", tgt: 8 }];
  return (
    <div className="h-72"><ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 12, left: -10, bottom: 0 }}>
        <defs><linearGradient id="infl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.red} stopOpacity={0.5} /><stop offset="100%" stopColor={C.red} stopOpacity={0} /></linearGradient></defs>
        {grid}<XAxis dataKey="l" tick={tick} /><YAxis tick={tick} unit="%" />
        <ReferenceArea y1={6} y2={10} fill={C.gold} fillOpacity={0.2} label={{ value: "2027 band 8% ± 2", position: "insideTopRight", fontSize: 10, fill: "currentColor" }} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v}%`} />
        <Area type="monotone" dataKey="rep" name="Reported" stroke={C.red} strokeWidth={2.5} fill="url(#infl)" dot={{ r: 4, fill: C.red }} connectNulls animationDuration={900}><LabelList dataKey="rep" position="top" fontSize={11} formatter={pct} /></Area>
        <Line type="monotone" dataKey="tgt" name="Target path" stroke={C.gold} strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 4, fill: C.gold }} connectNulls />
      </ComposedChart>
    </ResponsiveContainer></div>);
}

/** Bars coloured by sign + trend line + 2027 floor. */
export function PrimaryBalance() {
  const data = [{ l: "End-2022", v: -4.3 }, { l: "End-2024*", v: -4.1 }, { l: "2025", v: 2.5 }, { l: "2027 floor", v: 0.5 }];
  const col = (i: number, v: number) => (i === 3 ? C.gold : v < 0 ? C.red : C.green);
  return (
    <div className="h-72"><ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 12, left: -10, bottom: 0 }}>
        {grid}<XAxis dataKey="l" tick={tick} /><YAxis tick={tick} unit="%" />
        <ReferenceLine y={0} stroke="currentColor" opacity={0.5} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v}% of GDP`} />
        <Bar dataKey="v" name="% of GDP" radius={[4, 4, 0, 0]} animationDuration={900}>
          {data.map((d, i) => <Cell key={d.l} fill={col(i, d.v)} />)}<LabelList dataKey="v" position="top" fontSize={11} formatter={pct} />
        </Bar>
        <Line type="monotone" dataKey="v" stroke="currentColor" strokeOpacity={0.35} strokeDasharray="4 4" dot={false} legendType="none" />
      </ComposedChart>
    </ResponsiveContainer></div>);
}

/** Grouped bars (reported vs targets) + 2030 ambition reference line. */
export function GrowthCompare() {
  const data = [{ k: "Real GDP", t26: 4.8, r26: 6.2, t27: 5.2, m: 5.0 }, { k: "Non-oil GDP", t26: 4.9, r26: 5.9, t27: 5.7, m: 5.0 }];
  return (
    <div className="h-72"><ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 12, left: -10, bottom: 0 }}>
        {grid}<XAxis dataKey="k" tick={tick} /><YAxis tick={tick} unit="%" domain={[0, 9]} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v}%`} cursor={{ fill: "currentColor", opacity: 0.06 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <ReferenceLine y={8} stroke={C.green} strokeDasharray="5 4" label={{ value: "2030 ambition ≈ 8% (overall)", position: "insideTopRight", fontSize: 10, fill: "currentColor" }} />
        <Bar dataKey="t26" name="2026 target" fill="#9AA7B8" radius={[3, 3, 0, 0]} />
        <Bar dataKey="r26" name="H1 2026 reported" fill={C.green} radius={[3, 3, 0, 0]} />
        <Bar dataKey="t27" name="2027 target (≥)" fill={C.gold} radius={[3, 3, 0, 0]} />
        <Bar dataKey="m" name="2027–30 target (≥)" fill="#B58900" radius={[3, 3, 0, 0]} />
      </ComposedChart>
    </ResponsiveContainer></div>);
}

/** Donut: 2025 unemployment split into the 2030 ceiling and the gap to close (computed). */
export function UnemploymentDonut() {
  const data = [{ name: "2030 ambition: below", value: 8 }, { name: "Gap to close (computed)", value: 4.8 }];
  return (
    <div><div className="relative mx-auto h-60 max-w-xs"><ResponsiveContainer width="100%" height="100%">
      <PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="100%" startAngle={90} endAngle={-270} stroke="none" paddingAngle={2} animationDuration={900}>
        <Cell fill={C.green} /><Cell fill={C.red} /></Pie><Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => `${v} pp`} /></PieChart>
    </ResponsiveContainer><Center big="12.8%" small="unemployment, 2025 (about)" /></div>
    <Legendish items={[{ c: C.green, t: "Below 8% by 2030" }, { c: C.red, t: "≈4.8 pp to close" }]} /></div>);
}

/** Concentric radial bars: debt/GDP 2022 (plotted at the >100 floor), 2025 and the ~45% anchor. */
export function DebtRings() {
  const data = [{ name: "End-2022 (over 100%)", value: 100, c: C.red }, { name: "From 2027 (≈45%)", value: 45, c: C.gold }, { name: "End-2025", value: 44.7, c: C.green }];
  return (
    <div><div className="relative mx-auto h-60 max-w-xs"><ResponsiveContainer width="100%" height="100%">
      <RadialBarChart data={data} innerRadius="28%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={14}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" background={{ fill: "currentColor", opacity: 0.08 }} cornerRadius={8} animationDuration={900}>{data.map((d) => <Cell key={d.name} fill={d.c} />)}</RadialBar>
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [`${v}% of GDP`, n]} />
      </RadialBarChart>
    </ResponsiveContainer><Center big="44.7%" small="of GDP, end-2025" /></div>
    <Legendish items={data.map((d) => ({ c: d.c, t: d.name }))} /></div>);
}

/** Semi-circular gauge: reserves in months of import cover against the 6-month floor. */
export function ReservesGauge() {
  const data = [{ name: "End-2025", value: 5.7, c: "#64748B" }, { name: "Sep 2026", value: 4.5, c: C.green }];
  return (
    <div><div className="relative mx-auto h-44 max-w-sm"><ResponsiveContainer width="100%" height="100%">
      <RadialBarChart data={data} cy="92%" innerRadius="60%" outerRadius="130%" startAngle={180} endAngle={0} barSize={16}>
        <PolarAngleAxis type="number" domain={[0, 6]} tick={false} />
        <RadialBar dataKey="value" background={{ fill: "currentColor", opacity: 0.08 }} cornerRadius={8} animationDuration={900}>{data.map((d) => <Cell key={d.name} fill={d.c} />)}</RadialBar>
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [`${v} months`, n]} />
      </RadialBarChart>
    </ResponsiveContainer>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center"><div className="text-2xl font-semibold tabular-nums">4.5 → 6</div><div className="text-[11px] text-muted-foreground">months of import cover (Sep 2026 → 2027 floor)</div></div></div>
    <Legendish items={[{ c: "#64748B", t: "End-2025: 5.7" }, { c: C.green, t: "Sep 2026: 4.5 (US$12.7bn)" }, { c: "#9AA7B8", t: "End-2022: under 3 weeks" }]} /></div>);
}

/** One stacked bar: the two fiscal measures that finance the programme (¶109–110). Sum is computed. */
export function FinancingStack() {
  const data = [{ n: "pp of GDP", a: 1, b: 0.5 }];
  return (
    <div><div className="h-28"><ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <XAxis type="number" domain={[0, 1.6]} tick={tick} unit=" pp" /><YAxis type="category" dataKey="n" hide />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => [`${v} pp of GDP`, n]} cursor={false} />
        <Bar dataKey="a" stackId="s" name="Lower primary-surplus target" fill={C.gold} radius={[6, 0, 0, 6]}><LabelList dataKey="a" position="center" fontSize={12} fill="#101C2C" formatter={(v: ReactNode) => `${v} pp`} /></Bar>
        <Bar dataKey="b" stackId="s" name="Tax reform & compliance" fill={C.green} radius={[0, 6, 6, 0]}><LabelList dataKey="b" position="center" fontSize={12} fill="#fff" formatter={(v: ReactNode) => `${v} pp`} /></Bar>
      </BarChart></ResponsiveContainer></div>
    <Legendish items={[{ c: C.gold, t: "Lower primary-surplus target (¶109)" }, { c: C.green, t: "Tax reform & compliance (¶110)" }]} /></div>);
}

/** Donut of extracted commitments by sector (counts of rows, not money). */
export function SectorDonut({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-52 w-52 shrink-0"><ResponsiveContainer width="100%" height="100%">
        <PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="100%" stroke="none" paddingAngle={2} animationDuration={900}>
          {data.map((d, i) => <Cell key={d.name} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />)}</Pie>
          <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v} commitments`, ""]} /></PieChart></ResponsiveContainer>
        <Center big={String(total)} small="commitments" /></div>
      <ul className="w-full space-y-1 text-sm">{data.map((d, i) => (
        <li key={d.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: SECTOR_COLORS[i % SECTOR_COLORS.length] }} /><span className="flex-1 truncate">{d.name}</span><span className="tabular-nums text-muted-foreground">{d.value}</span></li>))}</ul>
    </div>);
}

/** Bars (starts, deadlines per year) + cumulative-deadlines line. Computed from the `start`/`target` text. */
export function DeliveryCalendar({ data }: { data: { label: string; starts: number; targets: number; cumulative: number }[] }) {
  return (
    <div className="h-80"><ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 16, right: 8, left: -14, bottom: 0 }}>
        {grid}<XAxis dataKey="label" tick={tick} /><YAxis yAxisId="l" tick={tick} allowDecimals={false} /><YAxis yAxisId="r" orientation="right" tick={tick} allowDecimals={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "currentColor", opacity: 0.06 }} /><Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar yAxisId="l" dataKey="starts" name="Cites a start in year" fill={C.blue} radius={[3, 3, 0, 0]} />
        <Bar yAxisId="l" dataKey="targets" name="Cites a deadline in year" fill={C.gold} radius={[3, 3, 0, 0]} />
        <Line yAxisId="r" type="monotone" dataKey="cumulative" name="Cumulative deadlines" stroke={C.green} strokeWidth={2.5} dot={{ r: 3 }} />
      </ComposedChart></ResponsiveContainer></div>);
}
