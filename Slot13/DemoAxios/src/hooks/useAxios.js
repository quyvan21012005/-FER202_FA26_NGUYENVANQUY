import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useAxios = (apiFunction, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(controller.signal);
      setData(result);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

export default useAxios;