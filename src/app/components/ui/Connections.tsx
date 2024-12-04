'use client';

import { ReactNode } from 'react';
import { mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import queryClient from '../query';
import { WagmiProvider } from 'wagmi';
import { type Chain } from 'viem';
import { QueryClientProvider } from '@tanstack/react-query';

interface NavBarProps {
  children: ReactNode;
}

const hardhat = {
  id: 31337,
  name: 'Hardhat',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['http://localhost:8545'] } },
  testnet: true,
} as const satisfies Chain;

export function Connections({ children }: NavBarProps) {
  const config = getDefaultConfig({
    appName: 'InDEX',
    projectId: 'INDEX',
    chains: [mainnet, sepolia, hardhat],
    ssr: true,
  });

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Connections;
