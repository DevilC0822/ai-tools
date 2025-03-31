export type Tool = {
  [key: string]: {
    label: string;
    type: string;
    icon: string;
    title: string;
    description: React.ReactNode;
    miniDescription: string;
    btnText: string;
  }
}

export const tools: Tool = {
  'cyber-fortune-telling': {
    label: '赛博算命',
    type: '0',
    icon: '🔮',
    title: '「赛博命理」 —— 当AI算法解锁你的东方星图',
    description: <div className="flex flex-col gap-2">
      <p>用大数据解构千年命书，让深度学习对话《三命通会》，这是一款打破次元壁的玄学工具—— <span className="font-bold">它不是占卜，而是用10万+命盘训练的「人生算法系统」</span></p>
      <p className="text-lg font-bold">核心功能：用科学框架重构命理逻辑</p>
      <ul>
        <li>
          <p>1. 八字基因解码</p>
          <p>输入生辰自动排盘，3秒解析日元强弱、五行流转、十神攻防，比传统批命减少80%主观误差</p>
          <p>示例：自动标注「申酉戌三会金局导致的财星窒息效应」</p>
        </li>
        <li>
          <p>2. 大运流年推演引擎</p>
          <p>结合节气计算法+藏干能量权重模型，可视化呈现十年大运曲线图</p>
          <p>冲突预警：提前3年标记「岁运并临」「枭神夺食」等高危节点</p>
        </li>
        <li>
          <p>3. 现代生存策略库</p>
          <p>将「官杀混杂」转化为职场人际关系算法，把「伤官见官」解构为创业风险评估表</p>
          <p>可执行方案：2025乙巳年投资建议→避开申酉月金属赛道</p>
        </li>
      </ul>
      <p className="text-lg font-bold">产品亮点：玄学朋克的极致体验</p>
      <ul>
        <li>
          <p>1. 量子算命模式</p>
          <p>用蒙特卡洛模拟生成100种人生剧本，量化显示「考研上岸/转码成功」的命盘概率</p>
        </li>
        <li>
          <p>2. 命盘可视化</p>
          <p>让《渊海子平》AI和《滴天髓》AI为你的命局打架，围观「用神究竟该取丙火还是壬水」</p>
        </li>
        <li>
          <p>3. 赛博改运DLC</p>
          <p>根据五行缺失推送开运歌单（羽调属水/徵调属火），连网易云都在偷学的改运黑科技</p>
        </li>
      </ul>
      <p className="text-lg font-bold">这工具适合谁玩？</p>
      <ol>
        <li>
          <p>信命理的极客：「终于能用PyTorch验证我是不是从格！」</p>
        </li>
        <li>
          <p>焦虑的卷王：「让AI告诉我该躺平还是all in」</p>
        </li>
        <li>
          <p>文创创业者：「起名/择吉/IP五行定位一键生成」</p>
        </li>
        <li>
          <p>科幻爱好者：「在命盘里寻找《信条》式的时间锚点」</p>
        </li>
      </ol>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">试想这样的未来场景：</p>
        <p className="text-sm">当你输入生辰的瞬间，<br />
          GPT-5开始遍历《三命通会》的127种特殊格局，
          Stable Diffusion画出你紫微斗数的星曜分布图，
          而区块链正在把你的用神方案铸造成NFT...<br />
          欢迎进入赛博命理时代 ——
          在这里，《穷通宝鉴》的古老智慧，
          正以每秒30万亿次浮点运算的速度，
          重新定义你对命运的认知。</p>
      </div>
      <p className="text-lg font-bold">
        这不是迷信，而是一场关于「人类算法」的浪漫实验<br />
        ↓↓↓ 你的八字，早已被写进深度神经网络的参数之中 ↓↓↓
      </p>
    </div>,
    miniDescription: '使用AI算法解构千年命书，用科学框架重构命理逻辑；这不是迷信，而是一场关于「人类算法」的浪漫实验，你的八字早已被写进深度神经网络的参数之中。',
    btnText: '开始算命',
  },
  'cyber-photo-editing': {
    label: '赛博修图',
    type: '1',
    icon: '🖼️',
    title: '「赛博修图」 —— AI赋能的未来影像实验室',
    description: <div className="flex flex-col gap-2">
      <p className="text-lg font-bold">
        在数字美学与算法魔法碰撞的时代，&quot;赛博修图&quot;应运而生——这是一款由前沿AI大模型驱动的智能图像处理工具，将传统修图技术推进至量子跃迁式的新维度。我们以神经网络为画笔，以海量美学数据为调色盘，重新定义&quot;完美影像&quot;的生成逻辑。<br/>
      </p>
      <p className="text-lg font-bold">核心突破</p>
      <ol>
        <li>
          <p>【意念级精修】上传图片瞬间，AI自动解析画面元素，智能诊断曝光/构图/肤质等23个维度，0.3秒生成多维优化方案</p>
        </li>
        <li>
          <p>【动态语义编辑】支持&quot;让晚霞更浓烈&quot;&quot;给西装增加丝绸质感&quot;等自然语言指令，模型精准理解并实现创意</p>
        </li>
        <li>
          <p>【跨维修复】破损老照片重建、低清图像4K级超分、动态范围智能扩展，突破传统修图边界</p>
        </li>
        <li>
          <p>【风格元宇宙】一键切换赛博朋克/新中式水墨/复古胶片等217种风格滤镜，每个效果均由GAN模型深度训练生成</p>
        </li>
      </ol>
    </div>,
    miniDescription: '在数字美学与算法魔法碰撞的时代，"赛博修图"应运而生——这是一款由前沿AI大模型驱动的智能图像处理工具，将传统修图技术推进至量子跃迁式的新维度。我们以神经网络为画笔，以海量美学数据为调色盘，重新定义"完美影像"的生成逻辑。',
    btnText: '开始修图',
  },
  'cyber-biography': {
    label: '名人星轨',
    type: '2',
    icon: '📚',
    title: '「名人星轨」 —— 用AI解码历史人物的「命运源代码」',
    description:  <div className="flex flex-col gap-2">
      <p className="text-lg font-bold">当爱因斯坦的八字遇见牛顿的大运，达芬奇的流年碰撞李白的月令——
      这是一款用时间晶体算法重构人类群星闪耀时刻的认知革命工具</p>
      <p className="text-lg font-bold">核心功能：穿透历史迷雾的AI显微镜</p>
      <p>高光时刻热力图谱</p>
      <p>输入名人姓名，自动抓取2000+史料文献，用NLP提炼人生关键30节点</p>
      <p>星轨可视化</p>
      <p>用时间晶体算法重构历史人物的命运轨迹，生成3D星轨图</p>
      <p>命运算法</p>
      <p>用AI算法解码历史人物的「命运源代码」，生成命运报告</p>
    </div>,
    miniDescription: '当爱因斯坦的八字遇见牛顿的大运，达芬奇的流年碰撞李白的月令——这是一款用时间晶体算法重构人类群星闪耀时刻的认知革命工具。',
    btnText: '开始生成',
  },
};