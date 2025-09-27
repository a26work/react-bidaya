import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { Line, Bar, Pie, Doughnut, Radar, Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

export const chartComponents = {
  line: Line,
  bar: Bar,
  pie: Pie,
  doughnut: Doughnut,
  radar: Radar,
  combo: Chart, // For line+bar combination
  multiaxis: Line, // For multi-axis line chart
};

export const colorPalette = [
  { border: "#FF6384", background: "rgba(255, 99, 132, 0.2)" },
  { border: "#36A2EB", background: "rgba(54, 162, 235, 0.2)" },
  { border: "#FFCE56", background: "rgba(255, 206, 86, 0.2)" },
  { border: "#4BC0C0", background: "rgba(75, 192, 192, 0.2)" },
  { border: "#9966FF", background: "rgba(153, 102, 255, 0.2)" },
  { border: "#FF9F40", background: "rgba(255, 159, 64, 0.2)" },
  { border: "#FF6384", background: "rgba(255, 99, 132, 0.2)" },
  { border: "#C9CBCF", background: "rgba(201, 203, 207, 0.2)" },
];