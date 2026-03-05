export const GAME_NAME = "SimonSays Pro";
export const GAME_SLOGAN = "¿Puedes seguir el ritmo de la luz?";

// Colors for Simon buttons
export const SIMON_COLORS = {
  RED: {
    id: 'red',
    name: 'Red',
    light: '#ff0000',
    dark: '#cc0000',
    soundFrequency: 329.63, // E4
    key: '1',
    symbol: 'R'
  },
  GREEN: {
    id: 'green',
    name: 'Green',
    light: '#00ff00',
    dark: '#00cc00',
    soundFrequency: 261.63, // C4
    key: '2',
    symbol: 'G'
  },
  BLUE: {
    id: 'blue',
    name: 'Blue',
    light: '#0000ff',
    dark: '#0000cc',
    soundFrequency: 392.00, // G4
    key: '3',
    symbol: 'B'
  },
  YELLOW: {
    id: 'yellow',
    name: 'Yellow',
    light: '#ffff00',
    dark: '#cccc00',
    soundFrequency: 293.66, // D4
    key: '4',
    symbol: 'Y'
  }
} as const;

export type SimonColorId = keyof typeof SIMON_COLORS;
export type SimonColor = typeof SIMON_COLORS[SimonColorId];

// Game difficulty levels
export const DIFFICULTY_LEVELS = {
  SLOW: {
    id: 'slow',
    name: 'Slow',
    sequenceSpeed: 1500,
    highlightDuration: 800,
    description: 'For beginners'
  },
  NORMAL: {
    id: 'normal',
    name: 'Normal',
    sequenceSpeed: 1000,
    highlightDuration: 500,
    description: 'Classic Simon speed'
  },
  FAST: {
    id: 'fast',
    name: 'Fast',
    sequenceSpeed: 600,
    highlightDuration: 300,
    description: 'Expert challenge'
  }
} as const;

export type DifficultyLevelId = keyof typeof DIFFICULTY_LEVELS;
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[DifficultyLevelId];

// Game states
export const GAME_STATES = {
  IDLE: 'idle',
  SEQUENCE_PLAYING: 'sequence_playing',
  AWAITING_INPUT: 'awaiting_input',
  INPUT_CORRECT: 'input_correct',
  INPUT_WRONG: 'input_wrong',
  GAME_OVER: 'game_over',
  PAUSED: 'paused'
} as const;

export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES];

// Game configuration
export const GAME_CONFIG = {
  INITIAL_SEQUENCE_LENGTH: 1,
  MAX_SEQUENCE_LENGTH: 20,
  MIN_SCORE_TO_SAVE: 5,
  MAX_NAME_LENGTH: 20,
  HIGH_SCORES_LIMIT: 10,
  VOLUME_MIN: 0,
  VOLUME_MAX: 100,
  VOLUME_DEFAULT: 70
} as const;

// Sound settings
export const SOUND_SETTINGS = {
  WAVE_TYPE: 'sine' as OscillatorType,
  DURATION: 0.3,
  FADE_OUT_DURATION: 0.1,
  ERROR_FREQUENCY: 220, // A3
  SUCCESS_FREQUENCY: 440, // A4
  ERROR_DURATION: 0.5
} as const;

// UI constants
export const UI_CONSTANTS = {
  // Colors
  BACKGROUND_DARK: '#121212',
  BACKGROUND_LIGHT: '#1a1a1a',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#b3b3b3',
  TEXT_DISABLED: '#666666',
  
  // Game casing colors
  CASING_TOP: '#333333',
  CASING_BOTTOM: '#444444',
  
  // Button glow effects
  GLOW_INTENSITY_LOW: '0px 0px 10px',
  GLOW_INTENSITY_MEDIUM: '0px 0px 20px',
  GLOW_INTENSITY_HIGH: '0px 0px 30px',
  
  // Animations
  TRANSITION_FAST: '150ms ease-in-out',
  TRANSITION_MEDIUM: '300ms ease-in-out',
  TRANSITION_SLOW: '500ms ease-in-out',
  
  // Border radius
  BORDER_RADIUS_SMALL: '8px',
  BORDER_RADIUS_MEDIUM: '12px',
  BORDER_RADIUS_LARGE: '20px',
  
  // Shadows
  SHADOW_SMALL: '0 2px 4px rgba(0,0,0,0.2)',
  SHADOW_MEDIUM: '0 4px 8px rgba(0,0,0,0.3)',
  SHADOW_LARGE: '0 8px 16px rgba(0,0,0,0.4)'
} as const;

// Responsive breakpoints (aligned with Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  START_GAME: ['Enter', 'Space'],
  RESTART_GAME: ['r', 'R'],
  TOGGLE_POWER: ['p', 'P'],
  TOGGLE_STRICT_MODE: ['s', 'S'],
  
  // Color buttons mapped to SIMON_COLORS keys
} as const;

// Accessibility constants
export const ACCESSIBILITY = {
  COLOR_BLIND_PATTERNS: {
    RED: { patternId: 'diagonal-stripes', angle: -45 },
    GREEN: { patternId: 'horizontal-stripes', angle: 0 },
    BLUE: { patternId: 'vertical-stripes', angle: 90 },
    YELLOW: { patternId: 'dots', spacing: -10 }
  },
  
  SOUND_ALTERNATIVES: {
    LOW_FREQ_RANGE_MIN: -200,
    LOW_FREQ_RANGE_MAX: -50,
    HIGH_FREQ_RANGE_MIN: -50,
    HIGH_FREQ_RANGE_MAX: -100
  },
  
  FOCUS_STYLES: {
    OUTLINE_COLOR: '#3b82f6', // blue-500
    OUTLINE_WIDTH: '2px',
    OUTLINE_OFFSET: '2px'
  }
} as const;

// API endpoints (for PocketBase)
export const API_ENDPOINTS = {
  HIGH_SCORES: '/api/collections/high_scores/records',
  
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  HIGH_SCORES_CACHE: 'simon_says_pro_high_scores_cache',
  
} as const;

// Error messages
export const ERROR_MESSAGES = {
  
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  
} as const;

// Game over messages (randomly selected)
export const GAME_OVER_MESSAGES = [
  
] as const;

// Validation constants
export const VALIDATION = {
  
} as const;

// Performance constants
export const PERFORMANCE = {
  
} as const;