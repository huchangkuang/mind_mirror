import type { Metadata } from "next";
import "./globals.css";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { copy } from "@/lib/copy";
import { getAuthServerSnapshot } from "@/lib/auth/server-snapshot";

export const metadata: Metadata = {
  title: copy.app.title,
  description: copy.app.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const snapshot = await getAuthServerSnapshot();

  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AuthBootstrap snapshot={snapshot} />
        {children}
      </body>
    </html>
  );
}
