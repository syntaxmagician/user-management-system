import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "User Management - Dashboard",
  description: "User Management System Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
