'use client';

import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Tabs() {
  const [page, setPage] = useState(0);
  const pages = [
    '/dashboard',
    '/dashboard/exchange',
    '/dashboard/market',
    '/dashboard/staking',
  ];
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (num: number) => {
    router.push(pages[num]);
    setPage(num);
  };

  useEffect(() => {
    if (pathname === '/dashboard') setPage(0);
    else if (pathname === '/dashboard/exchange') setPage(1);
    else if (pathname === '/dashboard/market') setPage(2);
    else setPage(3);
  }, [pathname]);
  return (
    <div role="tablist" className="tabs tabs-bordered">
      <button
        role="tab"
        className={clsx('tab', { 'tab-active': page === 0 })}
        onClick={() => navigate(0)}
      >
        Home
      </button>
      <button
        role="tab"
        className={clsx('tab', { 'tab-active': page === 1 })}
        onClick={() => navigate(1)}
      >
        Exchange
      </button>
      <button
        role="tab"
        className={clsx('tab', { 'tab-active': page === 2 })}
        onClick={() => navigate(2)}
      >
        Marketplace
      </button>
      <button
        role="tab"
        className={clsx('tab', { 'tab-active': page === 3 })}
        onClick={() => navigate(3)}
      >
        Staking
      </button>
    </div>
  );
}
