import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HotelDetails from '../pages/hotels/HotelDetails';
import RoomDetails from '../pages/hotels/RoomDetails';

let mockLanguage = 'en';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => (typeof defaultValue === 'string' ? defaultValue : key),
    i18n: {
      language: mockLanguage,
      dir: () => (mockLanguage.startsWith('ar') ? 'rtl' : 'ltr'),
    },
  }),
}));

vi.mock('../context/CurrencyContext', () => ({
  useCurrency: () => ({
    formatPrice: (price) => `$${price}`,
    currency: 'USD',
  }),
}));

vi.mock('../hooks/useHotels', () => ({
  useHotel: () => ({
    hotel: {
      name: mockLanguage.startsWith('ar') ? 'فندق سول بيراميد' : 'Sol Pyramid Hotel',
      stars: 3,
      address: 'Giza, Egypt',
      pricePerNight: 75,
      rooms: [
        {
          slug: 'single-room',
          name: mockLanguage.startsWith('ar') ? 'غرفة مفردة' : 'Single Room',
          ratePerNight: 75,
          maxOccupancy: 1,
        },
      ],
    },
    loading: false,
    error: null,
  }),
}));

describe('HotelDetails and RoomDetails components', () => {
  it('renders HotelDetails in English without isAr ReferenceError', () => {
    mockLanguage = 'en';
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/services/hotels/sol-pyramid-hotel']}>
          <Routes>
            <Route path="/services/hotels/:slug" element={<HotelDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getAllByText(/Sol Pyramid Hotel/i).length).toBeGreaterThan(0);
    expect(screen.getByText('View Available Rooms')).toBeInTheDocument();
  });

  it('renders HotelDetails in Arabic without isAr ReferenceError', () => {
    mockLanguage = 'ar';
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/services/hotels/sol-pyramid-hotel']}>
          <Routes>
            <Route path="/services/hotels/:slug" element={<HotelDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getAllByText(/Sol Pyramid Hotel|فندق سول بيراميد/i).length).toBeGreaterThan(0);
    expect(screen.getByText('غرفة مفردة')).toBeInTheDocument();
  });

  it('renders RoomDetails in English without isAr ReferenceError', () => {
    mockLanguage = 'en';
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/services/hotels/sol-pyramid-hotel/single-room']}>
          <Routes>
            <Route path="/services/hotels/:hotelSlug/:roomSlug" element={<RoomDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getAllByText(/Single Room/i).length).toBeGreaterThan(0);
  });

  it('renders RoomDetails in Arabic without isAr ReferenceError', () => {
    mockLanguage = 'ar';
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/services/hotels/sol-pyramid-hotel/single-room']}>
          <Routes>
            <Route path="/services/hotels/:hotelSlug/:roomSlug" element={<RoomDetails />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getAllByText(/غرفة مفردة/i).length).toBeGreaterThan(0);
  });
});
