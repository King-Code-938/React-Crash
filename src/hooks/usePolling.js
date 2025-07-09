import { useEffect } from 'react';

const usePolling = (callback, delay = 5000) => {
  useEffect(() => {
    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay]);
};

export default usePolling;
