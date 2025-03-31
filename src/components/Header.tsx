'use client';
import React from 'react';
import { menus } from '@/config/menus';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  cn,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';

type HeaderProps = {
  className?: string;
}

const AppIcon = () => {
  return (
    <div className="flex items-center gap-2 w-[200px]">
      <Icon icon="fluent-color:wrench-16" className="text-2xl" />
      <span className="text-lg font-bold ml-2 text-nowrap">AI Tool</span>
    </div>
  );
};
const Header = ({ className = '' }: HeaderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentPath = usePathname();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    window.localStorage.setItem('theme', newTheme);
  };
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex justify-between items-center gap-4 w-full px-[8%] max-lg:px-6 max-md:px-4 h-16 fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
        <AppIcon />
        <Button
          isIconOnly
          variant="light"
          className="text-2xl hidden max-md:block"
          onPress={onOpen}
        >
          <Icon icon="line-md:align-justify" />
        </Button>
        <div className="flex justify-center items-center gap-2 w-full max-md:hidden">
          {
            menus.filter((menu) => !menu.isExternal).map((menu) => (
              <Button
                key={menu.key}
                variant={currentPath.startsWith(`/${menu.key}`) ? 'solid' : 'light'}
                className="text-sm"
                as={NextLink}
                href={`/${menu.key}`}
                color='primary'
              >
                {menu.title}
              </Button>
            ))
          }
        </div>
        <div className="w-[200px] flex justify-end items-center gap-2 max-md:hidden">
          <Button
            variant="light"
            color='primary'
            className="text-2xl"
            onPress={toggleTheme}
            radius="full"
            isIconOnly
          >
            <Icon icon={theme === 'light' ? 'solar:sun-line-duotone' : 'solar:moon-stars-broken'} />
          </Button>
          <Button
            variant="light"
            color='primary'
            className="text-2xl"
            as={NextLink}
            href="https://github.com/DevilC0822/ai-tools"
            target="_blank"
            radius="full"
            isIconOnly
          >
            <Icon icon="ant-design:github-outlined" />
          </Button>
        </div>
      </div>

      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerContent>
          <DrawerHeader>
            <AppIcon />
          </DrawerHeader>
          <DrawerBody>
            <div className='flex flex-col gap-2'>
              {
                menus.map((menu) => (
                  <Button
                    color='primary'
                    key={menu.key}
                    variant={currentPath === `/${menu.key}` ? 'solid' : 'light'}
                    as={NextLink}
                    target={menu.isExternal ? '_blank' : undefined}
                    href={menu.isExternal ? menu.key : `/${menu.key}`}
                    className="text-sm"
                    startContent={<Icon icon={menu.icon} fontSize={18} />}
                  >
                    <div className='flex items-center justify-start w-[100px]'>
                      <span className='mr-1'>{menu.title}</span>
                      {menu.isExternal ? <Icon icon="line-md:external-link" /> : null}
                    </div>
                  </Button>
                ))
              }
              <Button
                variant="light"
                color='primary'
                className="text-sm"
                onPress={toggleTheme}
                startContent={<Icon icon={theme === 'light' ? 'solar:sun-line-duotone' : 'solar:moon-stars-broken'} fontSize={18} />}
              >
                <span className='w-[100px] text-left'>{theme === 'light' ? '暗黑' : '亮色'}</span>
              </Button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Header;
