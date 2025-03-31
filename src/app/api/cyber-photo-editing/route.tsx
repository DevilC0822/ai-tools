import { Execution, SuccessResponse, ErrorResponse } from '@/utils/server';
import { NextRequest } from 'next/server';
import { geminiServiceForGoogleGenAI } from '@/utils/server';
import { RecordUsage } from '@/utils/server';

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const model = formData.get('model') as string;
    const file = formData.get('image') as File;
    const buffer = await file.arrayBuffer();
    const base64_image = Buffer.from(buffer).toString('base64');
    
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: 'image/png',
          data: base64_image,
        },
      },
    ];
    const response = await geminiServiceForGoogleGenAI.models.generateContent({
      model,
      contents: contents,
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });
    if (!response.candidates) {
      return ErrorResponse('No response from Gemini');
    }
    if (!response.candidates[0]?.content?.parts) {
      return ErrorResponse('Invalid response format from Gemini');
    }
    const result = {
      text: '',
      img: '',
    };
    await RecordUsage({
      model,
      usage: {
        completion_tokens: 0,
        prompt_tokens: response.usageMetadata?.promptTokenCount ?? 0,
        total_tokens: response.usageMetadata?.promptTokenCount ?? 0,
      },
      type: '1',
    });
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
    return SuccessResponse({
      ...response,
      ...result,
    });
  });
}