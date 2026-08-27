import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, renderHook, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import TourCard from '../components/tour/TourCard';
import UserDashboard from '../pages/user/UserDashboard';
import api from '../utils/api';
import * as AuthContextModule from '../context/AuthContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => (typeof fallback === 'string' ? fallback : key),
    i18n: { language: 'en', dir: () => 'ltr' },
  }),
}));

vi.mock('../context/CurrencyContext', () => ({
  useCurrency: () => ({
    currency: 'USD',
    formatPrice: (p) => `$${p}`,
  }),
}));

describe('Prompt 03: User Wishlist & Favorites System', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('fetches user favorites from GET /api/auth/favorites when user is logged in', async () => {
    const mockFavs = [
      { id: 'tour-101', slug: 'grand-pyramids', title: 'Grand Pyramids Tour', price: 1200, images: ['/img1.jpg'] },
    ];
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'u-1', email: 'test@dunas.com' },
    });
    vi.spyOn(api, 'get').mockResolvedValue(mockFavs);

    const { result } = renderHook(() => useWishlist());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(api.get).toHaveBeenCalledWith('/auth/favorites');
    expect(result.current.favorites.length).toBe(1);
    expect(result.current.isFavorite('tour-101')).toBe(true);
  });

  it('toggles favorite via POST /api/tours/:tourId/favorite and DELETE /api/tours/:tourId/favorite', async () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'u-1', email: 'test@dunas.com' },
    });
    vi.spyOn(api, 'get').mockResolvedValue([]);
    vi.spyOn(api, 'post').mockResolvedValue({ success: true });
    vi.spyOn(api, 'delete').mockResolvedValue({ success: true });

    const { result } = renderHook(() => useWishlist());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Add favorite
    await act(async () => {
      await result.current.toggleFavorite('tour-101');
    });
    expect(api.post).toHaveBeenCalledWith('/tours/tour-101/favorite', {});

    // Mock favorites state after add
    vi.spyOn(api, 'get').mockResolvedValue([{ id: 'tour-101', slug: 'tour-101' }]);
    await act(async () => {
      await result.current.refetchFavorites();
    });
    expect(result.current.isFavorite('tour-101')).toBe(true);

    // Remove favorite
    await act(async () => {
      await result.current.toggleFavorite('tour-101');
    });
    expect(api.delete).toHaveBeenCalledWith('/tours/tour-101/favorite');
    expect(result.current.isFavorite('tour-101')).toBe(false);
  });

  it('renders interactive heart icon on TourCard and triggers toggleFavorite', async () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'u-1', email: 'test@dunas.com' },
    });
    vi.spyOn(api, 'get').mockResolvedValue([]);
    vi.spyOn(api, 'post').mockResolvedValue({ success: true });

    const testTour = { id: 'tour-55', slug: 'nile-cruise', title: 'Nile Cruise', price: 900, images: ['/img.jpg'], duration: '5 Days' };

    render(
      <MemoryRouter>
        <TourCard tour={testTour} />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByRole('button', { name: /Toggle wishlist/i });
    expect(toggleBtn).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(toggleBtn);
    });

    expect(api.post).toHaveBeenCalledWith('/tours/tour-55/favorite', {});
  });

  it('displays Saved Tours tab in UserDashboard with a live grid of user favorites', async () => {
    const savedTour = { id: 'tour-99', slug: 'greece-expedition', title: 'Greece Expedition', price: 2000, images: ['/greece.jpg'], duration: '7 Days' };

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { id: 'u-1', name: 'Traveler', email: 'traveler@dunas.com' },
      logout: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      getUserBookings: vi.fn().mockResolvedValue([]),
    });

    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url === '/auth/favorites') return Promise.resolve([savedTour]);
      return Promise.resolve([]);
    });

    render(
      <MemoryRouter>
        <UserDashboard initialTab="favorites" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Your Saved Tours')).toBeInTheDocument();
      expect(screen.getAllByText('Greece Expedition').length).toBeGreaterThan(0);
    });
  });
});
