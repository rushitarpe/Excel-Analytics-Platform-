import Insight from '../models/Insight.js';
import Upload from '../models/Upload.js';
import { asyncHandler } from '../middleware/error.js';
import { AppError } from '../middleware/error.js';
import {
  generateAllInsights,
  generateSummary,
  detectTrends,
  detectAnomalies,
  generateRecommendations
} from '../utils/aiInsights.js';

/**
 * @desc    Generate insights for an upload
 * @route   POST /api/insights/generate/:uploadId
 * @access  Private
 */
export const generateInsights = asyncHandler(async (req, res, next) => {
  const upload = await Upload.findById(req.params.uploadId);

  if (!upload) {
    return next(new AppError('Upload not found', 404));
  }

  // Check ownership
  if (upload.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to generate insights for this upload', 403));
  }

  if (!upload.parsedData) {
    return next(new AppError('Upload data not available for analysis', 400));
  }

  try {
    // Generate all insights
    const insights = generateAllInsights({
      sheets: upload.parsedData,
      workbook: {
        sheetCount: upload.sheetCount,
        totalRows: upload.rowCount,
        totalColumns: upload.columnCount,
        sheetNames: upload.sheetNames
      }
    });

    // Save insights to database
    const savedInsights = [];
    for (const insight of insights) {
      if (insight.success) {
        const insightDoc = await Insight.create({
          user: req.user.id,
          upload: upload._id,
          type: insight.type,
          title: insight.title,
          content: insight.content,
          data: insight.data || {},
          confidence: 85, // Default confidence
          status: 'completed'
        });
        savedInsights.push(insightDoc);
      }
    }

    res.status(201).json({
      success: true,
      message: `Generated ${savedInsights.length} insights successfully`,
      count: savedInsights.length,
      data: savedInsights
    });
  } catch (error) {
    return next(new AppError('Failed to generate insights: ' + error.message, 500));
  }
});

/**
 * @desc    Get all insights for a user
 * @route   GET /api/insights
 * @access  Private
 */
export const getMyInsights = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = { user: req.user.id };

  // Filter by type if provided
  if (req.query.type) {
    query.type = req.query.type;
  }

  // Filter by upload if provided
  if (req.query.uploadId) {
    query.upload = req.query.uploadId;
  }

  // Filter by read status if provided
  if (req.query.isRead !== undefined) {
    query.isRead = req.query.isRead === 'true';
  }

  const insights = await Insight.find(query)
    .populate('upload', 'fileName originalName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Insight.countDocuments(query);

  res.status(200).json({
    success: true,
    count: insights.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: insights
  });
});

/**
 * @desc    Get insights for a specific upload
 * @route   GET /api/insights/upload/:uploadId
 * @access  Private
 */
export const getInsightsByUpload = asyncHandler(async (req, res, next) => {
  const upload = await Upload.findById(req.params.uploadId);

  if (!upload) {
    return next(new AppError('Upload not found', 404));
  }

  // Check ownership
  if (upload.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access insights for this upload', 403));
  }

  const insights = await Insight.find({
    upload: req.params.uploadId,
    user: req.user.id
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: insights.length,
    data: insights
  });
});

/**
 * @desc    Get single insight by ID
 * @route   GET /api/insights/:id
 * @access  Private
 */
export const getInsight = asyncHandler(async (req, res, next) => {
  const insight = await Insight.findById(req.params.id)
    .populate('upload', 'fileName originalName')
    .populate('user', 'name email');

  if (!insight) {
    return next(new AppError('Insight not found', 404));
  }

  // Check ownership
  if (insight.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this insight', 403));
  }

  // Mark as read
  if (!insight.isRead) {
    await insight.markAsRead();
  }

  res.status(200).json({
    success: true,
    data: insight
  });
});

/**
 * @desc    Mark insight as read
 * @route   PATCH /api/insights/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res, next) => {
  const insight = await Insight.findById(req.params.id);

  if (!insight) {
    return next(new AppError('Insight not found', 404));
  }

  // Check ownership
  if (insight.user.toString() !== req.user.id) {
    return next(new AppError('Not authorized to update this insight', 403));
  }

  await insight.markAsRead();

  res.status(200).json({
    success: true,
    message: 'Insight marked as read'
  });
});

/**
 * @desc    Delete insight
 * @route   DELETE /api/insights/:id
 * @access  Private
 */
export const deleteInsight = asyncHandler(async (req, res, next) => {
  const insight = await Insight.findById(req.params.id);

  if (!insight) {
    return next(new AppError('Insight not found', 404));
  }

  // Check ownership
  if (insight.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this insight', 403));
  }

  await insight.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Insight deleted successfully'
  });
});

/**
 * @desc    Get insight statistics
 * @route   GET /api/insights/stats
 * @access  Private
 */
export const getInsightStats = asyncHandler(async (req, res, next) => {
  const stats = await Insight.aggregate([
    {
      $match: { user: req.user._id }
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        unread: {
          $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
        }
      }
    }
  ]);

  const totalStats = await Insight.aggregate([
    {
      $match: { user: req.user._id }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: {
          $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
        },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      byType: stats,
      overall: totalStats[0] || {
        total: 0,
        unread: 0,
        completed: 0
      }
    }
  });
});

/**
 * @desc    Generate specific insight type
 * @route   POST /api/insights/generate/:uploadId/:type
 * @access  Private
 */
export const generateSpecificInsight = asyncHandler(async (req, res, next) => {
  const { uploadId, type } = req.params;
  const { column } = req.body;

  const upload = await Upload.findById(uploadId);

  if (!upload) {
    return next(new AppError('Upload not found', 404));
  }

  // Check ownership
  if (upload.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized', 403));
  }

  let insightData;
  const firstSheet = Object.values(upload.parsedData)[0];

  switch (type) {
    case 'summary':
      insightData = generateSummary({
        sheets: upload.parsedData,
        workbook: {
          sheetCount: upload.sheetCount,
          totalRows: upload.rowCount,
          totalColumns: upload.columnCount
        }
      });
      break;

    case 'trend':
      if (!column) {
        return next(new AppError('Column name required for trend analysis', 400));
      }
      insightData = detectTrends(firstSheet.data, column);
      break;

    case 'anomaly':
      if (!column) {
        return next(new AppError('Column name required for anomaly detection', 400));
      }
      insightData = detectAnomalies(firstSheet.data, column);
      break;

    case 'recommendation':
      insightData = generateRecommendations({
        sheets: upload.parsedData
      });
      break;

    default:
      return next(new AppError('Invalid insight type', 400));
  }

  if (!insightData.success) {
    return next(new AppError(insightData.error, 400));
  }

  const insight = await Insight.create({
    user: req.user.id,
    upload: uploadId,
    type: insightData.type,
    title: insightData.title,
    content: insightData.content,
    data: insightData.data || {},
    confidence: 85,
    status: 'completed'
  });

  res.status(201).json({
    success: true,
    message: 'Insight generated successfully',
    data: insight
  });
});