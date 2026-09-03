import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaCarSide,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaShieldAlt,
  FaInfoCircle
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { fadeInUp } from '../../animations/variants';
import { useServices } from '../../hooks/useServices';
import { transportation as fallbackTransportation } from '../../data/transportation';
import { useAuth } from '../../context/AuthContext';
import InvoiceModal from './InvoiceModal';
import api from '../../utils/api';

const inputClass =
  'w-full px-3.5 py-3 rounded-xl bg-[rgba(255,252,247,0.03)] text-ivory-50 placeholder:text-ivory-400/40 border border-[rgba(201,162,39,0.18)] focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 focus:outline-none text-[13.5px] transition-all [color-scheme:dark]';

const labelClass =
  'block text-[11px] font-semibold text-gold-400 uppercase tracking-[1.2px] mb-1.5 flex items-center gap-1.5';

const TransportationForm = ({ preSelectedVehicleId = '' }) => {
  const { t } = useTranslation();
  const { services: rawTransportation = [], loading: servicesLoading, error: servicesError } =
    useServices('transportation');
  const transportationList = useMemo(() => {
    if (Array.isArray(rawTransportation) && rawTransportation.length > 0) {
      return rawTransportation;
    }
    return fallbackTransportation;
  }, [rawTransportation]);
  const { user } = useAuth();
  const [status, setStatus] = useState('idle');
  const [bookingResult, setBookingResult] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [error, setError] = useState('');

  const getTodayString = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
  };
  const todayStr = getTodayString();

  const [formData, setFormData] = useState({
    vehicleId: preSelectedVehicleId || '',
    tripDate: todayStr,
    pickupTime: '10:00',
    adults: 1,
    children: 0,
    luggageCount: 1,
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    flightNumber: '',
    pickupLocation: '',
    dropoffLocation: '',
    specialRequest: '',
  });

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Sync selected vehicle when user clicks "Reserve Now" or when fleet loads
  useEffect(() => {
    if (preSelectedVehicleId) {
      setFormData((prev) => ({ ...prev, vehicleId: preSelectedVehicleId }));
    } else if (transportationList.length > 0 && !formData.vehicleId) {
      setFormData((prev) => ({ ...prev, vehicleId: transportationList[0].id }));
    }
  }, [preSelectedVehicleId, transportationList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.tripDate && formData.tripDate < todayStr) return;
    const effectiveServiceId = formData.vehicleId || preSelectedVehicleId || transportationList[0]?.id;
    if (!effectiveServiceId) {
      setError(t('booking.selectVehicleError', 'Please select a vehicle from the fleet.'));
      return;
    }
    setError('');
    setStatus('submitting');
    try {
      const passengerCount = (parseInt(formData.adults, 10) || 1) + (parseInt(formData.children, 10) || 0);
      const transportPayload = {
        serviceId: effectiveServiceId,
        pickupDate: formData.tripDate,
        pickupTime: formData.pickupTime || '09:00',
        pickupLocation: formData.pickupLocation.trim(),
        dropoffLocation: formData.dropoffLocation.trim(),
        passengerCount,
        luggageCount: parseInt(formData.luggageCount, 10) || 0,
        flightNumber: formData.flightNumber.trim() || undefined,
        fullName: formData.fullName.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        notes: formData.specialRequest.trim() || undefined,
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
    <div className="bg-[#121118]/95 backdrop-blur-xl text-ivory-50 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.55)] border border-[rgba(201,162,39,0.22)] hover:border-gold-500/40 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-gold-500/15 bg-gradient-to-b from-gold-500/5 to-transparent">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <FaCarSide size={13} />
          </div>
          <div>
            <h3 className="text-body-lg text-ivory-50 font-display font-semibold leading-tight">
              {t('booking.bookYourTransfer', 'VIP Private Chauffeur & Transfers')}
            </h3>
            <p className="text-[11px] text-ivory-400 mt-0.5">
              {t('booking.transferDesc', 'Luxury vehicles with personal bilingual driver')}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(201,162,39,0.35)] ring-4 ring-gold-500/20">
                <FaCheckCircle className="text-obsidian-900 text-2xl" />
              </div>
              <span className="text-[11px] font-mono text-gold-400 uppercase tracking-widest block mb-1">
                Ref: #{bookingResult?.referenceCode || bookingResult?.id || 'CONFIRMED'}
              </span>
              <h3 className="text-display-sm text-ivory-50 mb-2 font-display">
                {t('booking.reservationConfirmed', 'Chauffeur Reserved')}
              </h3>
              <p className="text-body-sm text-ivory-300 max-w-sm mx-auto leading-relaxed">
                {t(
                  'booking.reservationSuccessDesc',
                  'Thank you for your booking. Our private concierge will reach out to confirm your pickup details and flight coordinates.'
                )}
              </p>
              {bookingResult?.invoiceNumber && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowInvoice(true);
                  }}
                  className="mt-5 px-6 py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-900 font-bold rounded-xl hover:shadow-[0_0_25px_rgba(245,166,35,0.4)] hover:scale-105 active:scale-95 transition-all text-[12px] uppercase tracking-[1.5px] flex items-center gap-2 cursor-pointer"
                >
                  <FaFileInvoiceDollar size={14} /> {t('booking.viewInvoice', 'Inspect Official Invoice')}
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
              className="space-y-4"
            >
              {error && (
                <div className="bg-red-500/15 border border-red-500/40 rounded-xl px-4 py-3 text-center">
                  <p className="text-body-sm text-red-400 font-medium">{typeof error === 'object' && error !== null ? (error.message || String(error)) : error}</p>
                </div>
              )}
              {servicesError && (
                <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl px-4 py-3 text-center">
                  <p className="text-body-sm text-amber-300">
                    {servicesError.message ||
                      t('transportation.loadError', 'Transportation services could not be loaded.')}
                  </p>
                </div>
              )}

              {/* Vehicle Select */}
              <div>
                <label htmlFor="vehicle-select" className={labelClass}>
                  <FaCarSide className="text-gold-400" size={11} />
                  {t('booking.selectVehicle', 'Select Vehicle Class')}
                </label>
                <select
                  id="vehicle-select"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  required
                  disabled={servicesLoading || transportationList.length === 0}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="" disabled className="bg-[#1a1a2e] text-ivory-400">
                    {servicesLoading
                      ? t('common.loading', 'Loading vehicle fleet...')
                      : t('booking.selectVehicle', 'Select Fleet Class...')}
                  </option>
                  {transportationList.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[#1a1a2e] text-ivory-50">
                      {t(`data.${v.name}`, v.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule (Date & Time) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="trip-date" className={labelClass}>
                    <FaCalendarAlt className="text-gold-400" size={11} />
                    {t('booking.tripDate', 'Service Date')}
                  </label>
                  <input
                    id="trip-date"
                    type="date"
                    name="tripDate"
                    value={formData.tripDate}
                    min={todayStr}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="pickup-time" className={labelClass}>
                    <FaClock className="text-gold-400" size={11} />
                    {t('booking.pickupTime', 'Pickup Time')}
                  </label>
                  <input
                    id="pickup-time"
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Passengers count */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="adults-count" className={labelClass}>
                    <FaUsers className="text-gold-400" size={11} />
                    {t('booking.adults', 'Adults')}
                  </label>
                  <input
                    id="adults-count"
                    type="number"
                    name="adults"
                    min="1"
                    max="20"
                    value={formData.adults}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="children-count" className={labelClass}>
                    <FaUsers className="text-gold-400" size={11} />
                    {t('booking.children', 'Children')}
                  </label>
                  <input
                    id="children-count"
                    type="number"
                    name="children"
                    min="0"
                    max="20"
                    value={formData.children}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="full-name" className={labelClass}>
                    <FaUsers className="text-gold-400" size={11} />
                    {t('booking.fullName', 'Full Name')}
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    name="fullName"
                    placeholder="e.g. Alexander Vance"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    <FaInfoCircle className="text-gold-400" size={11} />
                    {t('booking.email', 'Email Address')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="alexander@luxury.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className={labelClass}>
                    <FaPaperPlane className="text-gold-400" size={11} />
                    {t('booking.phone', 'Phone / WhatsApp')}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 019-2834"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Flight and Luggage Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="flight-number" className={labelClass}>
                    <FaPaperPlane className="text-gold-400" size={11} />
                    {t('booking.flightNumber', 'Flight No. (Optional)')}
                  </label>
                  <input
                    id="flight-number"
                    type="text"
                    name="flightNumber"
                    placeholder="e.g. TK 1821 / EK 924"
                    value={formData.flightNumber}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="luggage-count" className={labelClass}>
                    <FaCarSide className="text-gold-400" size={11} />
                    {t('booking.luggageCount', 'Luggage Pieces')}
                  </label>
                  <input
                    id="luggage-count"
                    type="number"
                    name="luggageCount"
                    min="0"
                    max="30"
                    value={formData.luggageCount}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="pickup-location" className={labelClass}>
                    <FaMapMarkerAlt className="text-gold-400" size={11} />
                    {t('booking.pickupLocation', 'Pickup Location / Airport / Hotel')}
                  </label>
                  <input
                    id="pickup-location"
                    type="text"
                    name="pickupLocation"
                    placeholder="e.g. Istanbul Grand Airport (IST) / Terminal VIP"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="dropoff-location" className={labelClass}>
                    <FaMapMarkerAlt className="text-gold-400" size={11} />
                    {t('booking.dropoffLocation', 'Drop-off Destination')}
                  </label>
                  <input
                    id="dropoff-location"
                    type="text"
                    name="dropoffLocation"
                    placeholder="e.g. Four Seasons Bosphorus / Private Villa"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="special-requests" className={labelClass}>
                  {t('booking.specialRequests', 'Special Requests (Child seats, luggage notes)')}
                </label>
                <textarea
                  id="special-requests"
                  name="specialRequest"
                  placeholder={t('booking.specialRequestPlaceholder', 'Number of large suitcases, flight numbers, or requested refreshments...')}
                  value={formData.specialRequest}
                  onChange={handleChange}
                  rows="2"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-obsidian-900 font-bold rounded-xl shadow-[0_4px_20px_rgba(245,166,35,0.3)] hover:shadow-[0_6px_30px_rgba(245,166,35,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] uppercase tracking-[1.5px] flex items-center justify-center gap-2 cursor-pointer pt-3"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
                    {t('common.processing', 'Securing Chauffeur...')}
                  </span>
                ) : (
                  <>
                    <FaPaperPlane size={12} />
                    {t('transportation.reserveNow', 'Reserve Private Transfer')}
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {showInvoice && bookingResult && (
        <InvoiceModal booking={bookingResult} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default TransportationForm;
