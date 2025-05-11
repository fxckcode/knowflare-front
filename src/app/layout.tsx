import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import { unstable_ViewTransition as ViewTransition } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Idle",
  description: "Chat with your AI"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        <ViewTransition>
          <main className="max-h-[calc(100vh-72px)] overflow-hidden">
            {children}
          </main>
        </ViewTransition>
        <Toaster />
      </body>
    </html>
  );
}
