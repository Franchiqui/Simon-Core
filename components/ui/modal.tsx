'use client';

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Trophy, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type GameResult = {
  level: number;
  score: number;
  sequenceLength: number;
  failedSequence: string[];
  timestamp: Date;
};

export type ModalVariant = 'gameOver' | 'highScore' | 'settings' | 'tutorial';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: ModalVariant;
  gameResult?: GameResult;
  onSaveScore?: (playerName: string) => Promise<void>;
  onRestart?: () => void;
  onDifficultyChange?: (difficulty: 'slow' | 'normal' | 'fast') => void;
  onVolumeChange?: (volume: number) => void;
  currentDifficulty?: 'slow' | 'normal' | 'fast';
  currentVolume?: number;
  highScores?: Array<{
    id: string;
    playerName: string;
    level: number;
    score: number;
    timestamp: Date;
  }>;
}

const Modal = React.memo(function Modal({
  isOpen,
  onClose,
  variant,
  gameResult,
  onSaveScore,
  onRestart,
  onDifficultyChange,
  onVolumeChange,
  currentDifficulty = 'normal',
  currentVolume = 0.7,
  highScores = [],
}: ModalProps) {
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [localVolume, setLocalVolume] = useState(currentVolume);
  const [localDifficulty, setLocalDifficulty] = useState(currentDifficulty);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalVolume(currentVolume);
  }, [currentVolume]);

  useEffect(() => {
    setLocalDifficulty(currentDifficulty);
  }, [currentDifficulty]);

  useEffect(() => {
    if (isOpen && variant === 'gameOver' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, variant]);

  const handleSaveScore = useCallback(async () => {
    if (!onSaveScore || !playerName.trim()) {
      setSaveError('Please enter your name');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await onSaveScore(playerName.trim());
      setPlayerName('');
      onClose();
    } catch (error) {
      setSaveError('Failed to save score. Please try again.');
      console.error('Save score error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [onSaveScore, playerName, onClose]);

  const handleRestart = useCallback(() => {
    if (onRestart) {
      onRestart();
    }
    onClose();
  }, [onRestart, onClose]);

  const handleVolumeChange = useCallback((value: number) => {
    setLocalVolume(value);
    if (onVolumeChange) {
      onVolumeChange(value);
    }
  }, [onVolumeChange]);

  const handleDifficultyChange = useCallback((difficulty: 'slow' | 'normal' | 'fast') => {
    setLocalDifficulty(difficulty);
    if (onDifficultyChange) {
      onDifficultyChange(difficulty);
    }
  }, [onDifficultyChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && variant === 'gameOver') {
      handleSaveScore();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  }, [variant, handleSaveScore, onClose]);

  const renderGameOverContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Game Over!
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          ¡Casi! Inténtalo de nuevo
        </p>
      </div>

      {gameResult && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Level Reached</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {gameResult.level}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Score</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {gameResult.score}
              </p>
            </div>
          </div>
          
          {gameResult.failedSequence.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Failed Sequence:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {gameResult.failedSequence.map((color, index) => (
                  <span
                    key={index}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-semibold',
                      color === 'red' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                      color === 'green' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                      color === 'blue' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                      color === 'yellow' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    )}
                  >
                    {color.charAt(0).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Save your score
          </label>
          <input
            ref={inputRef}
            id="playerName"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.slice(0, 20))}
            onKeyDown={handleKeyDown}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSaving}
            aria-label="Player name for high score"
          />
          {saveError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
              {saveError}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveScore}
            disabled={isSaving || !playerName.trim()}
            className={cn(
              'flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg transition-all duration-200',
              'hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-busy={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Score'}
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );

  const renderHighScoreContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Trophy className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text -2xl font-bold text-gray -900 dark:text-white">
          Top Scores
        </h3>
        <p className="mt -2 text-sm text-gray -600 dark:text-gray -300">
          Can you beat the best?
        </p>
      </div>

      <div className="space-y1 max-h-[300px] overflow-y-auto" role="table" aria-label="High scores table">
        <div className="grid grid-cols12 gap4 px4 py2 bg-gray -100 dark:bg-gray -800 rounded-lg font-semibold" role="rowgroup">
          <div className="col-span1 text-center" role="columnheader">#</div>
          <div className="col-span5" role="columnheader">Player</div>
          <div className="col-span3 text-center" role="columnheader">Level</div>
          <div className="col-span3 text-center" role="columnheader">Score</div>
        </div>

        <AnimatePresence>
          {highScores.map((score, index) => (
            <motion.div
              key={score.id}
              initial={{ opacity:0, y:-10 }}
              animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }}
              transition={{ delay:index *0.05 }}
              className={cn(
                "grid grid-cols12 gap4 px4 py3 items-center border-b border-gray -200 dark:border-gray -700 last:border-b0",
                index<3 && "bg-gradient-to-r from-yellow -50/50 to-transparent dark:from-yellow -900/20"
              )}
              role="row"
            >
              <div className="col-span1 text-center font-bold" role="cell">
                {index+1}
              </div>
              <div className="col-span5 truncate font-medium text-gray -900 dark:text-white" role="cell">
                {score.playerName}
              </div>
              <div className="col-span3 text-center font-semibold text-blue -600 dark:text-blue -400" role="cell">
                {score.level}
              </div>
              <div className="col-span3 text-center font-semibold text-green -600 dark:text-green -400" role="cell">
                {score.score.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {highScores.length===0 && (
          <div className="text-center py8 text-gray -500 dark:text-gray -400" role="cell">
            No scores yet. Be the first!
          </div>
        )}
      </div>

      <button
        onClick={handleRestart}
        className="w-full px4 py3 bg-gradient-to-r from-blue -600 to-blue -700 text-white font-semibold rounded-lg transition-all duration200 hover:from-blue -700 hover:to-blue -800 focus:outline-none focus:ring2 focus:ring-blue -500 focus:ring-offset2"
      >
        Challenge the Leaderboard
      </button>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="space-y6">
      <h3 className="text-xl font-bold text-gray -900 dark:text-white">
        Game Settings
      </h3>

      <div className="space-y6">
        <div>
          <label className="block text-sm font-medium text-gray -700 dark:text-gray -300 mb4">
            Difficulty
          </label>
          <div className="grid grid-cols3 gap2" role="radiogroup" aria-label="Game difficulty">
            {(['slow','normal','fast'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => handleDifficultyChange(diff)}
                className={cn(
                  "px4 py2 rounded-lg border transition-all duration200",
                  localDifficulty===diff
                    ? "border-blue -500 bg-blue -50 dark:bg-blue -900/30 text-blue -700 dark:text-blue -300"
                    : "border-gray -300 dark:border-gray -600 hover:border-gray -400 dark:hover:border-gray -500"
                )}
                role="radio"
                aria-checked={localDifficulty===diff}
              >
                {diff.charAt(0).toUpperCase()+diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb4">
            <label className="text-sm font-medium text-gray -700 dark:text-gray -300">
              Volume
            </label>
            <button
              onClick={() => handleVolumeChange(localVolume>0?0:0.7)}
              className="p1 rounded-full hover:bg-gray -100 dark:hover:bg-gray -700"
              aria-label={localVolume>0?"Mute volume":"Unmute volume"}
            >
              {localVolume>0?(
                <Volume2 className="h5 w5 text-gray -600 dark:text-gray -400"/>
              ):(
                <VolumeX className="h5 w5 text-gray -600 dark:text-gray -400"/>
              )}
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={localVolume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h2 bg-gradient-to-r from-gray -300 to-blue -500 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h4 [&::-webkit-slider-thumb]:w4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border2 [&::-webkit-slider-thumb]:border-blue -500"
            aria-label="Volume control"
          />
          <div className="flex justify-between text-xs text-gray -500 dark:text-gray -400 mt1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="pt4 border-t border-gray -200 dark:border-gray -700">
          <button
            onClick={onClose}
            className="w-full px4 py3 bg-gradient-to-r from-green -600 to-green -700 text-white font-semibold rounded-lg transition-all duration200 hover:from-green -700 hover:to-green -800 focus:outline-none focus:ring2 focus:ring-green -500 focus:ring-offset2"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );

  const renderTutorialContent = () => (
    <div className="space-y6">
      <h3 className="text-xl font-bold text-gray -900 dark:text-white">
        How to Play Simon Says Pro
      </h3>

      <div className="space-y4">
        {[
          {
            step:"1",
            title:"Watch the Sequence",
            description:"Simon will light up buttons in a sequence. Pay close attention!"
          },
          {
            step:"2",
            title:"Repeat the Pattern",
            description:"Click the buttons in the exact same order as shown."
          },
          {
            step:"3",
            title:"Level Up",
            description:"Each correct sequence adds one more step. How far can you go?"
          },
          {
            step:"4",
            title:"Avoid Mistakes",
            description:"In Strict Mode, one mistake ends the game. Otherwise, you get another try!"
          }
        ].map((item) => (
          <motion.div
            key={item.step}
            initial={{ opacity:0,x:-20 }}
            animate={{ opacity:1,x:0 }}
            transition={{ delay:(parseInt(item.step)-1)*0.1 }}
            className="flex items-start space-x4 p3 bg-gradient-to-r from-gray -50 to-transparent dark:from-gray -800/30 rounded-lg"
          >
            <div className="flex-shrink0 w8 h8 bg-gradient-to-br from-blue -500 to-blue -600 rounded-full flex items-center justify-center text-white font-bold">
              {item.step}
            </div>
            <div>
              <h4 className="font-semibold text-gray -900 dark:text-white">{item.title}</h4>
              <p className="text-sm text-gray -600 dark:text-gray -300 mt1">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full px4 py3 bg-gradient-to-r from-purple -600 to-purple -700 text-white font-semibold rounded-lg transition-all duration200 hover:from-purple -700 hover:to-purple -800 focus:outline-none focus:ring2 focus:ring-purple -500 focus:ring-offset2"
      >
        Let's Play!
      </button>
    </div>
  );

  const getModalContent = () => {
    switch (variant) {
      case 'gameOver':
        return renderGameOverContent}}})