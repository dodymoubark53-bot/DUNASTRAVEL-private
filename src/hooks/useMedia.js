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
        const url = tourId ? `/media/tours/${encodeURIComponent(tourId)}` : '/media';
        const result = normalizeAssets(await api.get(url));
        if (isMounted) {
          setGalleryImages(result.galleryImages);
          setVideos(result.videos);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
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
  }, [tourId]);

  return { galleryImages, videos, loading, error };
}
