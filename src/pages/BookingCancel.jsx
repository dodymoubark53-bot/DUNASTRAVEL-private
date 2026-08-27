import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTimesCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BookingCancel = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

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
        
        <p className="text-body-md text-ivory-300 mb-8 leading-relaxed">
          {t('payment.cancelMessage', 'Your payment process was cancelled. No charges were made. You can try paying again from your invoice page.')}
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/invoice"
            className="w-full px-6 py-4 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-xl shadow-[0_0_20px_rgba(201,162,39,0.2)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-[13px] uppercase tracking-[1.5px]"
          >
            <FaFileInvoiceDollar size={18} />
            {t('payment.viewInvoiceToRetry', 'View Invoice to Retry')}
          </Link>
          
          <Link
            to="/dashboard"
            className="w-full px-6 py-4 bg-[rgba(255,252,247,0.04)] text-ivory-200 border border-[rgba(201,162,39,0.15)] font-semibold rounded-xl hover:bg-[rgba(255,252,247,0.08)] hover:text-gold-400 transition-colors text-[13px] uppercase tracking-[1px]"
          >
            {t('user.tabOverview', 'Go to My Dashboard')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingCancel;
