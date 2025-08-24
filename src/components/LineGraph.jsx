import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const LineGraph = ({ dataProps, label }) => {

    const data = {
      labels: dataProps.map((item) => item.date),
      datasets: [
        {
          label: label,
          data: label === "Daily Revenue" ? dataProps.map((item) => item.revenue) : label === "Daily Orders" ? dataProps.map((item) => item.count) : dataProps.map((item) => item.average),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        },
      ],
    };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: label,
      },
    },
  };

  return (
    <Line data={data} options={options} />
  );
};

export default LineGraph;
