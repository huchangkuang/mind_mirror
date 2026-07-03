import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { ProtectedRouteGuard } from "@/components/auth/ProtectedRouteGuard";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { copy } from "@/lib/copy";
import { getAuthServerSnapshot } from "@/lib/auth/server-snapshot";
import { THEME_BOOT_SCRIPT } from "@/lib/theme/theme-boot-script";

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
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <Script
          id="mind-mirror-theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
        <AuthBootstrap snapshot={snapshot} />
        <ThemeProvider>
          <ProtectedRouteGuard />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
