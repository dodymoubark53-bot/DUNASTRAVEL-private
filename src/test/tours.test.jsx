import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, renderHook, act, fireEvent } from '@testing-library/react';
import { useTours } from '../hooks/useTours';
import { useTour } from '../hooks/useTour';
import { useReviews } from '../hooks/useReviews';
import { useCmsBlock } from '../hooks/useCmsBlock';
import { useMedia } from '../hooks/useMedia';
import ReviewsMap from '../components/tour/ReviewsMap';
import api from '../utils/api';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => (typeof fallback === 'string' ? fallback : key),
    i18n: { language: 'es', dir: () => 'ltr' },
  }),
}));

describe('Prompt 02: Tours Catalog, Localization & Reviews Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('useTours includes active lang and catalog filters in GET /api/tours', async () => {
    const mockTours = [
      { id: 't-1', slug: 'grand-pyramids', title: 'Grand Pyramids', category: 'classic', basePriceUsd: 1500 },
    ];
    vi.spyOn(api, 'get').mockResolvedValue(mockTours);

    const { result } = renderHook(() => useTours({ destination: 'egypt', category: 'classic', limit: 5 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/tours?'));
    const callUrl = vi.mocked(api.get).mock.calls[0][0];
    expect(callUrl).toContain('lang=es');
    expect(callUrl).toContain('destination=egypt');
    expect(callUrl).toContain('category=classic');
    expect(callUrl).toContain('limit=5');
    expect(result.current.tours.length).toBe(1);
    expect(result.current.tours[0].slug).toBe('grand-pyramids');
  });

  it('useTour passes active lang parameter to GET /api/tours/:slug', async () => {
    const mockTour = { slug: 'greece-odyssey', title: 'Greece Odyssey', itinerary: [{ day: 1, title: 'Arrival' }] };
    vi.spyOn(api, 'get').mockResolvedValue(mockTour);

    const { result } = renderHook(() => useTour('greece-odyssey'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/tours/greece-odyssey?lang=es');
    expect(result.current.tour.title).toBe('Greece Odyssey');
  });

  it('falls back to seed data ONLY when network connection is down in useTour', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTour('classic-egypt-pyramids'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    // Verify fallback tour exists
    expect(result.current.tour).toBeDefined();
  });

  it('ReviewsMap fetches reviews from GET /api/tours/:slug/reviews and submits to POST /api/tours/:slug/reviews', async () => {
    const mockReviews = [
      { name: 'John Doe', country: 'USA', rating: 5, text: 'Amazing experience!', date: 'May 2026' },
    ];
    vi.spyOn(api, 'get').mockResolvedValue(mockReviews);
    vi.spyOn(api, 'post').mockResolvedValue({ success: true });

    render(<ReviewsMap tourId="grand-pyramids" />);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    });

    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/tours/grand-pyramids/reviews?lang=es'));

    // Submit review form
    const nameInput = screen.getByLabelText(/Your Name/i);
    const reviewInput = screen.getByLabelText(/Your Review/i);
    const submitBtn = screen.getByRole('button', { name: /Submit Review/i });

    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    fireEvent.change(reviewInput, { target: { value: 'Unforgettable tour!' } });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // Verify immediate ticker refresh and POST call
    await waitFor(() => {
      expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0);
    });
    expect(api.post).toHaveBeenCalledWith('/tours/grand-pyramids/reviews', expect.objectContaining({ name: 'Jane Smith', text: 'Unforgettable tour!' }));
  });

  it('useCmsBlock passes lang to GET /api/cms/:key', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ content: { title: 'Welcome Banner' } });

    const { result } = renderHook(() => useCmsBlock('home_banner'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/cms/home_banner?lang=es');
    expect(result.current.data).toEqual({ title: 'Welcome Banner' });
  });

  it('useMedia fetches official tour gallery photos via GET /api/admin/media/tours/:tourId', async () => {
    const mockMedia = [{ id: 'm-1', url: '/images/tour1.jpg' }];
    vi.spyOn(api, 'get').mockResolvedValue(mockMedia);

    const { result } = renderHook(() => useMedia('tour-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/admin/media/tours/tour-123');
    expect(result.current.galleryImages.length).toBe(1);
  });
});
