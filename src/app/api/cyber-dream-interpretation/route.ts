import { Execution, getService, ErrorResponse, checkModelBalance } from '@/utils/server';
import { NextResponse, NextRequest } from 'next/server';
import { getStreamData } from '@/utils/server';

const getPrompt = (options: { mode: string, dream: string }) => {
  if (options.mode === 'east') {
    return `
    你是一名东方解梦师，熟读《周公解梦》、《梦林玄解》等解梦经典，请根据以下信息进行深度解梦：
    【基础信息】
    • 梦境：[${options.dream}]
    【专项分析请求】
    请重点解读：
      自动匹配《周公解梦》古籍库+现代心理学修正注解
    【输出格式】
    输出梦境解析结果，给出这个梦境的深层含义以及它可能对梦者的生活、工作、情感、健康等方面的影响
    `;
  }
  return `
  你是一名西方解梦师，熟读《梦的解析》、《荣格心理学》等解梦经典，请根据以下信息进行深度解梦：
  【基础信息】
  • 梦境：[${options.dream}]
  【专项分析请求】
    荣格原型分析+弗洛伊德欲望映射双模型
  【输出格式】
    输出梦境解析结果，给出这个梦境的深层含义以及它可能对梦者的生活、工作、情感、健康等方面的影响
  `;
};

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const params = await request.json();
    const { model, mode = 'east', dream } = params;
    const check = await checkModelBalance(model);
    if (!check.success) {
      return ErrorResponse(check.message);
    }
    const service = getService(model);
    const completion = await service.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: getPrompt({
            mode,
            dream,
          }),
        },
        {
          role: 'user',
          content: `
          请根据现有信息，给出命主的命盘解析
          `,
        },
      ],
      stream: true,
      stream_options: {
        include_usage: true,
      },
    });
    const stream = getStreamData(completion, {
      model,
      type: '4',
    });
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  });
}