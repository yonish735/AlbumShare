import { useEffect, useRef } from 'react';

// Hook. Call `callback` every `delay` milliseconds
const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  const lastCallback  = savedCallback.current;

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    const tick = () => savedCallback.current();

    if (delay !== null) {
      // Call `callback` once in the beginning
      tick();
      // Call `callback` at every `delay` ms
      let id = setInterval(tick, delay);
      // Cleanup
      return () => clearInterval(id);
    }
  }, [delay]);

  return lastCallback;
};

export default useInterval;
