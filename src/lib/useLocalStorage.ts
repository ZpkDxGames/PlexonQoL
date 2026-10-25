"use client";

import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type SetStateAction,
} from "react";

const CHANGE_EVENT = "plexon-storage";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
const serverSnapshot = () => null;

export function useLocalStorage<T>(
  key: string,
  fallback: T,
  validate: (value: unknown) => value is T,
) {
  const [error, setError] = useState("");
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(`plexon-qol:v1:${key}`);
    } catch {
      return null;
    }
  }, [key]);
  const raw = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  const parse = useCallback(
    (text: string | null): T => {
      try {
        const value: unknown = text ? JSON.parse(text) : null;
        return validate(value) ? value : fallback;
      } catch {
        return fallback;
      }
    },
    [fallback, validate],
  );
  const value = useMemo(() => parse(raw), [raw, parse]);
  function update(next: SetStateAction<T>) {
    const result =
      typeof next === "function"
        ? (next as (previous: T) => T)(parse(getSnapshot()))
        : next;
    try {
      window.localStorage.setItem(
        `plexon-qol:v1:${key}`,
        JSON.stringify(result),
      );
      setError("");
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      setError(
        "Your browser could not save this change. Allow local storage and try again.",
      );
    }
  }
  return [value, update, error] as const;
}
