import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, renderHook, fireEvent } from '@testing-library/react';
import { useTours } from '../hooks/useTours';
import { useTour } from '../hooks/useTour';
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
    vi.spyOn(api, 'get').mockResolvedValue({ data: mockTours, meta: { total: 1, page: 1, limit: 5, totalPages: 1 } });

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
    const mockTour = {
      id: 'tour-greece',
      slug: 'greece-odyssey',
      title: 'Greece Odyssey',
      basePriceUsd: '1200.00',
      currency: 'USD',
      images: [],
      itinerary: [],
      includedServices: [],
      excludedServices: [],
    };
    vi.spyOn(api, 'get').mockResolvedValue(mockTour);

    const { result } = renderHook(() => useTour('greece-odyssey'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/tours/greece-odyssey?lang=es');
    expect(result.current.tour.title).toBe('Greece Odyssey');
  });

  it('does not display seed data when the tour API is unavailable', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTour('classic-egypt-pyramids'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.tour).toBeNull();
  });

  it('ReviewsMap uses the verified UUID review contract and never inserts a local review', async () => {
    const mockReviews = [
      { id: 'review-1', reviewerName: 'John Doe', rating: 5, comment: 'Amazing experience!', createdAt: '2026-05-01T00:00:00.000Z' },
    ];
    vi.spyOn(api, 'get').mockResolvedValue({ data: mockReviews, ratingSummary: { averageRating: 5, totalReviews: 1 } });
    vi.spyOn(api, 'post').mockResolvedValue({ success: true });

    const tourId = '11111111-1111-4111-8111-111111111111';
    render(<ReviewsMap tourId={tourId} />);

    await waitFor(() => {
      expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
    });

    expect(api.get).toHaveBeenCalledWith(`/tours/${tourId}/reviews`);

    // Submit review form
    const bookingInput = screen.getByLabelText(/Completed booking ID/i);
    const reviewInput = screen.getByLabelText(/Your Review/i);
    fireEvent.change(bookingInput, { target: { value: '22222222-2222-4222-8222-222222222222' } });
    fireEvent.change(reviewInput, { target: { value: 'Unforgettable tour!' } });

    await waitFor(() => {
      expect(bookingInput.value).toBe('22222222-2222-4222-8222-222222222222');
      expect(reviewInput.value).toBe('Unforgettable tour!');
    });

    const formElement = bookingInput.closest('form');
    fireEvent.submit(formElement);

    // The API is authoritative: no pending review is inserted into the list.
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(`/tours/${tourId}/reviews`, {
        bookingId: '22222222-2222-4222-8222-222222222222',
        rating: 5,
        comment: 'Unforgettable tour!',
      });
    });
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
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

  it('useMedia fetches official tour gallery photos via GET /api/media/tours/:tourId', async () => {
    const mockMedia = [{ id: 'm-1', secureUrl: '/images/tour1.jpg', mimeType: 'image/webp' }];
    vi.spyOn(api, 'get').mockResolvedValue(mockMedia);

    const { result } = renderHook(() => useMedia('tour-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/media/tours/tour-123');
    expect(result.current.galleryImages.length).toBe(1);
  });
});
