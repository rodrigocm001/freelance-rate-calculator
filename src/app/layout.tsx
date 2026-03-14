import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator for Developers",
  description:
    "A simple pricing calculator for freelance developers to estimate hourly rate, day rate and income targets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
