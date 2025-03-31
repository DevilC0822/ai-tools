'use client';
import { cn, Alert, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

type ToolTitleProps = {
  title: string;
  description?: string;
  extra?: React.ReactNode;
  className?: string;
};

export default function ToolTitle({ title, description, extra, className }: ToolTitleProps) {
  const router = useRouter();

  return (
    <div className={cn('flex flex-col gap-2 items-start w-full', className)}>
      <div className='flex items-center justify-between w-full'>
        <p className="text-2xl font-bold">{title}</p>
        <Button
          variant='light'
          onPress={() => router.back()}
        >
          <div className='flex items-center gap-1'>
            <Icon icon="mingcute:left-fill" className="text-2xl" />
            <span>返回</span>
          </div>
        </Button>
      </div>
      {
        description && (
          <Alert variant='flat' color='primary' title={description} description={extra} />
        )
      }
    </div>
  );
}