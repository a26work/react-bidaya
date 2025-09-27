import clsx from 'clsx';
import { Loader } from './Loader';
import { useTranslation } from '../hooks/useTranslation';

export const KPICard = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  color = 'blue',
  className,
  loading = false,
  ...props
}) => {
  const { t } = useTranslation();
  const colors = {
    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    green:
      'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    red: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    yellow:
      'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    purple:
      'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  };

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  const TrendIcon = ({ trend }) => {
    const iconClass = 'w-4 h-4';

    if (trend === 'up') {
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg
          className={iconClass}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      );
    }
    return (
      <svg
        className={iconClass}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 12H4"
        />
      </svg>
    );
  };

  if (loading) {
    return (
      <div
        className={clsx(
          'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm',
          className
        )}
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
        'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div
              className={clsx(
                'flex items-center mt-2 text-sm',
                trendColors[trend]
              )}
            >
              <TrendIcon trend={trend} />
              <span className="ml-1">{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={clsx('p-3 rounded-full', colors[color])}>{icon}</div>
        )}
      </div>
    </div>
  );
};
