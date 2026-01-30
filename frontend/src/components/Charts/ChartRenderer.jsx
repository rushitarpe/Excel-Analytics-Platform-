import { useEffect, useRef } from 'react';
import Chart2D from './Chart2D';
import Chart3D from './Chart3D';

/**
 * ChartRenderer Component
 * Renders either 2D or 3D charts based on configuration
 */
export default function ChartRenderer({ chartData, chartConfig, width = '100%', height = 400 }) {
  const { chartDimension } = chartConfig;

  return (
    <div style={{ width, height }}>
      {chartDimension === '2D' ? (
        <Chart2D chartData={chartData} chartConfig={chartConfig} height={height} />
      ) : (
        <Chart3D chartData={chartData} chartConfig={chartConfig} height={height} />
      )}
    </div>
  );
}
