import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { models } from '@/config/models';
import Usage from '@/db/UsageSchema';
import { Stream } from 'openai/streaming';
import { ChatCompletionChunk } from 'openai/resources';
import dayjs from 'dayjs';

type Delta = {
  reasoning_content?: string;
  content?: string;
  [key: string]: unknown;  // 其他可能的属性
};

export const geminiServiceForGoogleGenAI = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });


export const grokService = new OpenAI({
  baseURL: 'https://api.x.ai/v1',
  apiKey: process.env.GROK_KEY,
});

export const siliconflowService = new OpenAI({
  baseURL: 'https://api.siliconflow.com',
  apiKey: process.env.SILICONFLOW_KEY,
});

export const geminiService = new OpenAI({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  apiKey: process.env.GEMINI_KEY,
});

export const volcengineService = new OpenAI({
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
  apiKey: process.env.VOLCENGINE_KEY,
});

export const deepseekService = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_KEY,
});

const ServiceMap: { [key: string]: OpenAI } = {
  grok: grokService,
  siliconflow: siliconflowService,
  gemini: geminiService,
  volcengine: volcengineService,
  deepseek: deepseekService,
};

export const getService = (model: string) => {
  const service = models[model].service;
  if (!ServiceMap[service]) {
    throw new Error(`Service ${service} not found`);
  }
  return ServiceMap[service];
};


type ResponseOptions = {
  code?: number;
  success?: boolean;
  message?: string;
}

export function SuccessResponse(data: unknown, { code = 200, success = true, message = 'success' }: ResponseOptions = {}) {
  return NextResponse.json({
    code,
    success,
    data,
    message,
  });
}

type ErrorResponseOptions = {
  code?: number;
  success?: boolean;
  data?: null;
}

export function ErrorResponse(message: string, { code = 200, success = false, data = null }: ErrorResponseOptions = {}) {
  return NextResponse.json({
    code,
    success,
    data,
    message,
  });
}

// 执行函数并返回结果
export async function Execution(fn: () => Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (error) {
    console.log(error);
    return ErrorResponse(error instanceof Error ? error.message : '服务器错误');
  }
}

// 记录使用情况
export async function RecordUsage({
  model,
  type,
  usage,
}: {
  model: string;
  type: string;
  usage: { completion_tokens: number, prompt_tokens: number, total_tokens: number };
}) {
  await Usage.create({
    model,
    type,
    usage,
    createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  });
}

/**
 * 获取大模型响应流
 * @param completion 大模型响应流 await service.chat.completions.create 返回的流式数据 create({ stream: true })
 * @param model 模型名称
 * @param type 类型
 * @returns 流式数据
 */
export const getStreamData = (completion: Stream<ChatCompletionChunk>, {
  model,
  type,
}: {
  model: string;
  type: string;
}) => {
  let count = 0;
  let thinkingCount = 0;
  const stream = new ReadableStream({
    async start(controller) {
      try {
        console.log('Starting stream processing...');
        for await (const chunk of completion) {
          if (chunk.choices[0].finish_reason === 'stop') {
            await RecordUsage({
              model,
              type,
              usage: chunk.usage as { completion_tokens: number, prompt_tokens: number, total_tokens: number },
            });
          }
          const { choices } = chunk;
          const delta = choices[0]?.delta as Delta ?? {};
          console.log(delta);
          
          if (!delta) continue;

          const { reasoning_content = null, content = null } = delta;
          // 添加 thinking 标签
          if (count === 0 && reasoning_content) {
            controller.enqueue(new TextEncoder().encode('<thinking>'));
            // 等待 100ms 后避免批处理
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          if (reasoning_content) {
            count++;
            thinkingCount++;
            controller.enqueue(new TextEncoder().encode(reasoning_content));
          }
          if (count - thinkingCount === 0 && thinkingCount !== 0 && content) {
            controller.enqueue(new TextEncoder().encode('</thinking>'));
            // 等待 100ms 后避免批处理
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          if (content) {
            count++;
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);
        controller.error(error);
      } finally {
        if (count === 0) {
          controller.enqueue(new TextEncoder().encode('[服务器繁忙，请稍后再试。]'));
        } else {
          controller.enqueue(new TextEncoder().encode('[DONE]'));
        }
        controller.close();
      }
    },
  });
  return stream;
};
