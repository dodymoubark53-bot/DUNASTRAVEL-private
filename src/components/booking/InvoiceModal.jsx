import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  FaTimes, 
  FaFileInvoiceDollar, 
  FaPrint, 
  FaShieldAlt, 
  FaPlaneDeparture, 
  FaUser, 
  FaBuilding, 
  FaCheckCircle, 
  FaClock, 
  FaQrcode,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { normalizeInvoiceResponse } from '../../utils/invoice';
import { redirectToPayLinkCheckout } from '../../utils/paylink';
import { generateEtaQrDataUrl } from '../../utils/eta-qr';

const InvoiceModal = ({ booking: initialBooking = {}, invoiceNumber: propInvoiceNumber, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [invoiceData, setInvoiceData] = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const targetInvoiceNum = propInvoiceNumber || initialBooking?.invoiceNumber;
  const targetRefCode = initialBooking?.referenceCode || initialBooking?.bookingReference || initialBooking?.id;

  useEffect(() => {
    let isMounted = true;
    if (!targetInvoiceNum && !targetRefCode) return;

    const fetchInvoice = async () => {
      setLoadingInvoice(true);
      try {
        let data;
        if (targetInvoiceNum) {
          data = await api.get(`/invoices/${encodeURIComponent(targetInvoiceNum)}`);
        } else if (targetRefCode) {
          data = await api.get(`/bookings/${encodeURIComponent(targetRefCode)}/invoice`);
        }
        if (isMounted && data) setInvoiceData(data);
      } catch (err) {
        console.warn('[InvoiceModal] Failed to fetch invoice details from API:', err);
      } finally {
        if (isMounted) setLoadingInvoice(false);
      }
    };
    fetchInvoice();
    return () => {
      isMounted = false;
    };
  }, [targetInvoiceNum, targetRefCode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const booking = invoiceData
    ? normalizeInvoiceResponse({ ...initialBooking, ...invoiceData })
    : normalizeInvoiceResponse(initialBooking);

  const [qrDataUrl, setQrDataUrl] = useState('');
  useEffect(() => {
    let active = true;
    const generateQr = async () => {
      try {
        const total = booking?.totalAmount ?? booking?.total ?? 0;
        const subtotal = booking?.subtotal ?? total;
        const tax = booking?.tax ?? '0.00';
        const url = await generateEtaQrDataUrl({
          sellerName: 'Dunas Travel (DMC Lic. #1882)',
          taxId: booking?.taxId || '692-481-209',
          timestamp: booking?.createdAt || new Date().toISOString(),
          total,
          tax,
        });
        if (active) setQrDataUrl(url);
      } catch (err) {
        console.warn('[InvoiceModal] ETA QR generation error:', err);
      }
    };
    generateQr();
    return () => {
      active = false;
    };
  }, [booking?.totalAmount, booking?.total, booking?.tax, booking?.createdAt]);

  const handlePayNow = async () => {
    const bId = booking.id || booking.bookingId || initialBooking.id || initialBooking.bookingId;
    if (!bId) {
      setPaymentError(t('booking.noBookingId', 'Booking ID not available for checkout.'));
      return;
    }
    setIsPaying(true);
    setPaymentError('');
    try {
      const res = await api.post('/payments/initiate', { bookingId: bId });
      const checkoutUrl =
        res?.checkoutUrl ||
        res?.sessionUrl ||
        res?.url ||
        res?.paymentUrl ||
        res?.data?.sessionUrl ||
        res?.data?.url;
      if (checkoutUrl) {
        redirectToPayLinkCheckout(checkoutUrl);
      } else {
        setPaymentError(
          t('booking.paymentInitiated', 'Payment request processed. Please check your email or concierge status.')
        );
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setPaymentError(
        err?.response?.data?.message ||
          err?.message ||
          t('booking.paymentError', 'Unable to initiate online payment session with gateway.')
      );
    } finally {
      setIsPaying(false);
    }
  };

  const rawDate = booking.createdAt || booking.date || booking.issueDate;
  const d = rawDate ? new Date(rawDate) : new Date();

  const totalPax = (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0);

  const passengerList = [];
  if (booking.passengerNames || booking.passengers) {
    const names =
      typeof booking.passengerNames === 'object' ? booking.passengerNames : booking.passengers;
    if (Array.isArray(names)) {
      names.forEach((passenger) => {
        const name = typeof passenger === 'string' ? passenger : passenger?.fullName;
        if (name) passengerList.push(name);
      });
    } else {
      Object.entries(names || {}).forEach(([, name]) => {
        if (name) passengerList.push(name);
      });
    }
  }

  const handlePrint = () => window.print();

  const isConfirmed = ['confirmed', 'paid', 'completed'].includes(String(booking.status).toLowerCase());

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="relative bg-[#16151f] text-ivory-50 border border-gold-500/30 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[100000] print:bg-white print:text-black print:border-none print:shadow-none print:max-h-none print:overflow-visible print:w-full print:m-0"
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions Bar (Screen only) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/20 bg-[rgba(255,252,247,0.02)] print:hidden">
          <div className="flex items-center gap-2">
            <FaFileInvoiceDollar className="text-gold-400" size={18} />
            <span className="text-[12px] font-bold text-gold-400 uppercase tracking-widest">
              {t('booking.officialVoucher', 'Official Tax Invoice & Voucher')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-obsidian-900 border border-gold-500/30 transition-all text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <FaPrint size={12} /> {t('common.print', 'Print / PDF')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[rgba(255,252,247,0.05)] hover:bg-red-500/20 text-ivory-400 hover:text-red-400 border border-[rgba(255,252,247,0.1)] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0">
          {/* Brand & Reference Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-gold-500/20 print:border-gray-300">
            <div>
              <h1 className="text-2xl font-display font-bold text-gold-400 print:text-black tracking-wide">
                DUNAS TRAVEL GROUP
              </h1>
              <p className="text-[11px] text-ivory-400 print:text-gray-600 uppercase tracking-[2px] mt-0.5">
                {t('booking.luxuryTravel', 'Exclusive Luxury Journeys • DMC License No. 1882')}
              </p>
              <p className="text-[10px] text-ivory-400/80 print:text-gray-500 mt-1">
                Tax Reg. No: <strong className="text-gold-400 print:text-black font-mono">482-901-382</strong> • Ministry of Tourism Licensed
              </p>
              <p className="text-[10px] text-ivory-400/70 print:text-gray-500">
                Nile City Towers, Cairo, Egypt • Athens • Casablanca • Istanbul
              </p>
            </div>
            <div className="sm:text-right">
              {booking.invoiceNumber && (
                <span className="block text-[12px] font-mono text-gold-400 print:text-black uppercase tracking-wider font-bold">
                  Invoice #: {booking.invoiceNumber}
                </span>
              )}
              {booking.referenceCode && (
                <span className="block text-[11px] font-mono text-ivory-400 print:text-gray-600 uppercase tracking-widest mt-0.5">
                  Ref: #{booking.referenceCode}
                </span>
              )}
              <span className="block text-[11px] text-ivory-400 print:text-gray-500 mt-1">
                {d.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Status Chip & Main Tour Banner */}
          <div className="bg-[rgba(255,252,247,0.02)] border border-gold-500/20 rounded-xl p-4 print:bg-gray-50 print:border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 print:text-gray-500 font-semibold block mb-0.5">
                {t('booking.tour', 'Reserved Itinerary')}
              </span>
              <h2 className="text-body-lg text-ivory-50 print:text-black font-semibold">
                {booking.tourTitle || 'Bespoke Luxury Experience'}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider self-start sm:self-auto border flex items-center gap-1.5 ${
                isConfirmed
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 print:text-green-700'
                  : ['cancelled', 'refunded'].includes(String(booking.status).toLowerCase())
                  ? 'bg-red-500/15 text-red-400 border-red-500/30 print:text-red-700'
                  : 'bg-gold-500/15 text-gold-400 border-gold-500/30 print:text-amber-700'
              }`}
            >
              {isConfirmed ? <FaCheckCircle size={11} /> : <FaClock size={11} />}
              {booking.status || 'PENDING'}
            </span>
          </div>

          {/* Details 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-body-sm">
            {/* Traveler & Billing Information */}
            <div className="bg-[rgba(255,252,247,0.02)] border border-gold-500/15 rounded-xl p-4 print:bg-transparent print:border-gray-200">
              <h3 className="text-[11px] font-semibold text-gold-400 print:text-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FaUser size={11} /> {t('booking.leadTraveler', 'Guest & Billing Details')}
              </h3>
              <dl className="space-y-2 text-[13px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ivory-400 print:text-gray-500">{t('booking.fullName', 'Lead Name')}</dt>
                  <dd className="text-ivory-100 print:text-black font-medium text-right">{booking.fullName || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ivory-400 print:text-gray-500">{t('booking.email', 'Email')}</dt>
                  <dd className="text-ivory-100 print:text-black font-mono text-[12px] text-right">{booking.email || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ivory-400 print:text-gray-500">{t('booking.phone', 'Phone')}</dt>
                  <dd className="text-ivory-100 print:text-black text-right">{booking.phone || '—'}</dd>
                </div>
                {booking.invoiceType === 'COMPANY' && booking.companyName && (
                  <div className="flex justify-between gap-4 pt-1 border-t border-gold-500/10">
                    <dt className="text-ivory-400 print:text-gray-500">{t('booking.companyName', 'Company')}</dt>
                    <dd className="text-ivory-100 print:text-black font-medium text-right">{booking.companyName}</dd>
                  </div>
                )}
                {(booking.address || booking.city || booking.country) && (
                  <div className="flex justify-between gap-4 pt-1 border-t border-gold-500/10">
                    <dt className="text-ivory-400 print:text-gray-500">{t('booking.address', 'Address')}</dt>
                    <dd className="text-ivory-100 print:text-black text-right">
                      {[booking.address, booking.city, booking.country].filter(Boolean).join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Itinerary & Passenger Information */}
            <div className="bg-[rgba(255,252,247,0.02)] border border-gold-500/15 rounded-xl p-4 print:bg-transparent print:border-gray-200">
              <h3 className="text-[11px] font-semibold text-gold-400 print:text-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FaPlaneDeparture size={11} /> {t('booking.tripDetails', 'Schedule & Party')}
              </h3>
              <dl className="space-y-2 text-[13px]">
                <div className="flex justify-between gap-4">
                  <dt className="text-ivory-400 print:text-gray-500">{t('booking.arrivalDate', 'Arrival Date')}</dt>
                  <dd className="text-ivory-100 print:text-black font-medium text-right">{booking.arrivalDate || 'TBD'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ivory-400 print:text-gray-500">{t('booking.departureDate', 'Departure Date')}</dt>
                  <dd className="text-ivory-100 print:text-black font-medium text-right">{booking.departureDate || 'TBD'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ivory-400 print:text-gray-500">{t('booking.passengers', 'Total Travelers')}</dt>
                  <dd className="text-ivory-100 print:text-black font-medium text-right">
                    {totalPax || booking.adults || 1} Guest(s)
                  </dd>
                </div>
                {passengerList.length > 0 && (
                  <div className="flex justify-between gap-4 pt-1 border-t border-gold-500/10">
                    <dt className="text-ivory-400 print:text-gray-500">{t('booking.passengerNames', 'Party')}</dt>
                    <dd className="text-ivory-100 print:text-black text-right max-w-[180px] truncate">
                      {passengerList.join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Pricing & Financial Summary */}
          <div className="bg-gradient-to-br from-[rgba(201,162,39,0.08)] to-transparent border border-gold-500/30 rounded-xl p-5 print:bg-gray-100 print:border-gray-300">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-gold-400 print:text-gray-600 font-semibold block">
                  {t('booking.totalPrice', 'Grand Total Amount')}
                </span>
                <span className="text-[10px] text-ivory-400 print:text-gray-500">
                  {t('booking.allInclusiveTaxes', 'Final all-inclusive pricing • All luxury services & taxes included')}
                </span>
              </div>
              <span className="text-display-sm font-display font-bold text-gold-400 print:text-black">
                {booking.currency === 'EUR' ? '€' : '$'}
                {typeof booking.totalAmount === 'number'
                  ? booking.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
                  : booking.totalAmount || booking.totalAmountUsd || '0.00'}
              </span>
            </div>

            {/* Online Payment Integration: GetPayIn Checkout (if pending) */}
            {!isConfirmed && (
              <div className="pt-4 border-t border-gold-500/20 print:hidden flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={isPaying}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-obsidian-950 font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(201,162,39,0.35)] hover:shadow-[0_0_35px_rgba(201,162,39,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaShieldAlt className="text-obsidian-950" />
                  {isPaying ? t('booking.processingPayment', 'Initiating Secure Gateway...') : t('booking.payWithGeitPatin', 'Proceed to Online Payment (GetPayIn SSL)')}
                </button>
                {paymentError && (
                  <p className="text-xs text-red-400 text-center mt-1 bg-red-950/40 p-2 rounded-lg border border-red-500/20">
                    {paymentError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Guarantee, QR Code & Verification Seal */}
          <div className="pt-4 border-t border-gold-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-ivory-400 print:text-gray-600">
            <div className="space-y-1 max-w-sm text-center sm:text-start">
              <p className="font-semibold text-gold-400/90 print:text-gray-700">
                DUNAS TRAVEL • Cairo • Istanbul • Athens • Casablanca
              </p>
              <p className="text-[10px] leading-relaxed">
                {t(
                  'booking.invoiceFooter',
                  'Thank you for selecting Dunas Travel. Official electronic tax invoice valid across all Egyptian ports & destinations.'
                )}
              </p>
            </div>

            {/* Digital Verification QR Box */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gold-500/20 bg-[rgba(255,252,247,0.03)] print:bg-white print:border-gray-300 shrink-0">
              <div className="w-14 h-14 bg-white rounded-lg p-1 border border-gold-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-sm print:border-gray-400">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="ETA E-Invoice QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <FaQrcode size={28} className="text-gold-400" />
                )}
              </div>
              <div className="text-[9px] font-mono space-y-0.5 text-start">
                <div className="font-bold text-ivory-100 print:text-black">DIGITAL VERIFIED</div>
                <div className="text-gold-400 print:text-gray-700">DMC LIC. #1882</div>
                <div className="text-emerald-400 font-bold">AUTHENTIC VOUCHER</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InvoiceModal;
