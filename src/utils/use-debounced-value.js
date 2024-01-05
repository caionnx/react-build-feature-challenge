import { useState, useEffect, useMemo } from "react";

const debounced = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export default function useDebouncedValue(initialValue, timeout = 500) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState('');

  const debouncedSearch = useMemo(() => debounced((value) => {
      setDebouncedValue(value);
  }, timeout), [timeout]);

  useEffect(() => {
      debouncedSearch(value);
      return () => {
        clearTimeout(debouncedSearch);
      };
  }, [value, debouncedSearch]);

  return [value, setValue, debouncedValue]
}