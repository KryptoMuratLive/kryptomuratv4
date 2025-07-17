'use client';

import { useState } from 'react';
import { StakingPosition } from '@/types';
import { getAPYForDuration } from '@/lib/utils';

interface StakingPanelProps {
  onCreatePosition: (amount: string, durationDays: number) => Promise<{ success: boolean; message: string }>;
  stakingPositions: StakingPosition[];
  loading: boolean;
}

export default function StakingPanel({ 
  onCreatePosition, 
  stakingPositions, 
  loading 
}: StakingPanelProps) {
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakeDuration, setStakeDuration] = useState(30);

  const handleCreatePosition = async () => {
    if (!stakeAmount || !stakeDuration) {
      alert('Bitte gib einen Betrag und eine Laufzeit an.');
      return;
    }
    
    const result = await onCreatePosition(stakeAmount, stakeDuration);
    if (result.success) {
      alert(result.message);
      setStakeAmount('');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Staking Form */}
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-semibold text-white mb-4">Neue Staking-Position</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Betrag</label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="100"
              className="w-full bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Laufzeit</label>
            <select
              value={stakeDuration}
              onChange={(e) => setStakeDuration(Number(e.target.value))}
              className="w-full bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value={30}>30 Tage (2% APY)</option>
              <option value={90}>90 Tage (4% APY)</option>
              <option value={180}>180 Tage (6% APY)</option>
              <option value={360}>360 Tage (8% APY)</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleCreatePosition}
              disabled={loading || !stakeAmount}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Erstelle...' : 'Stake erstellen'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Staking Positions */}
      <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-semibold text-white mb-4">Deine Staking-Positionen</h3>
        
        {stakingPositions.length === 0 ? (
          <p className="text-gray-400">Keine Staking-Positionen vorhanden.</p>
        ) : (
          <div className="space-y-3">
            {stakingPositions.map((position, index) => (
              <div key={index} className="bg-black/40 rounded-lg p-4 border border-gray-600">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">{position.amount} MURAT</div>
                    <div className="text-sm text-gray-400">{position.duration_days} Tage • {position.apy}% APY</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{position.status}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(position.end_date).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}