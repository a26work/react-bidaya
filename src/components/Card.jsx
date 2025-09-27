import clsx from 'clsx';
import { Loader } from './Loader';
import { useTranslation } from '../hooks/useTranslation';

export const Card = ({
  children,
  title,
  subtitle,
  actions,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  footer,
  padding = 'md',
  shadow = 'sm',
  hover = false,
  border = true,
  loading = false,
  ...props
}) => {
  const { t } = useTranslation();
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg overflow-hidden';

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const borderClass = border
    ? 'border border-gray-200 dark:border-gray-700'
    : '';
  const hoverClass = hover
    ? 'hover:shadow-lg transition-shadow duration-200'
    : '';

  if (loading) {
    return (
      <div
        className={clsx(baseClasses, borderClass, shadows[shadow], className)}
      >
        <div className="flex justify-center">
          <Loader size="lg" text={t('loading_ellipsis')} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        baseClasses,
        borderClass,
        shadows[shadow],
        hoverClass,
        className
      )}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div
          className={clsx(
            'border-b border-gray-200 dark:border-gray-700 px-6 py-4',
            headerClassName
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center space-x-2 ml-4">{actions}</div>
            )}
          </div>
        </div>
      )}

      <div className={clsx(paddings[padding], bodyClassName)}>{children}</div>

      {footer && (
        <div
          className={clsx(
            'border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-700/50',
            footerClassName
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
