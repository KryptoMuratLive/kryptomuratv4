import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Web3 Configuration
const WALLETCONNECT_PROJECT_ID = "4d6552f8a5d85b900455fb644bab328e";
const POLYGON_CHAIN_ID = 137;

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0");
  const [stakingPositions, setStakingPositions] = useState([]);
  const [nftAccess, setNftAccess] = useState(null);
  const [aiContent, setAiContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeDuration, setStakeDuration] = useState(30);
  const [aiPrompt, setAiPrompt] = useState("");
  const [contentType, setContentType] = useState("meme");

  // Web3 Setup
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await loadUserData(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setLoading(true);
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Switch to Polygon network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }] // Polygon mainnet
          });
        } catch (switchError) {
          // Network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                chainName: 'Polygon Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }]
            });
          }
        }
        
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        
        // Store connection in backend
        await axios.post(`${API}/wallet/connect`, {
          wallet_address: accounts[0],
          chain_id: POLYGON_CHAIN_ID
        });
        
        await loadUserData(accounts[0]);
        
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Fehler beim Verbinden der Wallet: ' + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert('MetaMask ist nicht installiert. Bitte installiere MetaMask um fortzufahren.');
    }
  };

  const loadUserData = async (address) => {
    try {
      // Load token balance
      const balanceResponse = await axios.get(`${API}/wallet/balance/${address}`);
      setTokenBalance(balanceResponse.data.balance);
      
      // Load staking positions
      const stakingResponse = await axios.get(`${API}/staking/positions/${address}`);
      setStakingPositions(stakingResponse.data);
      
      // Load NFT access
      const nftResponse = await axios.get(`${API}/nft/access/${address}`);
      setNftAccess(nftResponse.data);
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const createStakingPosition = async () => {
    if (!stakeAmount || !stakeDuration) {
      alert('Bitte gib einen Betrag und eine Laufzeit an.');
      return;
    }
    
    try {
      setLoading(true);
      await axios.post(`${API}/staking/create`, {
        wallet_address: walletAddress,
        amount: stakeAmount,
        duration_days: stakeDuration
      });
      
      alert('Staking-Position erfolgreich erstellt!');
      setStakeAmount("");
      await loadUserData(walletAddress);
    } catch (error) {
      console.error('Error creating staking position:', error);
      alert('Fehler beim Erstellen der Staking-Position: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAIContent = async () => {
    if (!aiPrompt) {
      alert('Bitte gib einen Prompt ein.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(`${API}/ai/generate`, {
        prompt: aiPrompt,
        content_type: contentType
      });
      
      setAiContent(response.data.content);
      setAiPrompt("");
    } catch (error) {
      console.error('Error generating AI content:', error);
      alert('Fehler beim Generieren des AI-Contents: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
  };

  const getAPYForDuration = (duration) => {
    const rates = {30: 2.0, 90: 4.0, 180: 6.0, 360: 8.0};
    return rates[duration] || 2.0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-black">₿</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Jagd auf den Bitcoin</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1">
                    <span className="text-green-400 text-sm">{formatAddress(walletAddress)}</span>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-1">
                    <span className="text-purple-400 text-sm">{parseFloat(tokenBalance).toFixed(2)} MURAT</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Verbinde...' : 'Wallet Verbinden'}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          /* Landing Page */
          <div className="text-center py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Willkommen zur epischen<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Jagd auf den Bitcoin
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Tauche ein in ein gamifiziertes Creator-Ökosystem mit NFTs, Token-Staking, 
                Live-Streaming und KI-generierten Inhalten. Verfolge den Bitcoin-Jäger in einer 
                interaktiven Story!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                  <div className="text-3xl mb-4">🪙</div>
                  <h3 className="text-xl font-semibold text-white mb-2">MURAT Token</h3>
                  <p className="text-gray-400">Stake deine Token für bis zu 8% APY mit verschiedenen Laufzeiten</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                  <div className="text-3xl mb-4">🎭</div>
                  <h3 className="text-xl font-semibold text-white mb-2">NFT Access</h3>
                  <p className="text-gray-400">Erhalte Zugang zu exklusiven Inhalten und Premium-Features</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                  <div className="text-3xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold text-white mb-2">AI Content</h3>
                  <p className="text-gray-400">Generiere Memes, Comics und Stories mit KI-Unterstützung</p>
                </div>
              </div>
              
              <button
                onClick={connectWallet}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Verbinde...' : 'Abenteuer Starten'}
              </button>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <div>
            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-8">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                { id: 'staking', label: 'Staking', icon: '🏦' },
                { id: 'ai', label: 'AI Creator', icon: '🤖' },
                { id: 'nft', label: 'NFT Access', icon: '🎭' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
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

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Token Balance</h3>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {parseFloat(tokenBalance).toFixed(2)} MURAT
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
            )}

            {activeTab === 'staking' && (
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
                        onClick={createStakingPosition}
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
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                {/* AI Content Generator */}
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">AI Content Generator</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Content-Typ</label>
                      <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                      >
                        <option value="meme">Meme</option>
                        <option value="comic">Comic</option>
                        <option value="story">Story</option>
                        <option value="text">Text</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Prompt</label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Beschreibe was du erstellen möchtest..."
                        rows={3}
                        className="w-full bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    
                    <button
                      onClick={generateAIContent}
                      disabled={loading || !aiPrompt}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Generiere...' : 'Content generieren'}
                    </button>
                  </div>
                </div>
                
                {/* AI Content Output */}
                {aiContent && (
                  <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-xl font-semibold text-white mb-4">Generierter Content</h3>
                    <div className="bg-black/40 rounded-lg p-4 border border-gray-600">
                      <pre className="text-white whitespace-pre-wrap">{aiContent}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'nft' && (
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
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;