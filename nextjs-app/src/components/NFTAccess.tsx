'use client';

import { NFTAccess as NFTAccessType } from '@/types';

interface NFTAccessProps {
  nftAccess: NFTAccessType | null;
}

export default function NFTAccess({ nftAccess }: NFTAccessProps) {
  return (
    <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-xl font-semibold text-white mb-4">NFT Access Status</h3>
      
      {nftAccess ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${nftAccess.has_access ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-white">
              {nftAccess.has_access ? 'Zugang gewährt' : 'Kein Zugang'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Access Level</label>
              <div className="text-white font-semibold">{nftAccess.access_level}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">NFT Count</label>
              <div className="text-white font-semibold">{nftAccess.nft_count}</div>
            </div>
          </div>
          
          {!nftAccess.has_access && (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-400">
                Du benötigst NFTs um Zugang zu Premium-Features zu erhalten. 
                Besuche unseren NFT-Marketplace!
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400">Lade NFT-Status...</p>
      )}
    </div>
  );
}