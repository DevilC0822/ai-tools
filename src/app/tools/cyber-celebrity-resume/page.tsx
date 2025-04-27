'use client';
import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardBody, Input, Button, Alert, addToast, Spinner } from '@heroui/react';
import ModelChoose from '@/components/ModelChoose';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import ToolTitle from '@/components/ToolTitle';
import { parseReadableStream } from '@/utils/client';
import { TModelList } from '@/config/models';
// import html2pdf from 'html2pdf.js';

const includeModels: TModelList[] = ['grok-3-mini', 'grok-3', 'gemini-2.0-flash', 'gemini-2.5-pro-exp-03-25', 'grok-2', 'deepseek-chat', 'deepseek-reasoner'];

const defaultFormData = {
  name: '',
  model: includeModels[0],
};

export default function CyberCelebrityResumePage() {
  const [formData, setFormData] = useState(defaultFormData);
  const [isLoading, setIsLoading] = useState(false); // 请求
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false); // 是否正在生成
  const [isReasoning, setIsReasoning] = useState<null | boolean>(null); // 是否在推理
  const [reasoningContent, setReasoningContent] = useState('');
  const [showReasoning, setShowReasoning] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(0);

  const onSubmit = async () => {
    if (!formData.name) {
      addToast({
        title: '请输入姓名',
        description: '请输入姓名',
        color: 'danger',
      });
      return;
    }
    setResult('');
    setReasoningContent('');
    setIsReasoning(null);
    setShowReasoning(true);
    setIsLoading(true);

    const stream = await fetch('/api/cyber-celebrity-resume', {
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
    setIsStreaming(true);
    parseReadableStream(stream, {
      onThinkingStart: () => {
        setIsReasoning(true);
        setIsStreaming(false);
      },
      onThinkingEnd: () => {
        setIsReasoning(false);
        setIsStreaming(true);
      },
      onchange: (thinking) => {
        setReasoningContent(thinking);
      },
      onEnd: (_thinking, result) => {
        setIsStreaming(false);
        if (typeof result === 'string') {
          console.log(result);
          // 匹配 ```html 和 ``` 之间的所有内容 忽略大小写
          const html = result.match(/```html\s*([\s\S]*?)\s*```/i)?.[1] || '';
          console.log(html);
          if (html) {
            setResult(html);
          } else {
            addToast({
              title: '生成失败',
              description: result,
              color: 'danger',
            });
          }
        }
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

  useEffect(() => {
    if (!result) {
      return;
    }
    const iframe = iframeRef.current;
    if (iframe && iframe.contentDocument) {
      const doc = iframe.contentDocument;
      doc.open();
      doc.write(result);
      doc.close();
      setIframeHeight(doc.documentElement.scrollHeight);
    }
  }, [result]);

  return (
    <>
      <Card className='w-full'>
        <CardHeader className='flex flex-col gap-2 items-start'>
          <ToolTitle title='名人简历' description='名人简历是一款基于AI的名人简历生成工具，通过输入名人的姓名，可以生成名人的简历。' />
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 items-start w-[400px] max-md:w-full">
              <span className='flex-shrink-0 text-right'>姓名</span>
              <Input
                placeholder='请输入姓名'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <Alert variant='flat' color='primary' className='mt-2' title='简历内容仅供参考，真实性请自行验证。'>
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
              <CardBody className='flex justify-center items-center'>
                {
                  isStreaming ? (
                    <div className='flex justify-center items-center h-[200px]'>
                      <Spinner color='primary' variant='wave' label='正在生成中...' />
                    </div>
                  ) : (
                    <div className='my-2 w-full flex flex-col gap-2 justify-center items-center'>
                      <iframe ref={iframeRef} srcDoc={result} style={{ height: iframeHeight + 1 }} className='w-full' />
                      {/* <Button color='primary' onPress={async () => {
                        const html2pdf = (await import('html2pdf.js')).default;
                        const body = iframeRef.current?.contentDocument?.body;
                        if (body) {
                          html2pdf(body, {
                            margin: [10, 10, 10, 10],
                            filename: `${formData.name}的简历.pdf`,
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                          });
                        }
                      }}>导出PDF</Button> */}
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