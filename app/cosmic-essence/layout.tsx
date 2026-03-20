import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "宇宙精神原色测试 | Mind Mirror",
  description: "8 道宇宙情境单选题，匹配你的精神原色并生成分享海报。",
};

export default function CosmicEssenceLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#030712] dark">
      {children}
    </div>
  );
}
