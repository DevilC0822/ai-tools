import { Execution, getService } from '@/utils/server';
import { NextRequest } from 'next/server';
import { SuccessResponse, ErrorResponse } from '@/utils/server';
import { geminiServiceForGoogleGenAI } from '@/utils/server';
import { RecordUsage } from '@/utils/server';

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const params = await request.json();
    const { model, ...rest } = params;
    const service = getService(model);
    if (model.includes('gemini')) {
      const response = await geminiServiceForGoogleGenAI.models.generateContent({
        model,
        contents: [{ text: rest.prompt }],
        config: {
          responseModalities: ['Text', 'Image'],
        },
      });
      await RecordUsage({
        model,
        usage: {
          completion_tokens: 0,
          prompt_tokens: response.usageMetadata?.promptTokenCount ?? 0,
          total_tokens: response.usageMetadata?.promptTokenCount ?? 0,
        },
        type: '3',
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
      for (const part of response.candidates[0].content.parts) {
        // Based on the part type, either show the text or save the image
        if (part?.text) {
          result.text += part.text;
        } else if (part?.inlineData) {
          const imageData = part.inlineData.data!;
          const buffer = Buffer.from(imageData, 'base64');
          result.img = buffer.toString('base64');
        }
      }
      if (!result.img) {
        return ErrorResponse('No image from Gemini');
      }
      return SuccessResponse([{
        text: result.text,
        revised_prompt: '',
        url: '',
        b64_json: `data:image/jpg;base64,${result.img}`,
      }]);
    }
    const response = await service.images.generate({
      model,
      ...rest,
      response_format: 'b64_json',
    });
    await RecordUsage({
      model,
      usage: {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0,
      },
      n: rest.n,
      type: '3',
    });
    return SuccessResponse(response.data.map(i => ({
      ...i,
      text: '',
      b64_json: `data:image/jpg;base64,${i.b64_json}`,
    })));
  });
}