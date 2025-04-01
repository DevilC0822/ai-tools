import Image from 'next/image';
import biography1 from '@/assets/images/biography-example-1.png';
import biography2 from '@/assets/images/biography-example-2.png';

export default function CyberBiography() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold">当爱因斯坦的八字遇见牛顿的大运，达芬奇的流年碰撞李白的月令——
        这是一款用时间晶体算法重构人类群星闪耀时刻的认知革命工具</p>
      <p className="text-lg font-bold">核心功能：穿透历史迷雾的AI显微镜</p>
      <p>高光时刻热力图谱</p>
      <p>输入名人姓名，自动抓取2000+史料文献，用NLP提炼人生关键30节点</p>
      <p>星轨可视化</p>
      <p>用时间晶体算法重构历史人物的命运轨迹，生成3D星轨图</p>
      <p>命运算法</p>
      <p>用AI算法解码历史人物的「命运源代码」，生成命运报告</p>
      <p className="text-lg font-bold">用户场景演示</p>
      <p>1.历史人物命运分析</p>
      <p>输入「爱因斯坦」，生成他一生的大事记</p>
      <Image src={biography1} alt="biography1" />
      <p>2. 虚拟人物命运预测</p>
      <p>输入可莉，生成她在提瓦特大陆的命运轨迹</p>
      <Image src={biography2} alt="biography2" />
    </div>
  );
}