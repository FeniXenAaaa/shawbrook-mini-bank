import { useState, useCallback } from 'react';

//Small wrapper around async calls (could be more advance ofc)
//Usually, something like RTK Query is used
//But in banking app we would like to avoid caching in JS
//And also minimize amount of external deps
export function useAsync<T>(asyncFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err);
      throw err; // so caller can handle session expired, etc.
    } finally {
      setLoading(false);
    }
  }, deps);

  return { data, loading, error, execute };
}
