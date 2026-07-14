import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue === null ? initialValue : JSON.parse(storedValue);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  function setStoredValue(nextValue) {
    setValue((previousValue) => {
      const resolvedValue =
        typeof nextValue === "function" ? nextValue(previousValue) : nextValue;

      localStorage.setItem(key, JSON.stringify(resolvedValue));
      return resolvedValue;
    });
  }

  return [value, setStoredValue];
}
