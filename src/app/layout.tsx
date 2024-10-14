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
