/**
 * Root Layout - Tell Their Stories
 * 
 * Purpose: Main application layout wrapping all pages
 * 
 * Key Elements:
 * - Font configuration (Geist Sans/Mono)
 * - Global CSS imports
 * - Toaster for notifications
 * - HTML lang and body setup
 * 
 * Dependencies:
 * - next/font/google (Geist fonts)
 * - sonner (toast notifications)
 * - ./globals.css (global styles)
 * 
 * Last Updated: Initial setup
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Tell Their Stories - A Family History AI Toolset",
  description: "Go beyond names and dates. Research deeply. Create content. Tell their stories.",
  keywords: ["family history", "genealogy", "AI", "storytelling", "FamilySearch", "ancestors"],
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
        <Toaster />
      </body>
    </html>
  );
}
