import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "GMN",
  description: "Track your gym progress, and compete with your friends.",
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
