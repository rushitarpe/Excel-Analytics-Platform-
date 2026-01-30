import mongoose from 'mongoose';

/**
 * Upload Model Schema
 * Tracks Excel file uploads and associated metadata
 */
const uploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true
    },
    originalName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    mimeType: {
      type: String,
      required: true,
      enum: [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    },
    sheetCount: {
      type: Number,
      default: 0
    },
    rowCount: {
      type: Number,
      default: 0
    },
    columnCount: {
      type: Number,
      default: 0
    },
    sheetNames: [{
      type: String
    }],
    parsedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing'
    },
    error: {
      type: String,
      default: null
    },
    chartCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
uploadSchema.index({ user: 1, createdAt: -1 });
uploadSchema.index({ status: 1 });

// Virtual for charts
uploadSchema.virtual('charts', {
  ref: 'Chart',
  localField: '_id',
  foreignField: 'upload'
});

// Method to get upload summary
uploadSchema.methods.getSummary = function () {
  return {
    id: this._id,
    fileName: this.fileName,
    originalName: this.originalName,
    fileSize: this.fileSize,
    sheetCount: this.sheetCount,
    rowCount: this.rowCount,
    columnCount: this.columnCount,
    status: this.status,
    createdAt: this.createdAt
  };
};

const Upload = mongoose.model('Upload', uploadSchema);

export default Upload;