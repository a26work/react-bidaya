import { useMemo } from 'react';
import clsx from 'clsx';

export const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'blue',
  showLabel = false,
  label,
  className,
  animated = false,
  striped = false,
  ...props
}) => {
  const percentage = useMemo(() => 
    Math.min(Math.max((value / max) * 100, 0), 100), 
    [value, max]
  );

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-5',
  };

  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600',
    purple: 'bg-purple-600',
    gray: 'bg-gray-600',
  };

  return (
    <div className={clsx('w-full', className)} {...props}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showLabel && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={clsx(
            'transition-all duration-300 ease-in-out rounded-full',
            colors[color],
            sizes[size],
            animated && 'animate-pulse',
            striped &&
              'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px]'
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
