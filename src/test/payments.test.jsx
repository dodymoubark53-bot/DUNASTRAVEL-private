import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookingSuccess from '../pages/BookingSuccess';
import InvoiceModal from '../components/booking/InvoiceModal';
import api from '../utils/api';
import { assertPayLinkCheckoutUrl } from '../utils/paylink';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, fallback) => (typeof fallback === 'string' ? fallback : key),
    i18n: { language: 'en', dir: () => 'ltr' },
  }),
}));

describe('Prompt 05: Payments & Invoice System Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('BookingSuccess polls GET /api/payments/:id/status until SUCCEEDED', async () => {
    let callCount = 0;
    vi.spyOn(api, 'get').mockImplementation((url) => {
      if (url.includes('/payments/')) {
        callCount++;
        if (callCount === 1) return Promise.resolve({ status: 'PENDING' });
        return Promise.resolve({ status: 'SUCCEEDED', invoiceNumber: 'INV-2026-99' });
      }
      return Promise.resolve({});
    });

    render(
      <MemoryRouter initialEntries={['/booking-success?payment_id=1b75ef8c-5b72-4f8a-a9cb-03c7403282d5']}>
        <Routes>
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(
      () => {
        expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(api.get).toHaveBeenCalledWith('/payments/1b75ef8c-5b72-4f8a-a9cb-03c7403282d5/status');
  });

  it('renders FAILED payment state when status endpoint returns FAILED', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ status: 'FAILED' });

    render(
      <MemoryRouter initialEntries={['/booking-success?payment_id=1b75ef8c-5b72-4f8a-a9cb-03c7403282d5']}>
        <Routes>
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Payment Unsuccessful')).toBeInTheDocument();
    });
  });

  it('does not claim success when the payment-status request fails', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('network failure'));

    render(
      <MemoryRouter initialEntries={['/booking-success?payment_id=1b75ef8c-5b72-4f8a-a9cb-03c7403282d5']}>
        <Routes>
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Payment Unsuccessful')).toBeInTheDocument();
    });
    expect(screen.queryByText('Payment Successful!')).not.toBeInTheDocument();
  });

  it('passes PayLink callback fields to the backend and trusts reconciled state only', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      paymentId: '1b75ef8c-5b72-4f8a-a9cb-03c7403282d5',
      status: 'CAPTURED',
      invoiceNumber: 'INV-2026-100',
    });

    render(
      <MemoryRouter
        initialEntries={[
          '/booking-success?success=1&invoice_id=40506&invoice_status=PAID&message=Invoice%20Paid&signature=signed',
        ]}
      >
        <Routes>
          <Route path="/booking-success" element={<BookingSuccess />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    expect(api.post).toHaveBeenCalledWith('/payments/callback/getpayin', {
      success: '1',
      invoice_id: '40506',
      invoice_status: 'PAID',
      message: 'Invoice Paid',
      signature: 'signed',
    });
  });

  it('allows only the HTTPS PayLink checkout origin', () => {
    expect(
      assertPayLinkCheckoutUrl(
        'https://pay.getpayin.com/integration/checkout?invoice_id=40506',
      ),
    ).toContain('pay.getpayin.com');
    expect(() =>
      assertPayLinkCheckoutUrl('https://evil.example/checkout'),
    ).toThrow('untrusted checkout URL');
  });

  it('InvoiceModal fetches invoice document breakdown via GET /api/invoices/:invoiceNumber', async () => {
    const mockInvoice = {
      invoiceNumber: 'INV-2026-0001',
      tourTitle: 'Nile Cruise & Pyramids',
      fullName: 'John Doe',
      email: 'john@dunas.com',
      phone: '+123456789',
      totalAmount: 2500,
      currency: 'USD',
      status: 'confirmed',
      createdAt: '2026-07-25T10:00:00Z',
    };

    vi.spyOn(api, 'get').mockResolvedValue(mockInvoice);

    render(
      <InvoiceModal invoiceNumber="INV-2026-0001" onClose={() => {}} />
    );

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/invoices/INV-2026-0001');
      expect(screen.getByText('Nile Cruise & Pyramids')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
