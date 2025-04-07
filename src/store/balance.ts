import { atom } from 'jotai';
import { models, type TModelList } from '@/config/models';
import Usage from '@/db/UsageSchema';
import dayjs from 'dayjs';

type Balance = {
  balance: number;
  currency: string;
}

export const deepseekBalanceAtom = atom<Promise<Balance>>(async () => {
  const balance = await fetch('https://api.deepseek.com/user/balance', {
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_KEY}`,
    },
  });
  const balanceData = await balance.json();
  return {
    balance: balanceData.balance_infos?.[0]?.total_balance ?? 0,
    currency: balanceData.balance_infos?.[0]?.currency ?? 'CNY',
  };
});

export const grokBalanceAtom = atom<Promise<Balance>>(async () => {
  const limit = models['grok-2'].useLimit.limit;
  const usage = await Usage.find({
    model: { $regex: '^grok' },
    createTime: { $gte: dayjs().startOf('month').format('YYYY-MM-DD'), $lte: dayjs().endOf('month').format('YYYY-MM-DD') },
  });
  const totalUsage = usage.reduce((acc, curr) => acc + Number(curr.usage?.money.trim().slice(0, -1) ?? 0), 0);
  return {
    balance: limit - totalUsage,
    currency: 'USD',
  };
}); 

const getGeminiBalance = async (model: TModelList): Promise<Balance> => {
  const currentModel = models[model];
  const usage = await Usage.countDocuments({
    model: { $regex: `^${currentModel.useLimit.key}` },
    createTime: { $gte: dayjs().format('YYYY-MM-DD') },
  });
  return {
    balance: currentModel.useLimit.limit - usage,
    currency: '次',
  };
};

const gemini20FlashBalanceAtom = atom(async () => getGeminiBalance('gemini-2.0-flash'));
const gemini20FlashExpBalanceAtom = atom(async () => getGeminiBalance('gemini-2.0-flash-exp-image-generation'));
const gemini25ProExpBalanceAtom = atom(async () => getGeminiBalance('gemini-2.5-pro-exp-03-25'));

const balanceAtom = atom<Promise<Record<string, Balance>>>(async (get) => {
  const deepseekBalance = await get(deepseekBalanceAtom);
  const grokBalance = await get(grokBalanceAtom); 
  const gemini20FlashBalance = await get(gemini20FlashBalanceAtom);
  const gemini20FlashExpBalance = await get(gemini20FlashExpBalanceAtom);
  const gemini25ProExpBalance = await get(gemini25ProExpBalanceAtom);
  return {
    'deepseek-chat': deepseekBalance,
    'deepseek-reasoner': deepseekBalance,
    'grok-2': grokBalance,
    'grok-2-vision': grokBalance,
    'grok-2-image': grokBalance,
    'gemini-2.0-flash': gemini20FlashBalance,
    'gemini-2.0-flash-exp-image-generation': gemini20FlashExpBalance,
    'gemini-2.5-pro-exp-03-25': gemini25ProExpBalance,
  };
});

export default balanceAtom;