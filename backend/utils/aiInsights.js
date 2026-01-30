/**
 * AI Insights Generator
 * Generate intelligent insights from Excel data
 * This is a template that can be integrated with OpenAI, Claude, or other AI APIs
 */

/**
 * Generate Data Summary
 * @param {object} parsedData - Parsed Excel data
 * @returns {object} Summary insights
 */
export const generateSummary = (parsedData) => {
  try {
    const { sheets, workbook } = parsedData;
    const firstSheet = Object.values(sheets)[0];
    
    if (!firstSheet || !firstSheet.data) {
      return {
        success: false,
        error: 'No data available for summary'
      };
    }

    const summary = {
      type: 'summary',
      title: 'Data Summary',
      content: `This dataset contains ${workbook.sheetCount} sheet(s) with a total of ${workbook.totalRows} rows and ${workbook.totalColumns} columns. `,
      insights: []
    };

    // Analyze first sheet
    const { headers, data, rowCount, columnCount } = firstSheet;

    summary.content += `The primary sheet has ${rowCount} data rows across ${columnCount} columns. `;

    // Identify numeric columns
    const numericColumns = [];
    headers.forEach((header, index) => {
      const columnValues = data.map(row => row[header]);
      const numericValues = columnValues.filter(val => !isNaN(parseFloat(val)));
      
      if (numericValues.length / columnValues.length > 0.7) {
        numericColumns.push({
          name: header,
          values: numericValues.map(v => parseFloat(v))
        });
      }
    });

    if (numericColumns.length > 0) {
      summary.insights.push({
        type: 'numeric_analysis',
        message: `Found ${numericColumns.length} numeric column(s) suitable for quantitative analysis.`
      });
    }

    // Check for missing data
    const totalCells = rowCount * columnCount;
    let missingCells = 0;
    data.forEach(row => {
      Object.values(row).forEach(val => {
        if (val === null || val === '') missingCells++;
      });
    });

    const missingPercentage = ((missingCells / totalCells) * 100).toFixed(2);
    if (missingCells > 0) {
      summary.insights.push({
        type: 'data_quality',
        message: `${missingPercentage}% of cells contain missing or empty values.`,
        severity: missingPercentage > 10 ? 'warning' : 'info'
      });
    }

    return {
      success: true,
      ...summary
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Detect Trends
 * @param {array} data - Time series or sequential data
 * @param {string} column - Column to analyze
 * @returns {object} Trend insights
 */
export const detectTrends = (data, column) => {
  try {
    const values = data
      .map(row => parseFloat(row[column]))
      .filter(val => !isNaN(val));

    if (values.length < 3) {
      return {
        success: false,
        error: 'Insufficient data for trend analysis'
      };
    }

    // Calculate trend direction
    let increases = 0;
    let decreases = 0;

    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) increases++;
      else if (values[i] < values[i - 1]) decreases++;
    }

    let trendDirection = 'stable';
    let trendStrength = 0;

    if (increases > decreases * 1.5) {
      trendDirection = 'increasing';
      trendStrength = (increases / values.length) * 100;
    } else if (decreases > increases * 1.5) {
      trendDirection = 'decreasing';
      trendStrength = (decreases / values.length) * 100;
    }

    // Calculate basic statistics
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const range = max - min;
    const volatility = (range / avg) * 100;

    return {
      success: true,
      type: 'trend',
      title: `Trend Analysis: ${column}`,
      content: `The column "${column}" shows a ${trendDirection} trend over the dataset. `,
      data: {
        direction: trendDirection,
        strength: trendStrength.toFixed(2),
        min,
        max,
        average: avg.toFixed(2),
        range,
        volatility: volatility.toFixed(2)
      },
      insights: [
        {
          type: 'trend_direction',
          message: `Data is ${trendDirection} with ${trendStrength.toFixed(1)}% consistency.`
        },
        {
          type: 'volatility',
          message: `Volatility is ${volatility.toFixed(1)}%, indicating ${volatility > 50 ? 'high' : 'moderate'} variability.`
        }
      ]
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Detect Anomalies
 * @param {array} data - Dataset
 * @param {string} column - Column to analyze
 * @returns {object} Anomaly insights
 */
export const detectAnomalies = (data, column) => {
  try {
    const values = data
      .map(row => parseFloat(row[column]))
      .filter(val => !isNaN(val));

    if (values.length < 5) {
      return {
        success: false,
        error: 'Insufficient data for anomaly detection'
      };
    }

    // Calculate mean and standard deviation
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Detect outliers (values beyond 2 standard deviations)
    const threshold = 2;
    const anomalies = [];

    values.forEach((val, index) => {
      const zScore = Math.abs((val - mean) / stdDev);
      if (zScore > threshold) {
        anomalies.push({
          index,
          value: val,
          zScore: zScore.toFixed(2),
          deviation: ((val - mean) / mean * 100).toFixed(2) + '%'
        });
      }
    });

    return {
      success: true,
      type: 'anomaly',
      title: `Anomaly Detection: ${column}`,
      content: anomalies.length > 0 
        ? `Detected ${anomalies.length} potential anomalies in "${column}" that deviate significantly from the mean.`
        : `No significant anomalies detected in "${column}". Data appears consistent.`,
      data: {
        mean: mean.toFixed(2),
        stdDev: stdDev.toFixed(2),
        anomalyCount: anomalies.length,
        anomalies: anomalies.slice(0, 10) // Limit to first 10
      },
      insights: anomalies.length > 0 ? [
        {
          type: 'anomaly_detected',
          message: `${anomalies.length} values exceed ${threshold} standard deviations from mean.`,
          severity: 'warning'
        }
      ] : []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate Recommendations
 * @param {object} parsedData - Parsed Excel data
 * @returns {object} Recommendations
 */
export const generateRecommendations = (parsedData) => {
  try {
    const { sheets } = parsedData;
    const firstSheet = Object.values(sheets)[0];
    const recommendations = [];

    if (!firstSheet) {
      return {
        success: false,
        error: 'No data available'
      };
    }

    const { headers, data } = firstSheet;

    // Recommend chart types based on data structure
    const numericColumns = headers.filter(header => {
      const values = data.map(row => row[header]);
      const numericCount = values.filter(val => !isNaN(parseFloat(val))).length;
      return numericCount / values.length > 0.7;
    });

    if (numericColumns.length >= 2) {
      recommendations.push({
        type: 'visualization',
        title: 'Scatter Plot Analysis',
        message: `Consider creating a scatter plot using ${numericColumns[0]} and ${numericColumns[1]} to identify correlations.`,
        priority: 'high'
      });
    }

    if (numericColumns.length >= 1) {
      recommendations.push({
        type: 'visualization',
        title: 'Trend Analysis',
        message: `Create a line chart to visualize trends in ${numericColumns[0]} over time.`,
        priority: 'medium'
      });
    }

    // Check for categorical data
    const categoricalColumns = headers.filter(header => {
      const values = data.map(row => row[header]);
      const uniqueCount = new Set(values).size;
      return uniqueCount < values.length * 0.5 && uniqueCount > 1;
    });

    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
      recommendations.push({
        type: 'visualization',
        title: 'Category Comparison',
        message: `Use a bar chart to compare ${numericColumns[0]} across different ${categoricalColumns[0]} categories.`,
        priority: 'high'
      });
    }

    return {
      success: true,
      type: 'recommendation',
      title: 'Analysis Recommendations',
      content: `Based on your data structure, here are ${recommendations.length} recommended analysis approaches.`,
      data: {
        recommendations
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate All Insights
 * @param {object} parsedData - Parsed Excel data
 * @returns {array} All generated insights
 */
export const generateAllInsights = (parsedData) => {
  const insights = [];

  // Generate summary
  const summary = generateSummary(parsedData);
  if (summary.success) {
    insights.push(summary);
  }

  // Analyze numeric columns for trends and anomalies
  const firstSheet = Object.values(parsedData.sheets)[0];
  if (firstSheet && firstSheet.data.length > 0) {
    const numericColumns = firstSheet.headers.filter(header => {
      const values = firstSheet.data.map(row => row[header]);
      const numericCount = values.filter(val => !isNaN(parseFloat(val))).length;
      return numericCount / values.length > 0.7;
    });

    // Analyze first numeric column for trends
    if (numericColumns.length > 0) {
      const trends = detectTrends(firstSheet.data, numericColumns[0]);
      if (trends.success) {
        insights.push(trends);
      }

      const anomalies = detectAnomalies(firstSheet.data, numericColumns[0]);
      if (anomalies.success) {
        insights.push(anomalies);
      }
    }
  }

  // Generate recommendations
  const recommendations = generateRecommendations(parsedData);
  if (recommendations.success) {
    insights.push(recommendations);
  }

  return insights;
};