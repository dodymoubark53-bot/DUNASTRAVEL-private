import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { tours as staticTours } from '../data/tours.js';

function normalizeTour(data) {
  if (!data?.id || !data?.slug || !data?.title || typeof data.currency !== 'string') {
    throw new Error('Invalid tour details response');
  }
  const price = Number(data.basePriceUsd);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${data.slug}`);
  }
  if (!Array.isArray(data.images) || !Array.isArray(data.itinerary)
    || !Array.isArray(data.includedServices) || !Array.isArray(data.excludedServices)) {
    throw new Error(`Invalid canonical tour presentation for ${data.slug}`);
  }
  const images = data.images.map((image) => {
    if (!image?.id || typeof image.imageUrl !== 'string') {
      throw new Error(`Invalid canonical tour image for ${data.slug}`);
    }
    return image.imageUrl;
  });
  const itinerary = data.itinerary.map((item) => {
    if (!item?.id || !Number.isInteger(item.sortOrder) || typeof item.description !== 'string') {
      throw new Error(`Invalid canonical itinerary item for ${data.slug}`);
    }
    return {
      ...item,
      day: item.sortOrder + 1,
      title: item.dayLabel || '',
      meals: item.meals || null,
    };
  });

  return {
    ...data,
    images,
    included: data.includedServices,
    excluded: data.excludedServices,
    itinerary,
    price,
  };
}

function getStaticTour(slug, lang) {
  const norm = String(slug).toLowerCase();
  const found = staticTours.find(
    (t) => (t.slug && t.slug.toLowerCase() === norm) || (t.id && String(t.id).toLowerCase() === norm)
  );
  if (!found) return null;

  const langKey = lang ? lang.toLowerCase() : 'en';

  const titleRaw = found.name || found.title;
  const title = typeof titleRaw === 'object' ? titleRaw[langKey] || titleRaw.ar || titleRaw.en || found.slug : titleRaw;

  const overviewRaw = found.overview || found.description;
  const overview = typeof overviewRaw === 'object' ? overviewRaw[langKey] || overviewRaw.ar || overviewRaw.en || '' : overviewRaw || '';

  const durationRaw = found.duration;
  const duration = typeof durationRaw === 'object' ? durationRaw[langKey] || durationRaw.ar || durationRaw.en || '' : durationRaw || '';

  const includedServices = Array.isArray(found.included)
    ? found.included
    : (found.included && (found.included[langKey] || found.included.ar || found.included.en)) || [];

  const excludedServices = Array.isArray(found.excluded)
    ? found.excluded
    : (found.excluded && (found.excluded[langKey] || found.excluded.ar || found.excluded.en)) || [];

  const itinerary = (found.days || found.itinerary || []).map((d, i) => {
    const dTitle = typeof d.title === 'object' ? d.title[langKey] || d.title.ar || d.title.en : d.title || `Day ${i + 1}`;
    const dDesc = typeof d.description === 'object' ? d.description[langKey] || d.description.ar || d.description.en : d.description || '';
    const dMeals = typeof d.meals === 'object' ? d.meals[langKey] || d.meals.ar || d.meals.en : d.meals || '';
    return {
      id: `itin-${i}`,
      sortOrder: i,
      day: i + 1,
      dayLabel: dTitle,
      title: dTitle,
      description: dDesc,
      meals: dMeals,
    };
  });

  const basePriceUsd = found.basePriceUsd || found.price || 450;

  return {
    id: found.id || found.slug,
    slug: found.slug,
    title,
    overview,
    duration,
    basePriceUsd,
    price: basePriceUsd,
    currency: 'USD',
    images: found.images && found.images.length > 0 ? found.images : [found.heroImage || 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200'],
    includedServices,
    excludedServices,
    included: includedServices,
    excluded: excludedServices,
    itinerary,
  };
}

export function useTour(slug) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return undefined;

    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        let result;
        try {
          result = normalizeTour(
            await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`),
          );
        } catch {
          result = getStaticTour(slug, lang);
        }

        if (!result) {
          result = getStaticTour(slug, lang);
        }

        if (isMounted) {
          if (result) {
            setTour(result);
            setError(null);
          } else {
            setError('Tour not found');
            setTour(null);
          }
        }
      } catch (requestError) {
        if (isMounted) {
          const fallback = getStaticTour(slug, lang);
          if (fallback) {
            setTour(fallback);
            setError(null);
          } else {
            setError(requestError);
            setTour(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { tour, loading, error };
}
