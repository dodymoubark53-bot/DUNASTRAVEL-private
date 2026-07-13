import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const usePrograms = (category) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [data, setData] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchTours = async () => {
      try {
        const url = category 
          ? `http://localhost:5000/api/tours?category=${category}&lang=${lang}&limit=50`
          : `http://localhost:5000/api/tours?lang=${lang}&limit=100`;
          
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch tours');
        const json = await res.json();
        
        if (active) {
          const mapped = json.data.map(tour => ({
            id: tour.id,
            slug: tour.slug,
            title: tour.title,
            overview: tour.title, // summary API only returns title, so we use it for description fallback
            duration: tour.duration,
            images: [tour.heroImage || 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'],
            raw: { price: parseFloat(tour.basePriceUsd), type: tour.category },
            code: tour.id,
            highlights: tour.title,
          }));
          setData(mapped);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTours();
    return () => { active = false; };
  }, [category, lang]);

  return data;
};
