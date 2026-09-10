import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import LandingPageDetails from '../pages/destinations/LandingPageDetails';
import NotFound from '../pages/NotFound';

const { useLandingPage } = vi.hoisted(() => ({ useLandingPage: vi.fn() }));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => (typeof defaultValue === 'string' ? defaultValue : key),
    i18n: { language: 'en', dir: () => 'ltr' },
  }),
}));

vi.mock('../hooks/useLandingPage', () => ({ useLandingPage }));
vi.mock('../components/tour/TourCard', () => ({ default: ({ tour }) => <div>{tour.title}</div> }));

const persistedDestination = {
  id: 'destination-id', slug: 'brazil', type: 'DESTINATION', title: 'Brazil', subtitle: 'Rio and beyond', brief: 'A real persisted destination.', description: 'Curated travel in Brazil.', seoTitle: 'Brazil | Dunas', seoDescription: 'Brazil journeys', sections: [],
  tours: [{ id: 'tour-id', slug: 'rio-private', title: 'Rio Private', basePriceUsd: '1200.00', currency: 'USD', images: [], country: 'Brazil' }],
};

describe('Frontend destination and program routes', () => {
  it('renders a real destination slug from the canonical public endpoint hook', async () => {
    useLandingPage.mockReturnValue({ landingPage: persistedDestination, loading: false, error: null });
    render(<HelmetProvider><MemoryRouter initialEntries={['/destinations/brazil']}><Routes><Route path="/destinations/:slug" element={<LandingPageDetails destinationOnly />} /></Routes></MemoryRouter></HelmetProvider>);
    await waitFor(() => expect(screen.getByText('Brazil')).toBeInTheDocument());
    expect(screen.getByText('Rio Private')).toBeInTheDocument();
  });

  it('shows an honest unavailable state for unpublished, missing, or inactive public slugs', async () => {
    const notFoundError = Object.assign(new Error('Not found'), { status: 404 });
    useLandingPage.mockReturnValue({ landingPage: null, loading: false, error: notFoundError });
    render(<HelmetProvider><MemoryRouter initialEntries={['/destinations/missing']}><Routes><Route path="/destinations/:slug" element={<LandingPageDetails destinationOnly />} /></Routes></MemoryRouter></HelmetProvider>);
    await waitFor(() => expect(screen.getByText('This destination is unavailable')).toBeInTheDocument());
  });

  it('maps program slugs through the generic persisted landing-page route', async () => {
    useLandingPage.mockReturnValue({ landingPage: { ...persistedDestination, slug: 'multi-country', type: 'COLLECTION', title: 'Multi-country journeys' }, loading: false, error: null });
    render(<HelmetProvider><MemoryRouter initialEntries={['/programs/multi-country']}><Routes><Route path="/programs/:slug" element={<LandingPageDetails />} /></Routes></MemoryRouter></HelmetProvider>);
    await waitFor(() => expect(screen.getByText('Multi-country journeys')).toBeInTheDocument());
  });

  it('renders the existing 404 page for routes outside the registry', async () => {
    render(<HelmetProvider><MemoryRouter initialEntries={['/invalid-unknown-page']}><Routes><Route path="*" element={<NotFound />} /></Routes></MemoryRouter></HelmetProvider>);
    await waitFor(() => expect(screen.getByText('Destination Not Found')).toBeInTheDocument());
  });

  it('extracts slug from pathname fallback when static route or prop is used', async () => {
    useLandingPage.mockReturnValue({ landingPage: { ...persistedDestination, slug: 'egypt', title: 'Egypt' }, loading: false, error: null });
    render(<HelmetProvider><MemoryRouter initialEntries={['/destinations/egypt']}><Routes><Route path="/destinations/*" element={<LandingPageDetails destinationOnly />} /></Routes></MemoryRouter></HelmetProvider>);
    await waitFor(() => expect(screen.getByText('Egypt')).toBeInTheDocument());
  });
});
