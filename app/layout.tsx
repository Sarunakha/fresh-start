import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { SplashGate } from "@/components/SplashGate";

export const metadata: Metadata = {
  title: {
    default: "Fresh Start Facility Solutions | Sydney",
    template: "%s | Fresh Start Facility Solutions"
  },
  description:
    "Fresh Start Facility Solutions provides professional cleaning and facility care across metropolitan Sydney—reliable, meticulous, and client-focused.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/logo.svg", type: "image/svg+xml" }]
  }
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white text-slate-900">
        <SplashGate>{children}</SplashGate>
      </body>
    </html>
  );
}

