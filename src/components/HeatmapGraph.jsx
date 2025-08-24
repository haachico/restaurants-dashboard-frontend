import { Chart as ChartJS, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';

ChartJS.register(MatrixController, MatrixElement, Tooltip, Legend, CategoryScale, LinearScale);

function transformToMatrix(trendy_hours) {
  const allDates = [...new Set(trendy_hours.map(item => item.date))];
  const matrixData = [];
  allDates.forEach(date => {
    for (let hour = 0; hour < 24; hour++) {
      const found = trendy_hours.find(item => item.date === date && item.hour === hour);
      matrixData.push({ x: hour, y: date, v: found ? found.order_count : 0 });
    }
  });
  return { allDates, matrixData };
}

export default function HeatmapGraph({ trendy_hours }) {
  const { allDates, matrixData } = transformToMatrix(trendy_hours);

  const data = {
    datasets: [
      {
        label: 'Order Count',
        data: matrixData,
        backgroundColor: ctx => {
          const value = ctx.raw.v;
          if (value === 0) return '#eee';
          if (value === 1) return '#b3e5fc';
          if (value === 2) return '#4fc3f7';
          return '#0288d1';
        },
        width: ({ chart }) => (chart.chartArea || {}).width / 24 - 2,
        height: ({ chart }) => (chart.chartArea || {}).height / allDates.length - 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: ctx => `Date: ${ctx[0].raw.y}, Hour: ${ctx[0].raw.x}`,
          label: ctx => `Orders: ${ctx.raw.v}`,
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: Array.from({ length: 24 }, (_, i) => i.toString()),
        title: { display: true, text: 'Hour' },
        grid: { display: false },
      },
      y: {
        type: 'category',
        labels: allDates,
        title: { display: true, text: 'Date' },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="w-full">
      <h4 className="text-center font-semibold mb-2">Order Heatmap</h4>
      <Chart type="matrix" data={data} options={options} />
    </div>
  );
}