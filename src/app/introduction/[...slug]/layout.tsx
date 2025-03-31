import React from 'react';
import { IntroductionPrimaryKeys, IntroductionSecondaryKeys } from '@/config';
import { Button } from '@heroui/react';
import NextLink from 'next/link';

type IntroductionLayoutProps = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export default async function MainIntroductionLayout(props: IntroductionLayoutProps) {
  const { params, children } = props;
  const slug = (await params).slug;
  const primaryKey = slug[0];
  const secondaryKey = slug[1];
  if (!IntroductionPrimaryKeys.includes(primaryKey) || !IntroductionSecondaryKeys.includes(secondaryKey)) {
    return (
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            页面不存在
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            抱歉，我们找不到您正在寻找的页面。
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              as={NextLink}
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              返回主页
            </Button>
          </div>
        </div>
      </main>
    );
  }
  return (
    <>{children}</>
  );
}
