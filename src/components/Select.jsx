import clsx from 'clsx';

export const Select = ({
  label,
  error,
  helperText,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  size = 'md',
  options = [],
  className,
  selectClassName,
  labelClassName,
  id,
  ...props
}) => {
  let selectCounter = 0;
  const selectId = id || `select-${++selectCounter}`;

  const baseClasses =
    'block w-full rounded-lg border-0 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 appearance-none';

  const variant = error ? 'error' : 'default';
  const variants = {
    default:
      'ring-gray-300 dark:ring-gray-600 focus:ring-blue-500 hover:ring-gray-400 dark:hover:ring-gray-500',
    error: 'ring-red-300 dark:ring-red-600 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-sm h-8',
    md: 'px-3 py-2 text-sm h-10',
    lg: 'px-4 py-2.5 text-base h-12',
  };

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={selectId}
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
        <select
          id={selectId}
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          className={clsx(
            baseClasses,
            variants[variant],
            sizes[size],
            'pr-10',
            selectClassName
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => {
            const optionValue =
              typeof option === 'object' ? option.value : option;
            const optionLabel =
              typeof option === 'object' ? option.label : option;
            const optionDisabled =
              typeof option === 'object' ? option.disabled : false;

            return (
              <option key={index} value={optionValue} disabled={optionDisabled}>
                {optionLabel}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-5 w-5 text-gray-400 dark:text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
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
