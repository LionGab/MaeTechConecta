/**
 * Hooks otimizados para performance
 *
 * Hooks que garantem memoização correta e evitam re-renders desnecessários
 */

import React, { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * useMemoizedCallback - Garante que callback só muda se dependências mudarem
 * Útil para passar callbacks para componentes memoizados
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(callback: T, deps: React.DependencyList): T {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    ((...args: any[]) => callbackRef.current(...args)) as T,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}

/**
 * useStableValue - Mantém referência estável de valor
 * Útil para valores que não devem causar re-renders
 */
export function useStableValue<T>(value: T): T {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * useDebounce - Debounce de valor
 * Útil para inputs de busca, etc
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useThrottle - Throttle de valor
 * Útil para eventos de scroll, resize, etc
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current)
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}
