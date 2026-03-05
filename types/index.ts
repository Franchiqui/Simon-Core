export type Color = 'red' | 'green' | 'blue' | 'yellow';
export type Difficulty = 'slow' | 'normal' | 'fast';
export type GameStatus = 'idle' | 'playing' | 'sequence' | 'input' | 'game-over' | 'paused';

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  sequence: Color[];
  playerInput: Color[];
  difficulty: Difficulty;
  strictMode: boolean;
  soundEnabled: boolean;
  powerOn: boolean;
  currentStep: number;
  maxLevelReached: number;
}

export interface GameSettings {
  difficulty: Difficulty;
  strictMode: boolean;
  soundEnabled: boolean;
  volume: number;
}

// Sequence timing based on difficulty
export const SEQUENCE_TIMING: Record<Difficulty, {
  highlightDuration: number;
  pauseDuration: number;
  inputTimeout: number;
}> = {
  slow: { highlightDuration: 800, pauseDuration: 500, inputTimeout: 3000 },
  normal: { highlightDuration: 500, pauseDuration: 300, inputTimeout: 2000 },
  fast: { highlightDuration: 300, pauseDuration: 200, inputTimeout: 1500 },
};

// Sound frequencies for each color
export const SOUND_FREQUENCIES: Record<Color, number> = {
  red: 329.63,    // E4
  green: 261.63,  // C4
  blue: 392.00,   // G4
  yellow: 293.66, // D4
};

// High score types
export interface HighScore {
  id: string;
  playerName: string;
  score: number;
  level: number;
  difficulty: Difficulty;
  date: Date;
}

export interface HighScoreInput {
  playerName: string;
  score: number;
  level: number;
  difficulty: Difficulty;
}

// Game events
export type GameEvent = 
  | { type: 'START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'POWER_TOGGLE' }
  | { type: 'COLOR_CLICK'; color: Color }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'TOGGLE_STRICT_MODE' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SAVE_SCORE'; data: HighScoreInput }
  | { type: 'GAME_OVER' }
  | { type: 'SEQUENCE_COMPLETE' };

// Component props
export interface GameButtonProps {
  color: Color;
  isActive: boolean;
  isDisabled?: boolean;
  onClick?: (color: Color) => void;
}

export interface ControlPanelProps {
  gameState: GameState;
  settings: GameSettings;
  onStartGame: () => void;
  onResetGame: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onToggleStrictMode: () => void;
  onToggleSound: () => void;
  onVolumeChange: (volume: number) => void;
}

export interface ScoreboardProps {
  score: number;
  level: number;
}

export interface HighScoresProps {
  scores: HighScore[];
}

export interface GameOverModalProps {
  isOpen: boolean;
  levelReached: number;
  failedSequence?: Color[];
  onPlayAgain?: () => void;
  onSaveScore?: (playerName: string) => void;
}

export interface TutorialStep {
  title: string;
  description: string;
  animation?: Color[];
}

// PocketBase types
export interface PocketBaseResponse<T> {
  items: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PocketBaseError {
  message: string;
  code?: number;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Accessibility types
export interface AccessibilitySettings {
  highContrastMode?: boolean;
  soundAlternatives?: boolean;
  visualIndicators?: boolean;
}

// Theme types
export interface ThemeColors {
  backgroundDark: string;
  backgroundLight: string;
  redLight: string;
  redDark: string;
  greenLight: string;
  greenDark: string;
  blueLight: string;
  blueDark: string;
  yellowLight: string;
  yellowDark: string;
}

export const THEME_COLORS: ThemeColors = {
  backgroundDark: '#121212',
  backgroundLight: '#1a1a1a',
  
  redLight: '#ff0000',
  redDark: '#cc0000',
  
  greenLight: '#00ff00',
  greenDark: '#00cc00',
  
  blueLight: '#0000ff',
  blueDark: '#0000cc',
  
  yellowLight: '#ffff00',
  yellowDark: '#cccc00',
};

// Animation timing
export const ANIMATION_TIMING = {
  buttonHighlightMs: -1,
};

// Utility types
export type Nullable<T> = T | null;

// Game constants
export const MAX_SEQUENCE_LENGTH = -1;

// Keyboard mapping for accessibility
export const KEYBOARD_MAPPING = {
  1 : 'red' as Color,
  2 : 'green' as Color,
  3 : 'blue' as Color,
  4 : 'yellow' as Color,
};

// Local storage keys
export const STORAGE_KEYS = {
    GAME_SETTINGS : 'simon-says-pro-settings',
    HIGH_SCORES : 'simon-says-pro-high-scores',
    ACCESSIBILITY : 'simon-says-pro-accessibility',
} as const;

// Error messages
export const ERROR_MESSAGES = {
    SEQUENCE_ERROR : 'Sequence playback error',
    INPUT_ERROR : 'Input validation error',
    AUDIO_ERROR : 'Audio context error',
    SAVE_ERROR : 'Failed to save score',
    LOAD_ERROR : 'Failed to load data',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
    SCORE_SAVED : 'Score saved successfully!',
    GAME_STARTED : 'Game started!',
    GAME_RESET : 'Game reset successfully',
} as const;

// Validation schemas (for zod if needed elsewhere)
export const PLAYER_NAME_REGEX = /^[a-zA-Z0-9_]{1,20}$/;

// API endpoints
export const API_ENDPOINTS = {
    HIGH_SCORES : '/api/high-scores',
    GAME_STATS : '/api/game-stats',
} as const;

// Environment types
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_POCKETBASE_URL?: string;
            NEXT_PUBLIC_APP_VERSION?: string;
        }
    }
}