import { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

type ToastVariant = 'success' | 'error';

interface ToastProps {
  message: string;
  variant: ToastVariant;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, variant, onDismiss, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  const isSuccess = variant === 'success';

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 right-4 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl max-w-sm ${
        isSuccess
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-[#FF0000]/10 border-[#FF0000]/30'
      }`}
    >
      {isSuccess
        ? <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
        : <AlertCircle size={18} className="text-[#FF4444] flex-shrink-0" />
      }
      <span className="text-white text-sm font-medium flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="text-white/40 hover:text-white transition-colors ml-1 flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
