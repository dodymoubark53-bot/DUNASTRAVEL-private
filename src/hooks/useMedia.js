import { useState, useEffect } from 'react';
import api from '../utils/api';
import { galleryImages as staticImages, videos as staticVideos } from '../data/media';

/**
 * Hook to fetch gallery media (images and videos) with resilient fallback
 */
export function useMedia(tourId = null) {
  const [galleryImages, setGalleryImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = tourId
          ? `/tours/${encodeURIComponent(tourId)}`
          : '/cms/gallery';

        const res = await api.get(url);
        if (isMounted && res) {
          const imgs = Array.isArray(res) ? res : (res.galleryImages || res.images || res.data || []);
          const vids = res.videos || [];
          setGalleryImages(imgs.length > 0 ? imgs : staticImages);
          setVideos(vids.length > 0 ? vids : staticVideos);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useMedia] Failed to fetch media from API, using fallback:', err);
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
  }, [tourId]);

  return { galleryImages, videos, loading, error };
}

