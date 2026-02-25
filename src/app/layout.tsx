import type { Metadata } from "next";
import { Inter, Space_Mono, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: '--font-space-mono' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "Share Link Gan - Your Personal Link Hub",
  description: "Create your own link-in-bio page. Share all your important links in one place.",
  manifest: "/manifest.json",
  themeColor: "#8b5cf6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ShareLinkGan",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} ${outfit.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {children}
        <Analytics />
        <div id="google_translate_element" style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000, background: 'var(--bg-card)', padding: '5px', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}></div>
        <Script id="google-translate-config" strategy="beforeInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,id',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="lazyOnload" />
      </body>
    </html>
  );
}
