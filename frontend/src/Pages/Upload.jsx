import React from 'react';
import { UploadCloud } from 'lucide-react';

const Upload = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-lg space-y-6 text-center">
        <UploadCloud className="w-14 h-14 text-white mx-auto mb-2" />
        <h2 className="text-3xl font-bold text-white">Upload Excel File</h2>
        <p className="text-white/70 mb-4">Drag & drop or select your .xls/.xlsx file to visualize your data.</p>

        <input
          type="file"
          accept=".xlsx, .xls"
          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />

        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:scale-105 hover:shadow-lg transition transform mt-4">
          Upload & Analyze
        </button>
      </div>
    </div>
  );
};

export default Upload;