import express from 'express';
import {
  uploadFile,
  getMyUploads,
  getUpload,
  getUploadData,
  deleteUpload,
  getUploadStats
} from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { upload, validateFile } from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload file
router.post('/', upload.single('file'), validateFile, uploadFile);

// Get user's uploads
router.get('/', getMyUploads);

// Get upload statistics
router.get('/stats', getUploadStats);

// Get specific upload
router.get('/:id', getUpload);

// Get upload data
router.get('/:id/data', getUploadData);

// Delete upload
router.delete('/:id', deleteUpload);

export default router;