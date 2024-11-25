'use client';

import { useSDK, MetaMaskProvider } from '@metamask/sdk-react';
import { useState } from 'react';
export const ConnectWalletButton = () => {
  const { sdk, connected, connecting } = useSDK();
  const [account, setAccount] = useState<string>();

  const connect = async () => {
    try {
      const accounts = await sdk.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  return (
    <div className="relative">
      {account ? (
        <button onClick={disconnect} className="btn">
          Disconnect
        </button>
      ) : (
        <button className="btn" disabled={connecting} onClick={connect}>
          Connect
        </button>
      )}
    </div>
  );
};

export const NavBar = () => {
  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: 'Next-Metamask-Boilerplate',
      url: 'http://localhost:3000', // using the host constant defined above
    },
  };

  return (
    <div className="navbar">
      <div className="flex-none">
        <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
          <ConnectWalletButton />
        </MetaMaskProvider>
      </div>
    </div>
  );
};

export default NavBar;
