import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const LINKS = [["/", "Overview"], ["/pillars", "New Economy"], ["/indicators", "Indicators"], ["/map", "Regional map"], ["/tracker", "Promise vs Progress"], ["/ai", "Ask the Budget"], ["/data", "Data"]] as const;
export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold"><span className="inline-block h-4 w-1 bg-[#D5A62E]" />Ghana Budget Intelligence <span className="text-muted-foreground">2027</span></Link>
        <nav className="ml-auto hidden gap-4 text-sm text-muted-foreground md:flex" aria-label="Main">{LINKS.slice(1).map(([h, l]) => <Link key={h} href={h} className="hover:text-foreground">{l}</Link>)}</nav>
        <div className="ml-auto md:ml-0"><ThemeToggle /></div>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-4 pb-2 text-sm text-muted-foreground md:hidden" aria-label="Main mobile">{LINKS.map(([h, l]) => <Link key={h} href={h} className="whitespace-nowrap">{l}</Link>)}</nav>
    </header>
  );
}
