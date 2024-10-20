import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: "Things Ben Built",
  description: "A portfolio of internet things Ben built for fun and profit.",
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
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
