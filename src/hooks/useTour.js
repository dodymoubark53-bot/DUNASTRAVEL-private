import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { tours as staticTours } from '../data/tours';
import { multiCountryTours } from '../data/multiCountryTours';
import programsData from '../data/programs.json';
import { turkeyTours } from '../data/turkeyTours';
import { tunisiaTours } from '../data/tunisiaTours';

const getAllFallbackTours = () => {
  const list = [
    ...(staticTours || []),
    ...(multiCountryTours || []),
    ...(turkeyTours || []),
    ...(tunisiaTours || []),
    ...((programsData && programsData.programs) || [])
  ];
  return list;
};

export function useTour(slug) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return;

    const findFallbackTour = (targetSlug) => {
      const all = getAllFallbackTours();
      const norm = String(targetSlug).toLowerCase().trim();
      const match = all.find(t => 
        (t.slug && t.slug.toLowerCase() === norm) ||
        (t.id && String(t.id).toLowerCase() === norm) ||
        (t.code && String(t.code).toLowerCase() === norm) ||
        (t.slug && t.slug.toLowerCase().includes(norm))
      );

      if (!match) return null;

      return {
        ...match,
        id: match.id || match.slug,
        slug: match.slug || match.id,
        title: match.title || match.name,
        subtitle: match.subtitle || match.tag,
        overview: match.overview || match.description || match.desc,
        duration: match.duration || '8 Days / 7 Nights',
        destination: match.destination || 'egypt',
        price: parseFloat(match.price || match.basePriceUsd || (match.raw && match.raw.price) || 890),
        raw: {
          price: parseFloat(match.price || match.basePriceUsd || (match.raw && match.raw.price) || 890),
          type: match.type || match.category || 'Luxury Journey'
        },
        images: Array.isArray(match.images) && match.images.length > 0
          ? match.images
          : match.heroImage
          ? [match.heroImage]
          : ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'],
        highlights: match.highlights || [],
        included: match.included || [],
        excluded: match.excluded || [],
        itinerary: match.itinerary || [],
        optionalExcursions: match.optionalExcursions || match.excursions || [],
        pricingTiers: match.pricingTiers || match.rates || [],
        hotels: match.hotels || {},
        hotelCategory: match.hotelCategory || '5-Star Luxury'
      };
    };

    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        // Always pass 'lang' query parameter matching active i18n language
        const data = await api.get(`/tours/${encodeURIComponent(slug)}?lang=${lang}`);
        if (isMounted) {
          if (data && (data.id || data.slug || data.title)) {
            setTour({
              ...data,
              images: Array.isArray(data.images) && data.images.length > 0
                ? data.images
                : data.heroImage
                ? [data.heroImage]
                : ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'],
            });
          } else {
            const fallback = findFallbackTour(slug);
            setTour(fallback);
          }
        }
      } catch (err) {
        // Fall back gracefully to curated luxury catalog
        if (isMounted) {
          const fallback = findFallbackTour(slug);
          if (fallback) {
            setTour(fallback);
          } else {
            setError(err);
            setTour(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { tour, loading, error };
}

