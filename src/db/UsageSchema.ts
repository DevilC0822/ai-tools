import mongoose from 'mongoose';

const UsageSchema = new mongoose.Schema({
  usage: {
    completion_tokens: Number,
    prompt_tokens: Number,
    total_tokens: Number,
  },
  model: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  createTime: {
    type: String,
    required: true,
  },
});

// 配置 toJSON 用于返回结果
UsageSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const newObj = ret;
    newObj.id = ret._id;
    delete newObj._id;
    delete newObj.__v;
    return newObj;
  },
});

export default mongoose.models?.Usage || mongoose.model('Usage', UsageSchema);
