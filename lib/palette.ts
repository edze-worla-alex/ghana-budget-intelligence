export const C = { navy: "#101C2C", midnight: "#17283C", gold: "#D5A62E", green: "#087A4B", grey: "#697586", red: "#C8553D", blue: "#3B6EA5", teal: "#2A9D8F", purple: "#8B6FBF", warm: "#F8F7F3" };
/** One stable colour per pillar so the same pillar reads the same on every chart. */
export const PILLAR_COLORS: Record<number, string> = { 1: "#64748B", 2: C.gold, 3: C.blue, 4: C.purple, 5: C.red, 6: C.teal, 7: C.green, 8: "#9AA7B8" };
export const SECTOR_COLORS = [C.gold, C.green, C.blue, C.purple, C.red, C.teal, "#9AA7B8", "#64748B", "#B58900", "#4F8A8B"];
export const TOOLTIP_STYLE = { background: "#17283C", border: "1px solid #2A3F58", color: "#F8F7F3", borderRadius: 8, fontSize: 12 } as const;
