'use client';
import { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Alert, addToast, Image as ImageUI } from '@heroui/react';
import ModelChoose from '@/components/ModelChoose';
import ReactMarkdown from 'react-markdown';
import ToolTitle from '@/components/ToolTitle';
import { isMobileDevice } from '@/utils/client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ExampleOriginal from '@/assets/images/edit-photo-example-original.png';
import ExampleResult from '@/assets/images/edit-photo-example-result.png';

const includeModels = ['gemini-2.0-flash-exp-image-generation'];

const defaultFormData = new FormData();
defaultFormData.append('image', ''); // File
defaultFormData.append('prompt', '');
defaultFormData.append('model', includeModels[0]);


export default function CyberPhotoEditingPage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false); // 请求image.png
  const [result, setResult] = useState({
    img: '',
    text: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 添加图片预览URL状态

  const onSelectImage = () => {
    // 创建一个input标签
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    // 将 input 添加到 DOM 中，防止在 iOS Safari 中被过早回收
    input.style.position = 'absolute';
    input.style.visibility = 'hidden';
    input.style.pointerEvents = 'none';
    input.style.left = '-9999px';
    document.body.appendChild(input);

    // 添加多个事件监听
    const handleFile = (e: Event) => {
      try {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          // 创建新的FormData实例，避免重复添加
          const newFormData = new FormData();
          // 复制现有的prompt和model
          newFormData.append('prompt', formData.get('prompt') as string);
          newFormData.append('model', formData.get('model') as string);
          // 添加新图片
          newFormData.append('image', file);
          setFormData(newFormData);

          // 创建图片URL预览
          const imageUrl = URL.createObjectURL(file);
          setImagePreview(imageUrl);

          // 重置input，确保同一文件可以重复选择
          target.value = '';
        }
      } catch {
        addToast({
          title: '选择图片失败',
          description: '请选择图片',
          color: 'danger',
        });
      } finally {
        // 从 DOM 中移除 input 元素
        if (input.parentNode) {
          input.parentNode.removeChild(input);
        }
      }
    };

    // 绑定多个相关事件，确保在各种浏览器中都能正确触发
    if (isMobileDevice()) {
      input.addEventListener('input', handleFile, false);
    } else {
      input.addEventListener('change', handleFile, false);
    }
    input.click();
  };

  const onSubmit = async () => {
    if (!formData.get('image')) {
      addToast({
        title: '请上传图片',
        description: '请上传图片',
        color: 'danger',
      });
      return;
    }
    if (!formData.get('prompt')) {
      addToast({
        title: '请输入提示词',
        description: '请输入提示词',
        color: 'danger',
      });
      return;
    }
    const balance = await fetch('/api/balance?model=gemini-2.0-flash-exp-image-generation').then(res => res.json());
    if (balance.data <= 0) {
      addToast({
        title: '今日使用次数已达上限',
        description: 'gemini-2.0-flash-exp-image-generation 模型限制每日 25 次，今天的使用次数已经用完，请明天再来吧。',
        color: 'danger',
      });
      return;
    }
    setResult({
      img: '',
      text: '',
    });
    setIsLoading(true);

    const res = await fetch('/api/cyber-photo-editing', {
      method: 'POST',
      body: formData,
    }).then(res => res.json()).finally(() => {
      setIsLoading(false);
    });
    if (!res.success) {
      addToast({
        title: '请求失败',
        description: res!.message,
        color: 'danger',
      });
      return;
    }
    setResult({
      img: res.data.img,
      text: res.data.text,
    });
  };

  const onDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${result.img}`;
    link.download = 'generator.png';
    link.click();
  };

  const onReset = () => {
    // 释放之前创建的URL对象，避免内存泄漏
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setFormData(defaultFormData);
    setResult({
      img: '',
      text: '',
    });
  };

  const [showExample, setShowExample] = useState(false);
  const example = (
    <div>
      <Button size='sm' className='mt-2' color='primary' onPress={() => setShowExample(!showExample)}>
        示例
      </Button>
      <motion.div
        className='rounded-md overflow-hidden'
        initial={{ height: 0 }}
        animate={{ height: showExample ? 'auto' : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='flex flex-col gap-2 bg-transparent'>
          <span className='text-base font-bold mt-2'>输入</span>
          <div className='flex flex-col gap-2'>
            <span>图片</span>
            <ImageUI src={ExampleOriginal.src} alt='赛博修图示例' width={400} />
          </div>
          <div className='flex flex-col gap-2'>
            <span>提示词</span>
            <p>把它变成熊猫，翅膀是白色的。</p>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <span className='text-base font-bold mt-2'>输出</span>
          <ImageUI src={ExampleResult.src} alt='赛博修图示例' width={400} />
        </div>
      </motion.div>
    </div>
  );
  return (
    <>
      <Card className='w-full'>
        <CardHeader className='flex flex-col gap-2 items-start'>
          <ToolTitle title='赛博修图' description='赛博修图是一款基于AI的修图工具，通过输入你的图片和提示词，可以生成一张新的图片。' extra={example} />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>图片</span>
              {
                imagePreview ? (
                  <div className='w-full rounded-md overflow-hidden relative group'>
                    <Image
                      src={imagePreview}
                      className="w-full h-full object-contain"
                      alt="已选择的图片"
                      width={400}
                      height={400}
                    />
                    <div className="absolute inset-0 group-hover:backdrop-blur-lg transition-opacity flex items-center justify-center">
                      <Button className='hidden group-hover:block group-hover:backdrop-blur-lg' color='primary' onPress={onSelectImage} size="sm">更换图片</Button>
                    </div>
                  </div>
                ) : (
                  <Button color='primary' onPress={onSelectImage}>选择图片</Button>
                )
              }
            </div>
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>提示词</span>
              <Input
                value={formData.get('prompt') as string}
                placeholder='请输入提示词'
                onChange={(e) => {
                  const newFormData = new FormData();
                  if (formData.get('image')) {
                    newFormData.append('image', formData.get('image') as File);
                  }
                  newFormData.append('prompt', e.target.value);
                  newFormData.append('model', formData.get('model') as string);
                  setFormData(newFormData);
                }}
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <span className='flex-shrink-0 text-right'>模型</span>
              <ModelChoose
                dataSources={includeModels}
                model={formData.get('model') as string}
                onChange={(model) => {
                  const newFormData = new FormData();
                  if (formData.get('image')) {
                    newFormData.append('image', formData.get('image') as File);
                  }
                  newFormData.append('prompt', formData.get('prompt') as string);
                  newFormData.append('model', model);
                  setFormData(newFormData);
                }}
              />
            </div>
            <div className="flex max-md:justify-center gap-2 mt-2">
              <Button color='primary' onPress={onSubmit} isLoading={isLoading}>开始修图</Button>
              <Button variant='light' onPress={onReset}>重置</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {
        (result.img || result.text) && (
          <>
            <Alert variant='flat' color='primary' className='mt-2' title='生成的图片仅作为参考，请以实际效果为准。'>
            </Alert>
            <Card className='w-full mt-2' classNames={{
              header: 'pb-0',
              body: 'pt-0',
            }}>
              <CardBody>
                {
                  result.img && (
                    <div className='w-full flex flex-col justify-center items-center overflow-hidden relative group'>
                      <Image
                        src={`data:image/png;base64,${result.img}`}
                        className='my-2'
                        alt="生成的图片"
                        width={400}
                        height={400}
                      />
                      <Button color="primary" variant="light" onPress={onDownload}>下载</Button>
                    </div>
                  )
                }
                {
                  result.text && (
                    <div className="prose dark:prose-invert max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-li:my-0 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg">
                      <ReactMarkdown>
                        {result.text}
                      </ReactMarkdown>
                    </div>
                  )
                }
              </CardBody>
            </Card>
          </>
        )
      }
    </>
  );
}