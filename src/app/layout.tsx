import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Providers from './providers';
import './globals.css';
import { connectToDatabase } from '@/db';

await connectToDatabase();

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI 工具箱',
  description: '由 AI 驱动的工具箱，提供多重好玩好用的 AI 工具',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
