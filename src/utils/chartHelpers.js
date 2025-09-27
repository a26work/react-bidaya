export const generateChartColors = (count, opacity = 1) => {
  const colors = [
    `rgba(59, 130, 246, ${opacity})`, // blue
    `rgba(16, 185, 129, ${opacity})`, // emerald
    `rgba(245, 158, 11, ${opacity})`, // amber
    `rgba(239, 68, 68, ${opacity})`,  // red
    `rgba(139, 92, 246, ${opacity})`, // violet
    `rgba(236, 72, 153, ${opacity})`, // pink
    `rgba(6, 182, 212, ${opacity})`,  // cyan
    `rgba(34, 197, 94, ${opacity})`,  // green
  ];
  
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length]);
  }
  return result;
};

export const transformOdooDataForChart = (data, groupBy, valueField, chartType = 'line') => {
  if (!data || !Array.isArray(data)) return { labels: [], datasets: [] };

  const labels = data.map(item => {
    if (groupBy.includes(':')) {
      // Handle date grouping like 'date_order:month'
      const value = item[groupBy.split(':')[0]];
      return value ? new Date(value).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      }) : 'Unknown';
    }
    return item[groupBy] || 'Unknown';
  });

  const values = data.map(item => item[valueField] || 0);
  
  const colors = generateChartColors(1);
  const backgroundColors = chartType === 'pie' || chartType === 'doughnut' 
    ? generateChartColors(data.length, 0.8)
    : generateChartColors(1, 0.1);

  return {
    labels,
    datasets: [
      {
        label: valueField.replace('_', ' ').toUpperCase(),
        data: values,
        borderColor: colors[0],
        backgroundColor: backgroundColors,
        borderWidth: 2,
        fill: chartType === 'area',
        tension: 0.4,
      },
    ],
  };
};

export const getChartOptions = (chartType, theme = 'light') => {
  const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
  const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
  };

  if (chartType === 'pie' || chartType === 'doughnut') {
    return baseOptions;
  }

  return {
    ...baseOptions,
    scales: {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    },
  };
};