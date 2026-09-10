import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaBell, FaCalendarCheck, FaCreditCard, FaQuestionCircle, FaMapMarkerAlt, FaArrowLeft, FaArrowRight, FaHome, FaUser, FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import SEOHead from '../components/seo/SEOHead';

export default function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadNotification() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        // Fetch recent notifications to find target item or single notification
        const res = await api.get('/in-app-notifications?limit=100');
        const items = res?.items || [];
        
        let found = null;
        if (id) {
          found = items.find((n) => String(n.id) === String(id));
        }
        
        // If not specific ID or not found, fallback to most recent notification
        if (!found && items.length > 0) {
          found = items[0];
        }

        if (isMounted) {
          if (found) {
            setNotification(found);
            // Mark as read automatically
            if (!found.isRead) {
              api.patch(`/in-app-notifications/${found.id}/read`).catch(() => {});
            }
          } else {
            setError(isRtl ? 'لم يتم العثور على الإشعار المطلوبة' : 'Notification not found');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load notification details:', err);
          setError(isRtl ? 'حدث خطأ أثناء تحميل تفاصيل الإشعار' : 'Failed to load notification details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadNotification();
    return () => {
      isMounted = false;
    };
  }, [id, user, isRtl]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'BOOKING':
        return <FaCalendarCheck className="text-emerald-500" />;
      case 'PAYMENT':
        return <FaCreditCard className="text-blue-500" />;
      case 'INQUIRY':
        return <FaQuestionCircle className="text-amber-500" />;
      case 'TOUR':
        return <FaMapMarkerAlt className="text-purple-500" />;
      default:
        return <FaBell className="text-amber-500" />;
    }
  };

  const resolveTargetLink = (link) => {
    if (!link || typeof link !== 'string') return null;
    let clean = link.trim();
    if (clean.startsWith('/account/bookings')) return '/bookings';
    if (clean.startsWith('/account/profile')) return '/profile';
    if (clean.startsWith('/account')) return '/dashboard';
    if (clean.startsWith('/admin')) return null;
    if (clean.startsWith('/')) return clean;
    return '/' + clean;
  };

  const ArrowIcon = isRtl ? FaArrowLeft : FaArrowRight;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-obsidian-950 text-gray-900 dark:text-white transition-colors duration-300">
      <SEOHead
        title={notification ? notification.title : (isRtl ? 'تفاصيل الإشعار' : 'Notification Details')}
        description={notification ? notification.message : (isRtl ? 'عرض تفاصيل الإشعار' : 'View notification details')}
      />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowIcon className={isRtl ? 'rotate-180' : ''} size={12} />
            <span>{isRtl ? 'الرجوع للخلف' : 'Go Back'}</span>
          </button>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <FaUser size={12} />
            <span>{isRtl ? 'لوحة التحكم' : 'Dashboard'}</span>
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-obsidian-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <FaSpinner className="animate-spin text-amber-500 text-3xl mx-auto" />
              <p className="text-xs text-gray-500 font-medium">
                {isRtl ? 'جاري تحميل تفاصيل الإشعار...' : 'Loading notification details...'}
              </p>
            </div>
          ) : error ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 mx-auto flex items-center justify-center text-2xl font-bold">
                !
              </div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{error}</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                <FaHome />
                <span>{isRtl ? 'العودة للرئيسية' : 'Return Home'}</span>
              </Link>
            </div>
          ) : notification ? (
            <div className="space-y-6">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-obsidian-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-xl shrink-0">
                    {getCategoryIcon(notification.category)}
                  </div>
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold">
                      {notification.category || (isRtl ? 'عام' : 'General')}
                    </span>
                    <span className="text-xs text-gray-400 block mt-1">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US', {
                            dateStyle: 'full',
                            timeStyle: 'short',
                          })
                        : ''}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {isRtl ? 'تمت القراءة' : 'Read'}
                </span>
              </div>

              {/* Title & Message */}
              <div className="space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                  {notification.title}
                </h1>

                <div className="bg-gray-50 dark:bg-obsidian-800/60 p-5 rounded-2xl border border-gray-100 dark:border-obsidian-800 text-sm leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-line break-words">
                  {notification.message}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 dark:border-obsidian-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-gray-100 dark:bg-obsidian-800 hover:bg-gray-200 dark:hover:bg-obsidian-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors text-center"
                >
                  {isRtl ? 'العودة للوحة التحكم' : 'Return to Dashboard'}
                </Link>

                {resolveTargetLink(notification.deepLink) && (
                  <button
                    onClick={() => {
                      const target = resolveTargetLink(notification.deepLink);
                      if (target) navigate(target);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all shadow-md text-center active:scale-95"
                  >
                    {isRtl ? 'الانتقال للصفحة المرتبطة' : 'Go to Related Page'}
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
