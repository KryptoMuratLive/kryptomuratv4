'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatAddress } from '@/lib/utils';
import { Stream } from '@/types';

interface StreamingPanelProps {
  address?: string;
  apiBase: string;
  loading: boolean;
}

export default function StreamingPanel({ address, apiBase, loading }: StreamingPanelProps) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [currentStream, setCurrentStream] = useState<Stream | null>(null);
  const [streamName, setStreamName] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [nftRequired, setNftRequired] = useState(true);
  const [streamError, setStreamError] = useState('');
  const [streamViewers, setStreamViewers] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/streams`);
      if (response.data.success) {
        setStreams(response.data.data);
      }
    } catch (error) {
      console.error('Error loading streams:', error);
    }
  };

  const createStream = async () => {
    if (!streamName || !address) {
      alert('Bitte gib einen Stream-Namen ein und verbinde deine Wallet.');
      return;
    }
    
    try {
      const response = await axios.post(`${apiBase}/api/streams?creator_wallet=${address}`, {
        name: streamName,
        description: streamDescription,
        nft_required: nftRequired
      });
      
      if (response.data.success) {
        alert(`Stream erstellt!\nStream Key: ${response.data.data.stream_key}\nPlayback ID: ${response.data.data.playback_id}`);
        setStreamName('');
        setStreamDescription('');
        await loadStreams();
      }
    } catch (error) {
      console.error('Error creating stream:', error);
      alert('Fehler beim Erstellen des Streams');
    }
  };

  const watchStream = async (streamId: string) => {
    if (!address) {
      alert('Bitte verbinde deine Wallet um den Stream zu schauen.');
      return;
    }
    
    try {
      setStreamError('');
      
      const stream = streams.find(s => s.id === streamId);
      if (stream) {
        setCurrentStream(stream);
        // In a real implementation, you would get the actual playback URL
        // For now, we'll show a placeholder
      }
    } catch (error) {
      console.error('Error watching stream:', error);
      setStreamError('Fehler beim Laden des Streams');
    }
  };

  const deleteStream = async (streamId: string) => {
    if (!confirm('Bist du sicher, dass du diesen Stream löschen möchtest?')) {
      return;
    }
    
    try {
      await axios.delete(`${apiBase}/api/streams/${streamId}?creator_wallet=${address}`);
      alert('Stream erfolgreich gelöscht!');
      await loadStreams();
      
      if (currentStream && currentStream.id === streamId) {
        setCurrentStream(null);
      }
    } catch (error) {
      console.error('Error deleting stream:', error);
      alert('Fehler beim Löschen des Streams');
    }
  };

  return (
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
                    {stream.creator_wallet === address && (
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
          ) : (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📺</div>
                  <p className="text-gray-400">
                    Stream-Player würde hier angezeigt werden
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Playback ID: {currentStream.playback_id}
                  </p>
                </div>
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
          )}
        </div>
      )}
    </div>
  );
}