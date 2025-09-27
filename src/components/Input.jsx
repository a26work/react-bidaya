import clsx from 'clsx';

export const Input = ({
  label,
  error,
  helperText,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  size = 'md',
  variant = 'default',
  icon,
  iconPosition = 'left',
  className,
  inputClassName,
  labelClassName,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseInputClasses =
    'block w-full rounded-lg border-0 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 dark:placeholder:text-gray-500';

  const variants = {
    default:
      'ring-gray-300 dark:ring-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-800 hover:ring-gray-400 dark:hover:ring-gray-500',
    error:
      'ring-red-300 dark:ring-red-600 focus:ring-red-500 bg-white dark:bg-gray-800',
    success:
      'ring-green-300 dark:ring-green-600 focus:ring-green-500 bg-white dark:bg-gray-800',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-sm h-8',
    md: 'px-3 py-2 text-sm h-10',
    lg: 'px-4 py-2.5 text-base h-12',
  };

  const inputVariant = error ? 'error' : variant;

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 mb-2',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-400 dark:text-gray-500">{icon}</span>
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={clsx(
            baseInputClasses,
            variants[inputVariant],
            sizes[size],
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            inputClassName
          )}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-400 dark:text-gray-500">{icon}</span>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p
          className={clsx(
            'mt-1.5 text-sm',
            error
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};
