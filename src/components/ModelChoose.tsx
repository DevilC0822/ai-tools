import { models, type TModelList } from '@/config/models';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, cn } from '@heroui/react';
import MyTooltip from './MyTooltip';

type ModelChooseProps = {
  model: TModelList;
  dataSources: TModelList[];
  onChange: (model: TModelList) => void;
};

export default function ModelChoose(props: ModelChooseProps) {
  const { dataSources, model, onChange = () => {} } = props;
  const [currentModel, setCurrentModel] = useState(model);
  useEffect(() => {
    if (model !== currentModel) {
      setCurrentModel(model);
    }
  }, [model]);
  return (
    <div className='flex gap-2 flex-wrap w-full'>
      {(Object.keys(models) as TModelList[]).filter((key) => dataSources.includes(key)).sort((a, b) => dataSources.indexOf(a) - dataSources.indexOf(b)).map((key) => (
        <Card
          key={key}
          classNames={{
            base: cn(
              'w-[calc(20%-8px)] max-lg:w-[calc(33.33%-8px)] max-md:w-full cursor-pointer',
              currentModel === key && 'bg-linear-65 from-primary-100 to-primary/50',
            ),
            header: 'pb-0',
            body: 'pt-0',
          }}
          isPressable
          onPress={() => {
            setCurrentModel(key);
            onChange(key);
          }}
        >
          <CardHeader>
            <p className='text-lg font-bold line-clamp-1'>{models[key].label}</p>
          </CardHeader>
          <CardBody>
            <MyTooltip content={models[key].description} textEllipsis lineClamp={3}>
              {models[key].description}
            </MyTooltip>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
