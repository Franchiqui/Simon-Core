'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Brain, 
  Zap, 
  Activity, 
  Play, 
  Database, 
  Terminal, 
  Keyboard, 
  Radio,
  ShieldAlert,
  Settings,
  Maximize2
} from 'lucide-react';

// --- Types ---
type GameStatus = 'IDLE' | 'PLAYING_SEQUENCE' | 'WAITING_FOR_USER' | 'GAME_OVER';
type Color = 'green' | 'red' | 'yellow' | 'blue';

interface PadConfig {
  id: Color;
  label: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  gridPos: string;
  key: string;
}

const PADS: PadConfig[] = [
  { 
    id: 'green', 
    label: 'MOD_01', 
    icon: <Cpu className="w-10 h-10" />, 
    colorClass: 'text-[#10b981]', 
    bgClass: 'bg-[#10b981]/5',
    gridPos: 'col-start-1 col-end-4 row-start-1 row-end-4',
    key: 'Q'
  },
  { 
    id: 'red', 
    label: 'MOD_02', 
    icon: <Brain className="w-10 h-10" />, 
    colorClass: 'text-[#ef4444]', 
    bgClass: 'bg-[#ef4444]/5',
    gridPos: 'col-start-4 col-end-7 row-start-2 row-end-5',
    key: 'W'
  },
  { 
    id: 'yellow', 
    label: 'MOD_03', 
    icon: <Zap className="w-10 h-10" />, 
    colorClass: 'text-[#fbbf24]', 
    bgClass: 'bg-[#fbbf24]/5',
    gridPos: 'col-start-2 col-end-4 row-start-4 row-end-7',
    key: 'A'
  },
  { 
    id: 'blue', 
    label: 'MOD_04', 
    icon: <Activity className="w-8 h-8" />, 
    colorClass: 'text-[#3b82f6]', 
    bgClass: 'bg-[#3b82f6]/5',
    gridPos: 'col-start-4 col-end-6 row-start-5 row-end-7',
    key: 'S'
  },
];

const FREQUENCIES = {
  green: 329.63, // E4
  red: 261.63,   // C4
  yellow: 220.00, // A3
  blue: 164.81,  // E3
  fail: 110.00   // A2
};

// --- Components ---

const TechBorder = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`tech-border bg-[#05070a] ${className}`}>
    {children}
  </div>
);

export default function App() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [activePad, setActivePad] = useState<Color | null>(null);
  const [telemetry, setTelemetry] = useState<number[]>(Array(8).fill(20));
  const [isEditMode, setIsEditMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Persistence for pads layout
  const [padsState, setPadsState] = useState<{ [key in Color]: { x: number, y: number, w: number, h: number } }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('simon_pads_layout');
      if (saved) return JSON.parse(saved);
    }
    
    return PADS.reduce((acc, pad) => {
      const parts = pad.gridPos.split(' ');
      const cs = parseInt(parts[0].split('-')[2]) - 1;
      const ce = parseInt(parts[1].split('-')[2]) - 1;
      const rs = parseInt(parts[2].split('-')[2]) - 1;
      const re = parseInt(parts[3].split('-')[2]) - 1;
      return {
        ...acc,
        [pad.id]: { 
          x: (cs / 6) * 100, 
          y: (rs / 6) * 100, 
          w: ((ce - cs) / 6) * 100, 
          h: ((re - rs) / 6) * 100 
        }
      };
    }, {} as any);
  });

  useEffect(() => {
    localStorage.setItem('simon_pads_layout', JSON.stringify(padsState));
  }, [padsState]);
  
  const audioCtx = useRef<AudioContext | null>(null);

  // Initialize Audio
  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playSound = (color: Color | 'fail') => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(FREQUENCIES[color], audioCtx.current.currentTime);
    
    gain.gain.setValueAtTime(0.2, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.3);
  };

  const startNewGame = () => {
    initAudio();
    setLevel(1);
    const firstColor = PADS[Math.floor(Math.random() * PADS.length)].id;
    setSequence([firstColor]);
    setUserSequence([]);
    setStatus('PLAYING_SEQUENCE');
  };

  const playSequence = useCallback(async () => {
    if (sequence.length === 0) return;
    
    setStatus('PLAYING_SEQUENCE');
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const color = sequence[i];
      setActivePad(color);
      playSound(color);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActivePad(null);
    }
    setStatus('WAITING_FOR_USER');
  }, [sequence]);

  useEffect(() => {
    if (status === 'PLAYING_SEQUENCE') {
      playSequence();
    }
  }, [status, playSequence]);

  const handlePadClick = (color: Color) => {
    if (status !== 'WAITING_FOR_USER') return;

    initAudio();
    setActivePad(color);
    playSound(color);
    setTimeout(() => setActivePad(null), 200);

    const nextUserSequence = [...userSequence, color];
    setUserSequence(nextUserSequence);

    // Check correctness
    const currentIndex = nextUserSequence.length - 1;
    if (nextUserSequence[currentIndex] !== sequence[currentIndex]) {
      // Game Over
      playSound('fail');
      setStatus('GAME_OVER');
      if (level - 1 > highScore) setHighScore(level - 1);
      return;
    }

    // Check if sequence complete
    if (nextUserSequence.length === sequence.length) {
      // Level Up
      setTimeout(() => {
        setLevel(prev => prev + 1);
        const nextColor = PADS[Math.floor(Math.random() * PADS.length)].id;
        setSequence(prev => [...prev, nextColor]);
        setUserSequence([]);
        setStatus('PLAYING_SEQUENCE');
        
        // Update telemetry
        setTelemetry(prev => [...prev.slice(1), Math.floor(Math.random() * 80) + 20]);
      }, 1000);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const pad = PADS.find(p => p.key === key);
      if (pad) {
        handlePadClick(pad.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, userSequence, sequence]);

  return (
    <div className="min-h-screen grid-bg overflow-x-hidden font-mono selection:bg-[#00f2ff]/30">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none scanline z-[100] opacity-30" />

      {/* Nav */}
      <nav className="border-b border-[#1f2937] bg-[#05070a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 border border-[#00f2ff] flex items-center justify-center">
              <div className="w-2 h-2 bg-[#00f2ff] animate-pulse" />
            </div>
            <span className="text-sm font-bold tracking-tighter text-[#00f2ff]">LAB_ID: SIMON_CORE_04</span>
            <div className="h-4 w-[1px] bg-[#1f2937]" />
            <span className="text-[10px] text-slate-500 hidden md:block uppercase tracking-widest">Cognitive Reflex Assessment Module</span>
          </div>
          <div className="flex items-center gap-8 text-[11px] uppercase tracking-widest font-bold">
            <span className="text-[#00f2ff] cursor-default">Diagnostic</span>
            <span className="text-slate-400 cursor-default hover:text-white transition-colors">Telemetry</span>
            <span className="text-slate-400 cursor-default hover:text-white transition-colors">Neural_Link</span>
            <div className="flex items-center gap-3 ml-4">
              <span className="text-slate-500">USER_AUTH:</span>
              <div className="w-7 h-7 border border-[#1f2937] bg-slate-800 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/pixel-art/svg?seed=fran" 
                  alt="Avatar" 
                  className="w-full h-full grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 lg:p-10">
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Stats */}
          <div className="col-span-12 lg:col-span-2 space-y-6">
            <TechBorder className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Active Session</h3>
                  <p className="text-2xl font-bold text-white">LEVEL_<span className="text-[#00f2ff]">{level.toString().padStart(2, '0')}</span></p>
                </div>
                <Radio className="text-[#00f2ff] w-4 h-4" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>NEURAL_LOAD</span>
                    <span className="text-[#00f2ff]">{Math.min(100, level * 10)}%</span>
                  </div>
                  <div className="h-1 bg-[#1f2937] w-full relative">
                    <motion.div 
                      className="h-full bg-[#00f2ff] shadow-[0_0_8px_rgba(0,242,255,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, level * 10)}%` }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1f2937]/50">
                  <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Peak Performance</h3>
                  <p className="text-3xl font-bold text-white tracking-tighter">
                    {highScore.toFixed(2)}
                  </p>
                </div>
              </div>
            </TechBorder>

            <TechBorder className="p-4">
              <h3 className="text-[10px] text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-1 bg-[#00f2ff]" /> Telemetry History
              </h3>
              <div className="h-32 flex items-end gap-1 px-1">
                {telemetry.map((val, i) => (
                  <motion.div 
                    key={i}
                    className={`w-full transition-colors ${i === telemetry.length - 1 ? 'bg-[#00f2ff]/60' : 'bg-[#1f2937]/30 hover:bg-[#00f2ff]/40'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                  />
                ))}
              </div>
            </TechBorder>
          </div>

          {/* Center Column: Game Board */}
          <div className="col-span-12 lg:col-span-8 relative">
            <div className="flex flex-col items-center">
              <div 
                ref={containerRef}
                className="relative w-full aspect-square max-w-[1000px] border border-[#1f2937]/30 bg-[#05070a]/30 tech-border overflow-hidden"
              >
                {PADS.map((pad) => {
                  const state = padsState[pad.id];
                  return (
                    <motion.div 
                      key={pad.id} 
                      drag={isEditMode}
                      dragMomentum={false}
                      onDrag={(e, info) => {
                        if (!containerRef.current) return;
                        const rect = containerRef.current.getBoundingClientRect();
                        const dx = (info.delta.x / rect.width) * 100;
                        const dy = (info.delta.y / rect.height) * 100;
                        setPadsState(prev => ({
                          ...prev,
                          [pad.id]: { ...prev[pad.id], x: prev[pad.id].x + dx, y: prev[pad.id].y + dy }
                        }));
                      }}
                      style={{
                        position: 'absolute',
                        left: `${state.x}%`,
                        top: `${state.y}%`,
                        width: `${state.w}%`,
                        height: `${state.h}%`,
                        zIndex: isEditMode ? 50 : 10,
                      }}
                      className={`tech-border bg-[#0d1117] overflow-hidden ${isEditMode ? 'cursor-move ring-1 ring-[#00f2ff]/50' : ''}`}
                    >
                      <button 
                        onClick={() => !isEditMode && handlePadClick(pad.id)}
                        disabled={status !== 'WAITING_FOR_USER' && !isEditMode}
                        className={`modular-btn w-full h-full ${pad.colorClass} flex items-center justify-center group transition-all duration-75 ${
                          activePad === pad.id 
                            ? 'scale-[0.97] brightness-[2] z-50' 
                            : 'hover:brightness-125'
                        }`}
                        style={activePad === pad.id ? {
                          backgroundColor: 'currentColor',
                          boxShadow: `
                            0 0 20px 5px currentColor,
                            0 0 50px 15px currentColor,
                            inset 0 0 30px rgba(255,255,255,0.8)
                          `,
                          filter: 'drop-shadow(0 0 20px currentColor)',
                          opacity: 1
                        } : {
                          backgroundColor: 'rgba(0,0,0,0.2)'
                        }}
                      >
                        <span className={`absolute ${pad.id === 'green' ? 'top-2 left-2' : pad.id === 'red' ? 'top-2 right-2' : pad.id === 'yellow' ? 'bottom-2 left-2' : 'bottom-2 right-2'} text-[10px] opacity-30`}>
                          {pad.label}
                        </span>
                        <div className="opacity-20 group-hover:opacity-100 transition-opacity duration-300">
                          {pad.icon}
                        </div>
                        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold opacity-0 group-hover:opacity-10 pointer-events-none">
                          {pad.key}
                        </span>
                      </button>

                      {/* Resize Handle */}
                      {isEditMode && (
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-[60] bg-[#00f2ff]/20 hover:bg-[#00f2ff]/40 flex items-center justify-center"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            const startX = e.clientX;
                            const startY = e.clientY;
                            const startW = state.w;
                            const startH = state.h;
                            
                            const handleMouseMove = (moveEvent: PointerEvent) => {
                              if (!containerRef.current) return;
                              const rect = containerRef.current.getBoundingClientRect();
                              const dx = ((moveEvent.clientX - startX) / rect.width) * 100;
                              const dy = ((moveEvent.clientY - startY) / rect.height) * 100;
                              setPadsState(prev => ({
                                ...prev,
                                [pad.id]: { 
                                  ...prev[pad.id], 
                                  w: Math.max(10, startW + dx), 
                                  h: Math.max(10, startH + dy) 
                                }
                              }));
                            };

                            const handleMouseUp = () => {
                              window.removeEventListener('pointermove', handleMouseMove);
                              window.removeEventListener('pointerup', handleMouseUp);
                            };

                            window.addEventListener('pointermove', handleMouseMove);
                            window.addEventListener('pointerup', handleMouseUp);
                          }}
                        >
                          <Maximize2 className="w-2 h-2 text-[#00f2ff]" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Center Button - Positioned absolutely at center */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center justify-center pointer-events-none">
                  <button 
                    onClick={startNewGame}
                    disabled={status === 'PLAYING_SEQUENCE' || status === 'WAITING_FOR_USER' || isEditMode}
                    className="pointer-events-auto w-24 h-24 rounded-full bg-[#05070a] border border-[#00f2ff] flex flex-col items-center justify-center group hover:bg-[#00f2ff] transition-all duration-300 shadow-[0_0_30px_rgba(0,242,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AnimatePresence mode="wait">
                      {status === 'IDLE' || status === 'GAME_OVER' ? (
                        <motion.div 
                          key="start"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex flex-col items-center"
                        >
                          <span className="text-[10px] font-bold text-[#00f2ff] group-hover:text-[#05070a] tracking-widest">
                            {status === 'GAME_OVER' ? 'RETRY' : 'INITIATE'}
                          </span>
                          <Play className="text-[#00f2ff] group-hover:text-[#05070a] w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="active"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-[10px] font-bold text-[#00f2ff] group-hover:text-[#05070a] tracking-widest"
                        >
                          {level}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-10 text-center space-y-4">
                <div className={`inline-flex items-center gap-3 px-4 py-2 bg-[#00f2ff]/5 border border-[#00f2ff]/20 rounded-full transition-all ${status === 'GAME_OVER' ? 'border-red-500/50 bg-red-500/5' : ''}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status === 'GAME_OVER' ? 'bg-red-500' : 'bg-[#00f2ff] animate-pulse'}`} />
                  <p className={`text-[10px] uppercase tracking-widest ${status === 'GAME_OVER' ? 'text-red-500' : 'text-[#00f2ff]'}`}>
                    {status === 'IDLE' && 'System Status: Waiting for initiation_'}
                    {status === 'PLAYING_SEQUENCE' && 'System Status: Transmitting sequence_'}
                    {status === 'WAITING_FOR_USER' && 'System Status: Awaiting neural response_'}
                    {status === 'GAME_OVER' && 'System Status: Neural link severed_'}
                  </p>
                </div>
                
                {status === 'GAME_OVER' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 text-red-500 text-xs font-bold"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    CRITICAL ERROR: SEQUENCE MISMATCH
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="col-span-12 lg:col-span-2 space-y-6">
            <TechBorder>
              <div className="p-4 border-b border-[#1f2937] flex items-center justify-between">
                <h2 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Database className="w-3 h-3" /> 
                  Global_Ranking
                </h2>
              </div>
              <div className="divide-y divide-[#1f2937]/30">
                {[
                  { rank: '01', name: 'TurboMax', score: '42.0' },
                  { rank: '02', name: 'NeonCat', score: '38.0' },
                  { rank: '03', name: 'MemMaster', score: '35.0' },
                ].map((entry) => (
                  <div key={entry.rank} className="p-3 flex items-center justify-between group hover:bg-[#00f2ff]/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500">{entry.rank}</span>
                      <span className="text-xs font-medium text-white">{entry.name}</span>
                    </div>
                    <span className="text-xs text-[#00f2ff] font-bold">{entry.score}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-2 text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 hover:text-[#00f2ff] transition-colors border-t border-[#1f2937]">
                Access_Full_Data
              </button>
            </TechBorder>

            <TechBorder className="p-6">
              <h2 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-6 text-[#00f2ff]">
                <Terminal className="w-3 h-3" /> 
                Protocol_Specs
              </h2>
              <div className="space-y-6 text-[11px] leading-relaxed">
                <div className="flex gap-4">
                  <span className="text-[#00f2ff] font-bold">01</span>
                  <p className="text-slate-400">System initiates visual/auditory sequence across MOD_01-04.</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#00f2ff] font-bold">02</span>
                  <p className="text-slate-400">Subject must replicate sequence using neural-interface or manual triggers.</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-[#00f2ff] font-bold">03</span>
                  <p className="text-slate-400">Failure results in session termination. Successful replication triggers Level_Up_Sequence.</p>
                </div>
              </div>
              <div className="mt-8 p-4 bg-[#05070a] border border-[#1f2937] text-[10px] italic text-slate-500">
                <div className="flex items-center gap-2 mb-2 not-italic text-[#00f2ff] font-bold uppercase tracking-wider">
                  <Keyboard className="w-3 h-3" /> Rapid_Access
                </div>
                Assign [Q, W, A, S] to respective modules for high-speed sensory throughput.
                </div>
                </TechBorder>

            <TechBorder className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-3 h-3 text-[#00f2ff]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f2ff]">Edit_Mode</span>
                </div>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`w-10 h-5 rounded-full border border-[#1f2937] relative transition-colors ${isEditMode ? 'bg-[#00f2ff]/20' : 'bg-[#05070a]'}`}
                >
                  <motion.div
                    animate={{ x: isEditMode ? 22 : 2 }}
                    initial={false}
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${isEditMode ? 'bg-[#00f2ff]' : 'bg-[#1f2937]'}`}
                  />
                </button>
              </div>
              
              {isEditMode && (
                <button
                  onClick={() => {
                    const defaultState = PADS.reduce((acc, pad) => {
                      const parts = pad.gridPos.split(' ');
                      const cs = parseInt(parts[0].split('-')[2]) - 1;
                      const ce = parseInt(parts[1].split('-')[2]) - 1;
                      const rs = parseInt(parts[2].split('-')[2]) - 1;
                      const re = parseInt(parts[3].split('-')[2]) - 1;
                      return {
                        ...acc,
                        [pad.id]: { 
                          x: (cs / 6) * 100, 
                          y: (rs / 6) * 100, 
                          w: ((ce - cs) / 6) * 100, 
                          h: ((re - rs) / 6) * 100 
                        }
                      };
                    }, {} as any);
                    setPadsState(defaultState);
                  }}
                  className="w-full py-1.5 border border-[#1f2937] bg-[#05070a] hover:bg-red-500/10 hover:border-red-500/50 text-[9px] text-slate-500 hover:text-red-500 transition-all uppercase font-bold tracking-widest"
                >
                  Reset_Layout
                </button>
              )}

              <p className="text-[9px] text-slate-500 mt-2 uppercase">
                {isEditMode ? 'Drag modules or use corner handles to resize.' : 'Interface layout locked.'}
              </p>
            </TechBorder>
                </div>
                </div>
                </main>
      <footer className="mt-12 border-t border-[#1f2937] py-8">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest text-slate-600 uppercase">
          <div className="flex gap-6">
            <span>Server_Status: <span className="text-[#10b981]">Online</span></span>
            <span>Latency: <span className="text-[#00f2ff]">14ms</span></span>
            <span>Enc_V: <span className="text-white">v4.0.2</span></span>
          </div>
          <div className="flex gap-8">
            <span className="hover:text-[#00f2ff] transition-colors cursor-pointer">Privacy_Vault</span>
            <span className="hover:text-[#00f2ff] transition-colors cursor-pointer">Ethics_Guidelines</span>
            <span className="hover:text-[#00f2ff] transition-colors cursor-pointer">Source_Core</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
