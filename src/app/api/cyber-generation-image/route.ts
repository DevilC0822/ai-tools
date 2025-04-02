import { Execution, imageGenerateForGoogleGenAI, imageGenerateForOpenAI } from '@/utils/server';
import { NextRequest } from 'next/server';
import { SuccessResponse, ErrorResponse } from '@/utils/server';

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const params = await request.json();
    const { model, prompt, ...rest } = params;
    if (model.includes('gemini')) {
      const result = await imageGenerateForGoogleGenAI({
        model,
        type: '3',
        contents: [
          { text: prompt },
        ],
      });
      if (typeof result === 'string') {
        return ErrorResponse(result);
      }
      return SuccessResponse(result);
    }
    const result = await imageGenerateForOpenAI({
      model,
      prompt,
      type: '3',
      ...rest,
    });
    if (typeof result === 'string') {
      return ErrorResponse(result);
    }
    return SuccessResponse(result);
  });
}