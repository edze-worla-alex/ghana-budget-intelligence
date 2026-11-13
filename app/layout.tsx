import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Shell } from "@/components/Shell";
import { AiWidget } from "@/components/AiWidget";
import "./globals.css";
import "./brand.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Ghana Budget Intelligence 2027", template: "%s · Ghana Budget Intelligence" },
  description: "Understand the Budget. Follow the Money. Measure the Promises. An explorer for Ghana's 2027 Budget Speech.",
  openGraph: { title: "Ghana Budget Intelligence 2027", description: "Explore targets, the New Economy Programme, regional projects and commitments.", type: "website" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Shell>
            <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</main>
            <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-muted-foreground lg:px-8">Source: 2027 Budget Speech (delivered 12 Nov 2026). Independent explainer, not an official government site. Targets and announcements are not results.</footer>
          </Shell>
          <AiWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
