export type Msg = { role: "user" | "assistant"; content: string };
export interface LLMProvider { name: string; stream(system: string, messages: Msg[]): AsyncGenerator<string> }

async function* sse(res: Response): AsyncGenerator<string> {
  if (!res.ok || !res.body) throw new Error(`Provider error ${res.status}: ${await res.text()}`);
  const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = "";
  for (;;) {
    const { value, done } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop() ?? "";
    for (const l of lines) if (l.startsWith("data: ") && l.slice(6).trim() !== "[DONE]") yield l.slice(6);
  }
}

const openai: LLMProvider = {
  name: "openai",
  async *stream(system, messages) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", stream: true, temperature: 0.1,
        messages: [{ role: "system", content: system }, ...messages] }),
    });
    for await (const d of sse(res)) { const t = JSON.parse(d).choices?.[0]?.delta?.content; if (t) yield t; }
  },
};

const gemini: LLMProvider = {
  name: "gemini",
  async *stream(system, messages) {
    const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY ?? "" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, generationConfig: { temperature: 0.1 },
        contents: messages.map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] })) }),
    });
    for await (const d of sse(res)) { const t = JSON.parse(d).candidates?.[0]?.content?.parts?.[0]?.text; if (t) yield t; }
  },
};

/** AI_PROVIDER=openai|gemini. Returns null when the chosen provider has no key (UI falls back to retrieval-only). */
export function getProvider(): LLMProvider | null {
  const want = (process.env.AI_PROVIDER ?? (process.env.GEMINI_API_KEY ? "gemini" : "openai")).toLowerCase();
  if (want === "gemini") return process.env.GEMINI_API_KEY ? gemini : null;
  return process.env.OPENAI_API_KEY ? openai : null;
}
