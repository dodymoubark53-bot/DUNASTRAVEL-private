import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTimesCircle, FaFileInvoiceDollar, FaRedo, FaSpinner, FaHeadset } from 'react-icons/fa';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { redirectToPayLinkCheckout } from '../utils/paylink';

const BookingCancel = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [searchParams] = useSearchParams();

  const referenceCode =
    searchParams.get('referenceCode') ||
    searchParams.get('booking_id') ||
    searchParams.get('bookingId');
  const invoiceId = searchParams.get('invoice_id');

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState('');

  const isUUID = (val) =>
    typeof val === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  const handleRetryPayment = async () => {
    if (!referenceCode) return;
    setIsRetrying(true);
    setRetryError('');
    try {
      let bookingUuid = referenceCode;
      if (!isUUID(bookingUuid)) {
        // Look up booking by reference code to obtain the UUID
        const summary = await api.get(`/bookings/${encodeURIComponent(referenceCode)}`);
        if (summary?.id) {
          bookingUuid = summary.id;
        }
      }

      const res = await api.post('/payments/initiate', { bookingId: bookingUuid });
      const checkoutUrl =
        res?.checkoutUrl ||
        res?.sessionUrl ||
        res?.url ||
        res?.paymentUrl;
      if (checkoutUrl) {
        redirectToPayLinkCheckout(checkoutUrl);
        return;
      }
      setRetryError(t('booking.paymentError', 'Unable to restart checkout. Please use your invoice.'));
    } catch (err) {
      setRetryError(err?.message || t('booking.paymentError', 'Unable to initiate online payment.'));
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 flex items-center justify-center p-4 pt-28 font-body" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121118] border border-[rgba(201,162,39,0.2)] p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-lg w-full text-center"
      >
        <div className="w-24 h-24 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <FaTimesCircle className="text-red-400 text-5xl" />
        </div>
        
        <h1 className="text-display-md font-display font-semibold text-ivory-50 mb-4">
          {t('payment.cancelTitle', 'Payment Cancelled')}
        </h1>
        
        <p className="text-body-md text-ivory-300 mb-6 leading-relaxed">
          {t('payment.cancelMessage', 'Your payment process was cancelled or interrupted. No charges were completed.')}
        </p>

        {referenceCode && (
          <div className="mb-6 p-3.5 bg-[rgba(201,162,39,0.08)] border border-gold-500/30 rounded-xl text-center">
            <span className="text-[11px] text-ivory-400 uppercase tracking-widest block mb-1">
              {t('booking.referenceCode', 'Booking Reference')}
            </span>
            <span className="font-mono text-gold-400 font-bold text-sm tracking-wider">
              {referenceCode}
            </span>
          </div>
        )}

        {retryError && (
          <div className="mb-6 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs">
            {retryError}
          </div>
        )}

        <div className="flex flex-col gap-3.5">
          {referenceCode && (
            <button
              type="button"
              onClick={handleRetryPayment}
              disabled={isRetrying}
              className="w-full px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:scale-[1.02] active:scale-[0.99] transition-transform flex items-center justify-center gap-2 text-[13px] uppercase tracking-[1.5px] cursor-pointer disabled:opacity-50"
            >
              {isRetrying ? (
                <>
                  <FaSpinner className="animate-spin" size={16} />
                  <span>{t('common.processing', 'Processing...')}</span>
                </>
              ) : (
                <>
                  <FaRedo size={15} />
                  <span>{t('payment.retryPaymentNow', 'Retry Payment Now')}</span>
                </>
              )}
            </button>
          )}

          <Link
            to={referenceCode ? `/invoice?reference=${encodeURIComponent(referenceCode)}` : '/invoice'}
            className="w-full px-6 py-3.5 bg-[rgba(255,252,247,0.04)] text-ivory-200 border border-[rgba(201,162,39,0.15)] font-semibold rounded-xl hover:bg-[rgba(255,252,247,0.08)] hover:text-gold-400 transition-colors flex items-center justify-center gap-2 text-[13px] uppercase tracking-[1px]"
          >
            <FaFileInvoiceDollar size={16} />
            <span>{t('payment.viewInvoiceToRetry', 'View Invoice to Pay')}</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full px-6 py-3.5 text-ivory-400 hover:text-ivory-200 transition-colors text-[12px] uppercase tracking-[1px]"
          >
            {t('user.tabOverview', 'Go to My Dashboard')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingCancel;
