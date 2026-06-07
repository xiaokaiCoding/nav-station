import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人导航站",
  description: "个人网站快捷导航",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
