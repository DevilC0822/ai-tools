'use client';
import { useState } from 'react';
import { Card, CardHeader, CardBody, Radio, RadioGroup, Input, Button, Alert, addToast } from '@heroui/react';
import ModelChoose from '@/components/ModelChoose';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import ToolTitle from '@/components/ToolTitle';
import { parseReadableStream } from '@/utils/client';
import { TModelList } from '@/config/models';

const includeModels: TModelList[] = ['grok-3-mini', 'grok-3', 'gemini-2.0-flash', 'gemini-2.5-pro-exp-03-25', 'grok-2', 'deepseek-chat', 'deepseek-reasoner'];

const defaultFormData = {
  mode: 'east',
  dream: '',
  model: includeModels[0],
};

export default function CyberFortuneTellingPage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false); // 请求
  const [result, setResult] = useState('');
  const [isReasoning, setIsReasoning] = useState<null | boolean>(null); // 是否在推理
  const [reasoningContent, setReasoningContent] = useState('');
  const [showReasoning, setShowReasoning] = useState(true);

  const onSubmit = async () => {
    setResult('');
    setReasoningContent('');
    setIsReasoning(null);
    setShowReasoning(true);
    setIsLoading(true);

    const stream = await fetch('/api/cyber-dream-interpretation', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async res => {
      if (res.headers.get('Content-Type') === 'application/json') {
        addToast({
          title: '请求失败',
          description: (await res.json()).message,
          color: 'danger',
        });
        return;
      }
      return res.body;
    }).finally(() => {
      setIsLoading(false);
    });
    if (!stream) {
      return;
    }
    parseReadableStream(stream, {
      onThinkingStart: () => {
        setIsReasoning(true);
      },
      onThinkingEnd: () => {
        setIsReasoning(false);
      },
      onchange: (thinking, result) => {
        setReasoningContent(thinking);
        setResult(result);
      },
    });
  };

  const onReset = () => {
    setFormData(defaultFormData);
    setResult('');
    setReasoningContent('');
    setIsReasoning(null);
    setShowReasoning(true);
  };
  return (
    <>
      <Card className='w-full'>
        <CardHeader className='flex flex-col gap-2 items-start'>
          <ToolTitle title='赛博解梦' description='输入梦境片段，AI解析深层隐喻。结合荣格原型理论与20万+文化符号数据库，提供心理映射、文化溯源、创意激发三重解读，让每个梦境都成为认识自我的钥匙。' />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>模式</span>
              <RadioGroup
                orientation='horizontal'
                className='w-full'
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              >
                <Radio value='east'>东方(周公解梦)</Radio>
                <Radio value='west'>西方(荣格心理学)</Radio>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>梦境</span>
              <Input
                placeholder='请输入梦境'
                value={formData.dream}
                onChange={(e) => setFormData({ ...formData, dream: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <span className='flex-shrink-0 text-right'>模型</span>
              <ModelChoose dataSources={includeModels} model={formData.model} onChange={(model) => setFormData({ ...formData, model })} />
            </div>
            <div className="flex max-md:justify-center gap-2 mt-2">
              <Button color='primary' onPress={onSubmit} isLoading={isLoading}>开始解梦</Button>
              <Button variant='light' onPress={onReset}>重置</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {
        (result || reasoningContent) && (
          <>
            <Alert variant='flat' color='primary' className='mt-2' title='梦境解析仅供参考，不可作为决策的唯一依据。梦境是潜意识的反映，通过深入分析，可以更好地认识自己，找到解决问题的方法。请理性看待梦境，切勿迷信。'>
            </Alert>
            <Card className='w-full mt-2' classNames={{
              header: 'pb-0',
              body: 'pt-0',
            }}>
              <CardHeader>
                {
                  isReasoning !== null && (
                    <div>
                      <Button color='primary' onPress={() => setShowReasoning(!showReasoning)}>
                        {isReasoning ? '正在思考中...' : '思考完成'}
                      </Button>
                      <motion.div
                        className='bg-gray-100 rounded-md overflow-hidden'
                        initial={{ opacity: 0, height: 0, margin: '8px 0' }}
                        animate={{ opacity: showReasoning ? 1 : 0, height: showReasoning ? 'auto' : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="prose dark:prose-invert max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-li:my-0 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg p-2">
                          <ReactMarkdown>
                            {reasoningContent}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    </div>
                  )
                }
              </CardHeader>
              <CardBody>
                <div className="prose dark:prose-invert max-w-none prose-headings:mt-4 prose-headings:mb-2 prose-p:my-2 prose-li:my-0 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg">
                  <ReactMarkdown>
                    {result}
                  </ReactMarkdown>
                </div>
              </CardBody>
            </Card>
          </>
        )
      }
    </>
  );
}