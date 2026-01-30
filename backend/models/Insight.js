import mongoose from 'mongoose';

/**
 * Insight Model Schema
 * Stores AI-generated insights and analytics for uploaded data
 */
const insightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    upload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Upload',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['summary', 'trend', 'anomaly', 'prediction', 'recommendation'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    metadata: {
      aiModel: String,
      processingTime: Number,
      tokensUsed: Number,
      parameters: mongoose.Schema.Types.Mixed
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
insightSchema.index({ user: 1, upload: 1 });
insightSchema.index({ type: 1 });
insightSchema.index({ status: 1 });

// Method to mark as read
insightSchema.methods.markAsRead = async function () {
  this.isRead = true;
  return await this.save();
};

const Insight = mongoose.model('Insight', insightSchema);

export default Insight;