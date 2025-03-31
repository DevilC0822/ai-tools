import React from 'react';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative px-[8%] max-lg:px-6 max-md:px-4 mx-auto py-4 w-full min-h-[calc(100vh-64px)] max-md:flex-col">
      {children}
    </div>
  );
}
