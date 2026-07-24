import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useCmsBlock(key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchBlock = async () => {
      try {
        setLoading(true);
        // GET /api/cms/:key
        const res = await api.get(`/cms/${key}`);
        if (isMounted && res?.content) {
          setData(res.content);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.warn(`[CMS] Failed to fetch block '${key}', falling back to static content.`, err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlock();

    return () => {
      isMounted = false;
    };
  }, [key]);

  return { data, loading, error };
}
