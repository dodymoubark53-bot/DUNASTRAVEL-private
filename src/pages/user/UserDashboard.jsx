
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  FaUserCircle, FaBookmark, FaLock, FaUser, FaEnvelope, 
  FaPhone, FaSignOutAlt, FaCalendarAlt, FaFileInvoiceDollar, FaGlobeAmericas,
  FaHeart, FaTimesCircle, FaEye, FaEyeSlash, FaCheck, FaTimes
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../hooks/useWishlist';
import InvoiceModal from '../../components/booking/InvoiceModal';
import TourCard from '../../components/tour/TourCard';
import Button from '../../components/ui/Button';
import api from '../../utils/api';
import { useToast } from '../../context/ToastContext';

const inputClass = "w-full p-3 rounded-xl outline-none transition-all text-[14px] bg-[rgba(255,252,247,0.04)] text-ivory-50 placeholder:text-[rgba(245,237,214,0.3)] border border-[rgba(201,162,39,0.15)] focus:border-[rgba(201,162,39,0.5)] focus:shadow-[0_0_20px_rgba(201,162,39,0.1)] [color-scheme:dark]";
const labelClass = "block text-caption text-gold-500 font-medium mb-1 text-[12px] uppercase tracking-[1px]";

const UserDashboard = ({ initialTab = 'overview' }) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const { user, logout, updateProfile, changePassword, getUserBookings } = useAuth();
  const { favorites, loading: loadingFavs } = useWishlist();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const [activeTab, setActiveTab] = useState(initialTab);
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);
  const [cancellingCode, setCancellingCode] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nationality: user?.nationality || '',
    preferredLanguage: user?.preferredLanguage || i18n.language || 'en',
    preferredCurrency: user?.preferredCurrency || 'USD',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password Form State
  const [pwdForm, setPwdForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [changingPwd, setChangingPwd] = useState(false);

  // Password complexity calculations
  const hasLength = pwdForm.newPassword.length >= 12;
  const hasUpper = /[A-Z]/.test(pwdForm.newPassword);
  const hasLower = /[a-z]/.test(pwdForm.newPassword);
  const hasDigit = /\d/.test(pwdForm.newPassword);
  const strengthScore = [hasLength, hasUpper, hasLower, hasDigit].filter(Boolean).length;
  const isPasswordValid = hasLength && hasUpper && hasLower && hasDigit;

  useEffect(() => {
    if (!user) return undefined;
    let isMounted = true;
    queueMicrotask(() => {
      if (!isMounted) return;
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        nationality: user.nationality || '',
        preferredLanguage: user.preferredLanguage || i18n.language || 'en',
        preferredCurrency: user.preferredCurrency || 'USD',
      });
    });
    return () => {
      isMounted = false;
    };
  }, [user, i18n.language]);

  
  useEffect(() => {
    let isMounted = true;
    const fetchBookings = async () => {
      setLoadingBookings(true);
      const tourBookings = (await getUserBookings()) || [];
      let transportBookings = [];
      try {
        const transList = await api.get('/transportation/bookings/my');
        if (!Array.isArray(transList)) throw new Error('Invalid transportation-booking collection');
        transportBookings = transList.map(tb => ({
          ...tb,
          isTransport: true,
          tourTitle: tb.tourTitle || `Transport: ${tb.pickupLocation || 'Pickup'} → ${tb.dropoffLocation || 'Dropoff'}`,
          referenceCode: tb.referenceCode || tb.bookingReference || tb.id,
          totalPrice: tb.totalPrice || tb.totalAmount || 0,
        }));
      } catch {
        // user may not have transport bookings
      }

      if (isMounted) {
        setBookings([...tourBookings, ...transportBookings]);
        setLoadingBookings(false);
      }
    };
    fetchBookings();
    return () => { isMounted = false; };
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setUpdatingProfile(true);
    try {
      await updateProfile(profileForm);
      setProfileMsg({ type: 'success', text: t('user.profileUpdated', 'Profile updated successfully!') });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || t('common.errorOccurred', 'Error updating profile') });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });

    if (!isPasswordValid) {
      return setPwdMsg({ 
        type: 'error', 
        text: t('auth.passwordComplexityError', 'Password must contain at least 12 characters, including an uppercase letter, a lowercase letter, and a number')
      });
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return setPwdMsg({ type: 'error', text: t('auth.passwordsDoNotMatch', 'Passwords do not match') });
    }

    setChangingPwd(true);
    try {
      await changePassword(pwdForm.oldPassword, pwdForm.newPassword);
      setPwdMsg({ type: 'success', text: t('user.passwordChanged', 'Password changed successfully!') });
      setPwdForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message || t('common.errorOccurred', 'Failed to change password') });
    } finally {
      setChangingPwd(false);
    }
  };

  const handleCancelBooking = async (refCode) => {
    if (!refCode) return;
    setCancellingCode(refCode);
    try {
      await api.post(`/bookings/${encodeURIComponent(refCode)}/cancel`, {});
      toast.success(t('booking.cancelSuccess', 'Booking cancelled successfully'));
      const tourBookings = (await getUserBookings()) || [];
      let transportBookings = [];
      try {
        const transList = await api.get('/transportation/bookings/my');
        if (Array.isArray(transList)) {
          transportBookings = transList.map(tb => ({
            ...tb,
            isTransport: true,
            tourTitle: tb.tourTitle || `Transport: ${tb.pickupLocation || 'Pickup'} → ${tb.dropoffLocation || 'Dropoff'}`,
            referenceCode: tb.referenceCode || tb.bookingReference || tb.id,
            totalPrice: tb.totalPrice || tb.totalAmount || 0,
          }));
        }
      } catch {
        // ignore transport load error
      }
      setBookings([...tourBookings, ...transportBookings]);
    } catch (err) {
      toast.error(err.message || t('common.errorOccurred', 'Failed to cancel booking'));
    } finally {
      setCancellingCode(null);
    }
  };

  const accountIsActive = user?.status === 'ACTIVE' && !user?.suspendedAt;
  const profileValue = (value, fallback = t('common.notProvided', 'Not provided')) => {
    if (value === null || value === undefined || value === '') return fallback;
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.length ? value.join(', ') : fallback;
    if (typeof value === 'object') {
      const values = Object.values(value).filter((item) => typeof item === 'string' && item.trim());
      return values.length ? values.join(', ') : fallback;
    }
    return fallback;
  };
  const formatProfileDate = (value) => {
    if (!value) return t('common.notProvided', 'Not provided');
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? t('common.notProvided', 'Not provided') : date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-obsidian-900 text-ivory-50 font-body">
      <Helmet>
        <title>{t('user.dashboardTitle', 'My Dashboard | Dunas Travel')}</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Profile Card */}
        <div className="bg-[#121118] border border-[rgba(201,162,39,0.2)] rounded-2xl p-6 md:p-8 mb-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-obsidian-900 font-bold text-2xl shadow-[0_0_25px_rgba(201,162,39,0.3)] flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle size={40} />}
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-gold-500/10 border border-gold-500/30 text-gold-400 rounded-full text-caption text-[11px] uppercase tracking-[1.5px] font-semibold mb-1">
                {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? 'VIP Admin' : user?.isVip ? 'VIP Member' : 'Luxury Explorer'}
              </span>
              <h1 className="text-display-sm text-ivory-50 font-display font-semibold truncate">
                {user?.name || 'Customer Profile'}
              </h1>
              <p className="text-body-sm text-ivory-400">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline-gold"
              onClick={handleLogout}
              className="w-full md:w-auto flex items-center justify-center gap-2 py-2.5 px-5 text-[12px] uppercase tracking-[1px]"
            >
              <FaSignOutAlt /> {t('nav.logout', 'Sign Out')}
            </Button>
          </div>
        </div>

        {/* Tab Navigation & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-3 shadow-lg">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-semibold text-[13px] uppercase tracking-[1px] flex items-center gap-3 transition-all ${activeTab === 'overview' ? 'bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 shadow-[0_0_15px_rgba(201,162,39,0.3)]' : 'text-ivory-300 hover:text-gold-400 hover:bg-[rgba(255,252,247,0.04)]'}`}
              >
                <FaGlobeAmericas size={15} /> {t('user.tabOverview', 'Overview')}
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-semibold text-[13px] uppercase tracking-[1px] flex items-center gap-3 transition-all ${activeTab === 'bookings' ? 'bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 shadow-[0_0_15px_rgba(201,162,39,0.3)]' : 'text-ivory-300 hover:text-gold-400 hover:bg-[rgba(255,252,247,0.04)]'}`}
              >
                <FaBookmark size={15} /> {t('user.tabBookings', 'My Bookings')}
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-semibold text-[13px] uppercase tracking-[1px] flex items-center gap-3 transition-all ${activeTab === 'favorites' ? 'bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 shadow-[0_0_15px_rgba(201,162,39,0.3)]' : 'text-ivory-300 hover:text-gold-400 hover:bg-[rgba(255,252,247,0.04)]'}`}
              >
                <FaHeart size={15} /> {t('user.tabFavorites', 'Saved Tours')}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-semibold text-[13px] uppercase tracking-[1px] flex items-center gap-3 transition-all ${activeTab === 'profile' ? 'bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 shadow-[0_0_15px_rgba(201,162,39,0.3)]' : 'text-ivory-300 hover:text-gold-400 hover:bg-[rgba(255,252,247,0.04)]'}`}
              >
                <FaUser size={15} /> {t('user.tabProfile', 'Profile Settings')}
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-semibold text-[13px] uppercase tracking-[1px] flex items-center gap-3 transition-all ${activeTab === 'security' ? 'bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 shadow-[0_0_15px_rgba(201,162,39,0.3)]' : 'text-ivory-300 hover:text-gold-400 hover:bg-[rgba(255,252,247,0.04)]'}`}
              >
                <FaLock size={15} /> {t('user.tabSecurity', 'Security')}
              </button>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="lg:col-span-3">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-6 md:p-8 shadow-card">
                  <h3 className="text-display-xs text-gold-500 font-display mb-4">
                    {t('user.welcomeBanner', 'Welcome to Your Private Luxury Portal')}
                  </h3>
                  <p className="text-body-md text-ivory-300 leading-relaxed">
                    {t('user.bannerDesc', 'Track your customized itineraries, access invoices, and manage your luxury travel preferences with Dunas Travel.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-5 text-center">
                    <p className="text-caption text-ivory-400 uppercase tracking-widest text-[10px] mb-1">{t('user.totalBookings', 'Total Bookings')}</p>
                    <p className="text-display-md text-gold-500 font-display">{bookings.length}</p>
                  </div>
                  <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-5 text-center">
                    <p className="text-caption text-ivory-400 uppercase tracking-widest text-[10px] mb-1">{t('user.accountStatus', 'Account Status')}</p>
                    <p className={`text-display-xs font-semibold mt-2 ${accountIsActive ? 'text-sage-400' : 'text-red-400'}`}>
                      {accountIsActive ? t('user.accountActive', 'Active') : user?.status || t('user.accountInactive', 'Inactive')}
                    </p>
                  </div>
                  <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-5 text-center">
                    <p className="text-caption text-ivory-400 uppercase tracking-widest text-[10px] mb-1">{t('user.emailStatus', 'Email Status')}</p>
                    <p className={`text-display-xs font-semibold mt-2 ${user?.isVerified ? 'text-sage-400' : 'text-amber-400'}`}>
                      {user?.isVerified ? t('user.verified', 'Verified') : t('user.notVerified', 'Not verified')}
                    </p>
                  </div>
                  <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-5 text-center">
                    <p className="text-caption text-ivory-400 uppercase tracking-widest text-[10px] mb-1">{t('user.customerNumber', 'Customer Number')}</p>
                    <p className="text-body-md text-gold-400 font-semibold mt-2">{profileValue(user?.customerNumber, '—')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-5">
                    <h4 className="text-body-lg text-gold-500 font-semibold mb-4">{t('user.personalDetails', 'Personal Details')}</h4>
                    <dl className="space-y-3 text-body-sm">
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.nationality', 'Nationality')}</dt><dd className="text-ivory-100 text-right">{profileValue(user?.nationality)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.gender', 'Gender')}</dt><dd className="text-ivory-100 text-right">{profileValue(user?.gender)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.dateOfBirth', 'Date of Birth')}</dt><dd className="text-ivory-100 text-right">{formatProfileDate(user?.dateOfBirth)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.memberSince', 'Member Since')}</dt><dd className="text-ivory-100 text-right">{formatProfileDate(user?.createdAt)}</dd></div>
                    </dl>
                  </div>
                  <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-5">
                    <h4 className="text-body-lg text-gold-500 font-semibold mb-4">{t('user.travelPreferences', 'Travel Preferences')}</h4>
                    <dl className="space-y-3 text-body-sm">
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.preferredLanguage', 'Language')}</dt><dd className="text-ivory-100 text-right uppercase">{profileValue(user?.preferredLanguage)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.preferredCurrency', 'Currency')}</dt><dd className="text-ivory-100 text-right uppercase">{profileValue(user?.preferredCurrency)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.preferredDestination', 'Preferred Destination')}</dt><dd className="text-ivory-100 text-right">{profileValue(user?.preferredDestination)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.preferredTravelType', 'Travel Style')}</dt><dd className="text-ivory-100 text-right">{profileValue(user?.preferredTravelType)}</dd></div>
                    </dl>
                  </div>
                  <div className="lg:col-span-2 bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-5">
                    <h4 className="text-body-lg text-gold-500 font-semibold mb-4">{t('user.contactPreferences', 'Contact & Account Preferences')}</h4>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-body-sm">
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('auth.phoneNumber', 'Phone')}</dt><dd className="text-ivory-100 text-right">{profileValue(user?.phone)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.phoneStatus', 'Phone Status')}</dt><dd className="text-ivory-100 text-right">{user?.phoneVerified ? t('user.verified', 'Verified') : t('user.notVerified', 'Not verified')}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.address', 'Address')}</dt><dd className="text-ivory-100 text-right">{profileValue(user?.address)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.emergencyContact', 'Emergency Contact')}</dt><dd className="text-ivory-100 text-right">{profileValue(user?.emergencyContact)}</dd></div>
                      <div className="flex justify-between gap-5"><dt className="text-ivory-400">{t('user.marketingConsent', 'Marketing Updates')}</dt><dd className="text-ivory-100 text-right">{user?.marketingConsent ? t('common.enabled', 'Enabled') : t('common.disabled', 'Disabled')}</dd></div>
                    </dl>
                  </div>
                </div>
              </div>
            )}

            {/* MY BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-6 md:p-8 shadow-card">
                <h2 className="text-display-xs text-ivory-50 font-display mb-6">
                  {t('user.myBookingsTitle', 'Your Journey History')}
                </h2>

                {loadingBookings ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[rgba(201,162,39,0.2)] rounded-2xl p-8">
                    <FaCalendarAlt size={36} className="text-ivory-400 mx-auto mb-3 opacity-40" />
                    <p className="text-body-md text-ivory-300 font-medium mb-2">{t('user.noBookings', 'No active bookings found.')}</p>
                    <p className="text-caption text-ivory-400 max-w-md mx-auto">{t('user.noBookingsDesc', 'Explore our hand-crafted luxury tours in Egypt, Turkey, Jordan, Morocco, and Greece to begin your journey.')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id || b.referenceCode} className="bg-[rgba(255,252,247,0.02)] border border-[rgba(201,162,39,0.12)] hover:border-gold-500/40 rounded-xl p-5 transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(201,162,39,0.08)] pb-4 mb-4">
                          <div>
                            <span className="text-caption text-gold-500 font-mono text-[11px] uppercase tracking-widest block mb-1">
                              Ref: #{b.id || b.referenceCode}
                            </span>
                            <h4 className="text-body-lg text-ivory-50 font-semibold">{b.tourTitle || b.tourName || 'Custom Luxury Tour'}</h4>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-[1px] font-bold self-start md:self-auto ${
                            ['confirmed', 'paid', 'completed'].includes(String(b.status).toLowerCase())
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : ['cancelled', 'refunded'].includes(String(b.status).toLowerCase())
                              ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                              : 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                          }`}>
                            {b.status || 'PENDING'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-body-sm text-ivory-300 mb-4">
                          <div>
                            <span className="block text-[11px] text-ivory-400 uppercase">{t('booking.arrivalDate', 'Arrival')}</span>
                            <span className="font-semibold text-ivory-100">{b.arrivalDate || 'TBD'}</span>
                          </div>
                          <div>
                            <span className="block text-[11px] text-ivory-400 uppercase">{t('booking.passengers', 'Passengers')}</span>
                            <span className="font-semibold text-ivory-100">{b.adults || 1} Adult(s)</span>
                          </div>
                          <div>
                            <span className="block text-[11px] text-ivory-400 uppercase">{t('booking.totalPrice', 'Total Price')}</span>
                            <span className="font-semibold text-gold-400">${b.totalAmountUsd || b.price || '0.00'}</span>
                          </div>
                          <div>
                            <span className="block text-[11px] text-ivory-400 uppercase">{t('booking.paymentStatus', 'Payment')}</span>
                            <span className="font-semibold text-ivory-100">{b.paymentStatus || t('booking.awaitingPayment', 'Awaiting payment')}</span>
                          </div>
                          <div className="flex items-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoiceBooking(b)}
                              className="px-3.5 py-2 bg-gradient-to-r from-gold-500 to-gold-700 text-obsidian-900 font-bold rounded-lg text-[11px] uppercase tracking-[1px] flex items-center gap-1.5 hover:scale-105 transition-all"
                            >
                              <FaFileInvoiceDollar /> {t('booking.viewInvoice', 'Invoice')}
                            </button>
                            {b.status !== 'CANCELLED' && b.status !== 'cancelled' && (
                              <button
                                type="button"
                                disabled={cancellingCode === (b.referenceCode || b.id)}
                                onClick={() => handleCancelBooking(b.referenceCode || b.id)}
                                className="px-3 py-2 bg-red-500/15 border border-red-500/30 text-red-400 font-semibold rounded-lg text-[11px] uppercase tracking-[1px] flex items-center gap-1 hover:bg-red-500/25 transition-all"
                              >
                                <FaTimesCircle /> {t('common.cancel', 'Cancel')}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SAVED TOURS / FAVORITES TAB */}
            {activeTab === 'favorites' && (
              <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-6 md:p-8 shadow-card">
                <h2 className="text-display-xs text-ivory-50 font-display mb-6">
                  {t('user.tabFavorites', 'Your Saved Tours')}
                </h2>

                {loadingFavs ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[rgba(201,162,39,0.2)] rounded-2xl p-8">
                    <FaHeart size={36} className="text-ivory-400 mx-auto mb-3 opacity-40" />
                    <p className="text-body-md text-ivory-300 font-medium mb-2">{t('user.noFavorites', 'No saved tours yet.')}</p>
                    <p className="text-caption text-ivory-400 max-w-md mx-auto">{t('user.noFavoritesDesc', 'Click the heart icon on any tour card to save it to your personal wishlist.')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((tour) => (
                      <TourCard key={tour.id || tour.slug} tour={tour} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE SETTINGS TAB */}
            {activeTab === 'profile' && (
              <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-6 md:p-8 shadow-card">
                <h2 className="text-display-xs text-ivory-50 font-display mb-6">
                  {t('user.profileSettingsTitle', 'Personal Profile Details')}
                </h2>

                {profileMsg.text && (
                  <div className={`mb-6 p-4 rounded-xl text-body-sm text-center border ${profileMsg.type === 'success' ? 'bg-sage-500/15 border-sage-500/40 text-sage-400' : 'bg-red-500/15 border-red-500/40 text-red-400'}`}>
                    {profileMsg.text}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><FaUser className="inline mr-1" size={11} />{t('auth.fullName', 'Full Name')}</label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}><FaEnvelope className="inline mr-1" size={11} />{t('auth.emailAddress', 'Email Address')}</label>
                      <input
                        type="email"
                        disabled
                        value={profileForm.email}
                        className={`${inputClass} opacity-60 cursor-not-allowed`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><FaPhone className="inline mr-1" size={11} />{t('auth.phoneNumber', 'Phone Number')}</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}><FaGlobeAmericas className="inline mr-1" size={11} />{t('user.nationality', 'Nationality')}</label>
                      <input
                        type="text"
                        value={profileForm.nationality}
                        maxLength={100}
                        onChange={(e) => setProfileForm({ ...profileForm, nationality: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><FaGlobeAmericas className="inline mr-1" size={11} />{t('user.preferredLanguage', 'Preferred Language')}</label>
                      <select
                        value={profileForm.preferredLanguage}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredLanguage: e.target.value })}
                        className={inputClass}
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="es">Español</option>
                        <option value="pt">Português</option>
                        <option value="it">Italiano</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>{t('user.preferredCurrency', 'Preferred Currency')}</label>
                      <select
                        value={profileForm.preferredCurrency}
                        onChange={(e) => setProfileForm({ ...profileForm, preferredCurrency: e.target.value })}
                        className={inputClass}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="EGP">EGP</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    variant="gold-glow"
                    type="submit"
                    className="py-3 px-8 text-[12px] uppercase tracking-[1.5px] font-bold mt-4"
                    disabled={updatingProfile}
                  >
                    {updatingProfile ? t('common.saving', 'Saving...') : t('common.saveChanges', 'Save Profile')}
                  </Button>
                </form>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="bg-[#121118] border border-[rgba(201,162,39,0.15)] rounded-2xl p-6 md:p-8 shadow-card">
                <h2 className="text-display-xs text-ivory-50 font-display mb-6">
                  {t('user.securityTitle', 'Change Account Password')}
                </h2>

                {pwdMsg.text && (
                  <div className={`mb-6 p-4 rounded-xl text-body-sm text-center border ${pwdMsg.type === 'success' ? 'bg-sage-500/15 border-sage-500/40 text-sage-400' : 'bg-red-500/15 border-red-500/40 text-red-400'}`}>
                    {pwdMsg.text}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className={labelClass}>{t('user.oldPassword', 'Current Password')}</label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        required
                        value={pwdForm.oldPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, oldPassword: e.target.value })}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-500 transition-colors"
                        aria-label="Toggle current password visibility"
                      >
                        {showOldPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>{t('user.newPassword', 'New Password')}</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={pwdForm.newPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-500 transition-colors"
                        aria-label="Toggle new password visibility"
                      >
                        {showNewPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    {pwdForm.newPassword && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex gap-1 h-1.5 w-full bg-obsidian-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-300 ${strengthScore >= 1 ? (strengthScore === 1 ? 'bg-red-500 w-1/4' : strengthScore === 2 ? 'bg-amber-500 w-1/2' : strengthScore === 3 ? 'bg-yellow-500 w-3/4' : 'bg-emerald-500 w-full') : 'w-0'}`} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-1 text-[11px] pt-1">
                          <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-400' : 'text-ivory-400'}`}>
                            {hasLength ? <FaCheck size={9} /> : <FaTimes size={9} />}
                            <span>{t('auth.reqLength', '12+ characters')}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-400' : 'text-ivory-400'}`}>
                            {hasUpper ? <FaCheck size={9} /> : <FaTimes size={9} />}
                            <span>{t('auth.reqUppercase', 'Uppercase letter')}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-400' : 'text-ivory-400'}`}>
                            {hasLower ? <FaCheck size={9} /> : <FaTimes size={9} />}
                            <span>{t('auth.reqLowercase', 'Lowercase letter')}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 ${hasDigit ? 'text-emerald-400' : 'text-ivory-400'}`}>
                            {hasDigit ? <FaCheck size={9} /> : <FaTimes size={9} />}
                            <span>{t('auth.reqNumber', 'Number (0-9)')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>{t('auth.confirmPassword', 'Confirm New Password')}</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={pwdForm.confirmPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory-400 hover:text-gold-500 transition-colors"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                      </button>
                    </div>
                    {pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword && (
                      <p className="text-[11px] text-red-400 mt-1">{t('auth.passwordsDoNotMatch', 'Passwords do not match.')}</p>
                    )}
                  </div>

                  <Button
                    variant="gold-glow"
                    type="submit"
                    className="py-3 px-8 text-[12px] uppercase tracking-[1.5px] font-bold mt-4"
                    disabled={changingPwd || !isPasswordValid || pwdForm.newPassword !== pwdForm.confirmPassword}
                  >
                    {changingPwd ? t('common.updating', 'Updating...') : t('user.updatePasswordBtn', 'Update Password')}
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedInvoiceBooking && (
        <InvoiceModal booking={selectedInvoiceBooking} onClose={() => setSelectedInvoiceBooking(null)} />
      )}
    </div>
  );
};

export default UserDashboard;
