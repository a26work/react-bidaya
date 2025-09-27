import { useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useTranslation } from '../hooks/useTranslation';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  overlayClassName,
  preventClose = false,
  ...props
}) => {
  const { t } = useTranslation();
  const sizes = {
    xs: 'max-w-sm',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl',
    full: 'max-w-full mx-4',
  };

  const handleClose = useCallback(() => {
    if (!preventClose) {
      onClose();
    }
  }, [preventClose, onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (closeOnEscape && e.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose, preventClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" {...props}>
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Overlay */}
        <div
          className={clsx(
            'fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
            overlayClassName
          )}
          onClick={closeOnOverlayClick ? handleClose : undefined}
        />

        {/* Modal */}
        <div
          className={clsx(
            'relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl transform transition-all duration-300 w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col',
            sizes[size],
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? `title` : undefined}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              {!preventClose && (
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={t('close_modal')}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
