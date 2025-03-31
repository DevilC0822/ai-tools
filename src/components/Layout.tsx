'use client';

import React from 'react';
import Header from './Header';
import { Particles } from './magic/Particles';
import { useTheme } from 'next-themes';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div className="relative flex h-screen min-h-dvh w-full flex-col overflow-hidden overflow-y-auto bg-background">
      <Header />
      <Particles
        className="absolute inset-0 z-0"
        quantity={333}
        ease={80}
        refresh
        color={theme === 'light' ? '#000' : '#fff'}
      />
      <div className="relative z-10 mt-16 h-full">
        {children}
      </div>
    </div>
  );
}
