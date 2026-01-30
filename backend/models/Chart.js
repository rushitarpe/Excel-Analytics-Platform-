import mongoose from 'mongoose';

/**
 * Chart Model Schema
 * Stores chart configurations and generated visualizations
 */
const chartSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: [true, 'Chart title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    chartType: {
      type: String,
      required: true,
      enum: [
        // 2D Charts
        'bar', 'horizontalBar', 'stackedBar', 'groupedBar',
        'line', 'smoothLine', 'steppedLine', 'multiLine',
        'pie', 'doughnut', 'polarArea',
        'scatter', 'bubble',
        'area', 'stackedArea',
        'radar', 'heatmap',
        // 3D Charts
        'bar3d', 'line3d', 'scatter3d', 'surface3d', 'mesh3d'
      ]
    },
    chartDimension: {
      type: String,
      enum: ['2D', '3D'],
      required: true
    },
    configuration: {
      xAxis: { type: String, required: true },
      yAxis: { type: String, required: true },
      zAxis: { type: String }, // For 3D charts
      labels: [String],
      datasets: [{
        label: String,
        data: [mongoose.Schema.Types.Mixed],
        backgroundColor: [String],
        borderColor: String,
        borderWidth: Number
      }],
      options: mongoose.Schema.Types.Mixed
    },
    chartData: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    imageUrl: {
      type: String,
      default: null
    },
    viewCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true
  }
);

// Index for faster queries
chartSchema.index({ user: 1, createdAt: -1 });
chartSchema.index({ upload: 1 });
chartSchema.index({ chartType: 1 });

// Method to increment view count
chartSchema.methods.incrementView = async function () {
  this.viewCount += 1;
  return await this.save();
};

// Method to increment download count
chartSchema.methods.incrementDownload = async function () {
  this.downloadCount += 1;
  return await this.save();
};

const Chart = mongoose.model('Chart', chartSchema);

export default Chart;