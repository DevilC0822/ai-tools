import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { models } from '@/config/models';
import Usage from '@/db/UsageSchema';
import { Stream } from 'openai/streaming';
import { ChatCompletionChunk } from 'openai/resources';
import dayjs from 'dayjs';
import { ContentListUnion } from '@google/genai';

const failMap: Record<string, string> = {
  'IMAGE_SAFETY': '候选图片因生成不安全的内容而被屏蔽。',
  'PROHIBITED_CONTENT': '系统屏蔽了此提示，因为其中包含禁止的内容。',
  'BLOCKLIST': '系统屏蔽了此提示，因为其中包含术语屏蔽名单中包含的术语。',
  'OTHER': '提示因未知原因被屏蔽了。',
  'SAFETY': '系统屏蔽了此提示，因为其中包含禁止的内容。',
  'BLOCK_REASON_UNSPECIFIED': '未指定原因。',
};

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
    return ErrorResponse(error instanceof Error ? error.message : '服务器错误');
  }
}

// 记录使用情况
export async function RecordUsage({
  model,
  type,
  usage,
  n, // 数量
}: {
  model: string;
  type: string;
  usage: { completion_tokens: number, prompt_tokens: number, total_tokens: number };
  n?: number;
}) {
  const modelInfo = models[model];
  const price = modelInfo.price;
  if (n) {
    await Usage.create({
      model,
      type,
      usage: {
        ...usage,
        money: `${(price.perImage! * n).toFixed(6)} ${price.unit}`,
      },
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    return;
  }
  await Usage.create({
    model,
    type,
    usage: {
      ...usage,
      money: `${(price.perInToken! * usage.prompt_tokens + price.perOutToken! * usage.completion_tokens).toFixed(6)} ${price.unit}`,
    },
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


type ImageGenerateResult = {
  text: string;
  revised_prompt: string;
  url: string;
  b64_json: string;
}

/**
 * 使用 Google GenAI 生成图片
 * @param model 模型名称
 * @param type 类型 工具类型，用于记录使用情况
 * @param contents 内容 包含图片的 base64 编码以及 prompt
 * @returns 图片结果 如果返回的的是字符串，则表示生成失败
 */
export const imageGenerateForGoogleGenAI = async ({
  model,
  type,
  contents,
}: {
  model: string;
  type: string;
  contents: ContentListUnion;
}): Promise<ImageGenerateResult[] | string> => {
  const response = await geminiServiceForGoogleGenAI.models.generateContent({
    model,
    contents,
    config: {
      responseModalities: ['Text', 'Image'],
    },
  });

  if (!response.candidates) {
    return 'Gemini返回结果为空,请重试';
  }
  await RecordUsage({
    model,
    usage: {
      completion_tokens: 0,
      prompt_tokens: response.usageMetadata?.promptTokenCount ?? 0,
      total_tokens: response.usageMetadata?.promptTokenCount ?? 0,
    },
    type,
  });
  if (!response.candidates[0]?.content?.parts) {
    const reason = failMap[response.candidates![0]?.finishReason ?? 'BLOCK_REASON_UNSPECIFIED'];
    return reason;
  }
  const result = {
    text: '',
    img: '',
  };
  for (const part of response.candidates[0].content.parts) {
    // Based on the part type, either show the text or save the image
    if (part?.text) {
      result.text = part.text;
    } else if (part?.inlineData) {
      const imageData = part.inlineData.data!;
      const buffer = Buffer.from(imageData, 'base64');
      result.img = buffer.toString('base64');
    }
  }
  if (!result.img) {
    return 'No image from Gemini';
  }
  return [{
    text: result.text,
    revised_prompt: '',
    url: '',
    b64_json: `data:image/png;base64,${result.img}`,
  }];
};

/**
 * 使用 OpenAI 生成图片
 * @param model 模型名称
 * @param type 类型 工具类型，用于记录使用情况
 * @param prompt 提示词
 * @param n 数量
 * @param rest 其他参数 参考 OpenAI API 文档
 * @returns 图片结果 如果返回的的是字符串，则表示生成失败
 */
export const imageGenerateForOpenAI = async ({
  model,
  type,
  prompt,
  n = 1,
  ...rest
}: {
  model: string;
  type: string;
  prompt: string;
  n?: number;
  [key: string]: unknown;
}): Promise<ImageGenerateResult[] | string> => {
  const service = getService(model);
  const response = await service.images.generate({
    model,
    prompt,
    n,
    response_format: 'b64_json',
    ...rest,
  });
  await RecordUsage({
    model,
    usage: {
      completion_tokens: 0,
      prompt_tokens: 0,
      total_tokens: 0,
    },
    n,
    type,
  });
  if (!response.data) {
    return 'OpenAI返回结果为空,请重试';
  }
  return response.data.map(i => ({
    text: '',
    revised_prompt: '',
    url: '',
    b64_json: `data:image/jpg;base64,${i.b64_json}`,
  }));
};
