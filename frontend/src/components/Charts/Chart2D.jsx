import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Scatter, Radar, PolarArea } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Chart2D Component
 * Renders 2D charts using Chart.js
 */
export default function Chart2D({ chartData, chartConfig, height = 400 }) {
  const { chartType, title } = chartConfig;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
      },
    },
    scales:
      chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'polarArea' && chartType !== 'radar'
        ? {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                font: {
                  family: "'Inter', sans-serif",
                  size: 11,
                },
              },
            },
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
              },
              ticks: {
                font: {
                  family: "'Inter', sans-serif",
                  size: 11,
                },
              },
            },
          }
        : undefined,
  };

  const containerStyle = {
    height: `${height}px`,
    position: 'relative',
  };

  // Render appropriate chart type
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
      case 'horizontalBar':
        return (
          <Bar
            data={chartData}
            options={{
              ...options,
              indexAxis: chartType === 'horizontalBar' ? 'y' : 'x',
            }}
          />
        );

      case 'line':
      case 'smoothLine':
        return (
          <Line
            data={chartData}
            options={{
              ...options,
              elements: {
                line: {
                  tension: chartType === 'smoothLine' ? 0.4 : 0,
                },
              },
            }}
          />
        );

      case 'pie':
        return <Pie data={chartData} options={options} />;

      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;

      case 'scatter':
      case 'bubble':
        return <Scatter data={chartData} options={options} />;

      case 'radar':
        return <Radar data={chartData} options={options} />;

      case 'polarArea':
        return <PolarArea data={chartData} options={options} />;

      case 'area':
        const areaData = {
          ...chartData,
          datasets: chartData.datasets.map((dataset) => ({
            ...dataset,
            fill: true,
            backgroundColor: dataset.backgroundColor || 'rgba(14, 165, 233, 0.2)',
          })),
        };
        return (
          <Line
            data={areaData}
            options={{
              ...options,
              elements: {
                line: {
                  tension: 0.4,
                },
              },
            }}
          />
        );

      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div style={containerStyle}>
      {renderChart()}
    </div>
  );
}