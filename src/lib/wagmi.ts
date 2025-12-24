import { http, createConfig } from 'wagmi';
import { defineChain } from 'viem';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const sepolia = defineChain({
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://eth-sepolia.public.blastapi.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'Bonsai Zen',
  projectId: 'bonsai-zen-demo', // Replace with your WalletConnect project ID
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.public.blastapi.io'),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
