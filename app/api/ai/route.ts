import { z } from "zod";
import { retrieve } from "@/lib/ai/retrieve";
import { getProvider } from "@/lib/ai/providers";
import { SYSTEM, contextBlock } from "@/lib/ai/prompt";

export const runtime = "nodejs";
const Body = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) })).min(1).max(20),
});

// Simple in-memory limiter (per instance). Replace with Upstash/Redis for multi-instance deploys.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(); const w = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  w.push(now); hits.set(ip, w); return w.length > 12;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (limited(ip)) return Response.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });

  const { messages } = parsed.data;
  const userTurns = messages.filter((m) => m.role === "user");
  // Retrieve on the latest question plus the one before it so follow-ups keep their context.
  const query = userTurns.slice(-2).map((m) => m.content).join(" ");
  const passages = retrieve(query, 9);
  const sources = passages.map((p) => ({ n: p.n, page: p.page, text: p.text }));
  const header = { "x-sources": Buffer.from(JSON.stringify(sources)).toString("base64") };

  const provider = getProvider();
  if (!provider) return Response.json({ mode: "retrieval-only", sources, notice: "No AI provider key configured. Showing the most relevant passages from the speech." }, { headers: header });

  const system = `${SYSTEM}\n\n${contextBlock(passages)}`;
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(c) {
      try { for await (const t of provider.stream(system, messages)) c.enqueue(enc.encode(t)); }
      catch (e) { c.enqueue(enc.encode(`\n\n[AI provider error: ${(e as Error).message.slice(0, 200)}]`)); }
      c.close();
    },
  });
  return new Response(stream, { headers: { ...header, "Content-Type": "text/plain; charset=utf-8", "x-mode": "ai" } });
}
