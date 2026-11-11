import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AUTHOR_NAME, SITE_NAME, SITE_URL, alternatesFor, openGraphDefaults } from '@/lib/site';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${AUTHOR_NAME}`,
    template: `%s — ${AUTHOR_NAME}`,
  },
  description: "A portfolio of internet things Ben built for fun and profit.",
  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  alternates: alternatesFor('/'),
  openGraph: { ...openGraphDefaults, type: 'website' },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={`${inter.className} antialiased`}>
        {children}
        {/* Vercel Web Analytics: cookieless page views, production only. */}
        <Analytics />
      </body>
    </html>
  );
}
