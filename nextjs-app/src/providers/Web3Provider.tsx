'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '4d6552f8a5d85b900455fb644bab328e';

// 2. Set chains
const polygon = {
  chainId: 137,
  name: 'Polygon',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com',
  rpcUrl: 'https://polygon-rpc.com'
};

// 3. Create a metadata object
const metadata = {
  name: 'KryptoMurat',
  description: 'Web3 Platform for Bitcoin Hunt Adventure',
  url: 'https://kryptomurat.vercel.app',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,
  /*Optional*/
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://polygon-rpc.com',
  defaultChainId: 137,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [polygon],
  projectId,
  enableAnalytics: true,
});

// Create a client
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}