import xlsx from 'xlsx';
import fs from 'fs';

/**
 * Parse Excel File
 * Extract data, metadata, and structure from Excel files
 * @param {string} filePath - Path to Excel file
 * @returns {object} Parsed data and metadata
 */
export const parseExcelFile = (filePath) => {
  try {
    // Read the file
    const workbook = xlsx.readFile(filePath, { cellDates: true });

    // Get sheet names
    const sheetNames = workbook.SheetNames;
    const sheetCount = sheetNames.length;

    // Parse all sheets
    const sheets = {};
    let totalRows = 0;
    let totalColumns = 0;

    sheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const jsonData = xlsx.utils.sheet_to_json(worksheet, {
        header: 1, // Use array of arrays format
        raw: false, // Format values as strings
        defval: null // Default value for empty cells
      });

      // Get column headers (first row)
      const headers = jsonData[0] || [];
      
      // Get data rows (excluding header)
      const dataRows = jsonData.slice(1);

      // Calculate dimensions
      const rowCount = dataRows.length;
      const columnCount = headers.length;

      totalRows += rowCount;
      if (columnCount > totalColumns) {
        totalColumns = columnCount;
      }

      // Convert to array of objects for easier manipulation
      const dataObjects = dataRows.map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header || `Column_${index + 1}`] = row[index] !== undefined ? row[index] : null;
        });
        return obj;
      });

      sheets[sheetName] = {
        headers,
        data: dataObjects,
        rawData: jsonData,
        rowCount,
        columnCount
      };
    });

    return {
      success: true,
      workbook: {
        sheetNames,
        sheetCount,
        totalRows,
        totalColumns
      },
      sheets,
      metadata: {
        parsedAt: new Date(),
        fileSize: fs.statSync(filePath).size
      }
    };
  } catch (error) {
    console.error('Excel parsing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get Excel File Info (without full parsing)
 * @param {string} filePath - Path to Excel file
 * @returns {object} Basic file information
 */
export const getExcelInfo = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath, { 
      bookSheets: true,
      bookProps: true 
    });

    return {
      success: true,
      sheetNames: workbook.SheetNames,
      sheetCount: workbook.SheetNames.length,
      properties: workbook.Props || {}
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Extract Specific Sheet Data
 * @param {string} filePath - Path to Excel file
 * @param {string} sheetName - Name of sheet to extract
 * @returns {object} Sheet data
 */
export const extractSheet = (filePath, sheetName) => {
  try {
    const workbook = xlsx.readFile(filePath);
    
    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      header: 1,
      raw: false,
      defval: null
    });

    const headers = jsonData[0] || [];
    const dataRows = jsonData.slice(1);

    const dataObjects = dataRows.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header || `Column_${index + 1}`] = row[index] !== undefined ? row[index] : null;
      });
      return obj;
    });

    return {
      success: true,
      sheetName,
      headers,
      data: dataObjects,
      rowCount: dataRows.length,
      columnCount: headers.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Detect Data Types in Column
 * @param {array} columnData - Array of column values
 * @returns {string} Detected data type
 */
export const detectColumnType = (columnData) => {
  const validData = columnData.filter(val => val !== null && val !== '');
  
  if (validData.length === 0) return 'empty';

  const numericCount = validData.filter(val => !isNaN(parseFloat(val))).length;
  const dateCount = validData.filter(val => !isNaN(Date.parse(val))).length;
  
  const numericRatio = numericCount / validData.length;
  const dateRatio = dateCount / validData.length;

  if (numericRatio > 0.8) return 'numeric';
  if (dateRatio > 0.8) return 'date';
  return 'text';
};

/**
 * Get Column Statistics
 * @param {array} columnData - Array of column values
 * @returns {object} Statistical information
 */
export const getColumnStats = (columnData) => {
  const validData = columnData.filter(val => val !== null && val !== '');
  const numericData = validData.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));

  if (numericData.length === 0) {
    return {
      type: 'non-numeric',
      count: validData.length,
      unique: new Set(validData).size
    };
  }

  const sorted = numericData.sort((a, b) => a - b);
  const sum = numericData.reduce((acc, val) => acc + val, 0);
  const mean = sum / numericData.length;

  return {
    type: 'numeric',
    count: numericData.length,
    min: Math.min(...numericData),
    max: Math.max(...numericData),
    mean: mean,
    median: sorted[Math.floor(sorted.length / 2)],
    sum: sum
  };
};