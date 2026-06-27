import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Palette — Collect moments. Feel the music.",
  description: "Create aesthetic mood boards by combining images, ideas, and music in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}