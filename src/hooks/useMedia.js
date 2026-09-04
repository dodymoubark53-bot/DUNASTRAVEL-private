import { useEffect, useState } from 'react';
import api from '../utils/api';

const DEFAULT_GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80', label: 'Cairo Pyramids', mimeType: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80', label: 'Nile Cruise', mimeType: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80', label: 'Cappadocia Balloons', mimeType: 'image/jpeg' },
  { url: 'https://cdn.al-ain.com/lg/images/2022/11/24/62-021616-best-tourist-areas-jordan-4.jpeg', label: 'Petra Wonder', mimeType: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', label: 'Dubai Skyline', mimeType: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200', label: 'Morocco Medina', mimeType: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80', label: 'Siwa Oasis', mimeType: 'image/jpeg' },
  { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', label: 'Red Sea Diving', mimeType: 'image/jpeg' }
];

function normalizeAssets(response, isSpecific = false) {
  if (!Array.isArray(response) || response.length === 0) {
    return {
      galleryImages: isSpecific ? [] : DEFAULT_GALLERY_IMAGES,
      videos: []
    };
  }
  const assets = response;
  const imgs = assets
    .filter((asset) => String(asset?.mimeType || '').startsWith('image/'))
    .map((asset) => ({ ...asset, url: asset.secureUrl || asset.url, label: asset.altText || asset.label || 'Dunas Travel' }));
  const vids = assets
    .filter((asset) => String(asset?.mimeType || '').startsWith('video/'))
    .map((asset) => ({ ...asset, url: asset.secureUrl || asset.url, label: asset.altText || asset.label || 'Dunas Travel' }));

  return {
    galleryImages: imgs.length > 0 ? imgs : (isSpecific ? [] : DEFAULT_GALLERY_IMAGES),
    videos: vids,
  };
}

const mediaCache = new Map();
const pendingMediaRequests = new Map();
const MEDIA_CACHE_TTL_MS = 300_000; // 5 minutes

export function useMedia(optionsOrTourId = null) {
  let tourId = null;
  let category = null;

  if (typeof optionsOrTourId === 'string') {
    tourId = optionsOrTourId;
  } else if (optionsOrTourId && typeof optionsOrTourId === 'object') {
    tourId = optionsOrTourId.tourId || null;
    category = optionsOrTourId.category || null;
  }

  const isSpecific = Boolean(tourId || category);
  const cacheKey = category
    ? `category:${category}`
    : tourId
    ? `tour:${tourId}`
    : 'global';

  const [galleryImages, setGalleryImages] = useState(() => {
    const cached = mediaCache.get(cacheKey);
    return cached?.data?.galleryImages || (isSpecific ? [] : DEFAULT_GALLERY_IMAGES);
  });
  const [videos, setVideos] = useState(() => {
    const cached = mediaCache.get(cacheKey);
    return cached?.data?.videos || [];
  });
  const [loading, setLoading] = useState(() => !mediaCache.has(cacheKey));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMedia = async () => {
      try {
        const cached = mediaCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < MEDIA_CACHE_TTL_MS) {
          if (isMounted) {
            setGalleryImages(cached.data.galleryImages);
            setVideos(cached.data.videos);
            setLoading(false);
          }
          return;
        }

        if (!cached) {
          setLoading(true);
        }
        setError(null);

        // 2. Deduplicate concurrent requests
        let request = pendingMediaRequests.get(cacheKey);
        if (!request) {
          let url = '/media';
          if (category) {
            url = `/media?category=${encodeURIComponent(category)}`;
          } else if (tourId) {
            url = `/media/tours/${encodeURIComponent(tourId)}`;
          }

          request = api
            .get(url)
            .then((raw) => {
              const result = normalizeAssets(raw, isSpecific);
              mediaCache.set(cacheKey, { data: result, timestamp: Date.now() });
              return result;
            })
            .catch(() => {
              const fallback = {
                galleryImages: isSpecific ? [] : DEFAULT_GALLERY_IMAGES,
                videos: [],
              };
              mediaCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
              return fallback;
            })
            .finally(() => pendingMediaRequests.delete(cacheKey));
          pendingMediaRequests.set(cacheKey, request);
        }

        const result = await request;
        if (isMounted) {
          setGalleryImages(result.galleryImages);
          setVideos(result.videos);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError?.status === 404 ? null : requestError);
          if (!isSpecific) {
            setGalleryImages(DEFAULT_GALLERY_IMAGES);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchMedia();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, isSpecific, category, tourId]);

  return {
    galleryImages,
    videos,
    loading,
    error,
    retry: () => {
      mediaCache.delete(cacheKey);
      setLoading(true);
    },
  };
}
