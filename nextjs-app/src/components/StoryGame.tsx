'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { StoryProgress, StoryChapter } from '@/types';

interface StoryGameProps {
  address?: string;
  apiBase: string;
}

export default function StoryGame({ address, apiBase }: StoryGameProps) {
  const [storyProgress, setStoryProgress] = useState<StoryProgress | null>(null);
  const [currentChapter, setCurrentChapter] = useState<StoryChapter | null>(null);
  const [allChapters, setAllChapters] = useState<StoryChapter[]>([]);
  const [showStoryChoice, setShowStoryChoice] = useState(false);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyError, setStoryError] = useState('');

  useEffect(() => {
    if (address) {
      loadStoryProgress();
      loadAllChapters();
    }
  }, [address]);

  const loadStoryProgress = async () => {
    if (!address) return;
    
    try {
      const response = await axios.get(`${apiBase}/api/story/progress/${address}`);
      if (response.data.success) {
        setStoryProgress(response.data.data);
        
        if (response.data.data.current_chapter) {
          await loadChapter(response.data.data.current_chapter);
        }
      }
    } catch (error) {
      console.error('Error loading story progress:', error);
    }
  };

  const loadAllChapters = async () => {
    try {
      const response = await axios.get(`${apiBase}/api/story/chapters`);
      if (response.data.success) {
        setAllChapters(response.data.data);
      }
    } catch (error) {
      console.error('Error loading chapters:', error);
    }
  };

  const loadChapter = async (chapterId: string) => {
    if (!address) return;
    
    try {
      setStoryLoading(true);
      setStoryError('');
      
      const response = await axios.get(`${apiBase}/api/story/chapter/${chapterId}?wallet_address=${address}`);
      if (response.data.success) {
        setCurrentChapter(response.data.data);
        setShowStoryChoice(true);
      }
    } catch (error) {
      console.error('Error loading chapter:', error);
      setStoryError('Fehler beim Laden des Kapitels');
    } finally {
      setStoryLoading(false);
    }
  };

  const startNewStory = async () => {
    if (!address) return;
    
    try {
      setStoryLoading(true);
      await axios.post(`${apiBase}/api/story/initialize?wallet_address=${address}`);
      await loadStoryProgress();
    } catch (error) {
      console.error('Error starting story:', error);
      alert('Fehler beim Starten der Story');
    } finally {
      setStoryLoading(false);
    }
  };

  const makeStoryChoice = async (choiceIndex: number) => {
    if (!address || !currentChapter) return;
    
    try {
      setStoryLoading(true);
      
      const response = await axios.post(`${apiBase}/api/story/choice`, {
        wallet_address: address,
        chapter_id: currentChapter.id,
        choice_index: choiceIndex
      });
      
      if (response.data.success) {
        const choice = response.data.data.choice;
        if (choice.consequence) {
          alert(`Konsequenz: ${choice.consequence}`);
        }
        
        if (response.data.data.reputation_change !== 0) {
          const change = response.data.data.reputation_change > 0 ? '+' : '';
          alert(`Reputation: ${change}${response.data.data.reputation_change}`);
        }
        
        setShowStoryChoice(false);
        
        if (response.data.data.next_chapter) {
          setTimeout(() => {
            loadChapter(response.data.data.next_chapter);
          }, 2000);
        }
        
        await loadStoryProgress();
      }
    } catch (error) {
      console.error('Error making story choice:', error);
      alert('Fehler bei der Wahl');
    } finally {
      setStoryLoading(false);
    }
  };

  return (
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
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20">
          <div className="text-center py-8">
            {storyProgress && storyProgress.completed_chapters.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Geschichte fortsetzen</h3>
                <p className="text-gray-400 mb-6">
                  Du hast bereits {storyProgress.completed_chapters.length} Kapitel abgeschlossen.
                </p>
                <button
                  onClick={() => storyProgress.current_chapter && loadChapter(storyProgress.current_chapter)}
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

      {storyError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{storyError}</p>
        </div>
      )}
    </div>
  );
}