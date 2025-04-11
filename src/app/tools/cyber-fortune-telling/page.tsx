'use client';
import { useState } from 'react';
import { Card, CardHeader, CardBody, Radio, RadioGroup, Input, Button, Alert, DatePicker, addToast } from '@heroui/react';
import { now } from '@internationalized/date';
import ModelChoose from '@/components/ModelChoose';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import ToolTitle from '@/components/ToolTitle';
import { parseReadableStream } from '@/utils/client';
import { TModelList } from '@/config/models';

const includeModels: TModelList[] = ['grok-3-mini', 'grok-3', 'gemini-2.0-flash', 'gemini-2.5-pro-exp-03-25', 'grok-2', 'deepseek-chat', 'deepseek-reasoner'];

const defaultFormData = {
  gender: 'male',
  birthday: now('Asia/Shanghai'),
  birthplace: '',
  model: includeModels[0],
};

const genderMap: Record<string, string> = {
  male: '男',
  female: '女',
};

export default function CyberFortuneTellingPage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false); // 请求
  const [result, setResult] = useState('');
  const [isReasoning, setIsReasoning] = useState<null | boolean>(null); // 是否在推理
  const [reasoningContent, setReasoningContent] = useState('');
  const [showReasoning, setShowReasoning] = useState(true);

  const onSubmit = async () => {
    if (!formData.birthplace) {
      addToast({
        title: '请输入出生地',
        description: '请输入出生地',
        color: 'danger',
      });
      return;
    }
    setResult('');
    setReasoningContent('');
    setIsReasoning(null);
    setShowReasoning(true);
    setIsLoading(true);

    const stream = await fetch('/api/cyber-fortune-telling', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        birthday: formData.birthday.toDate().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        gender: genderMap[formData.gender],
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
          <ToolTitle title='赛博算命' description='赛博算命是一款基于AI的算命工具，通过输入你的性别、出生日期和出生地，可以预测你的未来运势。' />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>性别</span>
              <RadioGroup
                orientation='horizontal'
                className='w-full'
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <Radio value='male'>男</Radio>
                <Radio value='female'>女</Radio>
              </RadioGroup>
            </div>
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>出生日期</span>
              <DatePicker
                hideTimeZone
                showMonthAndYearPickers={true}
                aria-label="出生日期"
                name="birthday"
                value={formData.birthday}
                onChange={(v) => {
                  if (v) {
                    setFormData({ ...formData, birthday: v });
                  } else {
                    setFormData({ ...formData, birthday: now('Asia/Shanghai') });
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>出生地</span>
              <Input
                placeholder='请输入出生地'
                value={formData.birthplace}
                onChange={(e) => setFormData({ ...formData, birthplace: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-full">
              <span className='flex-shrink-0 text-right'>模型</span>
              <ModelChoose dataSources={includeModels} model={formData.model} onChange={(model) => setFormData({ ...formData, model })} />
            </div>
            <div className="flex max-md:justify-center gap-2 mt-2">
              <Button color='primary' onPress={onSubmit} isLoading={isLoading}>开始算命</Button>
              <Button variant='light' onPress={onReset}>重置</Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {
        (result || reasoningContent) && (
          <>
            <Alert variant='flat' color='primary' className='mt-2' title='命理分析仅供参考，不可作为决策的唯一依据。命运掌握在自己手中，通过积极努力，可以改变人生的轨迹。请理性看待命理，切勿迷信。'>
            </Alert>
            <Card className='w-full mt-2' classNames={{
              header: 'pb-0',
              body: 'pt-0',
            }}>
              <CardHeader>
                {
                  isReasoning !== null && (
                    <div className='w-full'>
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