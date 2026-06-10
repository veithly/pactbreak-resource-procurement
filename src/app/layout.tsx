import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_DEMO_URL ?? "https://pactbreak-treasury-firewall.veithly.workers.dev"),
  title: "PactBreak Resource Procurement",
  description: "Let an agent buy audit data through CAW-bound authority, then mutate the order and inspect the proof.",
  openGraph: {
    title: "PactBreak Resource Procurement",
    description: "CAW-bound purchasing for AI agents, with live payment and denial evidence.",
    images: ["/brand/og.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body>{children}</body>
    </html>
  );
}
