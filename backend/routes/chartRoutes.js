import express from 'express';
import {
  createChart,
  getMyCharts,
  getChart,
  updateChart,
  deleteChart,
  getChartsByUpload,
  getChartStats,
  incrementDownload
} from '../controllers/chartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create chart
router.post('/', createChart);

// Get user's charts
router.get('/', getMyCharts);

// Get chart statistics
router.get('/stats', getChartStats);

// Get charts by upload
router.get('/upload/:uploadId', getChartsByUpload);

// Get specific chart
router.get('/:id', getChart);

// Update chart
router.put('/:id', updateChart);

// Delete chart
router.delete('/:id', deleteChart);

// Increment download count
router.post('/:id/download', incrementDownload);

export default router;