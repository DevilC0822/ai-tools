'use client';

import { models, type TModelList } from '@/config/models';
import { tools } from '@/config/tools';


export const getOptions = (type: string) => {
  switch (type) {
    case 'model':
      return Object.keys(models).map((model) => ({
        label: models[model as TModelList].label,
        value: model,
      }));
    case 'tool':
      return Object.keys(tools).map((tool) => ({
        label: tools[tool].label,
        value: tools[tool].type,
      }));
    default:
      return [];
  }
};

// 判断是否是移动端设备 使用 navigator.userAgent 判断
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 解析流式数据
 * @param stream 流式数据 ReadableStream
 * @param options 选项
 * @param options.output 输出类型 默认 text 如果 output 为 json 则onResult 的 result 返回解析后的 json 对象
 * @param options.onStart 流式数据开始
 * @param options.onEnd 流式数据结束 形参 thinking 为思考内容，result 为结果
 * @param options.onchange 实时更新最新内容 形参 thinking 为思考内容，result 为结果
 * @param options.onThinkingStart 如果是思考模型，则 onThinkingStart 会触发
 * @param options.onThinkingEnd 如果是思考模型，则 onThinkingEnd 会触发
 */
export const parseReadableStream = async (stream: ReadableStream<Uint8Array<ArrayBufferLike>>, options: {
  output?: 'text' | 'json';
  onStart?: () => void;
  onEnd?: (thinking: string, result: string | Record<string, unknown>) => void;
  onchange?: (thinking: string, result: string) => void;
  onThinkingStart?: () => void;
  onThinkingEnd?: () => void;
}) => {
  try {
    const { output = 'text', onStart = () => { }, onEnd = () => { }, onThinkingStart = () => { }, onThinkingEnd = () => { }, onchange = () => { } } = options;
    const reader = stream?.getReader();
    const decoder = new TextDecoder();
    let isReasoning = false;
    let thinking = '';
    let content = '';
    onStart();
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      const text = decoder.decode(value);
      if (text.includes('<thinking>')) {
        isReasoning = true;
        onThinkingStart();
        continue;
      }
      if (text.includes('</thinking>')) {
        if (text !== '</thinking>') {
          thinking += text.replace('</thinking>', '');
        }
        isReasoning = false;
        onThinkingEnd();
        continue;
      }
      if (text.includes('[DONE]')) {
        let result = content || text.replace('[DONE]', '');
        console.log(result);
        if (output === 'json') {
          if (result.includes('```json')) {
            // 取出 ```json 和 ``` 之间的内容
            result = result.match(/```json\s*([\s\S]*?)\s*```/)?.[1] || '';
          }
          try {
            result = JSON.parse(result);
          } catch (error) {
            console.error(error);
          }
        }
        onEnd(thinking, result);
        break;
      }
      if (isReasoning) {
        thinking += text;
      } else {
        content += text;
      }
      onchange(thinking, content);
    }
  } catch (error) {
    console.error(error);
  }
};
