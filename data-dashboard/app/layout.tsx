import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "美团 & 饿了么 | 数据分析平台",
  description: "每日解约数据、抽点店铺数据及回款金额统计分析平台",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
