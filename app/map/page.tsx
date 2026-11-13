import type { Metadata } from "next";
import { RegionMap } from "@/components/RegionMap";
export const metadata: Metadata = { title: "Regional impact map" };
export default function Page() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight">Regional impact map</h1><p className="mt-2 max-w-2xl text-muted-foreground">Where announced projects are named across Ghana’s 16 regions. Filter by sector and open a region for details, disclosed amounts and source paragraphs.</p></div>
      <RegionMap />
    </div>
  );
}
