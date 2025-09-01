
export const metadata = {
  title: "Adroit Extrusion — Blown Film Configurator",
  description: "Professional configurator for blown film plants with instant pricing and PDF quotation.",
};

import Image from "next/image";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0f1115]/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
            <Image src="/logo.jpg" alt="Adroit Extrusion" width={44} height={44} className="rounded-lg" />
            <div>
              <h1 className="text-lg font-semibold tracking-wide">Adroit Extrusion</h1>
              <p className="text-xs text-white/60 -mt-1">Explorers of Innovation</p>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-white/50">
          © {new Date().getFullYear()} Adroit Extrusion — Configurator
        </footer>
      </body>
    </html>
  );
}
