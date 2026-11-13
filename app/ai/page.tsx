import type { Metadata } from "next";
import { AiChat } from "@/components/AiChat";
export const metadata: Metadata = { title: "Ask the Budget" };
export default function Page() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-semibold tracking-tight">Ask the Budget</h1><p className="mt-2 max-w-2xl text-muted-foreground">Ask in plain language. Answers use only passages retrieved from the speech and cite paragraph and page.</p></div>
      <AiChat />
    </div>
  );
}
