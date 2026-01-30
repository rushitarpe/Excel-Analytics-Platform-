import express from 'express';
import {
  generateInsights,
  getMyInsights,
  getInsightsByUpload,
  getInsight,
  markAsRead,
  deleteInsight,
  getInsightStats,
  generateSpecificInsight
} from '../controllers/insightController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Generate insights for an upload
router.post('/generate/:uploadId', generateInsights);

// Generate specific insight type
router.post('/generate/:uploadId/:type', generateSpecificInsight);

// Get user's insights
router.get('/', getMyInsights);

// Get insight statistics
router.get('/stats', getInsightStats);

// Get insights by upload
router.get('/upload/:uploadId', getInsightsByUpload);

// Get specific insight
router.get('/:id', getInsight);

// Mark insight as read
router.patch('/:id/read', markAsRead);

// Delete insight
router.delete('/:id', deleteInsight);

export default router;