'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../@/lib/utils';

const Aside = () => {
  const pathname = usePathname();

  const activeNavItem = pathname.includes('customers') ? 1 : 0;

  return (
    <aside className="max-w-[200px] min-w-[200px] p-2 flex-grow  bg-black text-white flex flex-col gap-3 child:rounded-sm child:transition-all child:duration-150 child:ease-linear child:p-[2px_4px]">
      <Link
        href="/"
        className={cn('hover:text-black hover:bg-white', {
          'text-black bg-white': activeNavItem === 0,
        })}
      >
        Sales
      </Link>
      <Link
        href="/customers"
        className={cn('hover:text-black hover:bg-white', {
          'text-black bg-white': activeNavItem === 1,
        })}
      >
        Customers
      </Link>
    </aside>
  );
};
export default Aside;
