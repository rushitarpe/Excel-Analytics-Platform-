import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4 text-white">
      <h1 className="text-4xl font-bold mb-4">Data Analytics</h1>
      <p className="text-white/70 mb-8">Interactive charts and AI-driven insights at a glance.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <BarChart3 className="w-10 h-10 mb-2" />
          <h2 className="text-2xl font-semibold mb-4">Sales Overview</h2>
          <div className="h-56 w-full bg-white/20 rounded-lg flex items-center justify-center text-white/70">
            Bar Chart Placeholder
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <PieChart className="w-10 h-10 mb-2" />
          <h2 className="text-2xl font-semibold mb-4">Category Breakdown</h2>
          <div className="h-56 w-full bg-white/20 rounded-lg flex items-center justify-center text-white/70">
            Pie Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;