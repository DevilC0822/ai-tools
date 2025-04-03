import { Execution, getService, ErrorResponse, checkModelLimit } from '@/utils/server';
import { NextResponse, NextRequest } from 'next/server';
import { getStreamData } from '@/utils/server';

const getPrompt = (options: { gender: string, birthday: string, birthplace: string }) => {
  return `
  你作为一名资深命理学家，熟读《三命通会》、《渊海子平》，《滴天髓征义》、《穷通宝鉴》和《子平真诠评注》等命理经典，请根据以下信息进行深度命盘解析：
  【基础信息】
    • 生辰：[${options.birthday}]，
    • 性别：[${options.gender}]
    • 出生地：[${options.birthplace}]
  【专项分析请求】
    请重点解读：
    (1) 整体分析格局，考虑身强身弱，分析十神关系，体用平衡。注意逻辑合理，综合各种信息文本判断准确的关系模型，交叉验证，多次迭代后输出最终正确的结果。
    (2) 绘制命盘能量分布图（用ASCII字符呈现五行强弱）
    (3) 排出大运和流年，并列出命主的历史事件，尽量详细，细节丰富，以验证推算的准确性
    (4) 根据未来五年的大运和流年，推测命主未来的运势，并提供指导方针
  【解析要求】
    大运数的起法，以三天折合一岁计。根阳年生男、阴年生女顺行，阴年生男、阳年生女逆行。据出生日与上一个节气（逆行时）或下一个节气（顺行时）之间的天数来计算，然后根据阴阳顺逆的原则来确定大运的走向。
  【输出格式】
    用白话文分段论述，既有术语又能让人听懂
  `;
};

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const params = await request.json();
    const { model } = params;
    const check = await checkModelLimit(model);
    if (!check.success) {
      return ErrorResponse(check.message);
    }
    const service = getService(model);
    const completion = await service.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: getPrompt(params),
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
      type: '0',
    });
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  });
}