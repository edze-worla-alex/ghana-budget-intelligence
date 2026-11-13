import type { Metadata } from "next";
import { DownloadPanel } from "@/components/DownloadPanel";
export const metadata: Metadata = { title: "Data and downloads" };
export default function Page() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight">Data and downloads</h1><p className="mt-2 max-w-2xl text-muted-foreground">Clean, structured datasets with source paragraph and page on every row.</p></div>
      <DownloadPanel />
    </div>
  );
}
