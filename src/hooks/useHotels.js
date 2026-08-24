import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function supportedLocale(language) {
  const locale = (language || 'en').split('-')[0];
  return ['en', 'ar', 'es', 'pt', 'it'].includes(locale) ? locale : 'en';
}

export function useHotel(slug) {
  const { i18n } = useTranslation();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!slug) {
      return () => {
        active = false;
      };
    }
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        const item = await api.get(`/hotels/${encodeURIComponent(slug)}?locale=${supportedLocale(i18n.language)}`);
        if (active) setHotel(item);
      } catch (requestError) {
        if (active) {
          setHotel(null);
          setError(requestError);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchHotel();
    return () => {
      active = false;
    };
  }, [slug, i18n.language]);

  return {
    hotel: slug ? hotel : null,
    loading: slug ? loading : false,
    error: slug ? error : null,
  };
}
