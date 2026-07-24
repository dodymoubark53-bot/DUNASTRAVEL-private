import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaFileInvoiceDollar, FaPrint } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const InvoiceModal = ({ booking, onClose }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const d = new Date(booking.createdAt);

  const totalPax = (booking.adults || 0) + (booking.children || 0) + (booking.infants || 0);

  const passengerList = [];
  if (booking.passengerNames) {
    const names = typeof booking.passengerNames === 'object' ? booking.passengerNames : {};
    Object.entries(names).forEach(([, name]) => {
      if (name) passengerList.push(name);
    });
  }

  const handlePrint = () => window.print();

  const modalContent = (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="relative bg-white text-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-[100000]"
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Print Button */}
        <button
          type="button"
          onClick={handlePrint}
          className="absolute top-4 left-12 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors print:hidden"
        >
          <FaPrint size={14} className="text-gray-600" />
        </button>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors print:hidden"
        >
          <FaTimes size={14} className="text-gray-600" />
        </button>

        {/* Invoice Content */}
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
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
              booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {booking.status === 'pending' ? t('booking.pending', 'Pending') :
               booking.status === 'confirmed' ? t('booking.confirmed', 'Confirmed') :
               booking.status === 'cancelled' ? t('booking.cancelled', 'Cancelled') :
               t('booking.completed', 'Completed')}
            </span>
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

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400 space-y-1">
            <p className="font-semibold text-gray-500">DUNAS TRAVEL</p>
            <p>{t('booking.invoiceFooter', 'Thank you for choosing DUNAS TRAVEL. We look forward to providing you with an unforgettable experience.')}</p>
            <p className="mt-2">{t('booking.invoiceNote', 'This is a booking confirmation invoice. Payment details will be sent separately.')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InvoiceModal;
