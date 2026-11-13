import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { Tracker } from "@/components/Tracker";
import type { ProgressUpdate } from "@/data/types";

export const metadata: Metadata = { title: "Promise vs Progress" };
const Update = z.object({ commitmentId: z.string(), date: z.string(), status: z.enum(["Announced", "Planned", "In preparation", "In progress", "Completed", "Delayed", "Unverified"]),
  summary: z.string(), evidenceUrl: z.string().url(), verifiedBy: z.string(), verification: z.enum(["independent", "official-report"]) });

export default async function Page() {
  const raw = await readFile(path.join(process.cwd(), "data/progress/updates.json"), "utf8");
  const updates: ProgressUpdate[] = z.array(Update).parse(JSON.parse(raw)); // invalid entries fail the build, so unevidenced claims can't slip in
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight">Promise vs Progress</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Every commitment extracted from the speech, beside independently verified implementation updates. A budget speech is an announcement, so nothing is marked in progress or completed without an evidence link.</p></div>
      <Tracker updates={updates} />
    </div>
  );
}
