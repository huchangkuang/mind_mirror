import type { Metadata } from "next";
import "./globals.css";
import { copy } from "@/lib/copy";

export const metadata: Metadata = {
  title: copy.app.title,
  description: copy.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
