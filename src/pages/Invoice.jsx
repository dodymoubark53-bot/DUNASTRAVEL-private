import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFileInvoiceDollar, FaSearch, FaTimes, FaPrint, FaWhatsapp, FaUniversity, FaCreditCard } from 'react-icons/fa';
import api from '../utils/api';
import { normalizeInvoiceResponse } from '../utils/invoice';
import { redirectToPayLinkCheckout } from '../utils/paylink';

const Invoice = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const isAr = i18n.language === 'ar';
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoiceNum, setInvoiceNum] = useState(searchParams.get('inv') || '');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConciergePayment, setShowConciergePayment] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!invoiceNum.trim()) return;
    setLoading(true);
    setError('');
    setShowConciergePayment(false);
    setBooking(null);
    try {
      const data = await api.get(`/invoices/${invoiceNum.trim()}`);
      setBooking(normalizeInvoiceResponse(data));
      setSearchParams({ inv: invoiceNum.trim() });
    } catch (err) {
      if (err.status === 404) {
        setError(t('invoice.notFound', 'Invoice not found'));
      } else {
        setError(err.message || 'Server error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking || !booking.bookingId) return;
    setPaymentLoading(true);
    setError('');
    try {
      const guestToken = typeof window !== 'undefined' ? localStorage.getItem('dunas_guest_token') : undefined;
      const data = await api.post('/payments/initiate', {
        bookingId: booking.bookingId,
        guestToken: guestToken || undefined
      });
      const url = data?.url || data?.sessionUrl || data?.checkoutUrl || data?.session?.url;
      if (url) {
        if (url.startsWith('/') && !url.startsWith('//')) {
          window.location.href = url;
        } else {
          redirectToPayLinkCheckout(url);
        }
      } else {
        throw new Error('No payment URL returned');
      }
    } catch (err) {
      const isGatewayOffline = err.status === 503 || err.message?.toLowerCase().includes('not enabled') || err.message?.toLowerCase().includes('not configured');
      if (isGatewayOffline) {
        setShowConciergePayment(true);
      } else {
        setError(err.message || 'Unable to start payment session');
      }
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const d = booking ? new Date(booking.createdAt) : null;

  const passengerList = [];
  if (booking?.passengerNames) {
    const names = typeof booking.passengerNames === 'object' ? booking.passengerNames : {};
    Object.entries(names).forEach(([, name]) => {
      if (name) passengerList.push(name);
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaFileInvoiceDollar className="text-gold-600" size={20} />
            <h1 className="text-xl font-bold text-gray-900">{t('invoice.pageTitle', 'Invoice Lookup')}</h1>
          </div>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              placeholder={t('invoice.enterInvoiceNumber', 'Enter your invoice number (e.g. INV-202506-1234)')}
              value={invoiceNum}
              onChange={(e) => setInvoiceNum(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none text-sm"
            />
            <button
              type="submit"
              disabled={loading || !invoiceNum.trim()}
              className="px-5 py-3 bg-gradient-to-r from-gold-500 to-gold-700 text-white font-semibold rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaSearch />}
              {t('common.search', 'Search')}
            </button>
          </form>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-600">
              <FaTimes size={12} />
              {typeof error === 'object' && error !== null ? (error.message || String(error)) : error}
            </div>
          )}
        </div>

        {/* Invoice Result */}
        {booking && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
            {/* Print Button */}
            <div className="p-4 border-b border-gray-100 flex justify-end print:hidden">
              <button onClick={handlePrint} className="px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-2">
                <FaPrint size={14} />
                {t('common.print', 'Print')}
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-gray-200 pb-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaFileInvoiceDollar className="text-gold-600" size={20} />
                    <h2 className="text-xl font-bold text-gray-900">{t('booking.invoice', 'Invoice')}</h2>
                  </div>
                  {booking.invoiceNumber && (
                    <p className="text-sm text-gray-500 mt-1">
                      {t('booking.invoiceNumber', 'Invoice #')}: <span className="font-mono font-semibold text-gray-700">{booking.invoiceNumber}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">DUNAS TRAVEL</p>
                  <p className="text-xs text-gray-500">{t('booking.luxuryTravel', 'Luxury Travel Agency')}</p>
                </div>
              </div>

              {/* Status & Date */}
              <div className="flex items-center justify-between mb-6 text-sm">
                <span className="text-gray-500">
                  {t('booking.date', 'Date')}: {d.toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                {(() => {
                  const s = String(booking.status || booking.invoiceStatus || '').toUpperCase();
                  const isPaid = ['CONFIRMED', 'PAID', 'COMPLETED'].includes(s);
                  const isCancelled = ['CANCELLED', 'VOID'].includes(s);
                  const isRefunded = ['REFUNDED', 'CREDIT_NOTE', 'PARTIALLY_REFUNDED'].includes(s);
                  return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isPaid ? 'bg-green-100 text-green-700' :
                      isCancelled ? 'bg-red-100 text-red-700' :
                      isRefunded ? 'bg-purple-100 text-purple-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {isPaid ? t('booking.paid', 'Paid') :
                       isCancelled ? t('booking.cancelled', 'Cancelled') :
                       isRefunded ? t('booking.refunded', 'Refunded') :
                       t('booking.pending', 'Pending Payment')}
                    </span>
                  );
                })()}
              </div>

              {/* Tour Info */}
              {booking.tourTitle && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('booking.tour', 'Tour')}</p>
                  <p className="font-semibold text-gray-900">{booking.tourTitle}</p>
                </div>
              )}

              {/* Billing Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider">{t('booking.billingInfo', 'Billing Details')}</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('booking.fullName', 'Name')}</span>
                    <span className="font-medium text-gray-800">{booking.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('booking.email', 'Email')}</span>
                    <span className="font-medium text-gray-800">{booking.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('booking.phone', 'Phone')}</span>
                    <span className="font-medium text-gray-800">{booking.phone}</span>
                  </div>
                  {booking.invoiceType === 'company' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('booking.companyName', 'Company')}</span>
                        <span className="font-medium text-gray-800">{booking.companyName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t('booking.taxId', 'Tax ID')}</span>
                        <span className="font-medium text-gray-800">{booking.taxId}</span>
                      </div>
                    </>
                  )}
                  {(booking.address || booking.city || booking.country) && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('booking.address', 'Address')}</span>
                      <span className="font-medium text-gray-800 text-right">
                        {[booking.address, booking.city, booking.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trip Details */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider">{t('booking.tripDetails', 'Trip Details')}</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('booking.arrivalDate', 'Arrival')}</span>
                    <span className="font-medium text-gray-800">{booking.arrivalDate || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('booking.departureDate', 'Departure')}</span>
                    <span className="font-medium text-gray-800">{booking.departureDate || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('booking.passengers', 'Passengers')}</span>
                    <span className="font-medium text-gray-800">
                      {booking.adults > 0 && `${booking.adults} ${t('booking.adults', 'Adults')}`}
                      {booking.children > 0 && `, ${booking.children} ${t('booking.children', 'Children')}`}
                      {booking.infants > 0 && `, ${booking.infants} ${t('booking.infants', 'Infants')}`}
                    </span>
                  </div>
                  {passengerList.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t('booking.passengerNames', 'Names')}</span>
                      <span className="font-medium text-gray-800 text-right max-w-[200px]">{passengerList.join(', ')}</span>
                    </div>
                  )}
                  {booking.totalAmount > 0 && (
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-700">{t('booking.totalAmount', 'Total Amount')}</span>
                      <span className="font-bold text-lg text-gray-900">
                        {booking.currency === 'EUR' ? '€' : '$'}{booking.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Actions */}
              {!['CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED', 'VOID', 'REFUNDED', 'CREDIT_NOTE'].includes(String(booking.status || booking.invoiceStatus || '').toUpperCase()) && (
                <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-md hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {paymentLoading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaCreditCard size={18} />
                      )}
                      {t('booking.payNow', 'Pay Online Now')}
                    </button>

                    <a
                      href={`https://wa.me/201000000000?text=${encodeURIComponent(
                        isAr
                          ? `مرحباً دونس ترافيل، أود تأكيد ودفع الفاتورة رقم #${booking.invoiceNumber || invoiceNum} الخاصة بالحجز (المرجع: ${booking.bookingReference || booking.bookingId})، بقيمة ${booking.currency === 'EUR' ? '€' : '$'}${booking.totalAmount}.`
                          : `Hello Dunas Travel, I would like to confirm and pay Invoice #${booking.invoiceNumber || invoiceNum} (Ref: ${booking.bookingReference || booking.bookingId}) for amount ${booking.currency === 'EUR' ? '€' : '$'}${booking.totalAmount}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <FaWhatsapp size={18} />
                      {isAr ? 'الدفع عبر الكونسيرج (واتساب)' : 'Concierge WhatsApp Payment'}
                    </a>
                  </div>

                  {showConciergePayment && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-2 text-start">
                      <div className="font-semibold flex items-center gap-2">
                        <FaUniversity className="text-amber-700" />
                        <span>{isAr ? 'الدفع المباشر والتحويل البنكي' : 'Direct Bank Transfer & Concierge Settlement'}</span>
                      </div>
                      <p>
                        {isAr
                          ? 'بوابة الدفع الإلكتروني بالبطاقات تخضع للصيانة أو الحجز يتطلب تأكيداً خاصاً. يُرجى استخدام زر الواتساب أعلاه للتواصل المباشر مع الكونسيرج الخاص بنا أو طلب بيانات الحساب البنكي الرسمي لشركة دونس ترافيل.'
                          : 'Online card gateway is under scheduled maintenance or requires custom concierge confirmation. Please use the WhatsApp button above to finalize your reservation directly or request official bank transfer details.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 mt-6 text-center text-xs text-gray-400 space-y-1">
                <p className="font-semibold text-gray-500">DUNAS TRAVEL</p>
                <p>{t('booking.invoiceFooter', 'Thank you for choosing DUNAS TRAVEL. We look forward to providing you with an unforgettable experience.')}</p>
                {!['CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED', 'VOID', 'REFUNDED', 'CREDIT_NOTE'].includes(String(booking.status || booking.invoiceStatus || '').toUpperCase()) && (
                  <p className="mt-2 text-red-500">{t('booking.invoiceNote', 'This is a booking confirmation invoice. Please complete your payment to secure your reservation.')}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
