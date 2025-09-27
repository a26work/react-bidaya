import { colorPalette } from '../config/chart';

export const transformKpiDataForChart = (data, config) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      labels: [],
      datasets: [],
    };
  }

  const {
    chartType,
    dataField,
    labelField,
    secondaryDataField,
    datasets: configDatasets,
  } = config;

  let chartData = {
    labels: [],
    datasets: [],
  };

  if (chartType === "doughnut" || chartType === "pie") {
    const counts = {};
    data.forEach((item) => {
      const label = item[labelField] || "Unknown";
      const displayLabel =
        typeof label === "object" && label.name ? label.name : label;
      counts[displayLabel] = (counts[displayLabel] || 0) + 1;
    });

    chartData = {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: colorPalette.map((c) => c.background),
          borderColor: colorPalette.map((c) => c.border),
          borderWidth: 2,
        },
      ],
    };
  } else if (chartType === "radar") {
    const processedData = data.map((item) => {
      let label = item[labelField];
      let value = item[dataField];

      if (typeof label === "object" && label.name) {
        label = label.name;
      }

      if (typeof value === "string" && !isNaN(value)) {
        value = parseFloat(value);
      }

      return { label, value: value || 0 };
    });

    chartData = {
      labels: processedData.map((item) => item.label || "N/A"),
      datasets: [
        {
          label: dataField
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          data: processedData.map((item) => item.value),
          borderColor: colorPalette[0].border,
          backgroundColor: colorPalette[0].background,
          borderWidth: 2,
          pointBackgroundColor: colorPalette[0].border,
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: colorPalette[0].border,
        },
      ],
    };
  } else if (chartType === "combo") {
    const processedData = data.map((item) => {
      let label = item[labelField];
      let value1 = item[dataField];
      let value2 = item[secondaryDataField];

      if (labelField && labelField.includes("date") && label) {
        label = new Date(label).toLocaleDateString();
      }

      if (typeof label === "object" && label.name) {
        label = label.name;
      }

      if (typeof value1 === "string" && !isNaN(value1)) {
        value1 = parseFloat(value1);
      }

      if (typeof value2 === "string" && !isNaN(value2)) {
        value2 = parseFloat(value2);
      }

      return { label, value1: value1 || 0, value2: value2 || 0 };
    });

    chartData = {
      labels: processedData.map((item) => item.label || "N/A"),
      datasets: [
        {
          type: "line",
          label: dataField
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          data: processedData.map((item) => item.value1),
          borderColor: colorPalette[0].border,
          backgroundColor: colorPalette[0].background,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          yAxisID: "y",
        },
        {
          type: "bar",
          label: secondaryDataField
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          data: processedData.map((item) => item.value2),
          borderColor: colorPalette[1].border,
          backgroundColor: colorPalette[1].background,
          borderWidth: 1,
          yAxisID: "y1",
        },
      ],
    };
  } else if (
    chartType === "multiaxis" &&
    configDatasets &&
    configDatasets.length > 0
  ) {
    const processedData = data.map((item) => {
      let label = item[labelField];
      if (labelField && labelField.includes("date") && label) {
        label = new Date(label).toLocaleDateString();
      }
      if (typeof label === "object" && label.name) {
        label = label.name;
      }
      return { label, ...item };
    });

    chartData = {
      labels: processedData.map((item) => item.label || "N/A"),
      datasets: configDatasets.map((dataset, index) => {
        const color = colorPalette[index % colorPalette.length];
        return {
          label:
            dataset.label ||
            dataset.field
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          data: processedData.map((item) => {
            let value = item[dataset.field];
            if (typeof value === "string" && !isNaN(value)) {
              value = parseFloat(value);
            }
            return value || 0;
          }),
          borderColor: color.border,
          backgroundColor: color.background,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          yAxisID: dataset.yAxisID || "y",
        };
      }),
    };
  } else {
    const processedData = data.map((item) => {
      let label = item[labelField];
      let value = item[dataField];

      if (labelField && labelField.includes("date") && label) {
        label = new Date(label).toLocaleDateString();
      }

      if (typeof label === "object" && label.name) {
        label = label.name;
      }

      if (typeof value === "string" && !isNaN(value)) {
        value = parseFloat(value);
      }

      return { label, value: value || 0 };
    });

    if (labelField && labelField.includes("date")) {
      processedData.sort((a, b) => new Date(a.label) - new Date(b.label));
    }

    chartData = {
      labels: processedData.map((item) => item.label || "N/A"),
      datasets: [
        {
          label: dataField
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          data: processedData.map((item) => item.value),
          borderColor: colorPalette[0].border,
          backgroundColor:
            chartType === "line"
              ? colorPalette[0].background
              : colorPalette[0].border,
          borderWidth: 2,
          fill: chartType === "line",
          tension: 0.4,
        },
      ],
    };
  }

  return chartData;
};

export const getChartOptions = (chartType, theme, config = {}) => {
  const isDark = theme === "dark";
  const textColor = isDark ? "#E5E7EB" : "#374151";
  const gridColor = isDark ? "#374151" : "#E5E7EB";

  const baseOptions = {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
      },
    },
  };

  if (chartType === "pie" || chartType === "doughnut") {
    return {
      ...baseOptions,
      maintainAspectRatio: false,
    };
  }

  if (chartType === "radar") {
    return {
      ...baseOptions,
      scales: {
        r: {
          angleLines: {
            color: gridColor,
          },
          grid: {
            color: gridColor,
          },
          pointLabels: {
            color: textColor,
          },
          ticks: {
            color: textColor,
            backdropColor: "transparent",
          },
        },
      },
      maintainAspectRatio: false,
    };
  }

  if (chartType === "combo") {
    return {
      ...baseOptions,
      interaction: {
        mode: "index",
        intersect: false,
      },
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
          type: "linear",
          display: true,
          position: "left",
          ticks: {
            color: textColor,
          },
          grid: {
            color: gridColor,
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          ticks: {
            color: textColor,
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      maintainAspectRatio: false,
    };
  }

  if (chartType === "multiaxis") {
    const scales = {
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
    };

    // Add additional y-axes if specified in config
    if (config.datasets) {
      config.datasets.forEach((dataset, index) => {
        if (dataset.yAxisID && dataset.yAxisID !== "y") {
          scales[dataset.yAxisID] = {
            type: "linear",
            display: true,
            position: index % 2 === 0 ? "left" : "right",
            ticks: {
              color: textColor,
            },
            grid: {
              drawOnChartArea: false,
            },
          };
        }
      });
    }

    return {
      ...baseOptions,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales,
      maintainAspectRatio: false,
    };
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
    maintainAspectRatio: false,
  };
};