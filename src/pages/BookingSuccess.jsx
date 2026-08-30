import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaFileInvoiceDollar, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../utils/api';
import InvoiceModal from '../components/booking/InvoiceModal';

const BookingSuccess = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [searchParams] = useSearchParams();
  // Only the server-issued payment record UUID is a valid status resource.
  // Provider session IDs and booking references are different identifiers.
  const paymentId = searchParams.get('payment_id');
  const callbackInvoiceId = searchParams.get('invoice_id');
  const callbackSuccess = searchParams.get('success');
  const callbackStatus = searchParams.get('invoice_status');
  const callbackMessage = searchParams.get('message');
  const callbackSignature = searchParams.get('signature');
  const bookingId = searchParams.get('booking_id') || searchParams.get('bookingId') || searchParams.get('referenceCode');

  const [paymentStatus, setPaymentStatus] = useState('loading'); // loading, SUCCEEDED, PENDING, FAILED
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 20;
    let timerId;

    const verifyStatus = async () => {
      const hasSignedCallback = Boolean(
        callbackInvoiceId &&
          callbackSuccess !== null &&
          callbackStatus &&
          callbackMessage !== null &&
          callbackSignature,
      );
      if (!paymentId && !hasSignedCallback) {
        if (isMounted) setPaymentStatus('FAILED');
        return;
      }

      try {
        const res = paymentId
          ? await api.get(`/payments/${encodeURIComponent(paymentId)}/status`)
          : await api.post('/payments/callback/getpayin', {
              success: callbackSuccess,
              invoice_id: callbackInvoiceId,
              invoice_status: callbackStatus,
              message: callbackMessage,
              signature: callbackSignature,
            });
        const status = (res?.status || res?.paymentStatus || 'PENDING').toUpperCase();
        const invNum = res?.invoiceNumber || res?.invoice?.invoiceNumber;

        if (isMounted) {
          setInvoiceNumber(invNum || null);
          if (res?.booking) setBookingData(res.booking);

          if (status === 'CAPTURED' || status === 'SUCCEEDED' || status === 'PAID' || status === 'CONFIRMED') {
            setPaymentStatus('SUCCEEDED');
          } else if (status === 'FAILED' || status === 'CANCELLED' || status === 'EXPIRED' || status === 'REFUNDED') {
            setPaymentStatus('FAILED');
          } else if (status === 'PENDING') {
            setPaymentStatus('PENDING');
            if (pollCount < maxPolls) {
              pollCount++;
              timerId = setTimeout(verifyStatus, 1500);
            }
          } else {
            setPaymentStatus('FAILED');
          }
        }
      } catch {
        // A status lookup failure cannot be treated as payment confirmation.
        if (isMounted) setPaymentStatus('FAILED');
      }
    };

    verifyStatus();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [
    paymentId,
    callbackInvoiceId,
    callbackSuccess,
    callbackStatus,
    callbackMessage,
    callbackSignature,
  ]);

  return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center p-4 pt-28 font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121118] border border-[rgba(201,162,39,0.2)] p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-lg w-full text-center"
      >
        {paymentStatus === 'loading' || paymentStatus === 'PENDING' ? (
          <div>
            <div className="w-24 h-24 bg-gradient-to-br from-gold-500/20 to-gold-700/20 border border-gold-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSpinner className="text-gold-400 text-4xl animate-spin" />
            </div>
            <h1 className="text-display-md font-display font-semibold text-ivory-50 mb-4">
              {t('payment.verifyingTitle', 'Verifying Payment...')}
            </h1>
            <p className="text-body-md text-ivory-300 mb-8 leading-relaxed">
              {t('payment.verifyingDesc', 'Please wait while we confirm your payment status.')}
            </p>
          </div>
        ) : paymentStatus === 'FAILED' ? (
          <div>
            <div className="w-24 h-24 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="text-red-400 text-5xl" />
            </div>
            <h1 className="text-display-md font-display font-semibold text-ivory-50 mb-4">
              {t('payment.failedTitle', 'Payment Unsuccessful')}
            </h1>
            <p className="text-body-md text-ivory-300 mb-8 leading-relaxed">
              {t('payment.failedDesc', 'Your payment attempt could not be completed. Please try again or contact support.')}
            </p>
            <div className="flex flex-col gap-4">
              <Link
                to="/contact"
                className="w-full px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:scale-[1.02] transition-transform text-[13px] uppercase tracking-[1.5px]"
              >
                {t('contact.title', 'Contact Support')}
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(201,162,39,0.3)]">
              <FaCheckCircle className="text-obsidian-900 text-5xl" />
            </div>
            <h1 className="text-display-md font-display font-semibold text-ivory-50 mb-4">
              {t('payment.successTitle', 'Payment Successful!')}
            </h1>
            <p className="text-body-md text-ivory-300 mb-8 leading-relaxed">
              {t('payment.successMessage', 'Thank you for your payment. Your booking has been successfully confirmed. A confirmation email has been sent to you.')}
            </p>
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => setShowInvoice(true)}
                className="w-full px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-[13px] uppercase tracking-[1.5px] cursor-pointer"
              >
                <FaFileInvoiceDollar size={18} />
                {t('payment.viewInvoice', 'View Your Invoice')}
              </button>
              <Link
                to="/dashboard"
                className="w-full px-6 py-4 bg-[rgba(255,252,247,0.04)] text-ivory-200 border border-[rgba(201,162,39,0.15)] font-semibold rounded-xl hover:bg-[rgba(255,252,247,0.08)] hover:text-gold-400 transition-colors text-[13px] uppercase tracking-[1px]"
              >
                {t('user.tabOverview', 'Go to My Dashboard')}
              </Link>
            </div>
          </div>
        )}
      </motion.div>

      {showInvoice && (
        <InvoiceModal
          invoiceNumber={invoiceNumber}
          booking={bookingData || { id: bookingId, referenceCode: bookingId, status: 'confirmed' }}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};

export default BookingSuccess;
