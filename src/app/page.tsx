import { redirect } from 'next/navigation';
import { menus } from '@/config/menus';

export default function Home() {
  redirect(menus[0].key);
}
