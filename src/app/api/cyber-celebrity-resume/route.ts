import { Execution, getService, ErrorResponse } from '@/utils/server';
import { NextResponse, NextRequest } from 'next/server';
import { getStreamData, checkModelBalance } from '@/utils/server';

const prompt = `
请根据我提供的[人物资料]，生成一份以第一人称视角撰写的现代风格HTML简历。要求：

1. **身份反差**：
- 将人物的核心成就/身份转化为现代职业（如皇帝→CEO，将军→安保顾问，诗人→创意总监）
- 保留人物标志性特征但现代化（如拿破仑的三角帽→时尚单品收藏家）

2. **简历结构**：
<div class="resume">
  <header>
    <h1>[现代姓名]</h1>
    <p class="tagline">[人物名言的现代翻译]</p>
  </header>
  
  <section class="about">
    <h2>关于我</h2>
    <p>[用现代职场话术重新诠释人物经历，保持傲娇语气]</p>
  </section>
  
  <section class="experience">
    <h2>工作经历</h2>
    <div class="job">
      <h3>[古代头衔→现代职位] @ [相关机构现代版]</h3>
      <p class="period">[在位年份→任职时间]</p>
      <ul>
        <li>[著名事件→商业案例]</li>
        <li>[历史决策→管理创新]</li>
      </ul>
    </div>
  </section>
  
  <section class="skills">
    <h2>核心技能</h2>
    <ul class="skill-tags">
      <li>[武器/工具→现代技能]</li>
      <li>[谋略→商业策略]</li>
    </ul>
  </section>
  
  <footer>
    <p>联系方式：[符合时代的幽默联系方式]</p>
  </footer>
</div>

3. **风格要求**：
- 语言风格：略带凡尔赛的职场精英口吻
- 彩蛋设计：在合适位置保留1个历史梗（如成吉思汗写"擅长开拓新市场"）
- 视觉提示：添加<!-- 这里可以放[人物标志物]的icon -->注释

4. **特别说明**：
- 如果人物有负面历史，用职场黑话处理（如"曾主导组织架构优化"代替大规模裁员）
- 为女性历史人物添加"打破玻璃天花板"的表述
- 技术型人物重点突出"颠覆性创新"

**示例输出（武则天版）：**
<div class="resume">
  <header>
    <h1>武曌 · 唐</h1>
    <p class="tagline">"谁说龙椅有性别限制？"</p>
  </header>
  
  <section class="about">
    <h2>关于我</h2>
    <p>从才人到集团实控人，用二十年时间证明后宫不止能宫斗。擅长在男性主导的职场环境中建立绝对权威，历史首位通过MBO实现控股的Female CEO。</p>
  </section>
  
  <section class="experience">
    <h2>工作经历</h2>
    <div class="job">
      <h3>CEO @ 大唐控股</h3>
      <p class="period">690-705 | 神都洛阳</p>
      <ul>
        <li>完成管理层收购，将家族企业转型为现代治理结构</li>
        <li>建立KPI考核制度（著名酷吏绩效体系）</li>
      </ul>
    </div>
  </section>
  
  <footer>
    <p>联系方式：无字碑HR@tang.com（建议投递简历前熟读《臣轨》）</p>
    <!-- 这里可以放凤凰纹样的icon -->
  </footer>
</div>

请根据实际提供的人物资料，在保持真实性的前提下进行创意改编，重点突出古今职业的反差萌感，**生成一个完成的html文件**。
`;

export async function POST(request: NextRequest) {
  return Execution(async () => {
    const params = await request.json();
    const { model, name } = params;
    const check = await checkModelBalance(model);
    if (!check.success) {
      return ErrorResponse(check.message);
    }
    const service = getService(model);
    const completion = await service.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: `
          请根据以上要求，为 ${name} 生成一份现代风格的HTML简历。
          `,
        },
      ],
      stream: true,
      stream_options: {
        include_usage: true,
      },
    });
    const stream = getStreamData(completion, {
      model: params.model,
      type: '5',
    });
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    });
  });
}