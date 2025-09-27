import clsx from 'clsx';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100',
    success:
      'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-100',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-100',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
