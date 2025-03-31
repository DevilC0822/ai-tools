import Usage from '@/db/UsageSchema';
import { SuccessResponse, Execution } from '@/utils/server';
import { NextRequest } from 'next/server';
import dayjs from 'dayjs';

export async function GET(request: NextRequest) {
  return Execution(async () => {
    const { searchParams } = new URL(request.url);
    const model = searchParams.get('model') || '';
    const service = searchParams.get('service') || '';
    if (model) {
      switch (model) {
        case 'gemini-2.0-flash-exp-image-generation':
          const LIMIT = 25;
          const today = dayjs().format('YYYY-MM-DD');
          const usage = await Usage.countDocuments({
            model: 'gemini-2.0-flash-exp-image-generation',
            createTime: { $gte: today },
          });
          return SuccessResponse(LIMIT - usage, {
            message: `今日使用次数 ${usage} 次，剩余 ${LIMIT - usage} 次`,
          });
        default:
          return SuccessResponse(0, {
            message: '模型不存在',
          });
      }
    }
    if (service) {
      switch (service) {
        case 'deepseek':
          return SuccessResponse(0, {
            message: '服务不存在',
          });
        default:
          return SuccessResponse(0, {
            message: '服务不存在',
          });
      }
    }
    return SuccessResponse({
      balance: 0,
    });
  });
}
