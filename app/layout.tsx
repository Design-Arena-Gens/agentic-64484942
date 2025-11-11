import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Remylar ? From Data to Workflow Intelligence",
  description:
    "Remylar provides enterprise-grade AI infrastructure that transforms data into real-time workflow intelligence.",
  metadataBase: new URL("https://agentic-64484942.vercel.app"),
  openGraph: {
    title: "Remylar ? From Data to Workflow Intelligence",
    description:
      "Enterprise AI infra that turns your data into workflow intelligence.",
    url: "https://agentic-64484942.vercel.app",
    siteName: "Remylar",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remylar ? From Data to Workflow Intelligence",
    description:
      "Enterprise AI infra that turns your data into workflow intelligence.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[var(--color-bg)]`}>{children}</body>
    </html>
  );
}
