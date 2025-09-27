import { useState, useCallback, useMemo } from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Input } from './Input';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Button } from './Button';
import { Badge } from './Badge';
import { useTranslation } from '../hooks/useTranslation';

export const Table = ({
  data = [],
  columns = [],
  loading = false,
  pagination = {},
  searchable = true,
  filterable = true,
  sortable = true,
  selectable = false,
  actions = [],
  filtersSchema = [],
  onPageChange,
  onSearch,
  onFilter,
  onSort,
  onAction,
  onSelectionChange,
  emptyStateMessage = 'No data available',
  className = '',
  rowClassName,
  ...props
}) => {
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({});
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  // Debounced search
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Ensure data is always an array
  const dataArray = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchTerm(value);

      // Clear existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      // Set new timeout for debounced search
      const timeout = setTimeout(() => {
        onSearch?.(value);
      }, 300);

      setSearchTimeout(timeout);
    },
    [onSearch, searchTimeout]
  );

  // Handle sorting
  const handleSort = useCallback(
    (columnKey) => {
      if (!sortable) return;

      const column = columns.find((col) => col.key === columnKey);
      if (!column?.sortable) return;

      let direction = 'asc';
      if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
        direction = 'desc';
      }

      const newSortConfig = { key: columnKey, direction };
      setSortConfig(newSortConfig);
      onSort?.(columnKey, direction);
    },
    [sortable, columns, sortConfig, onSort]
  );

  // Handle filtering
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      const newFilters = { ...activeFilters };

      if (value && value !== '') {
        newFilters[filterKey] = value;
      } else {
        delete newFilters[filterKey];
      }

      setActiveFilters(newFilters);
      onFilter?.(newFilters);
    },
    [activeFilters, onFilter]
  );

  // Handle row selection
  const handleRowSelection = useCallback(
    (rowId, checked) => {
      const newSelectedRows = checked
        ? [...selectedRows, rowId]
        : selectedRows.filter((id) => id !== rowId);

      setSelectedRows(newSelectedRows);
      onSelectionChange?.(newSelectedRows);
    },
    [selectedRows, onSelectionChange]
  );

  const handleSelectAll = useCallback(
    (checked) => {
      const newSelectedRows = checked ? dataArray.map((row) => row.id) : [];
      setSelectedRows(newSelectedRows);
      onSelectionChange?.(newSelectedRows);
    },
    [dataArray, onSelectionChange]
  );

  const actionIcons = useMemo(
    () => ({
      view: <EyeIcon className="w-4 h-4" />,
      edit: <PencilIcon className="w-4 h-4" />,
      delete: <TrashIcon className="w-4 h-4" />,
    }),
    []
  );

  const actionColors = useMemo(
    () => ({
      view: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300',
      edit: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
      delete:
        'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300',
    }),
    []
  );

  const formatCellContent = useCallback((value, row, column) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400">—</span>;
    }

    switch (column.type) {
      case 'boolean':
        return (
          <Badge variant={value ? 'success' : 'default'} size="sm">
            {value ? t('yes') : t('no')}
          </Badge>
        );

      case 'date':
        return new Date(value).toLocaleDateString();

      case 'datetime':
        return new Date(value).toLocaleString();

      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: column.currency || 'USD',
        }).format(value);

      case 'number':
        return new Intl.NumberFormat().format(value);

      case 'badge':
        return (
          <Badge variant={column.badgeVariant?.(value) || 'default'} size="sm">
            {column.badgeLabel?.(value) || value}
          </Badge>
        );

      default:
        if (
          column.truncate &&
          typeof value === 'string' &&
          value.length > column.truncate
        ) {
          return (
            <span title={value}>{value.substring(0, column.truncate)}...</span>
          );
        }
        return value;
    }
  }, []);

  const getSortIndicator = (columnKey) => {
    if (!sortable || sortConfig.key !== columnKey) {
      return <div className="w-4 h-4" />; // Placeholder for alignment
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="w-4 h-4 text-blue-500" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-blue-500" />
    );
  };

  const renderFilters = () => {
    if (!filterable || filtersSchema.length === 0) return null;

    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-${Math.min(
          filtersSchema.length,
          4
        )} gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-300 ${
          showFilters ? 'block' : 'hidden'
        }`}
      >
        {filtersSchema.map((filter) => {
          if (filter.type === 'select') {
            return (
              <Select
                key={filter.key}
                placeholder={filter.label || filter.placeholder}
                value={activeFilters[filter.key] || ''}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                size="sm"
                options={[
                  {
                    value: '',
                    label: `${t('all')} ${filter.label || filter.key}`,
                  },
                  ...(filter.options || []),
                ]}
              />
            );
          }

          return (
            <Input
              key={filter.key}
              type={filter.type || 'text'}
              placeholder={filter.label || filter.placeholder}
              value={activeFilters[filter.key] || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              size="sm"
            />
          );
        })}

        {Object.keys(activeFilters).length > 0 && (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveFilters({});
                onFilter?.({});
              }}
            >
              {t('clear_filters')}
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        {searchable && (
          <div className="flex-1 max-w-md">
            <Input
              placeholder={t('search')}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              icon={<MagnifyingGlassIcon className="w-4 h-4" />}
              iconPosition="left"
              size="sm"
            />
          </div>
        )}

        {/* Filter toggle and selection info */}
        <div className="flex items-center gap-3">
          {selectable && selectedRows.length > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedRows.length} {t('selected')}
            </span>
          )}

          {filterable && filtersSchema.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              icon={<FunnelIcon className="w-4 h-4" />}
            >
              {t('filters')}{' '}
              {Object.keys(activeFilters).length > 0 &&
                `(${Object.keys(activeFilters).length})`}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      {renderFilters()}

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {selectable && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                  <Checkbox
                    checked={
                      selectedRows.length === dataArray.length &&
                      dataArray.length > 0
                    }
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < dataArray.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
              )}

              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable && sortable
                      ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
                      : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable &&
                      sortable &&
                      getSortIndicator(column.key)}
                  </div>
                </th>
              ))}

              {actions.length > 0 && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">
                  {t('actions')}
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="px-4 py-8"
                >
                  <div className="flex justify-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                      <span className="text-sm text-gray-600">
                        {t('loading_data')}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : dataArray.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="space-y-2">
                    <p className="text-lg">{emptyStateMessage}</p>
                    {Object.keys(activeFilters).length > 0 && (
                      <p className="text-sm">{t('try_adjusting_filters')}</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              dataArray.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedRows.includes(row.id)
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : ''
                  } ${rowClassName ? rowClassName(row, index) : ''}`}
                >
                  {selectable && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={(e) =>
                          handleRowSelection(row.id, e.target.checked)
                        }
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render
                        ? column.render(row[column.key], row, column)
                        : formatCellContent(row[column.key], row, column)}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        {actions.map((action) => (
                          <Button
                            key={action}
                            variant="ghost"
                            size="sm"
                            onClick={() => onAction?.(action, row)}
                            className={`p-2 ${
                              actionColors[action] ||
                              'text-gray-600 hover:text-gray-800'
                            }`}
                            title={`${
                              action.charAt(0).toUpperCase() + action.slice(1)
                            } ${row.name || row.title || 'item'}`}
                          >
                            {actionIcons[action] || action}
                          </Button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('showing')}{' '}
            {(pagination.currentPage - 1) * pagination.pageSize + 1} {t('to')}{' '}
            {Math.min(
              pagination.currentPage * pagination.pageSize,
              pagination.totalItems
            )}{' '}
            {t('of')} {pagination.totalItems} {t('results')}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            showFirstLast={true}
          />
        </div>
      )}
    </div>
  );
};
