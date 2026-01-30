import Chart from '../models/Chart.js';
import Upload from '../models/Upload.js';
import { asyncHandler } from '../middleware/error.js';
import { AppError } from '../middleware/error.js';

/**
 * @desc    Create new chart
 * @route   POST /api/charts
 * @access  Private
 */
export const createChart = asyncHandler(async (req, res, next) => {
  const {
    uploadId,
    title,
    description,
    chartType,
    chartDimension,
    configuration,
    chartData,
    tags
  } = req.body;

  // Validate required fields
  if (!uploadId || !title || !chartType || !chartDimension || !configuration || !chartData) {
    return next(new AppError('Please provide all required fields', 400));
  }

  // Check if upload exists and belongs to user
  const upload = await Upload.findById(uploadId);
  if (!upload) {
    return next(new AppError('Upload not found', 404));
  }

  if (upload.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to create chart for this upload', 403));
  }

  // Create chart
  const chart = await Chart.create({
    user: req.user.id,
    upload: uploadId,
    title,
    description,
    chartType,
    chartDimension,
    configuration,
    chartData,
    tags: tags || []
  });

  // Update upload chart count
  await Upload.findByIdAndUpdate(uploadId, {
    $inc: { chartCount: 1 }
  });

  res.status(201).json({
    success: true,
    message: 'Chart created successfully',
    data: chart
  });
});

/**
 * @desc    Get all charts for logged in user
 * @route   GET /api/charts
 * @access  Private
 */
export const getMyCharts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build query
  const query = { user: req.user.id };

  // Filter by upload if provided
  if (req.query.uploadId) {
    query.upload = req.query.uploadId;
  }

  // Filter by chart type if provided
  if (req.query.chartType) {
    query.chartType = req.query.chartType;
  }

  // Filter by dimension if provided
  if (req.query.dimension) {
    query.chartDimension = req.query.dimension;
  }

  const charts = await Chart.find(query)
    .populate('upload', 'fileName originalName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Chart.countDocuments(query);

  res.status(200).json({
    success: true,
    count: charts.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: charts
  });
});

/**
 * @desc    Get single chart by ID
 * @route   GET /api/charts/:id
 * @access  Private
 */
export const getChart = asyncHandler(async (req, res, next) => {
  const chart = await Chart.findById(req.params.id)
    .populate('upload', 'fileName originalName sheetNames')
    .populate('user', 'name email');

  if (!chart) {
    return next(new AppError('Chart not found', 404));
  }

  // Check ownership or public access
  if (
    chart.user._id.toString() !== req.user.id &&
    !chart.isPublic &&
    req.user.role !== 'admin'
  ) {
    return next(new AppError('Not authorized to access this chart', 403));
  }

  // Increment view count
  await chart.incrementView();

  res.status(200).json({
    success: true,
    data: chart
  });
});

/**
 * @desc    Update chart
 * @route   PUT /api/charts/:id
 * @access  Private
 */
export const updateChart = asyncHandler(async (req, res, next) => {
  let chart = await Chart.findById(req.params.id);

  if (!chart) {
    return next(new AppError('Chart not found', 404));
  }

  // Check ownership
  if (chart.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to update this chart', 403));
  }

  // Update allowed fields
  const allowedFields = [
    'title',
    'description',
    'configuration',
    'chartData',
    'tags',
    'isPublic'
  ];

  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  chart = await Chart.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Chart updated successfully',
    data: chart
  });
});

/**
 * @desc    Delete chart
 * @route   DELETE /api/charts/:id
 * @access  Private
 */
export const deleteChart = asyncHandler(async (req, res, next) => {
  const chart = await Chart.findById(req.params.id);

  if (!chart) {
    return next(new AppError('Chart not found', 404));
  }

  // Check ownership
  if (chart.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this chart', 403));
  }

  await chart.deleteOne();

  // Update upload chart count
  await Upload.findByIdAndUpdate(chart.upload, {
    $inc: { chartCount: -1 }
  });

  res.status(200).json({
    success: true,
    message: 'Chart deleted successfully'
  });
});

/**
 * @desc    Get charts by upload ID
 * @route   GET /api/charts/upload/:uploadId
 * @access  Private
 */
export const getChartsByUpload = asyncHandler(async (req, res, next) => {
  const upload = await Upload.findById(req.params.uploadId);

  if (!upload) {
    return next(new AppError('Upload not found', 404));
  }

  // Check ownership
  if (upload.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access charts for this upload', 403));
  }

  const charts = await Chart.find({
    upload: req.params.uploadId,
    user: req.user.id
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: charts.length,
    data: charts
  });
});

/**
 * @desc    Get chart statistics
 * @route   GET /api/charts/stats
 * @access  Private
 */
export const getChartStats = asyncHandler(async (req, res, next) => {
  const stats = await Chart.aggregate([
    {
      $match: { user: req.user._id }
    },
    {
      $group: {
        _id: '$chartType',
        count: { $sum: 1 },
        totalViews: { $sum: '$viewCount' },
        totalDownloads: { $sum: '$downloadCount' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  const totalStats = await Chart.aggregate([
    {
      $match: { user: req.user._id }
    },
    {
      $group: {
        _id: null,
        totalCharts: { $sum: 1 },
        totalViews: { $sum: '$viewCount' },
        totalDownloads: { $sum: '$downloadCount' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      byType: stats,
      overall: totalStats[0] || {
        totalCharts: 0,
        totalViews: 0,
        totalDownloads: 0
      }
    }
  });
});

/**
 * @desc    Increment chart download count
 * @route   POST /api/charts/:id/download
 * @access  Private
 */
export const incrementDownload = asyncHandler(async (req, res, next) => {
  const chart = await Chart.findById(req.params.id);

  if (!chart) {
    return next(new AppError('Chart not found', 404));
  }

  await chart.incrementDownload();

  // Also increment upload download count
  await Upload.findByIdAndUpdate(chart.upload, {
    $inc: { downloadCount: 1 }
  });

  res.status(200).json({
    success: true,
    message: 'Download count updated'
  });
});