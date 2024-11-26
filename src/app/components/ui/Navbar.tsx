'use client';

import { useSDK } from '@metamask/sdk-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ConnectWalletButton = () => {
  const { sdk, connecting } = useSDK();
  const [account, setAccount] = useState<string>();
  const router = useRouter();

  const connect = async () => {
    try {
      const accounts = await sdk.connect();
      setAccount(accounts?.[0]);
      router.push('/dashboard');
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
      setAccount('');
      router.push('/');
    }
  };

  return (
    <div className="relative">
      {account ? (
        <button onClick={disconnect} className="btn btn-outline btn-warning">
          Disconnect
        </button>
      ) : (
        <button
          className="btn btn-outline btn-success"
          disabled={connecting}
          onClick={connect}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export function NavBar() {
  return (
    <div className="flex bg-base-300 shadow-xl rounded-sm px-4">
      <div className="navbar">
        <div className="flex-1">
          <a className="btn text-xl font-bold">InDEX</a>
        </div>
        <div className="flex-none">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
