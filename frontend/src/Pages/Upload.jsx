import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadService } from '../services/api';
import toast from 'react-hot-toast';
import { Upload as UploadIcon, File, X, CheckCircle, AlertCircle } from 'lucide-react';

 const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedData, setUploadedData] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      toast.error('Please upload only Excel files (.xls or .xlsx)');
      return;
    }

    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadedData(null);
      setUploadProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await uploadService.uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadedData(response.data);
      toast.success('File uploaded and parsed successfully!');
      
      // Redirect to analytics after 2 seconds
      setTimeout(() => {
        navigate('/analytics');
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadedData(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Excel File
          </h1>
          <p className="text-gray-600">
            Upload your Excel file (.xls or .xlsx) to start analyzing your data
          </p>
        </div>

        {/* Upload Area */}
        <div className="card mb-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            }`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-lg text-primary-600 font-medium">
                Drop your Excel file here...
              </p>
            ) : (
              <>
                <p className="text-lg text-gray-700 mb-2">
                  Drag & drop your Excel file here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports .xls and .xlsx files (max 10MB)
                </p>
              </>
            )}
          </div>

          {/* Selected File */}
          {file && !uploadedData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-red-600 hover:text-red-700"
                disabled={uploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Uploading...
                </span>
                <span className="text-sm font-medium text-primary-600">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          {file && !uploadedData && !uploading && (
            <div className="mt-6">
              <button
                onClick={handleUpload}
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
              >
                <UploadIcon className="h-5 w-5" />
                <span>Upload and Process File</span>
              </button>
            </div>
          )}

          {/* Upload Success */}
          {uploadedData && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Upload Successful!
                  </h3>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>File: {uploadedData.originalName}</p>
                    <p>Sheets: {uploadedData.sheetCount}</p>
                    <p>Total Rows: {uploadedData.rowCount}</p>
                    <p>Total Columns: {uploadedData.columnCount}</p>
                  </div>
                  <p className="mt-3 text-sm text-green-700">
                    Redirecting to analytics...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Upload Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <span>Only Excel files (.xls, .xlsx) are supported</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <span>Maximum file size is 10MB</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <span>First row should contain column headers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <span>Multiple sheets are supported</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  <span>Your data is securely stored and encrypted</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <UploadIcon className="h-6 w-6 text-primary-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Easy Upload</h4>
            <p className="text-sm text-gray-600">
              Drag & drop or click to upload your Excel files instantly
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-primary-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Auto-Process</h4>
            <p className="text-sm text-gray-600">
              Automatic parsing and data extraction from all sheets
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-primary-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Secure Storage</h4>
            <p className="text-sm text-gray-600">
              Your data is encrypted and stored securely in the cloud
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload