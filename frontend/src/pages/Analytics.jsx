import { useState, useEffect } from 'react';
import { uploadService, chartService, insightService } from '../services/api';
import toast from 'react-hot-toast';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Activity, 
  Download,
  Brain,
  Eye,
  Plus
} from 'lucide-react';
import ChartRenderer from '../components/Charts/ChartRenderer';

export default function Analytics() {
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [insights, setInsights] = useState([]);
  const [generatingInsights, setGeneratingInsights] = useState(false);

  // Chart configuration
  const [chartConfig, setChartConfig] = useState({
    title: '',
    chartType: 'bar',
    chartDimension: '2D',
    xAxis: '',
    yAxis: '',
  });

  useEffect(() => {
    loadUploads();
  }, []);

  useEffect(() => {
    if (selectedUpload) {
      loadUploadData(selectedUpload);
      loadInsights(selectedUpload);
    }
  }, [selectedUpload]);

  const loadUploads = async () => {
    try {
      const response = await uploadService.getUploads(1, 100);
      setUploads(response.data);
      if (response.data.length > 0) {
        setSelectedUpload(response.data[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load uploads');
    } finally {
      setLoading(false);
    }
  };

  const loadUploadData = async (uploadId) => {
    setDataLoading(true);
    try {
      const response = await uploadService.getUploadData(uploadId);
      setUploadData(response.data);
      
      // Set first sheet as default
      const sheetNames = Object.keys(response.data.data);
      if (sheetNames.length > 0) {
        setSelectedSheet(sheetNames[0]);
        
        // Auto-populate chart axes
        const firstSheet = response.data.data[sheetNames[0]];
        if (firstSheet.headers.length > 0) {
          setChartConfig(prev => ({
            ...prev,
            xAxis: firstSheet.headers[0] || '',
            yAxis: firstSheet.headers[1] || '',
          }));
        }
      }
    } catch (error) {
      toast.error('Failed to load upload data');
    } finally {
      setDataLoading(false);
    }
  };

  const loadInsights = async (uploadId) => {
    try {
      const response = await insightService.getInsightsByUpload(uploadId);
      setInsights(response.data);
    } catch (error) {
      console.error('Failed to load insights');
    }
  };

  const generateInsights = async () => {
    if (!selectedUpload) return;
    
    setGeneratingInsights(true);
    try {
      const response = await insightService.generateInsights(selectedUpload);
      setInsights(response.data);
      toast.success(`Generated ${response.count} insights successfully!`);
    } catch (error) {
      toast.error('Failed to generate insights');
    } finally {
      setGeneratingInsights(false);
    }
  };

  const createChart = async () => {
    if (!selectedUpload || !chartConfig.title || !chartConfig.xAxis || !chartConfig.yAxis) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const sheetData = uploadData.data[selectedSheet];
      
      // Prepare chart data
      const labels = sheetData.data.map(row => row[chartConfig.xAxis]);
      const data = sheetData.data.map(row => parseFloat(row[chartConfig.yAxis]) || 0);

      const chartData = {
        labels,
        datasets: [{
          label: chartConfig.yAxis,
          data: data,
          backgroundColor: 'rgba(14, 165, 233, 0.5)',
          borderColor: 'rgba(14, 165, 233, 1)',
          borderWidth: 2
        }]
      };

      const chartPayload = {
        uploadId: selectedUpload,
        title: chartConfig.title,
        chartType: chartConfig.chartType,
        chartDimension: chartConfig.chartDimension,
        configuration: {
          xAxis: chartConfig.xAxis,
          yAxis: chartConfig.yAxis,
        },
        chartData: chartData
      };

      const response = await chartService.createChart(chartPayload);
      toast.success('Chart created successfully! You can view and download it in the Charts page.');
      setShowChartModal(false);
      
      // Reset form
      setChartConfig(prev => ({
        ...prev,
        title: ''
      }));
      
      // Navigate to charts page after 2 seconds
      setTimeout(() => {
        window.location.href = '/charts';
      }, 2000);
    } catch (error) {
      toast.error('Failed to create chart');
    }
  };

  const getCurrentSheetData = () => {
    if (!uploadData || !selectedSheet) return null;
    return uploadData.data[selectedSheet];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (uploads.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Data Uploaded Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Upload your first Excel file to start analyzing
          </p>
          <a href="/upload" className="btn btn-primary">
            Upload File
          </a>
        </div>
      </div>
    );
  }

  const currentSheet = getCurrentSheetData();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Data Analytics & Visualization
          </h1>
          <p className="text-gray-600">
            Analyze your data and create powerful visualizations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Selection */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Select Upload</h3>
              <select
                value={selectedUpload || ''}
                onChange={(e) => setSelectedUpload(e.target.value)}
                className="input"
              >
                {uploads.map((upload) => (
                  <option key={upload._id} value={upload._id}>
                    {upload.originalName}
                  </option>
                ))}
              </select>
            </div>

            {/* Sheet Selection */}
            {uploadData && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Select Sheet</h3>
                <select
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  className="input"
                >
                  {Object.keys(uploadData.data).map((sheetName) => (
                    <option key={sheetName} value={sheetName}>
                      {sheetName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowChartModal(true)}
                  className="w-full btn btn-primary flex items-center justify-center space-x-2"
                  disabled={!currentSheet}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Chart</span>
                </button>
                <button
                  onClick={generateInsights}
                  className="w-full btn btn-secondary flex items-center justify-center space-x-2"
                  disabled={generatingInsights || !selectedUpload}
                >
                  {generatingInsights ? (
                    <>
                      <div className="spinner w-4 h-4 border-2"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4" />
                      <span>Generate Insights</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Insights */}
            {insights.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary-600" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {insights.slice(0, 3).map((insight) => (
                    <div
                      key={insight._id}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        {insight.title}
                      </p>
                      <p className="text-xs text-blue-700">
                        {insight.content.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {dataLoading ? (
              <div className="card flex items-center justify-center py-20">
                <div className="spinner"></div>
              </div>
            ) : currentSheet ? (
              <>
                {/* Data Preview */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Data Preview</h3>
                    <span className="text-sm text-gray-600">
                      {currentSheet.rowCount} rows × {currentSheet.columnCount} columns
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {currentSheet.headers.map((header, index) => (
                            <th
                              key={index}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {currentSheet.data.slice(0, 10).map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {currentSheet.headers.map((header, colIndex) => (
                              <td
                                key={colIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                              >
                                {row[header] !== null ? row[header] : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {currentSheet.rowCount > 10 && (
                    <p className="mt-4 text-sm text-gray-600 text-center">
                      Showing first 10 of {currentSheet.rowCount} rows
                    </p>
                  )}
                </div>

                {/* Data Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card bg-primary-50 border border-primary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-primary-600 font-medium">Total Rows</p>
                        <p className="text-2xl font-bold text-primary-900">
                          {currentSheet.rowCount}
                        </p>
                      </div>
                      <Activity className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  
                  <div className="card bg-green-50 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium">Columns</p>
                        <p className="text-2xl font-bold text-green-900">
                          {currentSheet.columnCount}
                        </p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="card bg-purple-50 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Data Points</p>
                        <p className="text-2xl font-bold text-purple-900">
                          {currentSheet.rowCount * currentSheet.columnCount}
                        </p>
                      </div>
                      <Eye className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card text-center py-20">
                <p className="text-gray-600">Select a sheet to view data</p>
              </div>
            )}
          </div>
        </div>

        {/* Create Chart Modal */}
        {showChartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Chart</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chart Title *
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={chartConfig.title}
                      onChange={(e) => setChartConfig({...chartConfig, title: e.target.value})}
                      placeholder="e.g., Monthly Sales Analysis"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chart Type *
                    </label>
                    <select
                      className="input"
                      value={chartConfig.chartType}
                      onChange={(e) => setChartConfig({...chartConfig, chartType: e.target.value})}
                    >
                      <option value="bar">Bar Chart</option>
                      <option value="line">Line Chart</option>
                      <option value="pie">Pie Chart</option>
                      <option value="scatter">Scatter Plot</option>
                      <option value="area">Area Chart</option>
                      <option value="doughnut">Doughnut Chart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimension
                    </label>
                    <select
                      className="input"
                      value={chartConfig.chartDimension}
                      onChange={(e) => setChartConfig({...chartConfig, chartDimension: e.target.value})}
                    >
                      <option value="2D">2D Chart</option>
                      <option value="3D">3D Chart</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      X-Axis *
                    </label>
                    <select
                      className="input"
                      value={chartConfig.xAxis}
                      onChange={(e) => setChartConfig({...chartConfig, xAxis: e.target.value})}
                    >
                      <option value="">Select Column</option>
                      {currentSheet?.headers.map((header) => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Y-Axis *
                    </label>
                    <select
                      className="input"
                      value={chartConfig.yAxis}
                      onChange={(e) => setChartConfig({...chartConfig, yAxis: e.target.value})}
                    >
                      <option value="">Select Column</option>
                      {currentSheet?.headers.map((header) => (
                        <option key={header} value={header}>{header}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={createChart}
                    className="flex-1 btn btn-primary"
                  >
                    Create Chart
                  </button>
                  <button
                    onClick={() => setShowChartModal(false)}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}