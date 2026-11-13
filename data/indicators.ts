import type { Indicator } from "./types";

// Every point is quoted from the speech. Nulls are never filled in. "implied" points are flagged in `note`.
export const INDICATORS: Indicator[] = [
  { id: "gdp", name: "Real GDP growth", unit: "%", insight: "The 2027 target is below the H1-2026 outturn; the 2030 ambition of about 8% is far above both the 2027–30 floor and the 1990–2025 average.",
    points: [
      { label: "1990–2025 avg", value: 5.2, kind: "reported", para: 19 },
      { label: "H1 2026", value: 6.2, kind: "reported", note: "vs 2026 target of 4.8%", para: 398 },
      { label: "2027 target", value: 5.2, kind: "target", note: "at least", para: 457 },
      { label: "2027–30 target", value: 5.0, kind: "target", note: "at least", para: 458 },
      { label: "2030 ambition", value: 8, kind: "ambition", note: "about", para: 84 }] },
  { id: "nonoil", name: "Non-oil GDP growth", unit: "%", insight: "Non-oil growth is targeted higher than headline growth in 2027.",
    points: [
      { label: "H1 2026", value: 5.9, kind: "reported", note: "vs target of 4.9%", para: 399 },
      { label: "2027 target", value: 5.7, kind: "target", note: "at least", para: 457 },
      { label: "2027–30 target", value: 5.0, kind: "target", note: "at least", para: 458 }] },
  { id: "inflation", name: "Inflation", unit: "%", lowerIsBetter: true, insight: "From 54.1% at end-2022 to single digits; the 2027 target band is 8% ± 2 percentage points.",
    points: [
      { label: "End-2022", value: 54.1, kind: "reported", para: 33 },
      { label: "End-2024", value: 23.8, kind: "reported", note: "implied by ¶42 ('fallen from 23.8%')", para: 42 },
      { label: "End-2025", value: 5.4, kind: "reported", para: 42 },
      { label: "Oct 2026", value: 5.5, kind: "reported", para: 402 },
      { label: "2027 target", value: 8, kind: "target", note: "8% ± 2 (band 6–10%)", para: 457 }] },
  { id: "primary", name: "Primary balance (% of GDP)", unit: "% GDP", insight: "A swing from deficit to surplus; the target of at least 0.5% is deliberately lower than 2025's 2.5% to create room for the programme (¶109).",
    points: [
      { label: "End-2022", value: -4.3, kind: "reported", note: "deficit", para: 33 },
      { label: "End-2024", value: -4.1, kind: "reported", note: "deficit; implied by ¶42", para: 42 },
      { label: "2025", value: 2.5, kind: "reported", note: "surplus", para: 42 },
      { label: "2027 target", value: 0.5, kind: "target", note: "at least, commitment basis", para: 457 },
      { label: "2027–30 target", value: 0.5, kind: "target", note: "at least, commitment basis", para: 458 }] },
  { id: "debt", name: "Public debt (% of GDP)", unit: "% GDP", lowerIsBetter: true, insight: "The speech states 2022 debt as 'over 100%' (IMF DSA), so it is plotted at the 100 floor and labelled.",
    points: [
      { label: "End-2022", value: 100, kind: "reported", display: ">100", note: "'over 100%' per IMF DSA; plotted at the floor", para: 33 },
      { label: "End-2025", value: 44.7, kind: "reported", para: 42 },
      { label: "From 2027", value: 45, kind: "target", note: "'consistent with' 45%", para: 83 }] },
  { id: "reserves", name: "Gross international reserves (months of import cover)", unit: "months", insight: "End-2022 is 'less than three weeks', which has no clean month value, so it is shown as a note, not a bar.",
    points: [
      { label: "End-2022", value: null, kind: "reported", display: "<3 weeks", para: 33 },
      { label: "End-2025", value: 5.7, kind: "reported", para: 42 },
      { label: "Sep 2026", value: 4.5, kind: "reported", note: "US$12.7bn", para: 400 },
      { label: "2027 target", value: 6, kind: "target", note: "not less than", para: 457 }] },
  { id: "unemployment", name: "Unemployment", unit: "%", lowerIsBetter: true, insight: "Only one historical figure and one 2030 ambition are given; no intermediate path is stated.",
    points: [
      { label: "2025", value: 12.8, kind: "reported", note: "about", para: 27 },
      { label: "2030 ambition", value: 8, kind: "ambition", note: "below", para: 84 }] },
];
