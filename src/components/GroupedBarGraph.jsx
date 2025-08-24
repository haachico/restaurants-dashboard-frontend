import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Helper to transform trendy_hours to grouped bar chart data
function transformToGroupedBar(trendy_hours) {
  const allDates = [...new Set(trendy_hours.map(item => item.date))];
  const allHours = Array.from({ length: 24 }, (_, i) => i);
  // For each date, create an array of 24 order counts (0 if missing)
  const datasets = allDates.map((date, idx) => {
    const data = allHours.map(hour => {
      const found = trendy_hours.find(item => item.date === date && item.hour === hour);
      return found ? found.order_count : 0;
    });
    // Assign a color per date
    const colors = [
      '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ec407a', '#26a69a', '#ff7043', '#8d6e63',
      '#789262', '#d4e157', '#5c6bc0', '#ffb300', '#c62828', '#ad1457', '#6d4c41', '#0277bd',
      '#388e3c', '#fbc02d', '#7b1fa2', '#cddc39', '#0097a7', '#f44336', '#8bc34a', '#ff9800'
    ];
    return {
      label: date,
      data,
      backgroundColor: colors[idx % colors.length],
    };
  });
  return {
    labels: allHours.map(h => h.toString()),
    datasets,
  };
}

export default function GroupedBarGraph({ trendy_hours }) {
  const data = transformToGroupedBar(trendy_hours);
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Order Count by Hour (Grouped by Day)' },
    },
    scales: {
      x: {
        title: { display: true, text: 'Hour' },
      },
      y: {
        title: { display: true, text: 'Order Count' },
        beginAtZero: true,
      },
    },
  };
  return (
    <div className="w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
