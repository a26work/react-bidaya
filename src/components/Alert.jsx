import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { useTranslation } from '../hooks/useTranslation';

export const Alert = ({
  children,
  variant = 'info',
  size = 'md',
  dismissible = false,
  onDismiss,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-100',
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-100',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-100',
    error:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-100',
  };

  const sizes = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-sm',
    lg: 'p-5 text-base',
  };

  if (!isVisible) return null;

  return (
    <div
      className={clsx(
        'border rounded-lg flex items-start justify-between',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="ml-3 -mr-1 -mt-1 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label={t('dismiss_alert')}
        >
          <svg
            className="h-4 w-4"
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
  );
};
