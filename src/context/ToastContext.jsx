import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext } from './ToastContextValue';

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remove a toast
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add a new toast
  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove
    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast Container - Fixed Position */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[300] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Individual Toast Component
const ToastItem = ({ toast, onRemove }) => {
  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="pointer-events-auto w-full max-w-sm"
    >
      <div className="bg-white/90 backdrop-blur-md border border-border/40 p-5 rounded-2xl shadow-2xl flex gap-4 items-start relative overflow-hidden group">

        {/* Classy Accent Bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
          isSuccess ? 'bg-primary-button' : isError ? 'bg-red-400' : 'bg-text-secondary'
        }`} />

        {/* Icon */}
        <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isSuccess ? 'bg-primary-button/10 text-primary-button' :
          isError ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-text-secondary'
        }`}>
          {isSuccess && <Check size={16} strokeWidth={2.5} />}
          {isError && <AlertCircle size={16} strokeWidth={2.5} />}
          {!isSuccess && !isError && <Info size={16} strokeWidth={2.5} />}
        </div>

        {/* Content */}
        <div className="flex-1 pt-0.5">
          <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
            isSuccess ? 'text-primary-button' : isError ? 'text-red-500' : 'text-text-secondary'
          }`}>
            {isSuccess ? 'Success' : isError ? 'Attention' : 'Note'}
          </h4>
          <p className="text-text-primary font-serif text-sm leading-snug">
            {toast.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onRemove(toast.id)}
          className="text-text-secondary/40 hover:text-text-primary transition-colors p-1"
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
};
