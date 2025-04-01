import { Execution, SuccessResponse, ErrorResponse } from '@/utils/server';
import { NextRequest } from 'next/server';
import { geminiServiceForGoogleGenAI } from '@/utils/server';
import { RecordUsage } from '@/utils/server';

const failMap: Record<string, string> = {
  'IMAGE_SAFETY': '候选图片因生成不安全的内容而被屏蔽。',
  'PROHIBITED_CONTENT': '系统屏蔽了此提示，因为其中包含禁止的内容。',
  'BLOCKLIST': '系统屏蔽了此提示，因为其中包含术语屏蔽名单中包含的术语。',
  'OTHER': '提示因未知原因被屏蔽了。',
  'SAFETY': '系统屏蔽了此提示，因为其中包含禁止的内容。',
  'BLOCK_REASON_UNSPECIFIED': '未指定原因。',
};

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
      return ErrorResponse('Gemini返回结果为空,请重试');
    }
    await RecordUsage({
      model,
      usage: {
        completion_tokens: 0,
        prompt_tokens: response.usageMetadata?.promptTokenCount ?? 0,
        total_tokens: response.usageMetadata?.promptTokenCount ?? 0,
      },
      type: '1',
    });
    if (!response.candidates[0]?.content?.parts) {
      const reason = failMap[response.candidates![0]?.finishReason ?? 'BLOCK_REASON_UNSPECIFIED'];
      return ErrorResponse(reason);
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
      return ErrorResponse('No image from Gemini');
    }
    return SuccessResponse([{
      text: result.text,
      revised_prompt: '',
      url: '',
      b64_json: `data:image/jpg;base64,${result.img}`,
    }]);
  });
}