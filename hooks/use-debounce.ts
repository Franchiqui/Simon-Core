import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDebounceOptions<T> {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
  equalityFn?: (a: T, b: T) => boolean;
}

export function useDebounce<T>(
  value: T,
  options: UseDebounceOptions<T> = {}
): T {
  const {
    delay = 300,
    leading = false,
    trailing = true,
    maxWait,
    equalityFn = (a, b) => a === b
  } = options;

  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const firstMountRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousValueRef = useRef<T>(value);
  const isLeadingCallRef = useRef(false);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      previousValueRef.current = value;
      return;
    }

    if (equalityFn(previousValueRef.current, value)) {
      return;
    }

    previousValueRef.current = value;

    const shouldCallLeading = leading && !isLeadingCallRef.current;
    
    if (shouldCallLeading) {
      setDebouncedValue(value);
      isLeadingCallRef.current = true;
    }

    if (maxWait && !maxTimeoutRef.current) {
      maxTimeoutRef.current = setTimeout(() => {
        if (trailing && !equalityFn(debouncedValue, value)) {
          setDebouncedValue(value);
        }
        clearTimeouts();
        isLeadingCallRef.current = false;
      }, maxWait);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (trailing && (!leading || !equalityFn(debouncedValue, value))) {
        setDebouncedValue(value);
      }
      timeoutRef.current = null;
      isLeadingCallRef.current = false;
      
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
    }, delay);

  }, [value, delay, leading, trailing, maxWait, equalityFn, debouncedValue, clearTimeouts]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: Omit<UseDebounceOptions<unknown>, 'equalityFn'> = {}
): (...args: Parameters<T>) => void {
  const {
    delay = 300,
    leading = false,
    trailing = true,
    maxWait
  } = options;

  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const isLeadingCallRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current);
      maxTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  const debouncedFunction = useCallback((...args: Parameters<T>) => {
    lastArgsRef.current = args;
    lastCallTimeRef.current = Date.now();

    const shouldCallLeading = leading && !isLeadingCallRef.current;
    
    if (shouldCallLeading) {
      callbackRef.current(...args);
      isLeadingCallRef.current = true;
    }

    if (maxWait && !maxTimeoutRef.current) {
      maxTimeoutRef.current = setTimeout(() => {
        if (trailing && lastArgsRef.current) {
          callbackRef.current(...lastArgsRef.current);
        }
        clearTimeouts();
        isLeadingCallRef.current = false;
        lastArgsRef.current = null;
      }, maxWait);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (trailing && lastArgsRef.current) {
        callbackRef.current(...lastArgsRef.current);
      }
      timeoutRef.current = null;
      isLeadingCallRef.current = false;
      lastArgsRef.current = null;
      
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
    }, delay);

  }, [delay, leading, trailing, maxWait, clearTimeouts]);

  return debouncedFunction;
}