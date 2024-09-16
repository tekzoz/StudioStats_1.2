import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const StatsCard = ({ title, value, comparison }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
    {comparison !== undefined && (
      <p className={`text-sm ${comparison >= 0 ? 'text-green-500' : 'text-red-500'}`}>
        {comparison >= 0 ? '▲' : '▼'} {Math.abs(comparison).toFixed(2)}%
      </p>
    )}
  </div>
);

export const Chart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Totale Turni per Mese',
      },
    },
  };

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Totale Turni',
        data: Object.values(data).map(m => m.totaleTurni),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
};