import Link from "next/link";
import { regionIndex } from "@/lib/calc";

/** Heat-tiles of the 16 regions (count of commitments naming each). */
export function MiniMap() {
  const rows = regionIndex(); const max = Math.max(1, ...rows.map((r) => r.items.length));
  return (
    <Link href="/map" className="group block" aria-label="Open the regional impact map">
      <div className="grid grid-cols-5 gap-1">
        {rows.map((r) => (
          <div key={r.id} title={`${r.name}: ${r.items.length}`} style={{ gridColumn: r.col + 1, gridRow: r.row + 1, background: r.items.length ? `rgba(8,122,75,${0.2 + (0.8 * r.items.length) / max})` : undefined }}
            className="flex aspect-square items-center justify-center rounded-[5px] border text-[10px] font-semibold text-white transition group-hover:border-[#D5A62E]">{r.items.length || ""}</div>))}
      </div>
    </Link>
  );
}
