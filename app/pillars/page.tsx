import type { Metadata } from "next";
import { PillarExplorer } from "@/components/PillarExplorer";
export const metadata: Metadata = { title: "The New Economy Programme" };
export default function Page() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight">The New Economy Programme</h1><p className="mt-2 max-w-2xl text-muted-foreground">US$10 billion over 2027–2030, in eight connected pillars. Select a pillar for its stated amount, targets, value chains and commitments.</p></div>
      <PillarExplorer />
    </div>
  );
}
