import { useState, useEffect } from 'react';

export const useUser = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsConnected(!!token);
  }, []);

  return { isConnected };
};
