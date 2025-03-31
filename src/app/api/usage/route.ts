import Usage from '@/db/UsageSchema';
import { SuccessResponse, Execution } from '@/utils/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return Execution(async () => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    const model = searchParams.get('model') || '';
    const current = Number(searchParams.get('current')) || 1;
    const size = Number(searchParams.get('size')) || 10;
    const search: { [key: string]: unknown } = {
      type: type ? { $in: type.split(',') } : undefined,
      model: model ? { $in: model.split(',') } : undefined,
    };
    // 删除所有 undefined 的 key
    Object.keys(search).forEach((key) => {
      if (search[key] === undefined) {
        delete search[key];
      }
    });
    const usage = await Usage.find(search).sort({ createTime: -1 }).skip((current - 1) * size).limit(size);
    const total = await Usage.countDocuments(search);
    return SuccessResponse({
      records: usage,
      total,
      current,
      size,
    });
  });
}
