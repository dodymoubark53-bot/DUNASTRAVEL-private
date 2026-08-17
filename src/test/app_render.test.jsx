import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { ThemeProvider } from '../context/ThemeContext';
import { initI18n } from '../i18n';

describe('Full App Rendering Test', () => {
  it('renders App cleanly without ErrorBoundary crash', async () => {
    await initI18n();
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/']}>
          <CurrencyProvider>
            <ThemeProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ThemeProvider>
          </CurrencyProvider>
        </MemoryRouter>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('حدث خطأ غير متوقع')).toBeNull();
    }, { timeout: 3000 });
  });
});
