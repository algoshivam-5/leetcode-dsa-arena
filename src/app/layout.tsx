import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meadowbell Study — Shreya & Shivam DSA Suite",
  description: "Private DSA Preparation, Revision, and LeetCode Battles for Shreya and Shivam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased text-slate-800 bg-[#fff5f8]">
        {children}
      </body>
    </html>
  );
}

