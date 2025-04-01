'use client';
import { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Alert, addToast, Image, Slider } from '@heroui/react';
import ModelChoose from '@/components/ModelChoose';
import ToolTitle from '@/components/ToolTitle';

const includeModels = ['grok-2-image', 'gemini-2.0-flash-exp-image-generation'];

const defaultFormData = {
  prompt: '',
  model: includeModels[0],
  // size: '1024x1024',
  // quality: 'hd',
  n: 2,
};

type Result = {
  url: string;
  b64_json: string;
  revised_prompt?: string;
}

export default function CyberGenerationImagePage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result[]>([]);

  const onSubmit = async () => {
    if (!formData.prompt) {
      addToast({
        title: '请输入提示词',
        description: '请输入提示词',
        color: 'danger',
      });
      return;
    }
    setResult([]);
    setIsLoading(true);

    const response = await fetch('/api/cyber-generation-image', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json()).finally(() => {
      setIsLoading(false);
    });
    if (!response.success) {
      addToast({
        title: '生成失败',
        description: response.message,
        color: 'danger',
      });
      return;
    }
    setResult(response.data);
  };

  const onReset = () => {
    setFormData(defaultFormData);
    setResult([]);
  };

  const onDownBase64Image = (base64: string) => {
    const a = document.createElement('a');
    a.href = base64;
    a.download = 'image.png';
    a.click();
  };
  return (
    <>
      <Card className='w-full'>
        <CardHeader className='flex flex-col gap-2 items-start'>
          <ToolTitle title='智能图像生成器' description='智能图像生成器是一款基于AI的图像生成工具，通过输入你的提示词，可以生成你想要的图像。' />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>提示词</span>
              <Input
                placeholder='请输入提示词'
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              />
            </div>
            {
              formData.model === 'grok-2-image' && (
                <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
                  <div className='w-full pr-2 flex-shrink-0 flex justify-between'>
                    <span>图片数量</span>
                    <span>{formData.n}</span>
                  </div>
                  <Slider
                    color='primary'
                    value={formData.n}
                    minValue={1}
                    maxValue={10}
                    step={1}
                    showTooltip
                    onChange={(value) => setFormData({ ...formData, n: value as number })}
                  />
                </div>
              )
            }
            <div className="flex flex-col gap-2 items-start w-full">
              <span className='flex-shrink-0 text-right'>模型</span>
              <ModelChoose dataSources={includeModels} model={formData.model} onChange={(model) => setFormData({ ...formData, model })} />
            </div>
            <div className="flex max-md:justify-center gap-2 mt-2">
              <Button color='primary' onPress={onSubmit} isLoading={isLoading}>开始生成</Button>
              <Button variant='light' onPress={onReset}>重置</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {
        result.length > 0 && (
          <>
            <Alert variant='flat' color='primary' className='mt-2' title='生成的图片仅作为参考，请以实际效果为准。'>
            </Alert>
            <Card className='w-full mt-2' classNames={{
              header: 'pb-0',
              body: 'pt-0',
            }}>
              <CardHeader>
                {/* <p></p> */}
              </CardHeader>
              <CardBody>
                <div className='flex flex-wrap justify-center gap-6'>
                  {
                    result.map((item, index) => (
                      <div className='rounded-md overflow-hidden relative group' key={index}>
                        <Image key={index} src={item.b64_json} alt='生成的图片' height={400} />
                        <div className="z-[999] absolute inset-0 group-hover:backdrop-blur-lg group-hover:rounded-md transition-opacity flex items-center justify-center">
                          <Button className='hidden group-hover:block group-hover:backdrop-blur-lg' color='primary' onPress={() => onDownBase64Image(item.b64_json)} size="sm">下载</Button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardBody>
            </Card>
          </>
        )
      }
    </>
  );
}