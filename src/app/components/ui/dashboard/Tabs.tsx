'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Tabs() {
  const [page, setPage] = useState(0);
  const router = useRouter();

  const navigate = (num: number) => {
    switch (num) {
      case 0:
        router.push('/dashboard');
        break;
      case 1:
        router.push('/dashboard/exchange');
        break;
      case 2:
        router.push('/dashboard/market');
        break;
      case 3:
        router.push('/dashboard/staking');
        break;
      default:
        break;
    }
    setPage(num);
  };
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
