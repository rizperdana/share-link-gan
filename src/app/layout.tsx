import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Share Link Gan - Your Personal Link Hub",
  description: "Create your own link-in-bio page. Share all your important links in one place.",
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
