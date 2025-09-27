import { useMemo } from 'react';
import clsx from 'clsx';
import { useTranslation } from '../hooks/useTranslation';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className,
  size = 'md',
  ...props
}) => {
  const { t } = useTranslation();

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const buttonClass = useMemo(() => clsx(
    'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900',
    sizes[size]
  ), [size]);

  const activeClass = 'bg-blue-600 text-white hover:bg-blue-700';
  const inactiveClass =
    'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700';
  const disabledClass =
    'text-gray-400 dark:text-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50';

  const visiblePages = useMemo(() => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  if (totalPages <= 1) return null;

  return (
    <nav
      className={clsx('flex items-center justify-center space-x-1', className)}
      {...props}
    >
      {showFirstLast && (
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={clsx(
            buttonClass,
            currentPage === 1 ? disabledClass : inactiveClass
          )}
          aria-label={t('go_to_first_page')}
        >
          {t('first')}
        </button>
      )}

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={clsx(
            buttonClass,
            currentPage === 1 ? disabledClass : inactiveClass
          )}
          aria-label={t('go_to_previous_page')}
        >
          {t('previous')}
        </button>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={clsx(
            buttonClass,
            page === currentPage ? activeClass : inactiveClass
          )}
          aria-label={`${t('go_to_page')} ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={clsx(
            buttonClass,
            currentPage === totalPages ? disabledClass : inactiveClass
          )}
          aria-label={t('go_to_next_page')}
        >
          {t('next')}
        </button>
      )}

      {showFirstLast && (
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={clsx(
            buttonClass,
            currentPage === totalPages ? disabledClass : inactiveClass
          )}
          aria-label={t('go_to_last_page')}
        >
          {t('last')}
        </button>
      )}
    </nav>
  );
};
