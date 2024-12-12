'use client';

import { ReactNode } from 'react';
import queryClient from '../query';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

interface ConnectionProps {
  children: ReactNode;
}

export const Web3Provider = ({ children }: ConnectionProps) => {
  const config = createConfig(
    getDefaultConfig({
      chains: [hardhat],
      transports: {
        [hardhat.id]: http('http://localhost:8545'),
      },
      walletConnectProjectId: '734e52d2005cadccd4df1586ddf60766',
      appName: 'inDEX',
    })
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
