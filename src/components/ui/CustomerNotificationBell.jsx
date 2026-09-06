import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckDouble, FaCalendarCheck, FaCreditCard, FaQuestionCircle, FaTimes, FaVolumeUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { playNotificationSound } from '../../utils/sound';

export default function CustomerNotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const isInitializedRef = useRef(false);
  const prevUnreadCountRef = useRef(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      setLoading(true);
      const data = await api.get('/in-app-notifications?limit=8');
      if (!data || !Array.isArray(data.items) || typeof data.unreadCount !== 'number') {
        throw new Error('Invalid notification collection contract');
      }
      setNotifications(data.items);

      if (isInitializedRef.current && data.unreadCount > prevUnreadCountRef.current) {
        playNotificationSound();
      }

      setUnreadCount(data.unreadCount);
      prevUnreadCountRef.current = data.unreadCount;
      isInitializedRef.current = true;
    } catch (err) {
      console.warn('Customer notification fetch failed', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const initialFetch = setTimeout(fetchNotifications, 0);
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      clearTimeout(initialFetch);
      clearInterval(interval);
    };
  }, [user, fetchNotifications]);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.patch(`/in-app-notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => {
        const updated = Math.max(0, prev - 1);
        prevUnreadCountRef.current = updated;
        return updated;
      });
    } catch (err) {
      console.warn('Failed to mark read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/in-app-notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      prevUnreadCountRef.current = 0;
    } catch (err) {
      console.warn('Failed to mark all read', err);
    }
  };

  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleItemClick = (item) => {
    if (!item.isRead) {
      handleMarkAsRead(item.id);
    }
    setIsOpen(false);
    setSelectedNotification(item);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 hover:border-[#F5A623]/40 transition-all duration-300 hover:scale-110 relative"
      >
        <FaBell size={11} className="text-[#F5A623]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 bg-amber-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse border border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`fixed sm:absolute top-16 sm:top-full ${isRtl ? 'left-3 sm:left-0' : 'right-3 sm:right-0'} mt-2 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-obsidian-700 rounded-2xl shadow-2xl z-[999999] overflow-hidden text-gray-900 dark:text-white transition-all`}>
          <div className="p-3 border-b border-gray-100 dark:border-obsidian-800 flex items-center justify-between bg-gray-50 dark:bg-obsidian-800/50">
            <span className="font-bold text-xs">
              {isRtl ? 'الإشعارات' : 'Notifications'} {unreadCount > 0 && `(${unreadCount})`}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playNotificationSound();
                }}
                title={isRtl ? 'تجربة الصوت' : 'Test sound'}
                className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 active:scale-95"
              >
                <FaVolumeUp size={10} />
                <span>{isRtl ? 'تجربة الصوت' : 'Test sound'}</span>
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 active:scale-95"
                >
                  <FaCheckDouble size={10} />
                  <span>{isRtl ? 'قراءة الكل' : 'Mark all read'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-obsidian-800">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400">
                {isRtl ? 'جاري التحميل...' : 'Loading...'}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">
                {isRtl ? 'لا توجد إشعارات حالياً' : 'No notifications'}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`p-3 text-left cursor-pointer hover:bg-amber-50/50 dark:hover:bg-obsidian-800/60 transition-colors ${!n.isRead ? 'bg-amber-500/10' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-amber-600 dark:text-amber-400 truncate">
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed break-words">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* NOTIFICATION DETAILS MODAL / MOBILE BOTTOM SHEET (PORTAL TO DOCUMENT.BODY) */}
      {selectedNotification && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9999999] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto transition-all"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="bg-white dark:bg-obsidian-900 border-t sm:border border-gray-200 dark:border-obsidian-700 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[85vh] sm:max-h-[85vh] flex flex-col p-4 sm:p-6 shadow-2xl space-y-3.5 text-gray-900 dark:text-white relative animate-in slide-in-from-bottom-5 sm:zoom-in-95 duration-200 my-0 sm:my-auto z-[10000000]"
            dir={isRtl ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Touch Bar */}
            <div className="w-12 h-1 bg-gray-300 dark:bg-obsidian-700 rounded-full mx-auto -mt-1 mb-1 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100 dark:border-obsidian-800 shrink-0">
              <div className="flex items-start gap-3 min-w-0 flex-1 me-2">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
                  <FaBell />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold mb-1">
                    {selectedNotification.category || (isRtl ? 'إشعار' : 'Notification')}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white leading-snug break-words">
                    {selectedNotification.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 block mt-1">
                    {selectedNotification.createdAt
                      ? new Date(selectedNotification.createdAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US')
                      : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-obsidian-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition-colors shrink-0 active:scale-95"
              >
                <FaTimes size={13} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-1 overflow-y-auto flex-1 min-h-0 space-y-3">
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-obsidian-800/50 p-4 rounded-2xl border border-gray-100 dark:border-obsidian-800 break-words">
                {selectedNotification.message}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-gray-100 dark:border-obsidian-800 shrink-0">
              {selectedNotification.deepLink && !selectedNotification.deepLink.startsWith('/admin') && (
                <button
                  onClick={() => {
                    const target = selectedNotification.deepLink;
                    setSelectedNotification(null);
                    if (target === '/dashboard' || target === '/bookings' || target.startsWith('/')) {
                      navigate(target);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all shadow-md active:scale-95 text-center"
                >
                  {isRtl ? 'الانتقال للرابط' : 'Go to link'}
                </button>
              )}
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold bg-gray-100 dark:bg-obsidian-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-obsidian-700 rounded-xl transition-colors active:scale-95 text-center"
              >
                {isRtl ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
