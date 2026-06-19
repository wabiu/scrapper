import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northern Nigeria Situation Monitor",
  description:
    "A sourced news monitoring and weekly situation update workspace for Northern Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
