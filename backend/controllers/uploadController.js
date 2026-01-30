import Upload from '../models/Upload.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';
import { AppError } from '../middleware/error.js';
import { parseExcelFile, getExcelInfo } from '../utils/excelParser.js';
import { cleanupFile } from '../middleware/upload.js';
import path from 'path';
import fs from 'fs';

/**
 * @desc    Upload Excel file
 * @route   POST /api/uploads
 * @access  Private
 */
export const uploadFile = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  try {
    const file = req.file;

    // Parse Excel file
    const parsedData = parseExcelFile(file.path);

    if (!parsedData.success) {
      cleanupFile(file.path);
      return next(new AppError('Failed to parse Excel file: ' + parsedData.error, 400));
    }

    // Create upload record
    const upload = await Upload.create({
      user: req.user.id,
      fileName: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      sheetCount: parsedData.workbook.sheetCount,
      rowCount: parsedData.workbook.totalRows,
      columnCount: parsedData.workbook.totalColumns,
      sheetNames: parsedData.workbook.sheetNames,
      parsedData: parsedData.sheets,
      metadata: parsedData.metadata,
      status: 'completed'
    });

    // Update user statistics
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        uploadCount: 1,
        storageUsed: file.size
      }
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded and parsed successfully',
      data: upload
    });
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      cleanupFile(req.file.path);
    }
    throw error;
  }
});

/**
 * @desc    Get all uploads for logged in user
 * @route   GET /api/uploads
 * @access  Private
 */
export const getMyUploads = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = {
    user: req.user.id,
    isDeleted: false
  };

  const uploads = await Upload.find(query)
    .select('-parsedData') // Exclude large parsed data
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
 * @desc    Get single upload by ID
 * @route   GET /api/uploads/:id
 * @access  Private
 */
export const getUpload = asyncHandler(async (req, res, next) => {
  const upload = await Upload.findById(req.params.id);

  if (!upload) {
    return next(new AppError('Upload not found', 404));
  }

  // Check ownership
  if (upload.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this upload', 403));
  }

  if (upload.isDeleted) {
    return next(new AppError('Upload has been deleted', 404));
  }

  res.status(200).json({
    success: true,
    data: upload
  });
});

/**
 * @desc    Get parsed data from upload
 * @route   GET /api/uploads/:id/data
 * @access  Private
 */
export const getUploadData = asyncHandler(async (req, res, next) => {
  const upload = await Upload.findById(req.params.id);

  if (!upload) {
    return next(new AppError('Upload not found', 404));
  }

  // Check ownership
  if (upload.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to access this upload', 403));
  }

  if (upload.isDeleted) {
    return next(new AppError('Upload has been deleted', 404));
  }

  // Get specific sheet if requested
  const sheetName = req.query.sheet;
  let data = upload.parsedData;

  if (sheetName && upload.parsedData[sheetName]) {
    data = { [sheetName]: upload.parsedData[sheetName] };
  }

  res.status(200).json({
    success: true,
    data: {
      uploadId: upload._id,
      fileName: upload.originalName,
      sheetNames: upload.sheetNames,
      data
    }
  });
});

/**
 * @desc    Delete upload
 * @route   DELETE /api/uploads/:id
 * @access  Private
 */
export const deleteUpload = asyncHandler(async (req, res, next) => {
  const upload = await Upload.findById(req.params.id);

  if (!upload) {
    return next(new AppError('Upload not found', 404));
  }

  // Check ownership
  if (upload.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('Not authorized to delete this upload', 403));
  }

  // Soft delete
  upload.isDeleted = true;
  await upload.save();

  // Update user storage
  await User.findByIdAndUpdate(req.user.id, {
    $inc: {
      storageUsed: -upload.fileSize
    }
  });

  // Optionally delete physical file
  if (fs.existsSync(upload.filePath)) {
    fs.unlinkSync(upload.filePath);
  }

  res.status(200).json({
    success: true,
    message: 'Upload deleted successfully'
  });
});

/**
 * @desc    Get upload statistics
 * @route   GET /api/uploads/stats
 * @access  Private
 */
export const getUploadStats = asyncHandler(async (req, res, next) => {
  const stats = await Upload.aggregate([
    {
      $match: {
        user: req.user._id,
        isDeleted: false
      }
    },
    {
      $group: {
        _id: null,
        totalUploads: { $sum: 1 },
        totalSize: { $sum: '$fileSize' },
        totalSheets: { $sum: '$sheetCount' },
        totalRows: { $sum: '$rowCount' },
        totalCharts: { $sum: '$chartCount' }
      }
    }
  ]);

  const result = stats[0] || {
    totalUploads: 0,
    totalSize: 0,
    totalSheets: 0,
    totalRows: 0,
    totalCharts: 0
  };

  res.status(200).json({
    success: true,
    data: result
  });
});