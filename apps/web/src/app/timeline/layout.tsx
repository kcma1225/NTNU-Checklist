import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "時間軸 | NTNU 碩士生指南",
};

export default function TimelineLayout({ children }: { children: React.ReactNode }) {
  return children;
}
