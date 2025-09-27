import clsx from 'clsx';

export const Loader = ({
  size = 'md',
  variant = 'spinner',
  className,
  text,
  overlay = false,
  color = 'blue',
  ...props
}) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20',
  };

  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600',
    yellow: 'text-yellow-600',
  };

  const Spinner = () => (
    <svg
      className={clsx('animate-spin', colors[color], sizes[size])}
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
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const Dots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={clsx(
            'rounded-full animate-bounce',
            colors[color].replace('text-', 'bg-'),
            size === 'xs'
              ? 'h-1.5 w-1.5'
              : size === 'sm'
                ? 'h-2 w-2'
                : size === 'lg'
                  ? 'h-4 w-4'
                  : size === 'xl'
                    ? 'h-5 w-5'
                    : size === '2xl'
                      ? 'h-6 w-6'
                      : 'h-3 w-3'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <div
      className={clsx(
        'rounded-full animate-pulse',
        colors[color].replace('text-', 'bg-'),
        sizes[size]
      )}
    />
  );

  const variants = {
    spinner: <Spinner />,
    dots: <Dots />,
    pulse: <Pulse />,
  };

  const content = (
    <div
      className={clsx(
        'flex flex-col items-center justify-center space-y-3',
        className
      )}
      {...props}
    >
      {variants[variant]}
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
