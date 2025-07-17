'use client';

import { formatBalance } from '@/lib/utils';
import { StakingPosition, NFTAccess } from '@/types';

interface DashboardProps {
  tokenBalance: string;
  stakingPositions: StakingPosition[];
  nftAccess: NFTAccess | null;
}

export default function Dashboard({ 
  tokenBalance, 
  stakingPositions, 
  nftAccess 
}: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Token Balance</h3>
        <div className="text-3xl font-bold text-purple-400 mb-2">
          {formatBalance(tokenBalance)} MURAT
        </div>
        <p className="text-gray-400">Aktueller Kontostand</p>
      </div>
      
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">Staking Positionen</h3>
        <div className="text-3xl font-bold text-green-400 mb-2">
          {stakingPositions.length}
        </div>
        <p className="text-gray-400">Aktive Stakes</p>
      </div>
      
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">NFT Access</h3>
        <div className="text-3xl font-bold text-yellow-400 mb-2">
          {nftAccess?.access_level || 'Loading...'}
        </div>
        <p className="text-gray-400">Zugriffslevel</p>
      </div>
    </div>
  );
}