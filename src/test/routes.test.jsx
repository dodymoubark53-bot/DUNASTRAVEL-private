import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Brazil from '../pages/destinations/Brazil';
import Italy from '../pages/destinations/Italy';
import Spain from '../pages/destinations/Spain';
import NotFound from '../pages/NotFound';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => (typeof defaultValue === 'string' ? defaultValue : key),
    i18n: { language: 'en', dir: () => 'ltr' },
  }),
}));

vi.mock('../hooks/useTours', () => ({
  useTours: () => ({ tours: [], loading: false, error: null }),
}));

describe('Frontend Route Registry & Destination Navigation', () => {
  it('renders Brazil destination page cleanly', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/destinations/brazil']}>
          <Routes>
            <Route path="/destinations/brazil" element={<Brazil />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Brasil')).toBeInTheDocument();
    });
  });

  it('renders Italy destination page cleanly', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/destinations/italy']}>
          <Routes>
            <Route path="/destinations/italy" element={<Italy />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Scopri l'Italia")).toBeInTheDocument();
    });
  });

  it('renders Spain destination page cleanly', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/destinations/spain']}>
          <Routes>
            <Route path="/destinations/spain" element={<Spain />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('España')).toBeInTheDocument();
    });
  });

  it('renders 404 NotFound page for unmapped routes', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/invalid-unknown-page']}>
          <Routes>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Destination Not Found')).toBeInTheDocument();
    });
  });
});
