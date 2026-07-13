import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTimesCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookingCancel = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-lg max-w-lg w-full text-center"
      >
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="text-red-500 text-5xl" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('payment.cancelTitle', 'Payment Cancelled')}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {t('payment.cancelMessage', 'Your payment process was cancelled. No charges were made. You can try paying again from your invoice page.')}
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/invoice"
            className="w-full px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-700 text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <FaFileInvoiceDollar size={18} />
            {t('payment.viewInvoiceToRetry', 'View Invoice to Retry')}
          </Link>
          
          <Link
            to="/"
            className="w-full px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            {t('common.backToHome', 'Return to Home')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingCancel;
