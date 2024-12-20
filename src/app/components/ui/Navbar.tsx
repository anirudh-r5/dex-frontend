'use client';

import { ConnectButton, RainbowKitProvider } from '@rainbow-me/rainbowkit';
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
    <RainbowKitProvider>
      <div className="flex bg-base-300 shadow-xl rounded-sm px-4">
        <div className="navbar">
          <div className="flex-1">
            <a className="btn text-xl font-bold">InDEX</a>
          </div>
          <div className="flex-none">
            <ConnectButton />
          </div>
        </div>
      </div>
    </RainbowKitProvider>
  );
}

export default NavBar;
