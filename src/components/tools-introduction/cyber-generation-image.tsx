import Image from 'next/image';
import GenerationImage1 from '@/assets/images/generation-image-example-1.png';
import GenerationImage2 from '@/assets/images/generation-image-example-2.png';
import GenerationImage3 from '@/assets/images/generation-image-example-3.png';
import GenerationImage4 from '@/assets/images/generation-image-example-4.png';

export default function CyberGenerationImage() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold">核心功能</p>
      <p className="font-bold">1. 文字转视觉化图像</p>
      <p>输入描述性文案（支持中/英/日等12种语言），AI自动解析场景细节</p>
      <p>提供「创意词库」与「风格提示器」，降低新手使用门槛</p>
      <p className="font-bold">2. 全场景艺术风格库</p>
      <p>涵盖数字绘画/3D渲染/复古胶片/水墨风等32种风格</p>
      <p>独创「风格融合模式」可叠加2-3种艺术效果</p>
      <p className="font-bold">3. 专业级图像优化</p>
      <p>智能修复模糊/噪点</p>
      <p className="text-lg font-bold">用户场景演示</p>
      <p>1. 电商广告设计</p>
      <p>极简北欧风客厅，落地窗外是雪山景观 → 生成产品背景图</p>
      <Image src={GenerationImage1} alt="Generation Image 1" />
      <p>2. 游戏场景设计</p>
      <p>赛博朋克风城市夜景，霓虹灯下有辆摩托车 → 生成游戏场景图</p>
      <Image src={GenerationImage2} alt="Generation Image 2" />
      <p>3. 影视概念图</p>
      <p>科幻电影场景，未来感十足 → 生成概念设计图</p>
      <Image src={GenerationImage3} alt="Generation Image 3" />
      <p>4. 艺术创作</p>
      <p>梵高画作风格，向日葵与星空交织 → 生成艺术作品</p>
      <Image src={GenerationImage4} alt="Generation Image 4" />
    </div>
  );
}