import { Execution, getService, ErrorResponse } from '@/utils/server';
import { NextResponse, NextRequest } from 'next/server';
import { getStreamData, checkModelBalance } from '@/utils/server';

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
            Please summarize ${count} notable events in ${name}'s life.
            string type fields should be in Chinese.
            {
              "name": "string", // name
              "gender": "string", // gender
              "type": "string", // type
              "profile": "string", // profile 100 words
              "timeline": [
                {
                  "year": "string", // year
                  "title": "string", // title
                  "description": "string", // description 50 words
                }
              ]
            }
            `,
        },
        {
          role: 'user',
          content: `
          请根据以上要求，给出${name}的大事记
          `,
        },
      ],
      stream: true,
      stream_options: {
        include_usage: true,
      },
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