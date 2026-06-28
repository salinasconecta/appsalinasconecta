import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/navigation/BottomNav";
import OneSignalInitializer from "@/components/OneSignalInitializer";
import { InstallPWA } from "@/components/InstallPWA";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Salinas Conecta",
  description: "O Guia Comercial e Turístico de Salinas da Margarida",
  manifest: "/manifest.json",
  themeColor: "#9fd6d2",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Salinas Conecta",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 text-slate-900 overflow-x-hidden pt-safe pb-safe`}>
        {/* PWA Service Worker Registration movido para o Initializer */}
        <OneSignalInitializer />
        {/* Conteúdo principal empurrado para não sumir atrás da BottomNav (pb-20) */}
        <main className="flex-1 pb-16">
          {children}
        </main>
        <InstallPWA />

        <BottomNav />
      </body>
    </html>
  );
}
