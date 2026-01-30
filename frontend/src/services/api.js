import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure axios
axios.defaults.baseURL = API_URL;

// Upload Service
export const uploadService = {
  uploadFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('/api/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  getUploads: async (page = 1, limit = 10) => {
    const response = await axios.get(`/api/uploads?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUpload: async (id) => {
    const response = await axios.get(`/api/uploads/${id}`);
    return response.data;
  },

  getUploadData: async (id, sheet = null) => {
    const url = sheet ? `/api/uploads/${id}/data?sheet=${sheet}` : `/api/uploads/${id}/data`;
    const response = await axios.get(url);
    return response.data;
  },

  deleteUpload: async (id) => {
    const response = await axios.delete(`/api/uploads/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get('/api/uploads/stats');
    return response.data;
  },
};

// Chart Service
export const chartService = {
  createChart: async (chartData) => {
    const response = await axios.post('/api/charts', chartData);
    return response.data;
  },

  getCharts: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`/api/charts?${params}`);
    return response.data;
  },

  getChart: async (id) => {
    const response = await axios.get(`/api/charts/${id}`);
    return response.data;
  },

  updateChart: async (id, data) => {
    const response = await axios.put(`/api/charts/${id}`, data);
    return response.data;
  },

  deleteChart: async (id) => {
    const response = await axios.delete(`/api/charts/${id}`);
    return response.data;
  },

  getChartsByUpload: async (uploadId) => {
    const response = await axios.get(`/api/charts/upload/${uploadId}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get('/api/charts/stats');
    return response.data;
  },

  incrementDownload: async (id) => {
    const response = await axios.post(`/api/charts/${id}/download`);
    return response.data;
  },
};

// Insight Service
export const insightService = {
  generateInsights: async (uploadId) => {
    const response = await axios.post(`/api/insights/generate/${uploadId}`);
    return response.data;
  },

  generateSpecificInsight: async (uploadId, type, data = {}) => {
    const response = await axios.post(`/api/insights/generate/${uploadId}/${type}`, data);
    return response.data;
  },

  getInsights: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`/api/insights?${params}`);
    return response.data;
  },

  getInsight: async (id) => {
    const response = await axios.get(`/api/insights/${id}`);
    return response.data;
  },

  getInsightsByUpload: async (uploadId) => {
    const response = await axios.get(`/api/insights/upload/${uploadId}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await axios.patch(`/api/insights/${id}/read`);
    return response.data;
  },

  deleteInsight: async (id) => {
    const response = await axios.delete(`/api/insights/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get('/api/insights/stats');
    return response.data;
  },
};

// Admin Service
export const adminService = {
  getDashboard: async () => {
    const response = await axios.get('/api/admin/dashboard');
    return response.data;
  },

  getUsers: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`/api/admin/users?${params}`);
    return response.data;
  },

  getUser: async (id) => {
    const response = await axios.get(`/api/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await axios.put(`/api/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axios.delete(`/api/admin/users/${id}`);
    return response.data;
  },

  getUploads: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`/api/admin/uploads?${params}`);
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get('/api/admin/stats');
    return response.data;
  },

  getActivity: async (limit = 50) => {
    const response = await axios.get(`/api/admin/activity?limit=${limit}`);
    return response.data;
  },
};

export default {
  upload: uploadService,
  chart: chartService,
  insight: insightService,
  admin: adminService,
};