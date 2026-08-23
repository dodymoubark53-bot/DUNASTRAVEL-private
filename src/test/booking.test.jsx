import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import BookingForm from '../components/booking/BookingForm';
import api from '../utils/api';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, defaultValue) => (typeof defaultValue === 'string' ? defaultValue : key),
    i18n: { language: 'en', dir: () => 'ltr' },
  }),
}));

describe('Prompt 04: Booking Engine & Customer Inquiries Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    vi.spyOn(api, 'get').mockResolvedValue({
      availabilities: [
        {
          id: 'availability-2027-05-10',
          date: '2027-05-10T00:00:00.000Z',
          remainingSeats: 20,
          status: 'AVAILABLE',
        },
      ],
    });
  });

  it('submits inquiry payload via Nest API and presents success message', async () => {
    const mockInquiryResponse = {
      id: 'inq-99',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    vi.spyOn(api, 'post').mockResolvedValue(mockInquiryResponse);

    const { container } = render(<BookingForm tourTitle="Pyramids & Nile Luxury Cruise" />);

    // Switch to Inquiry tab
    const inquiryTab = screen.getByRole('button', { name: /Inquiry/i });
    fireEvent.click(inquiryTab);

    // Select form inputs by ID
    const nameInput = container.querySelector('#inquiry-name');
    const emailInput = container.querySelector('#inquiry-email');
    const phoneInput = container.querySelector('#inquiry-phone');
    const messageInput = container.querySelector('#inquiry-msg');

    expect(nameInput).not.toBeNull();
    expect(emailInput).not.toBeNull();
    expect(phoneInput).not.toBeNull();
    expect(messageInput).not.toBeNull();

    fireEvent.change(nameInput, { target: { value: 'Alice Smith' } });
    fireEvent.change(emailInput, { target: { value: 'alice@luxury.com' } });
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } });
    fireEvent.change(messageInput, { target: { value: 'Interested in March 2027 trip.' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Inquiry Sent')).toBeInTheDocument();
    });

    expect(api.post).toHaveBeenCalledWith('/inquiries', expect.objectContaining({
      tourTitle: 'Pyramids & Nile Luxury Cruise',
      fullName: 'Alice Smith',
      email: 'alice@luxury.com',
      phone: '+1234567890',
      message: 'Interested in March 2027 trip.',
    }));
  }, 20000);

  it('calls POST /api/bookings/calculate for pricing preview', async () => {
    const mockCalcResponse = { totalAmountUsd: '2400.00', promoValid: false };
    vi.spyOn(api, 'post').mockResolvedValue(mockCalcResponse);

    render(<BookingForm tourId="tour-pyramids" tourTitle="Pyramids Tour" />);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/bookings/calculate', expect.objectContaining({
        tourId: 'tour-pyramids',
        availabilityId: 'availability-2027-05-10',
        adults: 1,
        children: 0,
      }));
    });
  });

  it('uses the backend slug as the canonical booking identifier for static programs', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({ totalAmountUsd: '2400.00' });

    render(
      <BookingForm
        tourId="local-program-id"
        tourSlug="reg-22-stop-over-dubai"
        tourTitle="Stop Over Dubai"
      />,
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/bookings/calculate', expect.objectContaining({
        tourId: 'reg-22-stop-over-dubai',
        availabilityId: 'availability-2027-05-10',
      }));
    });
  });

  it('stores guestToken into localStorage (dunas_guest_token) upon successful booking creation', async () => {
    const mockBookingResponse = {
      id: 'bk-100',
      referenceCode: 'BK-DUNAS-100',
      guestToken: 'gt_secret_token_12345',
    };
    vi.spyOn(api, 'post').mockImplementation((path) => {
      if (path === '/bookings/calculate') return Promise.resolve({ totalAmountUsd: '1500.00' });
      if (path === '/bookings') return Promise.resolve(mockBookingResponse);
      return Promise.resolve({});
    });

    const { container } = render(<BookingForm tourId="tour-1" tourTitle="Cairo Discovery" />);

    await waitFor(() => {
      expect(container.querySelector('#arrival-date-input')?.tagName).toBe('SELECT');
    });

    const arrivalInput = container.querySelector('#arrival-date-input');
    const departureInput = container.querySelector('#departure-date-input');
    const fullNameInput = container.querySelector('#contact-fullname');
    const emailInput = container.querySelector('#contact-email');
    const phoneInput = container.querySelector('#contact-phone');

    fireEvent.change(arrivalInput, { target: { value: '2027-05-10' } });
    fireEvent.change(departureInput, { target: { value: '2027-05-18' } });
    fireEvent.change(fullNameInput, { target: { value: 'Robert Miller' } });
    fireEvent.change(emailInput, { target: { value: 'robert@dunas.com' } });
    fireEvent.change(phoneInput, { target: { value: '+1987654321' } });

    const form = container.querySelector('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(localStorage.getItem('dunas_guest_token')).toBe('gt_secret_token_12345');
    });

    expect(api.post).toHaveBeenCalledWith('/bookings', expect.objectContaining({
      tourId: 'tour-1',
      availabilityId: 'availability-2027-05-10',
      arrivalDate: '2027-05-10',
    }));
  });

  it('handles 409 conflict and 422 validation errors with localized alert messages', async () => {
    vi.spyOn(api, 'post').mockImplementation((path) => {
      if (path === '/bookings/calculate') return Promise.resolve({ totalAmountUsd: '1500.00' });
      if (path === '/bookings') {
        const error = new Error('Conflict');
        error.status = 409;
        return Promise.reject(error);
      }
      return Promise.resolve({});
    });

    const { container } = render(<BookingForm tourId="tour-1" tourTitle="Cairo Discovery" />);

    await waitFor(() => {
      expect(container.querySelector('#arrival-date-input')?.tagName).toBe('SELECT');
    });

    const arrivalInput = container.querySelector('#arrival-date-input');
    const departureInput = container.querySelector('#departure-date-input');
    const fullNameInput = container.querySelector('#contact-fullname');
    const emailInput = container.querySelector('#contact-email');
    const phoneInput = container.querySelector('#contact-phone');

    fireEvent.change(arrivalInput, { target: { value: '2027-05-10' } });
    fireEvent.change(departureInput, { target: { value: '2027-05-18' } });
    fireEvent.change(fullNameInput, { target: { value: 'Robert Miller' } });
    fireEvent.change(emailInput, { target: { value: 'robert@dunas.com' } });
    fireEvent.change(phoneInput, { target: { value: '+1987654321' } });

    const form = container.querySelector('form');
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(screen.getByText(/A booking conflict exists for the selected dates/i)).toBeInTheDocument();
    });
  });
});

