import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookingSuccess = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-3xl shadow-lg max-w-lg w-full text-center"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-green-500 text-5xl" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('payment.successTitle', 'Payment Successful!')}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {t('payment.successMessage', 'Thank you for your payment. Your booking has been successfully confirmed. A confirmation email has been sent to you.')}
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/invoice"
            className="w-full px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-700 text-white font-bold rounded-xl shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <FaFileInvoiceDollar size={18} />
            {t('payment.viewInvoice', 'View Your Invoice')}
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

export default BookingSuccess;
