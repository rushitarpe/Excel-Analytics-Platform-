import User from '../models/User.js';
import Upload from '../models/Upload.js';
import Chart from '../models/Chart.js';
import Insight from '../models/Insight.js';
import { asyncHandler } from '../middleware/error.js';
import { AppError } from '../middleware/error.js';

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  // User statistics
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const adminUsers = await User.countDocuments({ role: 'admin' });

  // Upload statistics
  const totalUploads = await Upload.countDocuments({ isDeleted: false });
  const uploadStats = await Upload.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalSize: { $sum: '$fileSize' },
        totalSheets: { $sum: '$sheetCount' },
        totalRows: { $sum: '$rowCount' }
      }
    }
  ]);

  // Chart statistics
  const totalCharts = await Chart.countDocuments();
  const chartStats = await Chart.aggregate([
    {
      $group: {
        _id: '$chartDimension',
        count: { $sum: 1 }
      }
    }
  ]);

  // Insight statistics
  const totalInsights = await Insight.countDocuments();
  const insightStats = await Insight.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  // Recent activity
  const recentUploads = await Upload.find({ isDeleted: false })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('fileName originalName fileSize createdAt user');

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');

  // Upload trends (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const uploadTrends = await Upload.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        isDeleted: false
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
        recent: recentUsers
      },
      uploads: {
        total: totalUploads,
        totalSize: uploadStats[0]?.totalSize || 0,
        totalSheets: uploadStats[0]?.totalSheets || 0,
        totalRows: uploadStats[0]?.totalRows || 0,
        recent: recentUploads,
        trends: uploadTrends
      },
      charts: {
        total: totalCharts,
        byDimension: chartStats
      },
      insights: {
        total: totalInsights,
        byType: insightStats
      }
    }
  });
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};

  // Filter by role
  if (req.query.role) {
    query.role = req.query.role;
  }

  // Filter by active status
  if (req.query.isActive !== undefined) {
    query.isActive = req.query.isActive === 'true';
  }

  // Search by name or email
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get user's uploads
  const uploads = await Upload.find({ user: user._id, isDeleted: false })
    .select('fileName fileSize createdAt')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get user's charts
  const chartCount = await Chart.countDocuments({ user: user._id });

  // Get user's insights
  const insightCount = await Insight.countDocuments({ user: user._id });

  res.status(200).json({
    success: true,
    data: {
      user,
      stats: {
        uploads: uploads.length,
        charts: chartCount,
        insights: insightCount,
        storageUsed: user.storageUsed
      },
      recentUploads: uploads
    }
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Fields that admin can update
  const allowedFields = ['name', 'email', 'role', 'isActive'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user.id) {
    return next(new AppError('You cannot delete your own account', 400));
  }

  // Soft delete by deactivating
  user.isActive = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully'
  });
});

/**
 * @desc    Get all uploads (admin view)
 * @route   GET /api/admin/uploads
 * @access  Private/Admin
 */
export const getAllUploads = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = { isDeleted: false };

  // Filter by user
  if (req.query.userId) {
    query.user = req.query.userId;
  }

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  const uploads = await Upload.find(query)
    .populate('user', 'name email')
    .select('-parsedData') // Exclude large data
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Upload.countDocuments(query);

  res.status(200).json({
    success: true,
    count: uploads.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: uploads
  });
});

/**
 * @desc    Get system statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getSystemStats = asyncHandler(async (req, res, next) => {
  // Storage statistics
  const storageStats = await Upload.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        totalStorage: { $sum: '$fileSize' },
        avgFileSize: { $avg: '$fileSize' },
        maxFileSize: { $max: '$fileSize' }
      }
    }
  ]);

  // User activity
  const userActivity = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        totalUploads: { $sum: '$uploadCount' },
        totalStorage: { $sum: '$storageUsed' }
      }
    }
  ]);

  // Chart type distribution
  const chartTypeStats = await Chart.aggregate([
    {
      $group: {
        _id: '$chartType',
        count: { $sum: 1 },
        totalViews: { $sum: '$viewCount' },
        totalDownloads: { $sum: '$downloadCount' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Most active users
  const topUsers = await User.find()
    .sort({ uploadCount: -1 })
    .limit(10)
    .select('name email uploadCount storageUsed');

  res.status(200).json({
    success: true,
    data: {
      storage: storageStats[0] || {
        totalStorage: 0,
        avgFileSize: 0,
        maxFileSize: 0
      },
      users: userActivity[0] || {
        totalUsers: 0,
        activeUsers: 0,
        totalUploads: 0,
        totalStorage: 0
      },
      chartTypes: chartTypeStats,
      topUsers
    }
  });
});

/**
 * @desc    Get activity logs
 * @route   GET /api/admin/activity
 * @access  Private/Admin
 */
export const getActivityLogs = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 50;

  // Get recent uploads
  const recentUploads = await Upload.find({ isDeleted: false })
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('fileName user createdAt');

  // Get recent charts
  const recentCharts = await Chart.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('title user createdAt chartType');

  // Get recent user registrations
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name email createdAt');

  // Combine and sort by date
  const activities = [
    ...recentUploads.map(u => ({
      type: 'upload',
      user: u.user,
      description: `Uploaded file: ${u.fileName}`,
      timestamp: u.createdAt
    })),
    ...recentCharts.map(c => ({
      type: 'chart',
      user: c.user,
      description: `Created ${c.chartType} chart: ${c.title}`,
      timestamp: c.createdAt
    })),
    ...recentUsers.map(u => ({
      type: 'registration',
      user: { name: u.name, email: u.email },
      description: `New user registered: ${u.name}`,
      timestamp: u.createdAt
    }))
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);

  res.status(200).json({
    success: true,
    count: activities.length,
    data: activities
  });
});