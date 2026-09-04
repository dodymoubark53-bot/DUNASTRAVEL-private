import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import TourCard from '../components/tour/TourCard';
import TourDetails from '../pages/tours/TourDetails';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => (typeof defaultValue === 'string' ? defaultValue : key),
    i18n: {
      language: 'en',
      dir: () => 'ltr',
    },
  }),
}));

vi.mock('../context/CurrencyContext', () => ({
  useCurrency: () => ({
    formatPrice: (price) => `$${price}`,
    currency: 'USD',
  }),
}));

vi.mock('../hooks/useWishlist', () => ({
  useWishlist: () => ({
    isFavorite: () => false,
    toggleFavorite: vi.fn(),
  }),
}));

vi.mock('../hooks/useTour', () => ({
  useTour: (slug) => ({
    tour: {
      id: slug,
      slug: slug,
      title: 'Grand Egypt & Jordan Pilgrimage - 14 Days',
      overview: 'Experience the holy journey across Cairo, Sinai, and Petra.',
      basePriceUsd: 2490,
      currency: 'USD',
      duration: '14 Days',
      images: ['https://images.unsplash.com/photo-1568322445389-f64ac2515020'],
      itinerary: [
        { day: 1, title: 'Arrival in Cairo', description: 'Welcome to Egypt.' },
        { day: 2, title: 'Pyramids of Giza', description: 'Explore the Great Pyramid.' },
      ],
      included: ['Private Transfers', '5-Star Accommodation'],
      excluded: ['International Flights'],
      highlights: ['Great Pyramids', 'Petra Treasury'],
    },
    loading: false,
    error: null,
  }),
}));

vi.mock('../hooks/useTours', () => ({
  useTours: () => ({
    tours: [],
    loading: false,
    error: null,
  }),
}));

describe('TourCard component', () => {
  it('renders "On Request" when price is 0 or null', () => {
    const freeTour = {
      id: 'reg-01-legendary-turkey',
      slug: 'reg-01-legendary-turkey',
      title: 'Legendary Turkey',
      basePriceUsd: 0,
      price: 0,
      duration: '11 Days',
      images: [],
    };

    render(
      <MemoryRouter>
        <TourCard tour={freeTour} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Legendary Turkey/i)).toBeInTheDocument();
    expect(screen.getByText(/On Request/i)).toBeInTheDocument();
    expect(screen.queryByText('$0')).not.toBeInTheDocument();
  });

  it('renders formatted price when price > 0', () => {
    const pricedTour = {
      id: 'hurghada-4d3n',
      slug: 'hurghada-4d3n',
      title: 'Hurghada Red Sea Extension',
      basePriceUsd: 450,
      price: 450,
      duration: '4 Days',
      images: [],
    };

    render(
      <MemoryRouter>
        <TourCard tour={pricedTour} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Hurghada Red Sea Extension/i)).toBeInTheDocument();
    expect(screen.getByText('$450')).toBeInTheDocument();
  });
});

describe('TourDetails component', () => {
  it('renders tour details with real title, overview, and itinerary', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/tours/egypt-jordan-combined-14d']}>
          <Routes>
            <Route path="/tours/:slug" element={<TourDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getAllByText(/Grand Egypt & Jordan Pilgrimage/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Arrival in Cairo/i)).toBeInTheDocument();
    expect(screen.getByText(/Pyramids of Giza/i)).toBeInTheDocument();
  });
});
