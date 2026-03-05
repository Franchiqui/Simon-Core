'use client';

'use client';

import React, { memo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  Cog6ToothIcon, 
  TrophyIcon, 
  QuestionMarkCircleIcon,
  MusicalNoteIcon,
  PowerIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  TrophyIcon as TrophyIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeView: 'game' | 'settings' | 'leaderboard' | 'tutorial';
  onViewChange: (view: 'game' | 'settings' | 'leaderboard' | 'tutorial') => void;
  gamePower: boolean;
  onPowerToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  strictMode: boolean;
  onStrictModeToggle: () => void;
  difficulty: 'slow' | 'normal' | 'fast';
  onDifficultyChange: (difficulty: 'slow' | 'normal' | 'fast') => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  currentUser?: { id: string; name: string; avatar?: string };
  onLogout?: () => void;
}

const Sidebar = memo(function Sidebar({
  isOpen,
  onToggle,
  activeView,
  onViewChange,
  gamePower,
  onPowerToggle,
  soundEnabled,
  onSoundToggle,
  strictMode,
  onStrictModeToggle,
  difficulty,
  onDifficultyChange,
  volume,
  onVolumeChange,
  currentUser,
  onLogout
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const navItems = [
    { id: 'game', label: 'Juego', icon: HomeIcon, activeIcon: HomeIconSolid },
    { id: 'settings', label: 'Configuración', icon: Cog6ToothIcon, activeIcon: Cog6ToothIconSolid },
    { id: 'leaderboard', label: 'Clasificación', icon: TrophyIcon, activeIcon: TrophyIconSolid },
    { id: 'tutorial', label: 'Cómo Jugar', icon: QuestionMarkCircleIcon, activeIcon: QuestionMarkCircleIconSolid },
  ] as const;

  return (
    <>
      <motion.aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800 shadow-2xl transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          !isOpen && "-translate-x-full"
        )}
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    SimonSays Pro
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">¿Puedes seguir el ritmo?</p>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleCollapse}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            >
              <ArrowRightStartOnRectangleIcon className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                isCollapsed && "rotate-180"
              )} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = activeView === item.id ? item.activeIcon : item.icon;
              const isActive = activeView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "flex items-center w-full p-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-gray-800 to-gray-900 shadow-inner border border-gray-700" 
                      : "hover:bg-gray-800/50"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={cn(
                    "w-6 h-6 flex-shrink-0",
                    isActive ? "text-cyan-400" : "text-gray-400"
                  )} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={cn(
                          "ml-3 text-sm font-medium whitespace-nowrap overflow-hidden",
                          isActive ? "text-white" : "text-gray-300"
                        )}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PowerIcon className={cn(
                    "w-5 h-5",
                    gamePower ? "text-green-400" : "text-red-400"
                  )} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-gray-300"
                      >
                        Encendido
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={onPowerToggle}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    gamePower ? "bg-green-500" : "bg-gray-700"
                  )}
                  aria-label={gamePower ? "Apagar juego" : "Encender juego"}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    gamePower ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MusicalNoteIcon className="w-5 h-5 text-purple-400" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm text-gray-300"
                      >
                        Sonido
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={onSoundToggle}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                    soundEnabled ? "bg-purple-500" : "bg-gray-700"
                  )}
                  aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    soundEnabled ? "translate-x-6" : "translate-x-1"
                  )} />
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm text-gray-300">
                    <span>Volumen</span>
                    <span className="text-xs text-gray-400">{Math.round(volume * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                    aria-label="Control de volumen"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm text-gray-300">Dificultad</label>
                  <div className="flex space-x-2">
                    {(['slow', 'normal', 'fast'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => onDifficultyChange(diff)}
                        className={cn(
                          "flex-1 py-2 text-xs font-medium rounded-lg transition-colors",
                          difficulty === diff
                            ? diff === 'slow' 
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : diff === 'normal'
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow -500/30"
                              : "bg-red -500/20 text-red -400 border border-red -500/30"
                            : "bg-gray -800 text-gray -400 hover:bg-gray -700"
                        )}
                      >
                        {diff === 'slow' && 'Lento'}
                        {diff === 'normal' && 'Normal'}
                        {diff === 'fast' && 'Rápido'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray -300">Modo Estricto</span>
                  <button
                    onClick={onStrictModeToggle}
                    className={cn(
                      "relative inline-flex h -6 w -11 items-center rounded-full transition-colors",
                      strictMode ? "bg-red -500" : "bg-gray -700"
                    )}
                    aria-label={strictMode ? "Desactivar modo estricto" : "Activar modo estricto"}
                  >
                    <span className={cn(
                      "inline-block h -4 w -4 transform rounded-full bg-white transition-transform",
                      strictMode ? "translate-x -6" : "translate-x -1"
                    )} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentUser && !isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt+4 border-t border-gray -800 mt+4"
              >
                <div className="flex items-center justify-between p+2 rounded-lg bg-gray -800/50">
                  <div className="flex items-center space-x+3">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w+8 h+8 rounded-full object+cover"
                      />
                    ) : (
                      <UserCircleIcon className="w+8 h+8 text-gray -400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{currentUser.name}</p>
                      <p className="text-xs text-gray -400">Jugador</p>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="p+2 hover:bg-gray -700 rounded-lg transition-colors"
                      aria-label="Cerrar sesión"
                    >
                      <ArrowRightStartOnRectangleIcon className="w+5 h+5 text-gray -400" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="fixed inset+0 z+30 bg-black/50 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  );
});

export default Sidebar;