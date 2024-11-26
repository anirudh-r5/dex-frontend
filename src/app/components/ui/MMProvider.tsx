'use client';

import { MetaMaskProvider } from '@metamask/sdk-react';
import { ReactNode } from 'react';

interface NavBarProps {
  children: ReactNode;
}

export function MMProvider({ children }: NavBarProps) {
  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: 'Next-Metamask-Boilerplate',
      url: 'http://localhost:3000',
    },
  };

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      {children}
    </MetaMaskProvider>
  );
}

export default MMProvider;
