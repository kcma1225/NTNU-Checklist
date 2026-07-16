import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { TaskDetailPanel } from "@/components/task/task-detail-panel";
import { Toaster } from "@/components/ui/sonner";
import { getAllTasks, getAllLinks, getGuideSections, getCategories } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NTNU 碩士生指南 | 入學與就學時程",
  description: "國立臺灣師範大學碩士生入學與就學指南 — 時間軸、任務清單與行事曆整合。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = {
    tasks: getAllTasks(),
    links: getAllLinks(),
    guide: getGuideSections(),
    categories: getCategories(),
  };

  return (
    <html
      lang="zh-Hant"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers data={data}>
          <Suspense fallback={null}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <TaskDetailPanel />
          </Suspense>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
