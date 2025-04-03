import { Execution, SuccessResponse, ErrorResponse, imageGenerateForGoogleGenAI, checkModelLimit } from '@/utils/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const model = formData.get('model') as string;
    const check = await checkModelLimit(model);
    if (!check.success) {
      return ErrorResponse(check.message);
    }
    const file = formData.get('image') as File;
    const buffer = await file.arrayBuffer();
    const base64_image = Buffer.from(buffer).toString('base64');

    const result = await imageGenerateForGoogleGenAI({
      model,
      type: '1',
      contents: [
        { text: prompt },
        { inlineData: { mimeType: 'image/png', data: base64_image } },
      ],
    });
    if (typeof result === 'string') {
      return ErrorResponse(result);
    }
    return SuccessResponse(result);
  });
}