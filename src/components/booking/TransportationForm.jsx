import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaFileInvoiceDollar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { fadeInUp } from '../../animations/variants';
import { useServices } from '../../hooks/useServices';
import { useAuth } from '../../context/AuthContext';
import InvoiceModal from './InvoiceModal';
import api from '../../utils/api';

const TransportationForm = ({ preSelectedVehicleId = '' }) => {
  const { t } = useTranslation();
  const { services: transportation } = useServices('transportation');
  const { user } = useAuth();
  const [status, setStatus] = useState('idle');
  const [bookingResult, setBookingResult] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [error, setError] = useState('');

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const todayStr = getTodayString();

  const [formData, setFormData] = useState({
    vehicleId: preSelectedVehicleId,
    tripDate: '',
    pickupTime: '',
    adults: 1,
    children: 0,
    pickupLocation: '',
    dropoffLocation: '',
    fullName: '',
    phone: '',
    email: '',
    specialRequest: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.tripDate && formData.tripDate < todayStr) return;
    setError('');
    if (!user) {
      setError(t('auth.loginRequired', 'Please sign in before requesting transportation.'));
      return;
    }
    setStatus('submitting');
    try {
      const passengerCount = (parseInt(formData.adults) || 1) + (parseInt(formData.children) || 0);
      const transportPayload = {
        serviceId: formData.vehicleId,
        pickupDate: formData.tripDate,
        pickupTime: formData.pickupTime || '09:00',
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        passengerCount,
      };

      const data = await api.post('/transportation/bookings', transportPayload);

      setBookingResult(data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Error processing request');
      setStatus('idle');
    }
  };

  return (
    <div
      className="relative mx-auto md:mx-0 rounded-2xl p-8 w-full"
      style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)', boxShadow: '0 0 40px rgba(10,25,105, 0.8)' }}
    >
      <AnimatePresence mode="wait">
        {status === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <FaCheckCircle className="text-gold-500 text-6xl mb-4" />
            </motion.div>
            <h3 className="text-display-md text-obsidian-900 mb-2 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('booking.reservationConfirmed', 'Reservation Confirmed')}</h3>
            <p className="text-body-md text-obsidian-500">
              {t('booking.reservationSuccessDesc', 'Thank you for your booking. Our DUNAS TRAVEL concierges will contact you shortly to finalize the details.')}
            </p>
            {bookingResult?.invoiceNumber && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowInvoice(true);
                }}
                className="mt-4 px-5 py-2.5 bg-gold-500 text-white font-bold rounded-full hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer"
              >
                <FaFileInvoiceDollar /> {t('booking.viewInvoice', 'View Invoice')}
              </button>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="form"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >
            <div className="mb-2">
              <h3 className="text-display-md text-obsidian-900 mb-2 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('booking.bookYourTransfer', 'Book Your Transfer')}</h3>
              <p className="text-caption text-obsidian-500">{t('booking.transferDesc', 'Reserve your premium vehicle and professional driver.')}</p>
            </div>

            {error && (
              <div className="bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center">
                <p className="text-body-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label htmlFor="vehicle-select" className="sr-only">
                {t('booking.selectVehicle', 'Select Vehicle')}
              </label>
              <select
                id="vehicle-select"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors bg-white md:col-span-2 text-[16px]"
              >
                <option value="" disabled>{t('booking.selectVehicle', 'Select Vehicle')}</option>
                {transportation.map(v => (
                  <option key={v.id} value={v.id}>{t(`data.${v.name}`, v.name)}</option>
                ))}
              </select>

              <label htmlFor="trip-date" className="sr-only">{t('booking.tripDate', 'Trip Date')}</label>
              <input
                id="trip-date"
                type="date"
                name="tripDate"
                value={formData.tripDate}
                min={todayStr}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors text-[16px]"
              />
              <label htmlFor="pickup-time" className="sr-only">{t('booking.pickupTime', 'Pick Up Time')}</label>
              <input
                id="pickup-time"
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors text-[16px]"
              />

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label htmlFor="adults-count" className="block text-caption text-obsidian-500 mb-1">{t('booking.adults', 'Adults')}</label>
                  <input
                    id="adults-count"
                    type="number"
                    name="adults"
                    min="1" max="20"
                    value={formData.adults}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors text-[16px]"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="children-count" className="block text-caption text-obsidian-500 mb-1">{t('booking.children', 'Children')}</label>
                  <input
                    id="children-count"
                    type="number"
                    name="children"
                    min="0" max="20"
                    value={formData.children}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors text-[16px]"
                  />
                </div>
              </div>

              <label htmlFor="pickup-location" className="sr-only">{t('booking.pickupLocation', 'Pick Up Location')}</label>
              <input
                id="pickup-location"
                type="text"
                name="pickupLocation"
                placeholder={t('booking.pickupLocation', 'Pick Up Location')}
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors text-[16px]"
              />
              <label htmlFor="dropoff-location" className="sr-only">{t('booking.dropoffLocation', 'Drop Off Location')}</label>
              <input
                id="dropoff-location"
                type="text"
                name="dropoffLocation"
                placeholder={t('booking.dropoffLocation', 'Drop Off Location')}
                value={formData.dropoffLocation}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors md:col-span-2 text-[16px]"
              />

              <label htmlFor="full-name" className="sr-only">{t('booking.fullName', 'Full Name')}</label>
              <input
                id="full-name"
                type="text"
                name="fullName"
                placeholder={t('booking.fullName', 'Full Name')}
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors text-[16px]"
              />
              <label htmlFor="phone-number" className="sr-only">{t('booking.phone', 'Phone Number')}</label>
              <input
                id="phone-number"
                type="tel"
                name="phone"
                placeholder={t('booking.phone', 'Phone Number')}
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors text-[16px]"
              />
              <label htmlFor="email-address" className="sr-only">{t('booking.email', 'Email Address')}</label>
              <input
                id="email-address"
                type="email"
                name="email"
                placeholder={t('booking.email', 'Email Address')}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors md:col-span-2 text-[16px]"
              />
            </div>

            <label htmlFor="special-requests" className="sr-only">{t('booking.specialRequestPlaceholder', 'Special Request...')}</label>
            <textarea
              id="special-requests"
              name="specialRequest"
              placeholder={t('booking.specialRequestPlaceholder', 'Special Request...')}
              value={formData.specialRequest}
              onChange={handleChange}
              rows="3"
              className="w-full p-4 border border-gray-200 rounded-lg focus:border-gold-500 outline-none transition-colors resize-none text-[16px]"
            ></textarea>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 text-lg rounded-full text-white hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, rgb(4, 20, 70) 0%, rgb(6, 29, 93) 40%, rgb(10, 40, 120) 100%)', boxShadow: '0 0 20px rgba(10,25,105, 0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {status === 'submitting' ? t('common.processing', 'Processing...') : t('transportation.reserveNow', 'Reserve Now')}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {showInvoice && bookingResult && (
        <InvoiceModal booking={bookingResult} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default TransportationForm;
