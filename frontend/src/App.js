import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactHlsPlayer from 'react-hls-player';

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
  
  // Streaming states
  const [streams, setStreams] = useState([]);
  const [currentStream, setCurrentStream] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");
  const [streamError, setStreamError] = useState("");
  const [streamName, setStreamName] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [nftRequired, setNftRequired] = useState(true);
  const [streamViewers, setStreamViewers] = useState({});
  
  // Story states
  const [storyProgress, setStoryProgress] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [storyLoading, setStoryLoading] = useState(false);
  const [allChapters, setAllChapters] = useState([]);
  const [showStoryChoice, setShowStoryChoice] = useState(false);
  const [storyVoteResults, setStoryVoteResults] = useState({});
  const [storyError, setStoryError] = useState("");

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

  // Streaming functions
  const loadStreams = async () => {
    try {
      const response = await axios.get(`${API}/streams`);
      setStreams(response.data);
      
      // Load viewer counts for each stream
      const viewerCounts = {};
      for (const stream of response.data) {
        try {
          const viewerResponse = await axios.get(`${API}/streams/${stream.id}/viewers`);
          viewerCounts[stream.id] = viewerResponse.data.total_viewers;
        } catch (error) {
          console.error('Error loading viewer count:', error);
        }
      }
      setStreamViewers(viewerCounts);
    } catch (error) {
      console.error('Error loading streams:', error);
    }
  };

  const createStream = async () => {
    if (!streamName || !walletAddress) {
      alert('Bitte gib einen Stream-Namen ein und verbinde deine Wallet.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(`${API}/streams/create?creator_wallet=${walletAddress}`, {
        name: streamName,
        description: streamDescription,
        nft_required: nftRequired
      });
      
      alert(`Stream erstellt!\nStream Key: ${response.data.stream_key}\nPlayback ID: ${response.data.playback_id}`);
      setStreamName("");
      setStreamDescription("");
      await loadStreams();
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Fehler beim Erstellen des Streams: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const watchStream = async (streamId) => {
    if (!walletAddress) {
      alert('Bitte verbinde deine Wallet um den Stream zu schauen.');
      return;
    }
    
    try {
      setLoading(true);
      setStreamError("");
      
      // Get stream info
      const streamResponse = await axios.get(`${API}/streams/${streamId}`);
      const stream = streamResponse.data;
      setCurrentStream(stream);
      
      // Get playback URL
      const playbackResponse = await axios.get(`${API}/streams/${streamId}/playback/${walletAddress}`);
      setStreamUrl(playbackResponse.data.hls_url);
      
    } catch (error) {
      console.error('Error watching stream:', error);
      setStreamError(error.response?.data?.detail || 'Fehler beim Laden des Streams');
    } finally {
      setLoading(false);
    }
  };

  const deleteStream = async (streamId) => {
    if (!confirm('Bist du sicher, dass du diesen Stream löschen möchtest?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`${API}/streams/${streamId}?creator_wallet=${walletAddress}`);
      alert('Stream erfolgreich gelöscht!');
      await loadStreams();
      
      // Close stream if it's currently playing
      if (currentStream && currentStream.id === streamId) {
        setCurrentStream(null);
        setStreamUrl("");
      }
    } catch (error) {
      console.error('Error deleting stream:', error);
      alert('Fehler beim Löschen des Streams: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load streams when component mounts
  useEffect(() => {
    loadStreams();
    loadStoryProgress();
  }, []);

  // Story functions
  const loadStoryProgress = async () => {
    if (!walletAddress) return;
    
    try {
      const response = await axios.get(`${API}/story/progress/${walletAddress}`);
      setStoryProgress(response.data);
      
      // Load current chapter
      if (response.data.current_chapter) {
        await loadChapter(response.data.current_chapter);
      }
      
      // Load all chapters
      const chaptersResponse = await axios.get(`${API}/story/chapters`);
      setAllChapters(chaptersResponse.data);
      
    } catch (error) {
      console.error('Error loading story progress:', error);
    }
  };

  const loadChapter = async (chapterId) => {
    if (!walletAddress) return;
    
    try {
      setStoryLoading(true);
      setStoryError("");
      
      const response = await axios.get(`${API}/story/chapter/${chapterId}?wallet_address=${walletAddress}`);
      setCurrentChapter(response.data);
      setShowStoryChoice(true);
      
    } catch (error) {
      console.error('Error loading chapter:', error);
      setStoryError(error.response?.data?.detail || 'Fehler beim Laden des Kapitels');
    } finally {
      setStoryLoading(false);
    }
  };

  const makeStoryChoice = async (choiceIndex) => {
    if (!walletAddress || !currentChapter) return;
    
    try {
      setStoryLoading(true);
      
      const response = await axios.post(`${API}/story/choice`, {
        wallet_address: walletAddress,
        chapter_id: currentChapter.id,
        choice_index: choiceIndex
      });
      
      // Show consequence
      if (response.data.choice.consequence) {
        alert(`Konsequenz: ${response.data.choice.consequence}`);
      }
      
      // Update reputation
      if (response.data.reputation_change !== 0) {
        const change = response.data.reputation_change > 0 ? '+' : '';
        alert(`Reputation: ${change}${response.data.reputation_change}`);
      }
      
      setShowStoryChoice(false);
      
      // Load next chapter if available
      if (response.data.next_chapter) {
        setTimeout(() => {
          loadChapter(response.data.next_chapter);
        }, 2000);
      }
      
      // Refresh progress
      await loadStoryProgress();
      
    } catch (error) {
      console.error('Error making story choice:', error);
      alert('Fehler bei der Wahl: ' + error.message);
    } finally {
      setStoryLoading(false);
    }
  };

  const voteStoryDirection = async (voteType, voteOption) => {
    if (!walletAddress) return;
    
    try {
      await axios.post(`${API}/story/vote`, {
        wallet_address: walletAddress,
        vote_type: voteType,
        vote_option: voteOption
      });
      
      alert('Deine Stimme wurde gezählt!');
      
      // Refresh vote results
      const voteResults = await axios.get(`${API}/story/votes/${voteType}`);
      setStoryVoteResults(prev => ({
        ...prev,
        [voteType]: voteResults.data
      }));
      
    } catch (error) {
      console.error('Error voting:', error);
      alert('Fehler beim Abstimmen: ' + error.message);
    }
  };

  const startNewStory = async () => {
    if (!walletAddress) return;
    
    try {
      setStoryLoading(true);
      await axios.post(`${API}/story/initialize?wallet_address=${walletAddress}`);
      await loadStoryProgress();
    } catch (error) {
      console.error('Error starting story:', error);
      alert('Fehler beim Starten der Story: ' + error.message);
    } finally {
      setStoryLoading(false);
    }
  };

  const generateAIContent_old = async () => {
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
              <h1 className="text-2xl font-bold text-white">KryptoMurat</h1>
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
                Willkommen bei<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  KryptoMurat
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Die ultimative Web3-Plattform mit gamifizierten Creator-Ökosystem! Spiele "Jagd auf den Bitcoin", 
                stake MURAT Token, streame live und generiere AI-Content. Alles mit NFT-Integration!
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
                  <div className="text-3xl mb-4">🎮</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Jagd auf den Bitcoin</h3>
                  <p className="text-gray-400">Spiele das epische Adventure-Game und folge dem Bitcoin-Jäger</p>
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
                { id: 'story', label: 'Bitcoin-Jagd', icon: '🎮' },
                { id: 'staking', label: 'Staking', icon: '🏦' },
                { id: 'streaming', label: 'Live Streaming', icon: '🎥' },
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

            {activeTab === 'story' && (
              <div className="space-y-6">
                {/* Story Header */}
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-yellow-400">🎮 Die Jagd auf den Bitcoin</h2>
                    <div className="flex items-center space-x-4">
                      {storyProgress && (
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Reputation</div>
                          <div className="text-lg font-bold text-yellow-400">{storyProgress.reputation_score}</div>
                        </div>
                      )}
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Fortschritt</div>
                        <div className="text-lg font-bold text-green-400">
                          {storyProgress ? storyProgress.completed_chapters.length : 0} Kapitel
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Folge dem Bitcoin-Jäger auf seiner epischen Reise durch Herford und Umgebung. 
                    Deine Entscheidungen bestimmen den Verlauf der Geschichte!
                  </p>
                  
                  {storyProgress && storyProgress.story_path && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">Story-Pfad:</span>
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                        {storyProgress.story_path}
                      </span>
                    </div>
                  )}
                </div>

                {/* Current Chapter */}
                {currentChapter && showStoryChoice ? (
                  <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        Kapitel {currentChapter.chapter_number}: {currentChapter.title}
                      </h3>
                      {currentChapter.nft_required && (
                        <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                          NFT Required
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 mb-4">{currentChapter.description}</p>
                    
                    <div className="bg-black/40 rounded-lg p-4 mb-6">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {currentChapter.content}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-yellow-400">Was ist deine Entscheidung?</h4>
                      
                      {currentChapter.choices.map((choice, index) => (
                        <button
                          key={index}
                          onClick={() => makeStoryChoice(index)}
                          disabled={storyLoading}
                          className="w-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 rounded-lg p-4 text-left transition-all duration-200 disabled:opacity-50"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{choice.text}</span>
                            {choice.reputation_change !== 0 && (
                              <span className={`text-sm px-2 py-1 rounded ${
                                choice.reputation_change > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {choice.reputation_change > 0 ? '+' : ''}{choice.reputation_change} Rep
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {storyLoading && (
                      <div className="flex items-center justify-center mt-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                        <span className="ml-2 text-gray-400">Verarbeite Entscheidung...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Story Start/Continue */
                  <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
                    <div className="text-center py-8">
                      {storyProgress && storyProgress.completed_chapters.length > 0 ? (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">Geschichte fortsetzen</h3>
                          <p className="text-gray-400 mb-6">
                            Du hast bereits {storyProgress.completed_chapters.length} Kapitel abgeschlossen.
                          </p>
                          <button
                            onClick={() => loadChapter(storyProgress.current_chapter)}
                            disabled={storyLoading}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50"
                          >
                            {storyLoading ? 'Lade...' : 'Fortsetzen'}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-4">Bereit für das Abenteuer?</h3>
                          <p className="text-gray-400 mb-6">
                            Starte deine epische Reise als Bitcoin-Jäger in Herford!
                          </p>
                          <button
                            onClick={startNewStory}
                            disabled={storyLoading}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50"
                          >
                            {storyLoading ? 'Starte...' : 'Abenteuer beginnen'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Chapter Overview */}
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">📚 Kapitel-Übersicht</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allChapters.map((chapter) => {
                      const isCompleted = storyProgress && storyProgress.completed_chapters.includes(chapter.id);
                      const isCurrent = storyProgress && storyProgress.current_chapter === chapter.id;
                      const isLocked = !isCompleted && !isCurrent;
                      
                      return (
                        <div
                          key={chapter.id}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            isCompleted 
                              ? 'bg-green-500/20 border-green-500/30' 
                              : isCurrent 
                                ? 'bg-yellow-500/20 border-yellow-500/30' 
                                : 'bg-gray-500/20 border-gray-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white text-sm">{chapter.title}</h4>
                            <div className="flex items-center space-x-1">
                              {chapter.nft_required && (
                                <span className="text-purple-400 text-xs">🎭</span>
                              )}
                              <span className="text-gray-400 text-xs">#{chapter.chapter_number}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-400 text-xs mb-3">{chapter.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded ${
                              isCompleted ? 'bg-green-500/20 text-green-400' :
                              isCurrent ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {isCompleted ? 'Abgeschlossen' : isCurrent ? 'Aktuell' : 'Gesperrt'}
                            </span>
                            
                            {(isCompleted || isCurrent) && (
                              <button
                                onClick={() => loadChapter(chapter.id)}
                                className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                              >
                                Öffnen
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Community Voting */}
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">🗳️ Community-Abstimmung</h3>
                  
                  <p className="text-gray-400 mb-4">
                    Bestimme mit, wie die Geschichte weitergeht! NFT-Holder haben mehr Stimmgewicht.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-black/40 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-3">Was soll als nächstes passieren?</h4>
                      <div className="space-y-2">
                        {[
                          'Mehr Action-Szenen mit Motorrad-Verfolgungen',
                          'Tiefere Krypto-Mysteries und Rätsel',
                          'Neue Charaktere und Verbündete',
                          'Romantische Storyline einführen'
                        ].map((option, index) => (
                          <button
                            key={index}
                            onClick={() => voteStoryDirection('next_direction', option)}
                            className="w-full text-left bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 transition-all duration-200"
                          >
                            <span className="text-white">{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {storyError && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400">{storyError}</p>
                  </div>
                )}
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

            {activeTab === 'streaming' && (
              <div className="space-y-6">
                {/* Stream Creation */}
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">🎥 Live Stream erstellen</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Stream Name</label>
                      <input
                        type="text"
                        value={streamName}
                        onChange={(e) => setStreamName(e.target.value)}
                        placeholder="Bitcoin Jagd Live"
                        className="w-full bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Beschreibung</label>
                      <input
                        type="text"
                        value={streamDescription}
                        onChange={(e) => setStreamDescription(e.target.value)}
                        placeholder="Epische Bitcoin-Jagd Action!"
                        className="w-full bg-black/40 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={nftRequired}
                        onChange={(e) => setNftRequired(e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-black/40 border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-400">NFT-Zugang erforderlich</span>
                    </label>
                  </div>
                  
                  <button
                    onClick={createStream}
                    disabled={loading || !streamName}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Erstelle Stream...' : 'Stream erstellen'}
                  </button>
                </div>
                
                {/* Stream List */}
                <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">🔴 Live Streams</h3>
                  
                  {streams.length === 0 ? (
                    <p className="text-gray-400">Keine Live Streams verfügbar.</p>
                  ) : (
                    <div className="space-y-3">
                      {streams.map((stream) => (
                        <div key={stream.id} className="bg-black/40 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                <h4 className="text-white font-semibold">{stream.name}</h4>
                                {stream.nft_required && (
                                  <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                                    NFT Required
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-sm mb-2">{stream.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Creator: {formatAddress(stream.creator_wallet)}</span>
                                <span>Viewers: {streamViewers[stream.id] || 0}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => watchStream(stream.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Ansehen
                              </button>
                              {stream.creator_wallet === walletAddress && (
                                <button
                                  onClick={() => deleteStream(stream.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  Löschen
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Stream Player */}
                {currentStream && (
                  <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-white">🎬 {currentStream.name}</h3>
                      <button
                        onClick={() => setCurrentStream(null)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ✕ Schließen
                      </button>
                    </div>
                    
                    {streamError ? (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                        <p className="text-red-400">{streamError}</p>
                      </div>
                    ) : streamUrl ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                          <ReactHlsPlayer
                            src={streamUrl}
                            autoPlay
                            controls
                            width="100%"
                            height="100%"
                            className="w-full h-full"
                            hlsConfig={{
                              maxLoadingDelay: 4,
                              maxBufferLength: 30,
                              maxBufferSize: 60*1000*1000,
                              maxBufferHole: 0.5,
                            }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-red-400 font-semibold">LIVE</span>
                            </div>
                            <span className="text-gray-400">Zuschauer: {streamViewers[currentStream.id] || 0}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded text-sm">
                              👍 Like
                            </button>
                            <button className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-sm">
                              💬 Chat
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                          <p className="text-gray-400">Lade Stream...</p>
                        </div>
                      </div>
                    )}
                  </div>
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