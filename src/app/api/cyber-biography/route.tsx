import { Execution, getService, ErrorResponse } from '@/utils/server';
import { NextResponse, NextRequest } from 'next/server';
import { getStreamData, checkModelBalance } from '@/utils/server';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const BiographySchema = z.object({
  name: z.string(),
  gender: z.string(),
  type: z.string(),
  profile: z.string(),
  timeline: z.array(z.object({ year: z.string(), title: z.string(), description: z.string() })),
});

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const params = await request.json();
    const { model, count = 1, name } = params;
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
          content: `
            you are a professional historian, you should be able to summarize the life of a person in a concise and accurate manner.
            `,
        },
        {
          role: 'user',
          content: `
          Please summarize ${count} notable events in ${name}'s life.
          string type fields should be in Chinese.
          ${model.includes('deepseek') ? `Please return the result in JSON format.
              name: z.string(),
              gender: z.string(),
              type: z.string(),
              profile: z.string(),
              timeline: z.array(z.object({ year: z.string(), title: z.string(), description: z.string() })),
            ` : ''}

          `,
        },
      ],
      stream: true,
      stream_options: {
        include_usage: true,
      },
      response_format: model.includes('deepseek') ? {
        type: model.includes('chat') ? 'json_object' : 'text',
      } : zodResponseFormat(BiographySchema, 'biography'),
    });
    const stream = getStreamData(completion, {
      model: params.model,
      type: '2',
    });
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  });
}