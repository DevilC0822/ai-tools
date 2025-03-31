'use client';
import { Card, CardBody, CardHeader, Accordion, AccordionItem, Button } from '@heroui/react';
import { models } from '@/config/models';
import { tools } from '@/config/tools';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const introductionMap: Record<string, { label: string; key: string; children: { label: string; key: string }[] }> = {
  tools: {
    label: '工具',
    key: 'tool',
    children: Object.keys(tools).map((key) => ({
      label: tools[key].label,
      key,
    })),
  },
  models: {
    label: '模型',
    key: 'model',
    children: Object.keys(models).map((key) => ({
      label: models[key].briefLabel,
      key,
    })),
  },
};

export default function IntroductionLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  
  const onGoIntroduction = (type: 'tool' | 'model', key: string) => {
    router.push(`/introduction/${type}/${key}`);
  };
  return (
    <div className="relative flex px-[8%] max-lg:px-6 max-md:px-4 mx-auto py-4 w-full min-h-[calc(100vh-64px)] max-md:flex-col">
      <Card className='w-[220px] max-md:w-full' classNames={{
        base: 'h-[calc(100vh-64px-32px)] max-md:h-fit overflow-y-auto fixed max-md:relative left-[8%] max-md:left-0 top-[calc(64px+16px)] max-md:top-0',
      }}>
        <CardHeader>
          <Button
            color={pathname === '/introduction' ? 'primary' : 'default'}
            variant='light'
            className='w-full'
            onPress={() => router.push('/introduction')}>
            <span className='text-2xl font-bold'>指南</span>
          </Button>
        </CardHeader>
        <CardBody>
          <Accordion defaultExpandedKeys={Object.keys(introductionMap)} selectionMode='multiple'>
            {
              Object.keys(introductionMap).map((key) => (
                <AccordionItem key={key} aria-label={introductionMap[key].label} title={introductionMap[key].label}>
                  {introductionMap[key].children.map((item) => (
                    <Button
                      color={pathname.slice(pathname.lastIndexOf('/') + 1) === item.key ? 'primary' : 'default'}
                      variant='light'
                      className='w-full'
                      key={item.key}
                      onPress={() => onGoIntroduction(key as 'tool' | 'model', item.key)}>
                      {item.label}
                    </Button>
                  ))}
                </AccordionItem>
              ))
            }
          </Accordion>
        </CardBody>
      </Card>
      <Card className='w-[calc(100%-220px)] max-md:w-full ml-[calc(220px+16px)] max-md:ml-0 px-6 py-8 max-md:mt-4' classNames={{
        base: 'h-fit',
      }}>
        {children}
      </Card>
    </div>
  );
}
