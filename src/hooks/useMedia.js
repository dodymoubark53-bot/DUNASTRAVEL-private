import { useState, useEffect } from 'react';
import api from '../utils/api';
import { galleryImages as staticImages, videos as staticVideos } from '../data/media';

const _mediaCache = new Map();
const _pendingMediaPromises = new Map();
const MEDIA_CACHE_TTL = 300_000; // 5 min TTL

/**
 * Hook to fetch gallery media (images and videos) with resilient fallback
 */
export function useMedia(tourId = null) {
  const cacheKey = tourId || 'global_gallery';

  const [galleryImages, setGalleryImages] = useState(() => {
    const cached = _mediaCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < MEDIA_CACHE_TTL) {
      return cached.data.galleryImages;
    }
    return [];
  });
  const [videos, setVideos] = useState(() => {
    const cached = _mediaCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < MEDIA_CACHE_TTL) {
      return cached.data.videos;
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    const cached = _mediaCache.get(cacheKey);
    return !(cached && Date.now() - cached.timestamp < MEDIA_CACHE_TTL);
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const cached = _mediaCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < MEDIA_CACHE_TTL) {
      if (isMounted) {
        setGalleryImages(cached.data.galleryImages);
        setVideos(cached.data.videos);
        setLoading(false);
      }
      return;
    }

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchPromise = _pendingMediaPromises.get(cacheKey);
        if (!fetchPromise) {
          const url = tourId
            ? `/tours/${encodeURIComponent(tourId)}`
            : '/cms/gallery';

          fetchPromise = api.get(url)
            .then(res => {
              const imgs = Array.isArray(res) ? res : (res?.galleryImages || res?.images || res?.data || []);
              const vids = res?.videos || [];
              const data = {
                galleryImages: imgs.length > 0 ? imgs : staticImages,
                videos: vids.length > 0 ? vids : staticVideos,
              };
              _mediaCache.set(cacheKey, { data, timestamp: Date.now() });
              return data;
            })
            .finally(() => {
              _pendingMediaPromises.delete(cacheKey);
            });

          _pendingMediaPromises.set(cacheKey, fetchPromise);
        }

        const result = await fetchPromise;
        if (isMounted) {
          setGalleryImages(result.galleryImages);
          setVideos(result.videos);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setGalleryImages(staticImages);
          setVideos(staticVideos);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMedia();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, tourId]);

  return { galleryImages, videos, loading, error };
}

