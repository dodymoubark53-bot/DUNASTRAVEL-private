import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext({
  showToast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const type = options.type || 'info';
    const title = options.title || '';
    const duration = options.duration || 5000;

    const newToast = { id, message, type, title, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, options = {}) => {
    showToast(message, { ...options, type: 'success' });
  }, [showToast]);

  const error = useCallback((message, options = {}) => {
    showToast(message, { ...options, type: 'error' });
  }, [showToast]);

  const info = useCallback((message, options = {}) => {
    showToast(message, { ...options, type: 'info' });
  }, [showToast]);

  const warning = useCallback((message, options = {}) => {
    showToast(message, { ...options, type: 'warning' });
  }, [showToast]);

  const value = useMemo(
    () => ({ showToast, success, error, info, warning }),
    [showToast, success, error, info, warning]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed z-[9999] top-5 right-5 rtl:right-auto rtl:left-5 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none p-4"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={'pointer-events-auto rounded-2xl p-4 shadow-2xl backdrop-blur-xl border flex items-start gap-3.5 ' + (
                t.type === 'success'
                  ? 'bg-[#070D19]/95 border-emerald-500/40 text-white shadow-emerald-950/40'
                  : t.type === 'error'
                  ? 'bg-[#070D19]/95 border-rose-500/40 text-white shadow-rose-950/40'
                  : 'bg-[#070D19]/95 border-[rgba(201,162,39,0.4)] text-white shadow-[rgba(201,162,39,0.15)]'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {t.type === 'success' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <FaCheckCircle className="w-4 h-4" />
                  </div>
                )}
                {t.type === 'error' && (
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <FaExclamationCircle className="w-4 h-4" />
                  </div>
                )}
                {t.type !== 'success' && t.type !== 'error' && (
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <FaInfoCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                {t.title && (
                  <h4 className="text-xs font-bold text-[#E8CB72] tracking-wide mb-1">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs text-white/90 leading-relaxed font-body">
                  {t.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="flex-shrink-0 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <FaTimes className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastContext;
