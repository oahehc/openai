import useLocalStorage, { localStorageKeys } from "./useLocalStorage";

export default function useCount() {
  const [storedValue, setValue] = useLocalStorage<Record<string, number>>(
    localStorageKeys.UsageCount,
    {}
  );

  function addCount(action: string) {
    setValue({
      ...storedValue,
      [action]: storedValue?.[action] ? storedValue[action] + 1 : 1,
    });
  }
  function resetCount(action: string) {
    setValue({
      ...storedValue,
      [action]: 0,
    });
  }
  function getCount(action: string) {
    return storedValue?.[action] || 0;
  }
  function resetAll() {
    setValue({});
  }

  return {
    addCount,
    resetCount,
    getCount,
    resetAll,
  };
}
