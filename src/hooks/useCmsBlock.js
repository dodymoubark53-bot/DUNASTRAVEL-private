import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

export function useCmsBlock(key) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchBlock = async () => {
      try {
        setLoading(true);
        setError(null);
        // GET /api/cms/:key?lang=${lang}
        const res = await api.get(`/cms/${encodeURIComponent(key)}?lang=${lang}`);
        if (isMounted && res) {
          setData(res.content || res);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          console.warn(`[CMS] Failed to fetch block '${key}'.`, err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlock();

    return () => {
      isMounted = false;
    };
  }, [key, lang]);

  return { block: data, data, loading, error };
}
