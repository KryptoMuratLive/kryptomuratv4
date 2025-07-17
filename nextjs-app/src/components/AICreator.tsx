'use client';

import { useState } from 'react';

interface AICreatorProps {
  onGenerateContent: (prompt: string, contentType: string) => Promise<{ success: boolean; content?: string; message?: string }>;
  loading: boolean;
}

export default function AICreator({ 
  onGenerateContent, 
  loading 
}: AICreatorProps) {
  const [aiPrompt, setAiPrompt] = useState('');
  const [contentType, setContentType] = useState('meme');
  const [aiContent, setAiContent] = useState('');

  const handleGenerateContent = async () => {
    if (!aiPrompt) {
      alert('Bitte gib einen Prompt ein.');
      return;
    }
    
    const result = await onGenerateContent(aiPrompt, contentType);
    if (result.success && result.content) {
      setAiContent(result.content);
      setAiPrompt('');
    } else {
      alert(result.message || 'Fehler beim Generieren des Contents');
    }
  };

  return (
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
            onClick={handleGenerateContent}
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
  );
}