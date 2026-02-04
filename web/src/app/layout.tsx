import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CORE_CONFIG } from "@/config/CORE_CONFIG";
import { AppProvider } from '@/providers/app-provider'

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${CORE_CONFIG.appName} ✦ AI Sustainability Platform`,
  description: "Make every AI prompt count. Analyze, optimize, and track your LLM energy usage to reduce costs and environmental impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased font-sans`}
      >
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
