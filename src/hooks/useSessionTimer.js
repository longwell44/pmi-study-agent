import { useState, useEffect, useRef } from 'react';

export function useSessionTimer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const reset = () => setSeconds(0);

  const formatted = [
    String(Math.floor(seconds / 3600)).padStart(2, '0'),
    String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'),
    String(seconds % 60).padStart(2, '0'),
  ]
    .filter((v, i) => i > 0 || v !== '00')
    .join(':');

  return { formatted, reset };
}
