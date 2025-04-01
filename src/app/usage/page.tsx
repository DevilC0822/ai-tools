'use client';
import { Card, CardHeader, CardBody, Table, Pagination, TableRow, TableCell, TableBody, TableColumn, TableHeader, addToast, Chip, Select, SelectItem, Button, Spinner } from '@heroui/react';
import { getOptions } from '@/utils/client';
import { useState, useEffect } from 'react';

type Usage = {
  id: string;
  type: string;
  model: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
  createTime: string;
}

const modelOptions = getOptions('model');
const toolOptions = getOptions('tool');

const defaultFilter = {
  type: toolOptions.map((option) => option.value),
  model: modelOptions.map((option) => option.value),
};

export default function UsagePage() {
  const [filter, setFilter] = useState(defaultFilter);
  const [usageList, setUsageList] = useState<Usage[]>([]);
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    size: 10,
    total: 1,
  });
  const [loading, setLoading] = useState(false);

  const onSearch = (params?: { [key: string]: string | number }) => {
    setLoading(true);
    fetch(`/api/usage?type=${filter.type}&model=${filter.model}&current=${params?.current ?? pageInfo.current}&size=${params?.size ?? pageInfo.size}`)
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          addToast({
            title: '错误',
            description: res.message,
            color: 'danger',
          });
          return;
        }
        setUsageList(res.data.records);
        setPageInfo({
          current: res.data.current,
          size: res.data.size,
          total: Math.ceil(res.data.total / res.data.size),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onReset = () => {
    setFilter(defaultFilter);
  };
  useEffect(() => {
    onSearch({ current: pageInfo.current, size: pageInfo.size });
  }, []);

  return (
    <div className="relative flex px-[8%] max-lg:px-6 max-md:px-4 mx-auto py-4 w-full min-h-[calc(100vh-64px)] max-md:flex-col">
      <Card className='w-full'>
        <CardHeader className='flex flex-col items-start w-full'>
          <p className='text-2xl font-bold'>使用统计</p>
          <div className="flex items-end gap-4 w-[80%] max-md:w-full max-md:flex-wrap mt-2">
            <div className='flex flex-col items-start gap-2 max-md:w-full mt-2'>
              <span className='text-nowrap'>工具</span>
              <Select
                selectionMode="multiple"
                className='w-[200px] max-md:w-full'
                color="secondary"
                aria-label="工具"
                size="sm"
                selectedKeys={filter.type}
                onChange={(e) => {
                  if (e.target.value === '') {
                    return;
                  }
                  setFilter({ ...filter, type: e.target.value.split(',') });
                }}
              >
                {toolOptions.map((option) => (
                  <SelectItem color="secondary" key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className='flex flex-col items-start gap-2 max-md:w-full'>
              <span className='text-nowrap'>模型</span>
              <Select
                selectionMode="multiple"
                className='w-[200px] max-md:w-full'
                color="secondary"
                aria-label="模型"
                size="sm"
                selectedKeys={filter.model}
                onChange={(e) => {
                  if (e.target.value === '') {
                    return;
                  }
                  setFilter({ ...filter, model: e.target.value.split(',') });
                }}
              >
                {modelOptions.map((option) => (
                  <SelectItem color="secondary" key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className='flex items-center gap-2 max-md:w-full'>
              <Button color="secondary" size="sm" onPress={() => onSearch()}>查询</Button>
              <Button color="secondary" size="sm" onPress={onReset}>重置</Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className='flex gap-4 flex-row max-md:flex-col flex-wrap'>
          <Table
            rowHeight={60}
            isStriped
            className="min-w-[880px]"
            aria-label="使用统计"
            bottomContent={
              <div className='flex justify-end mt-2'>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={pageInfo.current}
                  total={pageInfo.total}
                  boundaries={1}
                  onChange={(current) => onSearch({ current })}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn width={200} key="id">ID</TableColumn>
              <TableColumn width={140} key="type">工具</TableColumn>
              <TableColumn width={200} key="model">模型</TableColumn>
              <TableColumn width={120} key="usage">使用量</TableColumn>
              <TableColumn width={180} key="createTime">创建时间</TableColumn>
            </TableHeader>
            <TableBody isLoading={loading} loadingContent={<Spinner color="primary" label="Loading..." />}>
              {usageList?.map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell>{usage.id}</TableCell>
                  <TableCell>
                    {toolOptions.find((option) => option.value === usage.type)?.label}
                  </TableCell>
                  <TableCell>
                    <Chip
                      classNames={{
                        base: 'bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30 flex-inline',
                        content: 'drop-shadow shadow-black text-white',
                      }}
                      variant="shadow"
                    >
                      {usage.model}
                    </Chip>
                  </TableCell>
                  <TableCell>{Number(usage.usage.total_tokens).toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}</TableCell>
                  <TableCell>{usage?.createTime ?? ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}