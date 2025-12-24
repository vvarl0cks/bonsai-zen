import { http, createConfig } from 'wagmi';
import { defineChain } from 'viem';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

import { sepolia } from 'viem/chains';

export const config = getDefaultConfig({
  appName: 'Bonsai Zen',
  projectId: 'bonsai-zen-demo', // Replace with your WalletConnect project ID
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://rpc.sepolia.org'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
