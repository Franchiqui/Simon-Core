import { z } from 'zod';

// Game validation schemas
export const gameSettingsSchema = z.object({
  difficulty: z.enum(['slow', 'normal', 'fast']).default('normal'),
  volume: z.number().min(0).max(100).default(80),
  strictMode: z.boolean().default(false),
  soundEnabled: z.boolean().default(true),
  visualFeedback: z.boolean().default(true),
  colorblindMode: z.boolean().default(false),
});

export type GameSettings = z.infer<typeof gameSettingsSchema>;

export const scoreSubmissionSchema = z.object({
  playerName: z.string()
    .min(1, 'El nombre es requerido')
    .max(20, 'El nombre no puede exceder 20 caracteres')
    .regex(/^[a-zA-Z0-9\s]+$/, 'Solo letras, números y espacios permitidos'),
  level: z.number()
    .int('El nivel debe ser un número entero')
    .min(1, 'El nivel mínimo es 1')
    .max(999, 'El nivel máximo es 999'),
  score: z.number()
    .int('La puntuación debe ser un número entero')
    .min(0, 'La puntuación no puede ser negativa'),
  sequenceLength: z.number()
    .int('La longitud de secuencia debe ser un número entero')
    .min(1, 'La longitud mínima es 1'),
  difficulty: z.enum(['slow', 'normal', 'fast']),
  timestamp: z.date().optional(),
});

export type ScoreSubmission = z.infer<typeof scoreSubmissionSchema>;

export const gameStateSchema = z.object({
  isActive: z.boolean(),
  currentLevel: z.number().int().min(1),
  currentScore: z.number().int().min(0),
  sequence: z.array(z.enum(['red', 'green', 'blue', 'yellow'])),
  playerInput: z.array(z.enum(['red', 'green', 'blue', 'yellow'])),
  isPlayingSequence: z.boolean(),
  isWaitingForInput: z.boolean(),
  gameOver: z.boolean(),
  errorIndex: z.number().int().min(-1).optional(),
});

export type GameState = z.infer<typeof gameStateSchema>;

export const userInputSchema = z.object({
  color: z.enum(['red', 'green', 'blue', 'yellow']),
  timestamp: z.number().int().positive(),
});

export type UserInput = z.infer<typeof userInputSchema>;

// PocketBase validation
export const pocketbaseScoreSchema = scoreSubmissionSchema.extend({
  id: z.string().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
});

export type PocketbaseScore = z.infer<typeof pocketbaseScoreSchema>;

// Form validation schemas
export const playerNameFormSchema = z.object({
  playerName: scoreSubmissionSchema.shape.playerName,
});

export type PlayerNameFormData = z.infer<typeof playerNameFormSchema>;

export const settingsFormSchema = gameSettingsSchema;

export type SettingsFormData = z.infer<typeof settingsFormSchema>;

// Validation functions
export const validateGameSettings = (settings: unknown): GameSettings => {
  return gameSettingsSchema.parse(settings);
};

export const validateScoreSubmission = (score: unknown): ScoreSubmission => {
  return scoreSubmissionSchema.parse(score);
};

export const validateGameState = (state: unknown): GameState => {
  return gameStateSchema.parse(state);
};

export const validatePlayerName = (name: string): boolean => {
  try {
    playerNameFormSchema.shape.playerName.parse(name);
    return true;
  } catch {
    return false;
  }
};

export const validateColorInput = (color: string): color is GameState['sequence'][0] => {
  return ['red', 'green', 'blue', 'yellow'].includes(color);
};

// Sanitization functions
export const sanitizePlayerName = (name: string): string => {
  return name.trim().slice(0, 20);
};

export const sanitizeGameSettings = (settings: Partial<GameSettings>): GameSettings => {
  const defaults = gameSettingsSchema.parse({});
  
  return {
    ...defaults,
    ...settings,
    volume: Math.max(0, Math.min(100, settings.volume ?? defaults.volume)),
  };
};

// Utility validation functions
export const isValidLevel = (level: number): boolean => {
  return Number.isInteger(level) && level >= 1 && level <= 999;
};

export const isValidScore = (score: number): boolean => {
  return Number.isInteger(score) && score >= 0;
};

export const isValidSequenceLength = (length: number): boolean => {
  return Number.isInteger(length) && length >= 1;
};

export const isValidDifficulty = (difficulty: string): difficulty is GameSettings['difficulty'] => {
  return ['slow', 'normal', 'fast'].includes(difficulty);
};

// Response validation for API calls
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => 
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    timestamp: z.string(),
  });

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
};

// PocketBase specific validations
export const validatePocketbaseResponse = (response: unknown): PocketbaseScore => {
  return pocketbaseScoreSchema.parse(response);
};

export const validateScoreListResponse = (response: unknown): PocketbaseScore[] => {
  return z.array(pocketbaseScoreSchema).parse(response);
};

// Game logic validations
export const validateSequenceMatch = (
  expected: GameState['sequence'],
  actual: GameState['playerInput']
): { isValid: boolean; errorIndex?: number } => {
  
  if (actual.length > expected.length) {
    return { isValid: false, errorIndex: expected.length };
  }
  
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== expected[i]) {
      return { isValid: false, errorIndex: i };
    }
  }
  
  return { 
    isValid: actual.length === expected.length, 
    errorIndex: actual.length === expected.length ? -1 : undefined 
  };
};

export const calculateScore = (level: number, sequenceLength: number, difficulty: GameSettings['difficulty']): number => {
  if (!isValidLevel(level) || !isValidSequenceLength(sequenceLength)) {
    return 0;
  }
  
  const baseScore = level * sequenceLength * 10;
  
  const difficultyMultiplier = {
    slow: 1,
    normal: 1.5,
    fast: 2,
  }[difficulty];
  
  return Math.floor(baseScore * difficultyMultiplier);
};

// Environment validation
export const validateEnvironment = (): boolean => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_POCKETBASE_URL',
    'NEXT_PUBLIC_APP_URL',
  ];
  
  return requiredEnvVars.every(varName => 
    process.env[varName] && process.env[varName]!.length > 0
  );
};

// Export all types
export type {
  GameSettings,
  ScoreSubmission,
  GameState,
  UserInput,
  PocketbaseScore,
  PlayerNameFormData,
  SettingsFormData,
};