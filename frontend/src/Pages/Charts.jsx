import { useState, useEffect, useRef } from 'react';
import { chartService } from '../services/api';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Download,
  Eye,
  Trash2,
  Edit,
  Search,
  Filter,
  Grid,
  List,
} from 'lucide-react';
import Chart2D from '../components/Charts/Chart2D';
import Chart3D from '../components/Charts/Chart3D';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Charts() {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDimension, setFilterDimension] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedChart, setSelectedChart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    loadCharts();
  }, [filterType, filterDimension]);

  const loadCharts = async () => {
    try {
      const filters = {};
      if (filterType !== 'all') filters.chartType = filterType;
      if (filterDimension !== 'all') filters.dimension = filterDimension;

      const response = await chartService.getCharts(filters);
      setCharts(response.data);
    } catch (error) {
      toast.error('Failed to load charts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chartId) => {
    if (!window.confirm('Are you sure you want to delete this chart?')) return;

    try {
      await chartService.deleteChart(chartId);
      toast.success('Chart deleted successfully');
      loadCharts();
    } catch (error) {
      toast.error('Failed to delete chart');
    }
  };

  const handleView = (chart) => {
    setSelectedChart(chart);
    setShowModal(true);
  };

  const handleDownloadPNG = async () => {
    if (!selectedChart) return;

    try {
      // Create temporary div for rendering
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '1200px';
      tempDiv.style.height = '600px';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Render chart to temp div
      const chartContainer = document.createElement('div');
      chartContainer.style.width = '100%';
      chartContainer.style.height = '100%';
      chartContainer.style.backgroundColor = '#ffffff';
      chartContainer.style.padding = '20px';
      tempDiv.appendChild(chartContainer);

      // Add title
      const title = document.createElement('h2');
      title.textContent = selectedChart.title;
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '20px';
      title.style.textAlign = 'center';
      chartContainer.appendChild(title);

      // Add chart
      const chartDiv = document.createElement('div');
      chartDiv.style.width = '100%';
      chartDiv.style.height = 'calc(100% - 60px)';
      chartContainer.appendChild(chartDiv);

      // Wait for chart to render (simplified - using canvas directly)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture and download
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${selectedChart.title.replace(/[^a-z0-9]/gi, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Cleanup
      document.body.removeChild(tempDiv);

      // Increment download count
      await chartService.incrementDownload(selectedChart._id);
      
      toast.success('Chart downloaded as PNG');
      loadCharts(); // Reload to update count
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download chart. Please try viewing the chart first.');
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedChart) return;

    try {
      // Create temporary div for rendering
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '1200px';
      tempDiv.style.height = '600px';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      // Render chart to temp div
      const chartContainer = document.createElement('div');
      chartContainer.style.width = '100%';
      chartContainer.style.height = '100%';
      chartContainer.style.backgroundColor = '#ffffff';
      chartContainer.style.padding = '20px';
      tempDiv.appendChild(chartContainer);

      // Add title
      const title = document.createElement('h2');
      title.textContent = selectedChart.title;
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '20px';
      title.style.textAlign = 'center';
      chartContainer.appendChild(title);

      // Add chart
      const chartDiv = document.createElement('div');
      chartDiv.style.width = '100%';
      chartDiv.style.height = 'calc(100% - 60px)';
      chartContainer.appendChild(chartDiv);

      // Wait for chart to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture and create PDF
      const canvas = await html2canvas(tempDiv, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${selectedChart.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);

      // Cleanup
      document.body.removeChild(tempDiv);

      // Increment download count
      await chartService.incrementDownload(selectedChart._id);
      
      toast.success('Chart downloaded as PDF');
      loadCharts(); // Reload to update count
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download chart. Please try viewing the chart first.');
    }
  };

  const filteredCharts = charts.filter((chart) =>
    chart.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Charts
          </h1>
          <p className="text-gray-600">
            View, download, and manage all your visualizations
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search charts..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Chart Type Filter */}
            <div>
              <select
                className="input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="doughnut">Doughnut Chart</option>
                <option value="scatter">Scatter Plot</option>
                <option value="area">Area Chart</option>
                <option value="radar">Radar Chart</option>
              </select>
            </div>

            {/* Dimension Filter */}
            <div>
              <select
                className="input"
                value={filterDimension}
                onChange={(e) => setFilterDimension(e.target.value)}
              >
                <option value="all">All Dimensions</option>
                <option value="2D">2D Charts</option>
                <option value="3D">3D Charts</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 btn ${
                  viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <Grid className="h-4 w-4 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 btn ${
                  viewMode === 'list' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                <List className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Charts Display */}
        {filteredCharts.length === 0 ? (
          <div className="card text-center py-20">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Charts Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search or filters'
                : 'Create your first chart in the Analytics page'}
            </p>
            <a href="/analytics" className="btn btn-primary">
              Create Chart
            </a>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharts.map((chart) => (
              <div
                key={chart._id}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Chart Preview */}
                <div className="mb-4 bg-gray-50 rounded-lg p-4 h-48 flex items-center justify-center">
                  <div className="w-full h-full">
                    {chart.chartDimension === '2D' ? (
                      <Chart2D
                        chartData={chart.chartData}
                        chartConfig={{
                          chartType: chart.chartType,
                          title: '',
                        }}
                        height={160}
                      />
                    ) : (
                      <Chart3D
                        chartData={chart.chartData}
                        chartConfig={{
                          chartType: chart.chartType,
                          title: '',
                        }}
                        height={160}
                      />
                    )}
                  </div>
                </div>

                {/* Chart Info */}
                <h3 className="font-semibold text-gray-900 mb-2">
                  {chart.title}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="badge badge-primary">{chart.chartType}</span>
                  <span className="badge badge-secondary">
                    {chart.chartDimension}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {chart.viewCount} views
                  </span>
                  <span className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {chart.downloadCount} downloads
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  Created: {formatDate(chart.createdAt)}
                </p>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleView(chart)}
                    className="btn btn-primary flex items-center justify-center space-x-1 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedChart(chart);
                      setTimeout(() => handleDownloadPNG(), 100);
                    }}
                    className="btn btn-secondary flex items-center justify-center space-x-1 text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedChart(chart);
                      setTimeout(() => handleDownloadPDF(), 100);
                    }}
                    className="btn btn-secondary flex items-center justify-center space-x-1 text-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => handleDelete(chart._id)}
                    className="btn btn-danger flex items-center justify-center text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCharts.map((chart) => (
              <div
                key={chart._id}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {chart.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="badge badge-primary">
                        {chart.chartType}
                      </span>
                      <span className="badge badge-secondary">
                        {chart.chartDimension}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {chart.viewCount}
                      </span>
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {chart.downloadCount}
                      </span>
                      <span>{formatDate(chart.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleView(chart)}
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDelete(chart._id)}
                      className="btn btn-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chart Modal */}
        {showModal && selectedChart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedChart.title}
                    </h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="badge badge-primary">
                        {selectedChart.chartType}
                      </span>
                      <span className="badge badge-secondary">
                        {selectedChart.chartDimension}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Chart Display */}
                <div ref={chartRef} className="bg-white p-6 rounded-lg mb-6">
                  {selectedChart.chartDimension === '2D' ? (
                    <Chart2D
                      chartData={selectedChart.chartData}
                      chartConfig={{
                        chartType: selectedChart.chartType,
                        title: selectedChart.title,
                      }}
                      height={500}
                    />
                  ) : (
                    <Chart3D
                      chartData={selectedChart.chartData}
                      chartConfig={{
                        chartType: selectedChart.chartType,
                        title: selectedChart.title,
                      }}
                      height={500}
                    />
                  )}
                </div>

                {/* Chart Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="card bg-gray-50">
                    <p className="text-xs text-gray-600">Views</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedChart.viewCount}
                    </p>
                  </div>
                  <div className="card bg-gray-50">
                    <p className="text-xs text-gray-600">Downloads</p>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedChart.downloadCount}
                    </p>
                  </div>
                  <div className="card bg-gray-50">
                    <p className="text-xs text-gray-600">X-Axis</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {selectedChart.configuration.xAxis}
                    </p>
                  </div>
                  <div className="card bg-gray-50">
                    <p className="text-xs text-gray-600">Y-Axis</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {selectedChart.configuration.yAxis}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedChart.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">{selectedChart.description}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDownloadPNG}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PNG</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Close
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