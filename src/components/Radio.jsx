import clsx from 'clsx';

export const Radio = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  color = 'blue',
  className,
  labelClassName,
  id,
  name,
  value,
  ...props
}) => {
  let radioCounter = 0;
const radioId = id || `radio-${++radioCounter}`;

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const colors = {
    blue: 'text-blue-600 focus:ring-blue-500',
    green: 'text-green-600 focus:ring-green-500',
    red: 'text-red-600 focus:ring-red-500',
    purple: 'text-purple-600 focus:ring-purple-500',
    yellow: 'text-yellow-600 focus:ring-yellow-500',
  };

  return (
    <div className={clsx('flex items-start', className)}>
      <input
        id={radioId}
        type="radio"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        name={name}
        value={value}
        className={clsx(
          'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed',
          sizes[size],
          colors[color]
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={radioId}
          className={clsx(
            'ml-2 text-sm text-gray-900 dark:text-gray-100 select-none leading-5',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};
