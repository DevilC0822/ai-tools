import { Button, Alert } from '@heroui/react';
import { Icon } from '@iconify/react';
import AuroraText from '@/components/magic/AuroraText';
import MorphingText from '@/components/magic/MorphingText';
import NextLink from 'next/link';

const texts = [
  'DeepSeek',
  'Gemini',
  'Grok',
  'Doubao',
  'Qwen',
];

const features = [
  {
    title: '免费',
    description: '无需登录，无需订阅，无需隐藏费用！',
    icon: 'emojione:free-button',
  },
  {
    title: '美观',
    description: '美观的 UI，流畅的动画！',
    icon: 'unjs:theme-colors',
  },
  {
    title: '简单',
    description: '无需复杂的操作，无需困难的步骤，无需头痛！',
    icon: 'unjs:nitro',
  },
  {
    title: '暗黑 & 亮色',
    description: 'Light & Dark 主题，你可以选择你喜欢的主题！',
    icon: 'unjs:nypm',
  },
];

export default function Home() {
  return (
    <div className="mt-2">
      <main className="flex flex-col items-center rounded-2xl md:rounded-3xl px-6">
        <section className="z-20 my-14 flex flex-col items-center justify-center gap-[18px] max-md:gap-4">
          <div className="text-4xl font-bold tracking-tighter flex max-md:flex-col items-center justify-center">由 &nbsp;<AuroraText className='text-6xl max-md:text-4xl'>人工智能</AuroraText>&nbsp; 驱动</div>
          <div className="bg-gradient-to-br from-[#2c3b13] to-[#a1c2ea] bg-clip-text text-4xl max-md:text-2xl font-extrabold text-transparent">
            模型来自于
          </div>
          <MorphingText texts={texts} />
          <p className="text-center font-normal leading-7 text-default-500">
            使用最先进、最强大的 AI 模型，实现一些好玩的、好用的功能。
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
            <Button
              className="h-10 w-[163px] bg-default-foreground px-[16px] py-[10px] text-small font-medium leading-5 text-background"
              radius="full"
              as={NextLink}
              href="/tools"
            >
              开始使用
            </Button>
            <Button
              as={NextLink}
              href="/introduction"
              className="h-10 w-[163px] border-1 border-default-100 px-[16px] py-[10px] text-small font-medium leading-5"
              endContent={
                <span className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full bg-default-100">
                  <Icon
                    className="text-default-500 [&>path]:stroke-[1.5]"
                    icon="solar:arrow-right-linear"
                    width={16}
                  />
                </span>
              }
              radius="full"
              variant="bordered"
            >
              查看指南
            </Button>
          </div>
        </section>
        <section className="z-20 my-14 mt-0 flex flex-col items-center justify-center gap-[18px] max-md:gap-6 w-full">
          <div className="text-4xl font-bold tracking-tighter flex flex-col items-center justify-center">功能</div>
          <div className="w-full px-8 max-md:px-0 flex flex-wrap items-center justify-center gap-2 max-md:flex-col max-md:gap-4">
            {features.map((feature) => (
              <Alert key={feature.title}
                icon={<Icon icon={feature.icon} fontSize={20} />}
                classNames={{
                  base: 'max-md:w-full max-lg:w-[calc(50%-0.5rem)] w-[calc(25%-1.5rem)] max-w-[333px] max-lg:max-w-full',
                  title: 'text-2xl font-bold',
                  description: 'text-default-500 min-h-[40px]',
                }}
                title={feature.title}
                description={feature.description}
                color="secondary"
                hideIconWrapper
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
