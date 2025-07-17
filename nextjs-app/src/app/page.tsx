'use client';

import { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/ethers/react';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { BrowserProvider } from 'ethers';
import axios from 'axios';
import { formatAddress, formatBalance, getAPYForDuration } from '@/lib/utils';
import { WalletData, StakingPosition, NFTAccess as NFTAccessType } from '@/types';
import Dashboard from '@/components/Dashboard';
import StoryGame from '@/components/StoryGame';
import StakingPanel from '@/components/StakingPanel';
import StreamingPanel from '@/components/StreamingPanel';
import AICreator from '@/components/AICreator';
import NFTAccessPanel from '@/components/NFTAccess';
import MobileNavigation from '@/components/MobileNavigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export default function Home() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);
  const [nftAccess, setNftAccess] = useState<NFTAccessType | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      connectWallet();
      loadUserData();
    }
  }, [isConnected, address]);

  const connectWallet = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      
      // Store connection in backend
      await axios.post(`${API_BASE}/api/wallet/connect`, {
        wallet_address: address,
        chain_id: 137
      });
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!address) return;
    
    try {
      // Load token balance
      const balanceResponse = await axios.get(`${API_BASE}/api/wallet/balance/${address}`);
      if (balanceResponse.data.success) {
        setTokenBalance(balanceResponse.data.data.balance);
      }
      
      // Load staking positions
      const stakingResponse = await axios.get(`${API_BASE}/api/staking/positions/${address}`);
      if (stakingResponse.data.success) {
        setStakingPositions(stakingResponse.data.data);
      }
      
      // Load NFT access
      const nftResponse = await axios.get(`${API_BASE}/api/nft/access/${address}`);
      if (nftResponse.data.success) {
        setNftAccess(nftResponse.data.data);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const createStakingPosition = async (amount: string, durationDays: number) => {
    if (!address || !amount) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/api/staking/create`, {
        wallet_address: address,
        amount: amount,
        duration_days: durationDays
      });
      
      if (response.data.success) {
        await loadUserData();
        return { success: true, message: 'Staking-Position erfolgreich erstellt!' };
      }
      
      return { success: false, message: 'Fehler beim Erstellen der Staking-Position' };
    } catch (error) {
      console.error('Error creating staking position:', error);
      return { success: false, message: 'Fehler beim Erstellen der Staking-Position' };
    } finally {
      setLoading(false);
    }
  };

  const generateAIContent = async (prompt: string, contentType: string) => {
    if (!address || !prompt) return;
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/api/ai/generate`, {
        prompt,
        content_type: contentType,
        wallet_address: address
      });
      
      if (response.data.success) {
        return { success: true, content: response.data.data.content };
      }
      
      return { success: false, message: 'Fehler beim Generieren des AI-Contents' };
    } catch (error) {
      console.error('Error generating AI content:', error);
      return { success: false, message: 'Fehler beim Generieren des AI-Contents' };
    } finally {
      setLoading(false);
    }
  };

  // Touch handlers for swipe navigation
  const [swipeStartX, setSwipeStartX] = useState(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const swipeEndX = e.changedTouches[0].clientX;
    const swipeDistance = swipeStartX - swipeEndX;
    
    if (Math.abs(swipeDistance) > 50) {
      const tabs = ['dashboard', 'story', 'staking', 'streaming', 'ai', 'nft'];
      const currentIndex = tabs.indexOf(activeTab);
      
      if (swipeDistance > 0 && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      } else if (swipeDistance < 0 && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
         onTouchStart={handleTouchStart}
         onTouchEnd={handleTouchEnd}>
      
      <Header 
        isConnected={isConnected}
        address={address}
        tokenBalance={tokenBalance}
        onConnectWallet={() => open()}
        loading={loading}
        isMobile={isMobile}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="container mx-auto px-4 py-4 md:py-8">
        {!isConnected ? (
          <div className="text-center py-10 md:py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Willkommen bei<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  KryptoMurat
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
                Die ultimative Web3-Plattform mit gamifizierten Creator-Ökosystem! Spiele "Jagd auf den Bitcoin", 
                stake MURAT Token, streame live und generiere AI-Content. Alles mit NFT-Integration!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 px-4">
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-purple-500/20">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-4">🪙</div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">MURAT Token</h3>
                  <p className="text-sm md:text-base text-gray-400">Stake deine Token für bis zu 8% APY mit verschiedenen Laufzeiten</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-purple-500/20">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-4">🎥</div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Live Streaming</h3>
                  <p className="text-sm md:text-base text-gray-400">Schaue exklusive Streams und erstelle eigene Inhalte</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-purple-500/20">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-4">🤖</div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">AI Content</h3>
                  <p className="text-sm md:text-base text-gray-400">Generiere Memes, Comics und Stories mit KI-Unterstützung</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-purple-500/20">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-4">🎮</div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">Jagd auf den Bitcoin</h3>
                  <p className="text-sm md:text-base text-gray-400">Spiele das epische Adventure-Game und folge dem Bitcoin-Jäger</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-4 md:p-6 border border-purple-500/20">
                  <div className="text-2xl md:text-3xl mb-2 md:mb-4">🎭</div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">NFT Access</h3>
                  <p className="text-sm md:text-base text-gray-400">Erhalte Zugang zu exklusiven Inhalten und Premium-Features</p>
                </div>
              </div>
              
              <button
                onClick={() => open()}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl text-lg md:text-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Verbinde...' : 'Abenteuer Starten'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <MobileNavigation 
              isMobile={isMobile}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            {activeTab === 'dashboard' && (
              <Dashboard 
                tokenBalance={tokenBalance}
                stakingPositions={stakingPositions}
                nftAccess={nftAccess}
              />
            )}

            {activeTab === 'story' && (
              <StoryGame 
                address={address}
                apiBase={API_BASE}
              />
            )}

            {activeTab === 'staking' && (
              <StakingPanel 
                onCreatePosition={createStakingPosition}
                stakingPositions={stakingPositions}
                loading={loading}
              />
            )}

            {activeTab === 'streaming' && (
              <StreamingPanel 
                address={address}
                apiBase={API_BASE}
                loading={loading}
              />
            )}

            {activeTab === 'ai' && (
              <AICreator 
                onGenerateContent={generateAIContent}
                loading={loading}
              />
            )}

            {activeTab === 'nft' && (
              <NFTAccess 
                nftAccess={nftAccess}
              />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}