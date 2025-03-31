'use client';
import { Card, CardHeader, CardBody, Button } from '@heroui/react';
import { tools } from '@/config/tools';
import { useRouter } from 'next/navigation';

export default function ToolsPage() {
  const router = useRouter();
  return (
    <Card className='w-full'>
      <CardHeader>
        <p className='text-2xl font-bold'>工具广场</p>
      </CardHeader>
      <CardBody className='flex gap-4 flex-row max-md:flex-col flex-wrap'>
        {
          Object.entries(tools).map(([key, tool]) => (
            <div key={key} className='w-[calc(33.33%-16px)] max-md:w-full border border-default-200 rounded-lg p-4 h-fit'>
              <p className='text-lg font-bold line-clamp-1'>{tool.label}</p>
              <span className='text-sm text-default-400 line-clamp-3 min-h-[60px] mt-2'>{tool.miniDescription}</span>
              <Button color='primary' className='w-full mt-4' onPress={() => router.push(`/tools/${key}`)}>{tool.btnText}</Button>
            </div>
          ))
        }
      </CardBody>
    </Card>
  );
}