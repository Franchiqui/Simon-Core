'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type LocalStorageValue<T> = T | null;

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: Error) => void;
}

interface UseLocalStorageReturn<T> {
  value: LocalStorageValue<T>;
  setValue: (value: T | ((prev: LocalStorageValue<T>) => T)) => void;
  removeValue: () => void;
  isPersistent: boolean;
}

const IS_SERVER = typeof window === 'undefined';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError = (error) => console.error(`useLocalStorage error for key "${key}":`, error),
  } = options;

  const [storedValue, setStoredValue] = useState<LocalStorageValue<T>>(() => {
    if (IS_SERVER) return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      onError(error as Error);
      return initialValue;
    }
  });

  const [isPersistent, setIsPersistent] = useState(true);
  const initialValueRef = useRef(initialValue);
  const keyRef = useRef(key);

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: LocalStorageValue<T>) => T)) => {
      if (IS_SERVER) return;

      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        window.localStorage.setItem(keyRef.current, serializer(valueToStore));
        setIsPersistent(true);
      } catch (error) {
        onError(error as Error);
        setIsPersistent(false);
      }
    },
    [storedValue, serializer, onError]
  );

  const removeValue = useCallback(() => {
    if (IS_SERVER) return;

    try {
      window.localStorage.removeItem(keyRef.current);
      setStoredValue(initialValueRef.current);
      setIsPersistent(true);
    } catch (error) {
      onError(error as Error);
      setIsPersistent(false);
    }
  }, [onError]);

  useEffect(() => {
    if (IS_SERVER) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === keyRef.current && event.storageArea === window.localStorage) {
        try {
          const newValue = event.newValue ? deserializer(event.newValue) : initialValueRef.current;
          setStoredValue(newValue);
        } catch (error) {
          onError(error as Error);
        }
      }
    };

    const testPersistence = () => {
      try {
        const testKey = `__persistence_test_${Date.now()}__`;
        window.localStorage.setItem(testKey, 'test');
        window.localStorage.removeItem(testKey);
        setIsPersistent(true);
      } catch {
        setIsPersistent(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', testPersistence);

    testPersistence();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', testPersistence);
    };
  }, [deserializer, onError]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isPersistent,
  };
}

export function useLocalStorageGameState() {
  const { value: highScore, setValue: setHighScore } = useLocalStorage<number>('simon-high-score', 0);
  const { value: playerName, setValue: setPlayerName } = useLocalStorage<string>('simon-player-name', '');
  const { value: gameSettings, setValue: setGameSettings } = useLocalStorage<{
    difficulty: 'slow' | 'normal' | 'fast';
    volume: number;
    strictMode: boolean;
    colorBlindMode: boolean;
    soundEnabled: boolean;
  }>('simon-game-settings', {
    difficulty: 'normal',
    volume: 0.7,
    strictMode: false,
    colorBlindMode: false,
    soundEnabled: true,
  });

  const { value: recentGames, setValue: setRecentGames } = useLocalStorage<
    Array<{
      level: number;
      score: number;
      timestamp: number;
      sequenceLength: number;
    }>
  >('simon-recent-games', []);

  const addRecentGame = useCallback(
    (gameData: { level: number; score: number; sequenceLength: number }) => {
      setRecentGames((prev) => {
        const newGames = [
          { ...gameData, timestamp: Date.now() },
          ...(prev || []),
        ].slice(0, 10);
        return newGames;
      });
    },
    [setRecentGames]
  );

  const updateHighScore = useCallback(
    (score: number) => {
      if (score > (highScore || 0)) {
        setHighScore(score);
        return true;
      }
      return false;
    },
    [highScore, setHighScore]
  );

  const updateGameSetting = useCallback(
    <K extends keyof typeof gameSettings>(
      key: K,
      value: typeof gameSettings[K]
    ) => {
      if (!gameSettings) return;
      
      setGameSettings({
        ...gameSettings,
        [key]: value,
      });
    },
    [gameSettings, setGameSettings]
  );

  const clearAllGameData = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const keysToRemove = [
        'simon-high-score',
        'simon-player-name',
        'simon-game-settings',
        'simon-recent-games',
      ];

      keysToRemove.forEach((key) => window.localStorage.removeItem(key));
      
      window.location.reload();
    } catch (error) {
      console.error('Failed to clear game data:', error);
    }
  }, []);

  return {
    highScore: highScore || 0,
    playerName: playerName || '',
    gameSettings: gameSettings || {
      difficulty: 'normal',
      volume: 0.7,
      strictMode: false,
      colorBlindMode: false,
      soundEnabled: true,
    },
    recentGames: recentGames || [],
    
    setHighScore,
    setPlayerName,
    setGameSettings,
    
    addRecentGame,
    updateHighScore,
    updateGameSetting,
    clearAllGameData,
    
    isPersistent: true,
  };
}