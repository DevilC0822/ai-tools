export const modelAbilities = {
  textInput: {
    label: '文本输入',
    icon: 'text',
  },
  textOutput: {
    label: '文本输出',
    icon: 'text',
  },
  imageInput: {
    label: '图像输入',
    icon: 'image',
  },
  imageOutput: {
    label: '图像输出',
    icon: 'image',
  },
};

export type Model = {
  disabled?: boolean; // 是否可用
  disabledReason?: string; // 不可用原因
  developer: string; // 开发团队
  service: string; // 服务提供方
  apiService: string; // API服务提供方
  label: string; // 模型名称
  briefLabel: string; // 模型简称
  icon: string; // 模型图标
  website: string; // 模型官网
  description: string; // 模型描述
  abilities: (keyof typeof modelAbilities)[]; // 模型能力
  price: {
    perInToken?: number; // 每个输入token的价格
    perOutToken?: number; // 每个输出token的价格
    perImage?: number; // 每个图片的价格
    unit: string; // 价格单位
  };
  useLimit: {
    description: string; // 使用限制
    type: 'frequency' | 'balance' | 'token'; // 使用限制类型
    limit: number; // 使用限制数量
    key: string; // 使用限制key
  };
}

export const grokUseLimit = {
  description: '所有 grok 模型限制每月消费 100 美元',
  type: 'balance' as const,
  limit: 100,
  key: 'grok' as const,
};

export type TModelList = 'gemini-2.0-flash' | 'gemini-2.5-pro-exp-03-25' | 'gemini-2.0-flash-exp-image-generation' | 'grok-2' | 'grok-2-vision' | 'grok-2-image' | 'doubao-1-5-vision-pro-32k-250115' | 'deepseek-chat' | 'deepseek-reasoner';

export const models: Record<TModelList, Model> = {
  'gemini-2.0-flash': {
    service: 'gemini',
    apiService: '谷歌', 
    developer: '谷歌',
    label: 'Gemini 2.0 Flash',
    briefLabel: 'Gemini 2.0 Flash',
    icon: 'gemini',
    description: 'Gemini 2.0 Flash 提供新一代功能和增强型功能，包括更快的速度、原生工具使用、多模态生成功能，以及 100 万个 token 的上下文窗口。',
    website: 'https://gemini.google.com/',
    abilities: ['textInput', 'textOutput', 'imageInput', 'imageOutput'],
    price: {
      perInToken: 0.1 / 1000000,
      perOutToken: 0.4 / 1000000,
      unit: '$',
    },
    useLimit: {
      description: 'Gemini 2.0 Flash 模型每天限制 1000 次',
      type: 'frequency',
      limit: 1000,
      key: 'gemini-2.0-flash',
    },
  },
  'gemini-2.5-pro-exp-03-25': {
    service: 'gemini',
    apiService: '谷歌',
    developer: '谷歌',
    label: 'Gemini 2.5 Pro Exp 03-25',
    briefLabel: 'Gemini 2.5 Pro',
    icon: 'gemini',
    description: 'Gemini 2.5 Pro Experimental 是我们最先进的思考模型，能够推理代码、数学和 STEM 领域的复杂问题，以及使用长上下文分析大型数据集、代码库和文档。',
    website: 'https://gemini.google.com/',
    abilities: ['textInput', 'textOutput', 'imageInput'],
    price: {
      perInToken: 0.1 / 1000000,
      perOutToken: 0.4 / 1000000,
      unit: '$',
    },
    useLimit: {
      description: 'Gemini 2.5 Pro Exp 03-25 每天限制 15 次',
      type: 'frequency',
      limit: 15,
      key: 'gemini-2.5-pro-exp',
    },
  },
  'gemini-2.0-flash-exp-image-generation': {
    service: 'gemini',
    apiService: '谷歌',
    developer: '谷歌',
    label: 'Gemini 2.0 Flash Exp Image Generation',
    briefLabel: 'Gemini 2.0 Image',
    icon: 'gemini',
    description: 'Gemini 2.0 Flash Exp Image Generation 是谷歌推出的多模态人工智能模型，具备原生图像生成和编辑能力。与其他图像生成模型不同，它能够将详细的文本描述转换为视觉上吸引人的图像，适用于创建复杂且逼真的图像。',
    website: 'https://gemini.google.com/',
    abilities: ['textInput', 'textOutput', 'imageInput', 'imageOutput'],
    price: {
      perInToken: 0.1 / 1000000,
      perOutToken: 0.4 / 1000000,
      unit: '$',
    },
    useLimit: {
      description: 'Gemini 2.0 Flash Experimental 模型每天限制 1000 次',
      type: 'frequency',
      limit: 1000,
      key: 'gemini-2.0-flash-exp',
    },
  },
  'grok-2': {
    service: 'grok',
    apiService: 'xAI',
    developer: 'xAI',
    label: 'Grok 2',
    briefLabel: 'Grok 2',
    icon: 'grok',
    description: 'Grok 最新的文本模型支持结构化输出，效率、速度和性能均得到提升。',
    website: 'https://grok.com/',
    abilities: ['textInput', 'textOutput'],
    price: {
      perInToken: 2 / 1000000,
      perOutToken: 10 / 1000000,
      unit: '$',
    },
    useLimit: grokUseLimit,
  },
  'grok-2-vision': {
    service: 'grok',
    apiService: 'xAI',
    developer: 'xAI',
    label: 'Grok 2 Vision',
    briefLabel: 'Grok 2 Vision',
    icon: 'grok',
    description: 'Grok 最新的图像理解模型具有增加的上下文窗口，可以处理各种视觉信息，包括文档、图表、图表、屏幕截图和照片。',
    website: 'https://grok.com/',
    abilities: ['textInput', 'textOutput', 'imageInput'],
    price: {
      perInToken: 2 / 1000000,
      perOutToken: 10 / 1000000,
      unit: '$',
    },
    useLimit: grokUseLimit,
  },
  'grok-2-image': {
    service: 'grok',
    apiService: 'xAI',
    developer: 'xAI',
    label: 'Grok 2 Image',
    briefLabel: 'Grok 2 Image',
    icon: 'grok',
    description: 'Grok 最新的图像生成模型能够根据文本提示，生成具有更强创造力和更高精确度的高质量、细节丰富的图像。',
    website: 'https://grok.com/',
    abilities: ['textInput', 'textOutput', 'imageInput', 'imageOutput'],
    price: {
      perImage: 0.07,
      unit: '$',
    },
    useLimit: grokUseLimit,
  },
  'doubao-1-5-vision-pro-32k-250115': {
    service: 'volcengine',
    apiService: '火山引擎',
    developer: '字节跳动',
    label: 'Doubao-1.5-vision-pro-32k',
    briefLabel: 'Doubao-1.5-vision-pro',
    icon: 'doubao',
    description: 'Doubao-1.5-vision-pro，全新升级的多模态大模型，支持任意分辨率和极端长宽比图像识别，增强视觉推理、文档识别、细节信息理解和指令遵循能力。',
    website: 'https://volcengine.com/L/XCKSzRRrE24',
    abilities: ['textInput', 'textOutput', 'imageInput'],
    price: {
      perInToken: 3 / 1000000,
      perOutToken: 9 / 1000000,
      unit: '¥',
    },
    useLimit: {
      description: '每天 50万 Token 使用量',
      type: 'token',
      limit: 500000,
      key: 'doubao',
    },
  },
  'deepseek-chat': {
    service: 'deepseek',
    apiService: '深度求索',
    developer: '深度求索',
    label: 'DeepSeek Chat',
    briefLabel: 'DeepSeek Chat',
    icon: 'deepseek',
    description: 'DeepSeek Chat 是 面向对话交互优化的通用大模型，支持多轮对话、知识库问答、代码解释、数据分析等多种功能。',
    website: 'https://deepseek.com/',
    abilities: ['textInput', 'textOutput'],
    price: {
      perInToken: 2 / 1000000,
      perOutToken: 8 / 1000000,
      unit: '¥',
    },
    useLimit: {
      description: '按照余额限制',
      type: 'balance',
      limit: 100,
      key: 'deepseek',
    },
  },
  'deepseek-reasoner': {
    service: 'deepseek',
    apiService: '深度求索',
    developer: '深度求索',
    label: 'DeepSeek R1',
    briefLabel: 'DeepSeek R1',
    icon: 'deepseek',
    description: 'DeepSeek R1 是 面向复杂推理任务的通用大模型，支持多轮对话、知识库问答、代码解释、数据分析等多种功能。',
    website: 'https://deepseek.com/',
    abilities: ['textInput', 'textOutput'],
    price: {
      perInToken: 4 / 1000000,
      perOutToken: 16 / 1000000,
      unit: '¥',
    },
    useLimit: {
      description: '按照余额限制',
      type: 'balance',
      limit: 100,
      key: 'deepseek',
    },
  },
};