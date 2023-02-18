import { useEffect, useState } from "react";

export enum localStorageKeys {
  UsageCount = "UsageCount",
}

export default function useLocalStorage<T>(
  key: localStorageKeys,
  initialValue: T
): [T, (value: T | Function) => void] {
  const [storedValue, setStoredValue] = useState(initialValue);

  const setValue = (value: any) => {
    try {
      if (value instanceof Function) {
        setStoredValue((prev: T) => {
          const valueToStore = value(prev);
          window.localStorage.setItem(
            String(key),
            JSON.stringify(valueToStore)
          );

          return valueToStore;
        });
      } else {
        setStoredValue(value);
        window.localStorage.setItem(String(key), JSON.stringify(value));
      }
    } catch (error) {
      console.error("set value to local-storage fail:", error);
    }
  };

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(String(key));
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      setValue(initialValue);
    }
  }, []);

  return [storedValue, setValue];
}
