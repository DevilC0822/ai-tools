'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Input, Slider, Button, Alert, addToast, Spinner } from '@heroui/react';
import ModelChoose from '@/components/ModelChoose';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import ToolTitle from '@/components/ToolTitle';
import { parseReadableStream } from '@/utils/client';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

const includeModels = ['gemini-2.0-flash', 'gemini-2.5-pro-exp-03-25', 'grok-2', 'deepseek-chat', 'deepseek-reasoner'];

const defaultFormData = {
  name: '',
  count: 10,
  model: includeModels[0],
};

type Result = {
  name: string;
  gender: string;
  type: string;
  profile: string;
  timeline: {
    year: string;
    title: string;
    description: string;
  }[];
}

export default function CyberFortuneTellingPage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false); // 请求
  const [result, setResult] = useState<Result>();
  const [isStreaming, setIsStreaming] = useState(false); // 是否正在生成
  const [isReasoning, setIsReasoning] = useState<null | boolean>(null); // 是否在推理
  const [reasoningContent, setReasoningContent] = useState('');
  const [showReasoning, setShowReasoning] = useState(true);

  const onSubmit = async () => {
    if (!formData.name) {
      addToast({
        title: '请输入姓名',
        description: '请输入姓名',
        color: 'danger',
      });
      return;
    }
    setResult(undefined);
    setReasoningContent('');
    setIsReasoning(null);
    setShowReasoning(true);
    setIsLoading(true);

    const stream = await fetch('/api/cyber-biography', {
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
    try {
      parseReadableStream(stream!, {
        output: 'json',
        onStart: () => {
          setIsStreaming(true);
        },
        onchange: (thinking) => {
          setReasoningContent(thinking);
        },
        onThinkingStart: () => {
          setIsReasoning(true);
          setIsStreaming(false);
        },
        onThinkingEnd: () => {
          setIsReasoning(false);
          setIsStreaming(true); // 如果是思考模型，则在思考结束时才开始生成并解析 json
        },
        onEnd: (_thinking, result) => {
          setIsStreaming(false);
          setResult(result as Result);
        },
      });
    } catch {
      addToast({
        title: '请求失败',
        description: '请求异常，请重试！',
        color: 'danger',
      });
    }
  };

  const onReset = () => {
    setFormData(defaultFormData);
    setResult(undefined);
    setReasoningContent('');
    setIsReasoning(null);
    setShowReasoning(true);
  };
  const [screenWidth, setScreenWidth] = useState(0);
  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener('resize', () => {
      setScreenWidth(window.innerWidth);
    });
    return () => {
      window.removeEventListener('resize', () => { });
    };
  }, []);
  return (
    <>
      <Card className='w-full'>
        <CardHeader className='flex flex-col gap-2 items-start'>
          <ToolTitle title='名人大事记' description='名人大事记是一款基于AI的名人传记生成工具，通过输入名人的姓名，可以生成名人的传记。' />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>姓名</span>
              <Input
                placeholder='请输入你想了解的名人'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <div className='w-full pr-2 flex-shrink-0 flex justify-between'>
                <span>大事记数量</span>
                <span>{formData.count}</span>
              </div>
              <Slider
                aria-label='大事记数量'
                color='primary'
                value={formData.count}
                minValue={2}
                maxValue={20}
                step={1}
                showTooltip
                onChange={(value) => setFormData({ ...formData, count: value as number })}
              />
            </div>
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
        (result || reasoningContent || isStreaming) && (
          <>
            <Alert variant='flat' color='primary' className='mt-2' title="以下内容由 AI 生成，真实性请自行考证" description={result?.profile} />
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
              {
                result?.name ? (<CardBody>
                  <VerticalTimeline>
                    {result?.timeline.map((item, index) => (
                      <VerticalTimelineElement
                        key={item.title}
                        contentStyle={{ boxShadow: '1px 1px 1px 1px #7761da', border: '1px solid #7761da', borderRadius: '10px' }}
                        contentArrowStyle={{ borderRight: '7px solid  #000' }}
                        date={screenWidth <= 1169 ? '' : `${item.year}`}
                        icon={<div className="text-lg max-md:text-sm font-bold text-center">
                          <span className='text-nowrap'>{screenWidth <= 1169 ? <p>{item.year}</p> : index + 1}</span>
                        </div>}
                      >
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <span className="text-sm text-gray-500">{item.description}</span>
                      </VerticalTimelineElement>
                    ))}
                  </VerticalTimeline>
                </CardBody>) : isStreaming ? (<CardBody>
                  <div className='flex justify-center items-center h-[200px]'>
                    <Spinner color='primary' variant='wave' label='正在生成中...' />
                  </div>
                </CardBody>) : (<></>)
              }
            </Card>
          </>
        )
      }
    </>
  );
}