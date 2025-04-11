import CyberFortuneTelling from '@/components/tools-introduction/cyber-fortune-telling';
import CyberPhotoEditing from '@/components/tools-introduction/cyber-photo-editing';
import CyberBiography from '@/components/tools-introduction/cyber-biography';
import CyberGenerationImage from '@/components/tools-introduction/cyber-generation-image';
import CyberDreamInterpretation from '@/components/tools-introduction/cyber-dream-interpretation';
import CyberCelebrityResume from '@/components/tools-introduction/cyber-celebrity-resume';

export type Tool = {
  [key: string]: {
    label: string;
    type: string;
    title: string;
    description: React.ReactNode;
    miniDescription: string;
    btnText: string;
  }
}

export const tools: Tool = {
  'cyber-fortune-telling': {
    label: '🔮 赛博命理',
    type: '0',
    title: '「赛博命理」 —— 当AI算法解锁你的东方星图',
    description: <CyberFortuneTelling />,
    miniDescription: '使用AI算法解构千年命书，用科学框架重构命理逻辑；这不是迷信，而是一场关于「人类算法」的浪漫实验，你的八字早已被写进深度神经网络的参数之中。',
    btnText: '开始算命',
  },
  'cyber-photo-editing': {
    label: '🌠 赛博修图',
    type: '1',
    title: '「赛博修图」 —— AI赋能的未来影像实验室',
    description: <CyberPhotoEditing />,
    miniDescription: '在数字美学与算法魔法碰撞的时代，"赛博修图"应运而生——这是一款由前沿AI大模型驱动的智能图像处理工具，将传统修图技术推进至量子跃迁式的新维度。我们以神经网络为画笔，以海量美学数据为调色盘，重新定义"完美影像"的生成逻辑。',
    btnText: '开始修图',
  },
  'cyber-biography': {
    label: '📚 名人星轨',
    type: '2',
    title: '「名人星轨」 —— 用AI解码历史人物的「命运源代码」',
    description: <CyberBiography />,
    miniDescription: '当爱因斯坦的八字遇见牛顿的大运，达芬奇的流年碰撞李白的月令——这是一款用时间晶体算法重构人类群星闪耀时刻的认知革命工具。',
    btnText: '开始生成',
  },
  'cyber-generation-image': {
    label: '🖼️ 图像生成',
    type: '3',
    title: '「Artificium Canvas」 —— 智能图像生成器，让创意无限延展',
    description: <CyberGenerationImage />,
    miniDescription: '输入文字，即刻生成高清图像。Artificium Canvas提供30+艺术风格、10秒极速出图。设计师、营销人、内容创作者的AI画布，让想象力突破工具限制。',
    btnText: '开始生成',
  },
  // 赛博解梦
  'cyber-dream-interpretation': {
    label: '🛌 赛博解梦',
    type: '4',
    title: '「赛博解梦」 —— 用AI解码你的梦境密码',
    description: <CyberDreamInterpretation />,
    miniDescription: '输入梦境片段，AI解析深层隐喻。结合荣格原型理论与20万+文化符号数据库，提供心理映射、文化溯源、创意激发三重解读，让每个梦境都成为认识自我的钥匙。',
    btnText: '开始解梦',
  },
  'cyber-celebrity-resume': {
    label: '👔 名人简历',
    type: '5',
    title: '「名人简历」 —— 用AI生成名人简历',
    description: <CyberCelebrityResume />,
    miniDescription: '输入名人姓名，即刻生成 TA 的简历；了解 TA 的生平、成就、经历，以及 TA 的职业生涯和人生轨迹。',
    btnText: '开始生成',
  },
};