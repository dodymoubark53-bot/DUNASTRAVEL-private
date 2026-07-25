import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * Hook to fetch gallery media (images and videos) or official tour gallery photos via GET /api/admin/media/tours/:tourId or GET /api/media
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
          ? `/admin/media/tours/${encodeURIComponent(tourId)}`
          : '/media';

        const res = await api.get(url).catch(() => (tourId ? api.get(`/media/tours/${encodeURIComponent(tourId)}`) : api.get('/media')));
        if (isMounted && res) {
          const imgs = Array.isArray(res) ? res : (res.galleryImages || res.images || res.data || []);
          setGalleryImages(imgs);
          setVideos(res.videos || []);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useMedia] Failed to fetch media from API:', err);
          setError(err);
          setGalleryImages([]);
          setVideos([]);
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

