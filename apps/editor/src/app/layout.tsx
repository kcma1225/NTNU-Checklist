import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PublishButton } from "@/components/publish-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NTNU 指南 — 內容編輯器",
  description: "編輯 NTNU 碩士生指南的任務與連結資料，並發布到 GitHub。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b">
          <div className="mx-auto flex h-14 max-w-4xl items-center gap-6 px-4">
            <Link href="/" className="font-semibold">
              NTNU 指南編輯器
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/tasks" className="hover:text-foreground">
                任務
              </Link>
              <Link href="/links" className="hover:text-foreground">
                常用連結
              </Link>
            </nav>
            <div className="ml-auto">
              <PublishButton />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
