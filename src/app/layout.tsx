import type { Metadata } from "next";
import "./globals.css";
import TopBar from "@/components/TopBar";
import TabNav from "@/components/TabNav";

export const metadata: Metadata = {
  title: "OPERA Cloud — Simulador de práctica",
  description: "Simulador educativo de un PMS hotelero, inspirado en Oracle OPERA Cloud",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">
        <TopBar />
        <TabNav />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
