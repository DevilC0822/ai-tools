import Image from 'next/image';
import EditPhoto1 from '@/assets/images/edit-photo-example-1.png';
import EditPhoto2 from '@/assets/images/edit-photo-example-2.png';
import EditPhoto3 from '@/assets/images/edit-photo-example-3.png';

export default function CyberPhotoEditing() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-bold">
        在数字美学与算法魔法碰撞的时代，&quot;赛博修图&quot;应运而生——这是一款由前沿AI大模型驱动的智能图像处理工具，将传统修图技术推进至量子跃迁式的新维度。我们以神经网络为画笔，以海量美学数据为调色盘，重新定义&quot;完美影像&quot;的生成逻辑。<br />
      </p>
      <p className="text-lg font-bold">用户场景演示</p>
      <p>1.人像精修</p>
      <p>上传自拍，AI自动优化曝光/肤色/构图，生成时尚杂志封面</p>
      <Image src={EditPhoto1} alt="Edit Photo 1" />
      <p>2.清晰度提升</p>
      <p>AI智能提升图像清晰度，细节更丰富，噪点更少</p>
      <Image src={EditPhoto2} alt="Edit Photo 2" />
      <p>3.证件照生成</p>
      <p>上传照片生成标准证件照</p>
      <Image src={EditPhoto3} alt="Edit Photo 3" />
    </div>
  );
}