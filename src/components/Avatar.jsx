import { useState } from 'react';
import clsx from 'clsx';

export const Avatar = ({
  src,
  alt = '',
  size = 'md',
  fallback,
  className,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={clsx(
        'rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden',
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={handleImageError}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className={clsx(
            'font-medium text-gray-600 dark:text-gray-300',
            textSizes[size]
          )}
        >
          {fallback || alt.charAt(0).toUpperCase() || '?'}
        </span>
      )}
    </div>
  );
};
