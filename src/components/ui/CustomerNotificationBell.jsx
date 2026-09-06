import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckDouble, FaCalendarCheck, FaCreditCard, FaQuestionCircle, FaTimes } from 'react-icons/fa';
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

  const handleItemClick = (item) => {
    if (!item.isRead) {
      handleMarkAsRead(item.id);
    }
    setIsOpen(false);
    if (item.deepLink) {
      navigate(item.deepLink);
    } else {
      navigate('/dashboard');
    }
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
        <div className={`absolute top-full ${isRtl ? 'left-0' : 'right-0'} mt-2 w-72 sm:w-80 bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-obsidian-700 rounded-2xl shadow-2xl z-[10000] overflow-hidden text-gray-900 dark:text-white`}>
          <div className="p-3 border-b border-gray-100 dark:border-obsidian-800 flex items-center justify-between bg-gray-50 dark:bg-obsidian-800/50">
            <span className="font-bold text-xs">
              {isRtl ? 'الإشعارات' : 'Notifications'} {unreadCount > 0 && `(${unreadCount})`}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
              >
                <FaCheckDouble size={10} />
                <span>{isRtl ? 'قراءة الكل' : 'Mark all read'}</span>
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-obsidian-800">
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
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-amber-600 dark:text-amber-400 truncate">
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
