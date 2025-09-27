import { useTheme } from '../hooks/useTheme';
import { chartComponents } from '../config/chart';
import { transformKpiDataForChart, getChartOptions } from '../utils/chartUtils';
import { useTranslation } from '../hooks/useTranslation';

export const Chart = ({
  data = [],
  config = {},
  title,
  className = '',
  ...props
}) => {
  const { mode } = useTheme();
  const { t } = useTranslation();
  const chartType = config?.chartType || 'line';
  const ChartComponent = chartComponents[chartType];

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 ${className}`}
      >
        {t('no_data_available')}
      </div>
    );
  }

  if (!ChartComponent) {
    return (
      <div
        className={`flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 ${className}`}
      >
        {t('unsupported_chart_type')}: {chartType}
      </div>
    );
  }

  let dataField = config.dataField;
  let labelField = config.labelField;

  if (!dataField && data[0]) {
    const firstItem = data[0];
    const numericFields = [
      'actual_value',
      'target_value',
      'amount_total',
      'value',
      'count',
    ];
    dataField =
      numericFields.find((field) => firstItem[field] !== undefined) ||
      Object.keys(firstItem).find((key) => typeof firstItem[key] === 'number');
  }

  if (!labelField && data[0]) {
    const firstItem = data[0];
    const labelFields = ['name', 'date_start', 'date_order', 'create_date'];
    labelField =
      labelFields.find((field) => firstItem[field] !== undefined) ||
      Object.keys(firstItem).find(
        (key) =>
          typeof firstItem[key] === 'string' ||
          (typeof firstItem[key] === 'object' && firstItem[key].name)
      );
  }

  const chartData = transformKpiDataForChart(data, {
    ...config,
    dataField: dataField || 'value',
    labelField: labelField || 'name',
  });

  const chartOptions = getChartOptions(chartType, mode, config);

  if (chartData.labels.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 ${className}`}
      >
        {t('no_chart_data_available')}
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 w-full rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1${className}`}
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div className="relative h-96">
        <ChartComponent
          data={chartData}
          options={{
            ...chartOptions,
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};
