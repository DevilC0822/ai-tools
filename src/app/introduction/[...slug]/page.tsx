import React from 'react';
import { CardHeader, CardBody, Chip } from '@heroui/react';
import { tools, models, IntroductionPrimaryKeys, IntroductionSecondaryKeys } from '@/config';
import { modelAbilities } from '@/config/models';

type IntroductionPageProps = {
  params: Promise<{ slug: string }>
}

export default async function MainIntroductionPage(props: IntroductionPageProps) {
  const { params } = props;
  const slug = (await params).slug;
  const primaryKey = slug[0];
  const secondaryKey = slug[1];
  if (!IntroductionPrimaryKeys.includes(primaryKey) || !IntroductionSecondaryKeys.includes(secondaryKey)) {
    return <div>404</div>;
  }
  if (primaryKey === 'tools') {
    const tool = tools[secondaryKey as keyof typeof tools];
    return (
      <>
        <CardHeader>
          <p className='text-2xl font-bold'>{tool.title}</p>
        </CardHeader>
        <CardBody>
          <div className='text-sm text-gray-500'>{tool.description}</div>
        </CardBody>
      </>
    );
  }
  if (primaryKey === 'models') {
    const model = models[secondaryKey as keyof typeof models];
    return (
      <div className='flex flex-col gap-4'>
        <p className='text-2xl font-bold'>{model.label}</p>
        <p className='text-sm text-gray-500'>{model.description}</p>
        <div className='flex flex-wrap gap-2'>
          <span className='font-bold'>模型能力：</span>
          {
            model.abilities.map((ability) => (
              <Chip key={ability} variant='flat' color='primary'>
                {modelAbilities[ability].label}
              </Chip>
            ))
          }
        </div>
        <p>
          <span className='font-bold'>开发团队：</span>
          {model.developer}
        </p>
        <p>
          <span className='font-bold'>服务提供方：</span>
          {model.apiService}
        </p>
        <p>
          <span className='font-bold'>使用限制：</span>
          {model.useLimit.description}
        </p>
      </div>
    );
  }
  return (
    <></>
  );
}
