import { useCallback, useRef, useEffect } from 'react';
import clsx from 'clsx';

export const Textarea = ({
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
  rows = 4,
  maxRows,
  minRows = 2,
  resize = 'vertical',
  className,
  textareaClassName,
  labelClassName,
  id,
  autoResize = false,
  ...props
}) => {
  const textareaRef = useRef(null);
  const textareaId =
    id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const adjustHeight = useCallback(() => {
    if (!autoResize || !textareaRef.current) return;

    const textarea = textareaRef.current;
    textarea.style.height = 'auto';

    const scrollHeight = textarea.scrollHeight;
    const minHeight = minRows * 24; // Approximate line height
    const maxHeight = maxRows ? maxRows * 24 : Infinity;

    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [autoResize, minRows, maxRows]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleChange = (e) => {
    onChange?.(e);
    adjustHeight();
  };

  const baseClasses =
    'block w-full rounded-lg border-0 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 text-sm';

  const variant = error ? 'error' : 'default';
  const variants = {
    default:
      'ring-gray-300 dark:ring-gray-600 focus:ring-blue-500 bg-white dark:bg-gray-800 hover:ring-gray-400 dark:hover:ring-gray-500',
    error:
      'ring-red-300 dark:ring-red-600 focus:ring-red-500 bg-white dark:bg-gray-800',
  };

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={textareaId}
          className={clsx(
            'block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 mb-2',
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={textareaId}
        ref={textareaRef}
        value={value || ''}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={autoResize ? minRows : rows}
        className={clsx(
          baseClasses,
          variants[variant],
          !autoResize && resizeClasses[resize],
          autoResize && 'resize-none overflow-hidden',
          textareaClassName
        )}
        {...props}
      />

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
