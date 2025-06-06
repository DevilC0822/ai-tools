import { Execution, imageGenerateForGoogleGenAI, imageGenerateForOpenAI, checkModelBalance } from '@/utils/server';
import { NextRequest } from 'next/server';
import { SuccessResponse, ErrorResponse } from '@/utils/server';

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const params = await request.json();
    const { model, prompt, ...rest } = params;
    const translatePrompt = `Translate the following text to English: ${prompt}`;
    const check = await checkModelBalance(model);
    if (!check.success) {
      return ErrorResponse(check.message);
    }

    if (model.includes('gemini')) {
      const result = await imageGenerateForGoogleGenAI({
        model,
        type: '3',
        contents: [
          { text: translatePrompt },
        ],
      });
      if (typeof result === 'string') {
        return ErrorResponse(result);
      }
      return SuccessResponse(result);
    }
    const result = await imageGenerateForOpenAI({
      model,
      prompt: translatePrompt,
      type: '3',
      ...rest,
    });
    if (typeof result === 'string') {
      return ErrorResponse(result);
    }
    return SuccessResponse(result);
  });
}