import { models } from '@/config/models';
import { tools } from '@/config/tools';

export const getOptions = (type: string) => {
  switch (type) {
    case 'model':
      return Object.keys(models).map((model) => ({
        label: models[model].label,
        value: model,
      }));
    case 'tool':
      return Object.keys(tools).map((tool) => ({
        label: tools[tool].label,
        value: tools[tool].type,
      }));
    default:
      return [];
  }
};

// 判断是否是移动端设备 使用 navigator.userAgent 判断
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * string example
<thinking>嗯，用户让我总结蔡徐坤的10个重要事件，按照给定的JSON格式。首先，我需要确认所有字段都是中文的，特别是那些字符串类型的。用户还特别说明了每个描述的字数限制，比如个人简介要100字左右，时间线里的每个描述大约50字。

首先，我得收集蔡徐坤的基本信息，比如姓名、性别、类型。姓名和性别应该没问题，类型的话可能需要归类，比如“歌手、演员、音乐制作人”之类的。个人简介需要涵盖他的主要成就和特点，比如他的出道经历、代表作、获得的荣誉等，确保在100字左右。

接下来是时间线部分，要找出他生涯中的10个关键事件。从2012年参加《向上吧！少年》开始，这是他早期的曝光。然后是2015年参加《星动亚洲》，这对他后来的发展很重要。2018年的《偶像练习生》夺冠并加入NINE PERCENT应该是重点事件。之后每年的重要活动，比如首张EP、综艺节目、巡回演唱会、公益活动、担任导师、音乐获奖、影视作品，以及2023年的个人巡回演唱会，这些都需要涵盖进去。

需要注意的是每个事件的年份、标题和描述，描述要简洁，大约50字。要确保没有遗漏重要节点，并且时间顺序正确。可能还需要验证某些事件的具体年份，比如他的公益活动时间和音乐奖项的具体时间，避免错误。

另外，用户可能希望这些事件能展示蔡徐坤的多方面发展，不仅是音乐，还有综艺、公益和影视。所以在选择事件时，要平衡各个领域的成就。同时，确保时间线中的事件之间有连贯性，展示他的成长轨迹。

最后，检查JSON结构是否符合要求，字段是否正确使用中文，字数是否符合限制，特别是个人简介和时间线描述。可能需要调整用词，确保简洁明了，同时信息准确。如果有不确定的细节，可能需要快速查阅可靠资料确认，比如蔡徐坤的维基页面或权威媒体报道，确保数据的准确性。</thinking>```json
{
  "name": "蔡徐坤",
  "gender": "男",
  "type": "歌手、演员、音乐制作人",
  "profile": "蔡徐坤，1998年8月2日出生于浙江温州，中国内地男歌手、演员及音乐制作人。2018年因参加选秀节目《偶像练习生》以第一名成绩加入NINE PERCENT组合正式出道。其音乐风格融合流行与电子元素，代表作《Wait Wait Wait》《情人》等屡获奖项。他积极参与综艺节目和公益事业，同时涉足影视领域，以全能艺人和时尚偶像形象备受关注。",
  "timeline": [
    {
      "year": "2012",
      "title": "首次亮相综艺节目",
      "description": "参加湖南卫视《向上吧！少年》进入全国200强，首次进入公众视野。"
    },
    {
      "year": "2015",
      "title": "赴韩参加选秀",
      "description": "参与中韩合作选秀节目《星动亚洲》，展现唱跳实力，积累早期粉丝基础。"
    },
    {
      "year": "2018",
      "title": "《偶像练习生》夺冠",
      "description": "以最高票数C位出道，成为NINE PERCENT队长，开启顶流偶像之路。"
    },
    {
      "year": "2018",
      "title": "首张个人EP发布",
      "description": "推出首张EP《1》，主打曲《Pull Up》登顶多个音乐榜单。"
    },
    {
      "year": "2019",
      "title": "担任《青春有你2》导师",
      "description": "以青春制作人代表身份指导练习生，专业表现获广泛好评。"
    },
    {
      "year": "2020",
      "title": "原创单曲《情人》爆红",
      "description": "《情人》获年度金曲奖，舞台表演掀起全网翻跳热潮。"
    },
    {
      "year": "2021",
      "title": "首场个人巡回演唱会",
      "description": "启动“迷”巡回演唱会，展现成熟舞台掌控力与高规格制作水准。"
    },
    {
      "year": "2021",
      "title": "跨界影视领域",
      "description": "主演电影《我和我的青春》，首次尝试大银幕作品。"
    },
    {
      "year": "2022",
      "title": "获得国际音乐奖项",
      "description": "凭《Hug Me》获MTV欧洲音乐奖“最佳中国艺人”，国际影响力提升。"
    },
    {
      "year": "2023",
      "title": "公益项目推进",
      "description": "发起“葵计划”儿童公益项目，捐赠多所音乐教室，聚焦青少年美育发展。"
    }
  ]
}
```[DONE]
 */

export const parseReadableStream = async (stream: ReadableStream<Uint8Array<ArrayBufferLike>>, options: {
  output?: 'text' | 'json';
  onStart?: () => void; // 开始
  onEnd?: () => void; // 结束
  onchange?: (thinking: string, result: string) => void;
  onThinkingStart?: () => void; // 思考开始
  onThinkingEnd?: () => void; // 思考结束
  onResult?: (thinking: string, result: string | Record<string, unknown>) => void; // 结果
}) => {
  const { output = 'text', onStart = () => {}, onEnd = () => {}, onThinkingStart = () => {}, onThinkingEnd = () => {}, onchange = () => {}, onResult = () => {} } = options;
  const reader = stream?.getReader();
  const decoder = new TextDecoder();
  let isReasoning = false;
  let thinking = '';
  let content = '';
  onStart();
  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;
    const text = decoder.decode(value);
    console.log(text);
    if (text.includes('<thinking>')) {
      isReasoning = true;
      onThinkingStart();
      continue;
    }
    if (text.includes('</thinking>')) {
      isReasoning = false;
      onThinkingEnd();
      continue;
    }
    if (text.includes('[DONE]')) {
      let result = content;
      console.log('result', result);
      
      if (output === 'json') {
        // 取出 ```json 和 ``` 之间的内容
        const jsonContent = result.match(/```json\s*([\s\S]*?)\s*```/)?.[1] || '';
        try {
          result = JSON.parse(jsonContent);
        } catch (error) {
          console.error(error);
        }
      }
      onResult(thinking, result);
      onEnd();
      break;
    }
    if (isReasoning) {
      thinking += text;
    } else {
      content += text;
    }
    onchange(thinking, content);
  }
};