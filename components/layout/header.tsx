'use client';

'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Volume2, Trophy, HelpCircle, RotateCcw, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  score: number;
  level: number;
  isPoweredOn: boolean;
  isStrictMode: boolean;
  difficulty: 'slow' | 'normal' | 'fast';
  volume: number;
  gameStatus: 'idle' | 'playing' | 'game-over';
  onPowerToggle: () => void;
  onRestart: () => void;
  onDifficultyChange: (difficulty: 'slow' | 'normal' | 'fast') => void;
  onVolumeChange: (volume: number) => void;
  onStrictModeToggle: () => void;
  onShowLeaderboard: () => void;
  onShowTutorial: () => void;
}

const Header = memo(function Header({
  score,
  level,
  isPoweredOn,
  isStrictMode,
  difficulty,
  volume,
  gameStatus,
  onPowerToggle,
  onRestart,
  onDifficultyChange,
  onVolumeChange,
  onStrictModeToggle,
  onShowLeaderboard,
  onShowTutorial
}: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const difficultyLabels = {
    slow: 'Lento',
    normal: 'Normal',
    fast: 'Rápido'
  };

  return (
    <header className="w-full bg-gradient-to-b from-gray-900 to-gray-800 border-b border-gray-700 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className={cn(
          "flex flex-col md:flex-row items-center justify-between gap-6",
          "transition-all duration-300"
        )}>
          
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-green-500 animate-pulse-slow" />
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-sm" />
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                SimonSays Pro
              </h1>
              <p className="text-sm text-gray-400 font-mono">
                ¿Puedes seguir el ritmo de la luz?
              </p>
            </div>
          </div>

          {/* Game Status Display */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative bg-gray-900 border-2 border-gray-700 rounded-xl px-6 py-3 min-w-[200px]">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-800 px-3 py-1 rounded-lg border border-gray-600">
                <span className="text-xs font-mono text-gray-300">ESTADO</span>
              </div>
              
              <div className="flex items-center justify-between gap-6">
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-mono">PUNTUACIÓN</div>
                  <div className="text-2xl font-bold text-green-400 font-mono tracking-wider">
                    {score.toString().padStart(4, '0')}
                  </div>
                </div>
                
                <div className="h-10 w-px bg-gray-700" />
                
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-mono">NIVEL</div>
                  <div className="text-2xl font-bold text-blue-400 font-mono tracking-wider">
                    {level.toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
              
              {/* Status Indicator */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <motion.div
                  animate={{
                    backgroundColor: gameStatus === 'playing' ? '#10B981' : 
                                   gameStatus === 'game-over' ? '#EF4444' : '#6B7280'
                  }}
                  className="w-3 h-3 rounded-full border border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            
            {/* Power Button */}
            <button
              onClick={onPowerToggle}
              aria-label={isPoweredOn ? "Apagar" : "Encender"}
              className={cn(
                "relative p-3 rounded-xl transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800",
                isPoweredOn 
                  ? "bg-gradient-to-br from-green-600 to-green-800 shadow-lg shadow-green-900/30" 
                  : "bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600"
              )}
            >
              <Power className={cn(
                "w-6 h-6 transition-colors",
                isPoweredOn ? "text-green-200" : "text-gray-400"
              )} />
              {isPoweredOn && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  className="absolute inset-0 rounded-xl bg-green-500/20"
                />
              )}
            </button>

            {/* Restart Button */}
            <button
              onClick={onRestart}
              disabled={!isPoweredOn}
              aria-label="Reiniciar juego"
              className={cn(
                "relative p-3 rounded-xl transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800",
                isPoweredOn
                  ? "bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 shadow-lg shadow-blue-900/30"
                  : "bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 cursor-not-allowed"
              )}
            >
              <RotateCcw className={cn(
                "w-6 h-6",
                isPoweredOn ? "text-blue-200" : "text-gray-400"
              )} />
            </button>

            {/* Difficulty Selector */}
            <div className="relative group">
              <select
                value={difficulty}
                onChange={(e) => onDifficultyChange(e.target.value as 'slow' | 'normal' | 'fast')}
                disabled={!isPoweredOn}
                aria-label="Seleccionar dificultad"
                className={cn(
                  "appearance-none pl1 pr -10 py1 rounded-xl border transition-all duration -200",
                  "focus:outline-none focus:ring -2 focus:ring-offset -2 focus:ring-offset -gray -800",
                  isPoweredOn
                    ? "bg-gradient-to-br from-purple -700 to-purple -900 border-purple -600 text-white shadow-lg shadow-purple -900/30"
                    : "bg-gradient-to-br from-gray -700 to-gray -900 border-gray -600 text-gray -400 cursor-not-allowed"
                )}
              >
                {Object.entries(difficultyLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <Zap className={cn(
                "absolute right -3 top -1/2 transform -translate-y -1/2 w -4 h -4 pointer-events-none",
                isPoweredOn ? "text-yellow -400" : "text-gray -500"
              )} />
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap -2">
              <Volume2 className={cn(
                "w -5 h -5",
                isPoweredOn ? "text-gray -300" : "text-gray -500"
              )} />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => onVolumeChange(parseInt(e.target.value))}
                disabled={!isPoweredOn}
                aria-label="Control de volumen"
                className={cn(
                  "w -24 accent-green -500 transition-opacity",
                  !isPoweredOn && "opacity -50 cursor-not-allowed"
                )}
              />
            </div>

            {/* Strict Mode Toggle */}
            <button
              onClick={onStrictModeToggle}
              disabled={!isPoweredOn}
              aria-label={`Modo estricto ${isStrictMode ? 'activado' : 'desactivado'}`}
              className={cn(
                "relative px -4 py -2 rounded-xl transition-all duration -200",
                "focus:outline-none focus:ring -2 focus:ring-offset -2 focus:ring-offset -gray -800",
                isStrictMode && isPoweredOn
                  ? "bg-gradient-to-br from-red -600 to-red -800 shadow-lg shadow-red -900/30 text-white"
                  : isPoweredOn
                    ? "bg-gradient-to-br from-gray -700 to-gray -900 border border-gray -600 text-gray -300 hover:text-white"
                    : "bg-gradient-to-br from-gray -700 to-gray -900 border border-gray -600 text-gray -400 cursor-not-allowed"
              )}
            >
              <span className="text-sm font-semibold">STRICT</span>
              {isStrictMode && isPoweredOn && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  className="absolute inset -0 rounded-xl bg-red -500/20"
                />
              )}
            </button>

            {/* Leaderboard Button */}
            <button
              onClick={onShowLeaderboard}
              aria-label="Ver tabla de clasificación"
              className={cn(
                "p -3 rounded-xl transition-all duration -200",
                "focus:outline-none focus:ring -2 focus:ring-offset -2 focus:ring-offset -gray -800",
                "bg-gradient-to-br from-yellow -700 to-yellow -900 hover:from-yellow -600 hover:to-yellow -800",
                "shadow-lg shadow-yellow -900/30"
              )}
            >
              <Trophy className="w -6 h -6 text-yellow -200" />
            </button>

            {/* Tutorial Button */}
            <button
              onClick={onShowTutorial}
              aria-label="Mostrar tutorial"
              className={cn(
                "p -3 rounded-xl transition-all duration -200",
                "focus:outline-none focus:ring -2 focus:ring-offset -2 focus:ring-offset -gray -800",
                "bg-gradient-to-br from-blue -700 to-blue -900 hover:from-blue -600 hover:to-blue -800",
                "shadow-lg shadow-blue -900/30"
              )}
            >
              <HelpCircle className="w -6 h -6 text-blue -200" />
            </button>

          </div>

        </div>

        {/* Mobile Controls (stacked below) */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt -6 pt -6 border-t border-gray -700"
          >
            <div className="flex flex-wrap items-center justify-center gap -3">
              <span className="text-xs text-gray -400 font-mono px -3 py1 bg-gray -800 rounded-full">
                CONTROLES
              </span>
              
              {/* Quick Stats */}
              <div className="flex items-center gap4">
                <div className="flex items-center gap2">
                  <div className={cn(
                    "w2 h2 rounded-full",
                    gameStatus === 'playing' ? "bg-green500 animate-pulse" :
                    gameStatus === 'game-over' ? "bg-red500" : "bg-gray500"
                  )} />
                  <span className="text-xs text-gray300">
                    {gameStatus === 'playing' ? 'JUGANDO' :
                     gameStatus === 'game-over' ? 'GAME OVER' : 'LISTO'}
                  </span>
                </div>
                
                <div className="h4 w-px bg-gray600" />
                
                <div className="text-xs text-gray300">
                  Dificultad: <span className="font-semibold text-purple300">{difficultyLabels[difficulty]}</span>
                </div>
                
                {isStrictMode && (
                  <>
                    <div className="h4 w-px bg-gray600" />
                    <span className="text-xs font-semibold text-red400">MODO ESTRICTO</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
});

export default Header;