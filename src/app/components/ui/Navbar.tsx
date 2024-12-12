'use client';

import { ConnectKitButton } from 'connectkit';
import { useRouter } from 'next/navigation';
import { useAccountEffect } from 'wagmi';

export function NavBar() {
  const router = useRouter();
  useAccountEffect({
    onConnect() {
      router.push('/dashboard');
    },
    onDisconnect() {
      router.push('/');
    },
  });
  return (
    <div className="flex bg-base-300 shadow-xl rounded-sm px-4">
      <div className="navbar">
        <div className="flex-1">
          <a className="btn text-xl font-bold">InDEX</a>
        </div>
        <div className="flex-none">
          <ConnectKitButton />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
