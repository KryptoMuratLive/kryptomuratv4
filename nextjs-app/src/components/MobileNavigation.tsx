'use client';

interface MobileNavigationProps {
  isMobile: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileNavigation({ 
  isMobile, 
  activeTab, 
  setActiveTab 
}: MobileNavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'story', label: 'Bitcoin-Jagd', icon: '🎮' },
    { id: 'staking', label: 'Staking', icon: '🏦' },
    { id: 'streaming', label: 'Live Streaming', icon: '🎥' },
    { id: 'ai', label: 'AI Creator', icon: '🤖' },
    { id: 'nft', label: 'NFT Access', icon: '🎭' }
  ];

  if (!isMobile) {
    // Desktop Tab Navigation
    return (
      <div className="flex space-x-4 mb-8 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-purple-500/30 text-purple-400 border border-purple-500/50'
                : 'bg-black/20 text-gray-400 hover:bg-black/30'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Mobile Tab Indicator
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between bg-black/20 backdrop-blur-lg rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {activeTab === 'dashboard' ? '📊' : 
             activeTab === 'story' ? '🎮' :
             activeTab === 'staking' ? '🏦' :
             activeTab === 'streaming' ? '🎥' :
             activeTab === 'ai' ? '🤖' : '🎭'}
          </span>
          <span className="text-white font-semibold">
            {activeTab === 'dashboard' ? 'Dashboard' : 
             activeTab === 'story' ? 'Bitcoin-Jagd' :
             activeTab === 'staking' ? 'Staking' :
             activeTab === 'streaming' ? 'Live Streaming' :
             activeTab === 'ai' ? 'AI Creator' : 'NFT Access'}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          Swipe ← → für Navigation
        </div>
      </div>
    </div>
  );
}