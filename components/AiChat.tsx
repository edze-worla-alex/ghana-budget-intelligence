"use client";
import { useEffect, useRef, useState } from "react";
import { Copy, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pdfHref } from "@/lib/source";

type Src = { n: number; page: number; text: string };
type Turn = { role: "user" | "assistant"; content: string; sources?: Src[]; notice?: string };

const PROMPTS = [
  "What does this budget mean for a poultry farmer in the Volta Region?",
  "What are the government's 2027 economic targets?",
  "What is the plan for rice self-sufficiency?",
  "What does the budget say about local pharmaceutical production?",
  "Which projects are expected to be completed by 2030?",
  "How much is allocated to the technology economy?",
];

function Cited({ text }: { text: string }) {
  // Turn "[¶136, p.23]" into links that open the PDF at that page.
  return <>{text.split(/(\[¶[^\]]+\])/g).map((part, i) => {
    const m = part.match(/^\[¶(\d+)/);
    return m ? <a key={i} href={pdfHref(Number(m[1]))} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#087A4B] underline dark:text-[#D5A62E]">{part}</a> : <span key={i}>{part}</span>;
  })}</>;
}

export function AiChat({ compact = false, listen = false }: { compact?: boolean; listen?: boolean }) {
  const [turns, setTurns] = useState<Turn[]>([]); const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  // Other parts of the site can fire: window.dispatchEvent(new CustomEvent("ask-budget", { detail: { q } }))
  const askRef = useRef<(q: string) => void>(() => {});
  useEffect(() => {
    if (!listen) return;
    const h = (e: Event) => askRef.current(String((e as CustomEvent).detail?.q ?? ""));
    window.addEventListener("ask-budget", h); return () => window.removeEventListener("ask-budget", h);
  }, [listen]);

  async function ask(q: string) {
    if (!q.trim() || busy) return;
    const history: Turn[] = [...turns, { role: "user", content: q }];
    setTurns([...history, { role: "assistant", content: "" }]); setInput(""); setBusy(true);
    const patch = (p: Partial<Turn>) => setTurns((t) => t.map((x, i) => (i === t.length - 1 ? { ...x, ...p } : x)));
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }) });
      if (res.status === 429) return patch({ content: "Too many questions in a short time. Please wait a minute." });
      const h = res.headers.get("x-sources");
      const sources: Src[] | undefined = h ? JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(h), (c) => c.charCodeAt(0)))) : undefined;
      if (res.headers.get("content-type")?.includes("application/json")) {
        const j = await res.json();
        return patch({ content: j.error ?? "", sources: j.sources ?? sources, notice: j.notice });
      }
      patch({ sources }); const r = res.body!.getReader(); const d = new TextDecoder(); let acc = "";
      for (;;) { const { value, done } = await r.read(); if (done) break; acc += d.decode(value, { stream: true }); patch({ content: acc }); end.current?.scrollIntoView({ block: "end" }); }
    } catch { patch({ content: "Something went wrong reaching the assistant." }); } finally { setBusy(false); }
  }
  askRef.current = ask;
  const exportMd = () => {
    const md = turns.map((t) => `**${t.role === "user" ? "Q" : "A"}:** ${t.content}`).join("\n\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([md], { type: "text/markdown" })), download: "ghana-budget-ai-conversation.md" }); a.click();
  };

  return (
    <div className={compact ? "flex h-full min-h-0 flex-col gap-3" : "flex flex-col gap-4"}>
      <div className={compact ? "min-h-0 flex-1 space-y-3 overflow-y-auto pr-1" : "space-y-4"}>
      {!turns.length && <div className="flex flex-wrap gap-2">{(compact ? PROMPTS.slice(0, 4) : PROMPTS).map((p) => <button key={p} onClick={() => ask(p)} className="rounded-full border px-3 py-1.5 text-left text-sm text-muted-foreground hover:border-[#D5A62E] hover:text-foreground">{p}</button>)}</div>}
      <div className="space-y-4" aria-live="polite">
        {turns.map((t, i) => (
          <div key={i} className={t.role === "user" ? "ml-auto max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm" : "text-sm"}>
            {t.role === "user" ? t.content : (
              <div className="rounded-lg border p-4">
                {t.notice && <p className="mb-2 rounded bg-[#D5A62E]/15 p-2 text-xs">{t.notice}</p>}
                {t.content ? <div className="whitespace-pre-wrap leading-relaxed"><Cited text={t.content} /></div> : busy && i === turns.length - 1 ? <span className="text-muted-foreground">Reading the speech…</span> : null}
                {t.sources && t.sources.length > 0 && (
                  <details className="mt-3 text-xs"><summary className="cursor-pointer text-muted-foreground">{t.sources.length} source passages retrieved</summary>
                    <ul className="mt-2 space-y-2">{t.sources.map((s) => <li key={s.n}><a className="font-mono underline" href={pdfHref(s.n)} target="_blank" rel="noreferrer">¶{s.n} · p.{s.page}</a><p className="text-muted-foreground">{s.text}</p></li>)}</ul></details>)}
                {t.content && <Button variant="ghost" size="sm" className="mt-2" onClick={() => navigator.clipboard.writeText(t.content)}><Copy className="mr-1 h-3 w-3" />Copy</Button>}
              </div>)}
          </div>))}
        <div ref={end} />
      </div>
      </div>
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about the 2027 budget…" aria-label="Your question" maxLength={500} />
        <Button type="submit" disabled={busy} aria-label="Send"><Send className="h-4 w-4" /></Button>
        {turns.length > 0 && <Button type="button" variant="outline" onClick={exportMd} aria-label="Export conversation"><Download className="h-4 w-4" /></Button>}
      </form>
      <p className="text-xs text-muted-foreground">Answers are generated from retrieved passages of the speech. Anything under “AI analysis” is interpretation, not an official statement. Check the cited paragraph.</p>
    </div>
  );
}
