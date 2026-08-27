import { useEffect, useState } from 'react';
import api from '../utils/api';

function normalizeAssets(response) {
  if (!Array.isArray(response)) throw new Error('Invalid media collection');
  const assets = response;
  return {
    galleryImages: assets
      .filter((asset) => String(asset?.mimeType || '').startsWith('image/'))
      .map((asset) => ({ ...asset, url: asset.secureUrl, label: asset.altText || 'Dunas Travel' })),
    videos: assets
      .filter((asset) => String(asset?.mimeType || '').startsWith('video/'))
      .map((asset) => ({ ...asset, url: asset.secureUrl, label: asset.altText || 'Dunas Travel' })),
  };
}

const mediaCache = new Map();
const pendingMediaRequests = new Map();
const MEDIA_CACHE_TTL_MS = 300_000; // 5 minutes

export function useMedia(tourId = null) {
  const cacheKey = tourId ? `tour:${tourId}` : 'global';
  const [galleryImages, setGalleryImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMedia = async () => {
      try {
        await Promise.resolve();

        // 1. Serve from in-memory cache if fresh
        const cached = mediaCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < MEDIA_CACHE_TTL_MS) {
          if (isMounted) {
            setGalleryImages(cached.data.galleryImages);
            setVideos(cached.data.videos);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        setError(null);

        // 2. Deduplicate concurrent requests
        let request = pendingMediaRequests.get(cacheKey);
        if (!request) {
          const url = tourId ? `/media/tours/${encodeURIComponent(tourId)}` : '/media';
          request = api
            .get(url)
            .then((raw) => {
              const result = normalizeAssets(raw);
              mediaCache.set(cacheKey, { data: result, timestamp: Date.now() });
              return result;
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
          setGalleryImages([]);
          setVideos([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchMedia();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, tourId]);

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
