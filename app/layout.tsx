import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stallora AI | Predictive Parking Intelligence",
  description: "An interactive graduate academic pilot for predictive parking intelligence at Wayne State University Parking Structure 2.",
  applicationName: "Stallora AI",
  manifest: "/stallora-ai/manifest.webmanifest",
  themeColor: "#102e26",
  appleWebApp: {
    capable: true,
    title: "Stallora",
    statusBarStyle: "black-translucent",
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/stallora-ai/icons/stallora-icon.svg",
    shortcut: "/stallora-ai/icons/stallora-icon.svg",
    apple: "/stallora-ai/icons/stallora-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
