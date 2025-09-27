import { useCallback } from 'react';
import clsx from 'clsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  onClick,
  type = 'button',
  fullWidth = false,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-blue-500',
    success:
      'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white focus:ring-green-500',
    secondary:
      'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500',
    outline:
      'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 text-gray-700 dark:text-gray-300 focus:ring-blue-500',
    ghost:
      'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 focus:ring-gray-500',
    danger:
      'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500',
  };

  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs h-7',
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12',
    xl: 'px-8 py-4 text-lg h-14',
  };

  const handleClick = useCallback((e) => {
    if (loading || disabled) return;
    onClick?.(e);
  }, [loading, disabled, onClick]);

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {icon && iconPosition === 'left' && !loading && (
        <span className={clsx('flex-shrink-0', children ? 'mr-2' : '')}>
          {icon}
        </span>
      )}

      {children && (
        <span className={loading ? 'opacity-75' : ''}>{children}</span>
      )}

      {icon && iconPosition === 'right' && !loading && (
        <span className={clsx('flex-shrink-0', children ? 'ml-2' : '')}>
          {icon}
        </span>
      )}
    </button>
  );
};
