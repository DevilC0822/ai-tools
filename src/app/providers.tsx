'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Layout from '@/components/Layout';
import { Provider as JotaiProvider } from 'jotai';
import myStore from '@/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement='top-center' toastOffset={36} regionProps={{
        classNames: {
          base: 'z-[9999]',
        },
      }} />
      <NextThemesProvider attribute="class" defaultTheme="light">
        <JotaiProvider store={myStore}>
          <Layout>{children}</Layout>
        </JotaiProvider>
      </NextThemesProvider>
    </HeroUIProvider >
  );
}