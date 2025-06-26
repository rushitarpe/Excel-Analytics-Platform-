import React from 'react';
import { TrendingUp, UploadCloud, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <UploadCloud className="w-10 h-10 mb-2" />
          <h2 className="text-xl font-semibold">Files Uploaded</h2>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <BarChart3 className="w-10 h-10 mb-2" />
          <h2 className="text-xl font-semibold">Total Charts</h2>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>

        <div className="bg-white/10 p-6 rounded-xl shadow-lg flex flex-col items-center">
          <TrendingUp className="w-10 h-10 mb-2" />
          <h2 className="text-xl font-semibold">Insights Generated</h2>
          <p className="text-3xl font-bold mt-2">18</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
