/**
 * CSV utility functions for data processing
 */

import type { TimeSeriesData } from '../../types';

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}

/**
 * Enhanced datetime validation with common format patterns
 */
export function isValidDateTime(value: any): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') return false;
  
  const str = String(value).trim();
  
  // Common datetime patterns
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,                    // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,  // ISO datetime
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,  // YYYY-MM-DD HH:MM:SS
    /^\d{2}\/\d{2}\/\d{4}$/,                 // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/,                   // MM-DD-YYYY
    /^\d{4}\/\d{2}\/\d{2}$/,                 // YYYY/MM/DD
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,             // M/D/YYYY
    /^\d{4}-\d{1,2}-\d{1,2}$/,               // YYYY-M-D
  ];
  
  // Check against patterns first for performance
  const matchesPattern = datePatterns.some(pattern => pattern.test(str));
  if (!matchesPattern && isNaN(Date.parse(str))) return false;
  
  // Validate that it's actually a valid date
  const date = new Date(str);
  return !isNaN(date.getTime()) && date.getFullYear() > 1900 && date.getFullYear() < 2100;
}

/**
 * Parse datetime values with enhanced format support
 */
export function parseDateTime(value: any): Date | null {
  if (!isValidDateTime(value)) return null;
  
  const str = String(value).trim();
  const date = new Date(str);
  
  return !isNaN(date.getTime()) ? date : null;
}

/**
 * Infer data type from array of values with enhanced datetime detection
 */
export function inferDataType(values: any[]): 'numeric' | 'categorical' | 'datetime' {
  const nonEmptyValues = values.filter(val => val !== null && val !== undefined && val !== '');

  if (nonEmptyValues.length === 0) return 'categorical';

  // Enhanced datetime detection with common patterns (check first to avoid numeric dates)
  const dateValues = nonEmptyValues.filter(val => isValidDateTime(val));
  if (dateValues.length >= nonEmptyValues.length * 0.75) {
    return 'datetime';
  }

  // Check if numeric (after datetime check)
  const numericValues = nonEmptyValues.filter(val => !isNaN(Number(val)) && val !== '');
  if (numericValues.length > nonEmptyValues.length * 0.8) {
    return 'numeric';
  }

  return 'categorical';
}

/**
 * Calculate basic statistics for numeric data
 */
export function calculateNumericStats(values: number[]) {
  if (values.length === 0) return null;

  const validValues = values.filter(val => !isNaN(val));
  if (validValues.length === 0) return null;

  const mean = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  const variance = validValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validValues.length;

  return {
    min: Math.min(...validValues),
    max: Math.max(...validValues),
    mean,
    std: Math.sqrt(variance),
    unique: new Set(validValues).size,
    nullCount: values.length - validValues.length
  };
}

/**
 * Normalize data using z-score normalization (standardization)
 */
export function normalizeData(data: number[][], stats?: { mean: number; std: number }[]): {
  normalizedData: number[][];
  normalizationStats: { mean: number; std: number }[];
} {
  if (data.length === 0) {
    return { normalizedData: [], normalizationStats: [] };
  }

  const numFeatures = data[0].length;
  const normalizationStats: { mean: number; std: number }[] = [];

  // Calculate stats if not provided
  if (!stats) {
    for (let featureIndex = 0; featureIndex < numFeatures; featureIndex++) {
      const featureValues = data.map(row => row[featureIndex]).filter(val => !isNaN(val));
      const mean = featureValues.reduce((sum, val) => sum + val, 0) / featureValues.length;
      const variance = featureValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / featureValues.length;
      const std = Math.sqrt(variance);

      normalizationStats.push({
        mean,
        std: std === 0 ? 1 : std // Prevent division by zero
      });
    }
  } else {
    normalizationStats.push(...stats);
  }

  // Normalize data
  const normalizedData = data.map(row =>
    row.map((value, featureIndex) => {
      if (isNaN(value)) return 0;
      const { mean, std } = normalizationStats[featureIndex];
      return (value - mean) / std;
    })
  );

  return { normalizedData, normalizationStats };
}

/**
 * Denormalize data using stored normalization stats
 */
export function denormalizeData(
  normalizedData: number[][],
  normalizationStats: { mean: number; std: number }[]
): number[][] {
  return normalizedData.map(row =>
    row.map((normalizedValue, featureIndex) => {
      const { mean, std } = normalizationStats[featureIndex];
      return normalizedValue * std + mean;
    })
  );
}

/**
 * Handle missing values in time series data
 */
export function handleMissingValues(
  values: (number | null | undefined)[],
  method: 'forward-fill' | 'drop' = 'forward-fill'
): { values: number[]; removedIndices: number[] } {
  const removedIndices: number[] = [];
  
  if (method === 'drop') {
    const cleanValues: number[] = [];
    values.forEach((value, index) => {
      if (value !== null && value !== undefined && !isNaN(value)) {
        cleanValues.push(value);
      } else {
        removedIndices.push(index);
      }
    });
    return { values: cleanValues, removedIndices };
  }
  
  // Forward fill method
  const filledValues: number[] = [];
  let lastValidValue: number | null = null;
  
  values.forEach((value, index) => {
    if (value !== null && value !== undefined && !isNaN(value)) {
      lastValidValue = value;
      filledValues.push(value);
    } else if (lastValidValue !== null) {
      filledValues.push(lastValidValue);
    } else {
      // If no previous valid value, use 0 or mark for removal
      removedIndices.push(index);
      filledValues.push(0);
    }
  });
  
  return { values: filledValues, removedIndices };
}

/**
 * Handle missing timestamps in time series data
 */
export function handleMissingTimestamps(
  timestamps: (Date | null | undefined)[],
  values: (number | null | undefined)[],
  method: 'drop' = 'drop'
): { timestamps: Date[]; values: number[]; removedIndices: number[] } {
  const removedIndices: number[] = [];
  const cleanTimestamps: Date[] = [];
  const cleanValues: number[] = [];
  
  timestamps.forEach((timestamp, index) => {
    const value = values[index];
    
    if (timestamp && !isNaN(timestamp.getTime()) && 
        value !== null && value !== undefined && !isNaN(value)) {
      cleanTimestamps.push(timestamp);
      cleanValues.push(value);
    } else {
      removedIndices.push(index);
    }
  });
  
  return { timestamps: cleanTimestamps, values: cleanValues, removedIndices };
}

/**
 * Detect time series frequency from timestamps
 */
export function detectTimeSeriesFrequency(timestamps: Date[]): 'daily' | 'weekly' | 'monthly' | 'irregular' {
  if (timestamps.length < 2) return 'irregular';
  
  // Sort timestamps to ensure chronological order
  const sortedTimestamps = [...timestamps].sort((a, b) => a.getTime() - b.getTime());
  
  // Calculate intervals in milliseconds
  const intervals: number[] = [];
  for (let i = 1; i < sortedTimestamps.length; i++) {
    intervals.push(sortedTimestamps[i].getTime() - sortedTimestamps[i - 1].getTime());
  }
  
  // Common intervals in milliseconds
  const DAY_MS = 24 * 60 * 60 * 1000;
  const WEEK_MS = 7 * DAY_MS;
  const MONTH_MS = 30 * DAY_MS; // Approximate
  
  // Calculate most common interval (with tolerance)
  const tolerance = 0.1; // 10% tolerance
  
  const dailyCount = intervals.filter(interval => 
    Math.abs(interval - DAY_MS) / DAY_MS < tolerance
  ).length;
  
  const weeklyCount = intervals.filter(interval => 
    Math.abs(interval - WEEK_MS) / WEEK_MS < tolerance
  ).length;
  
  const monthlyCount = intervals.filter(interval => 
    Math.abs(interval - MONTH_MS) / MONTH_MS < tolerance
  ).length;
  
  const totalIntervals = intervals.length;
  const threshold = 0.7; // 70% of intervals should match
  
  if (dailyCount / totalIntervals > threshold) return 'daily';
  if (weeklyCount / totalIntervals > threshold) return 'weekly';
  if (monthlyCount / totalIntervals > threshold) return 'monthly';
  
  return 'irregular';
}

/**
 * Convert raw data to TimeSeriesData format
 */
export function createTimeSeriesData(
  timestamps: Date[],
  values: (number | null | undefined)[],
  options: {
    handleMissing?: 'forward-fill' | 'drop';
  } = {}
): TimeSeriesData {
  const { handleMissing = 'forward-fill' } = options;
  
  // Handle missing values first, then align with timestamps
  const { values: processedValues } = handleMissingValues(values, handleMissing);
  
  // Only keep valid timestamps and corresponding values
  const cleanTimestamps: Date[] = [];
  const cleanValues: number[] = [];
  
  timestamps.forEach((timestamp, index) => {
    if (timestamp && !isNaN(timestamp.getTime()) && index < processedValues.length) {
      cleanTimestamps.push(timestamp);
      cleanValues.push(processedValues[index]);
    }
  });
  
  // Detect frequency
  const frequency = detectTimeSeriesFrequency(cleanTimestamps);
  
  // Check for gaps
  const hasGaps = cleanTimestamps.length < timestamps.length || 
                  values.some(v => v === null || v === undefined || isNaN(Number(v)));
  
  return {
    timestamps: cleanTimestamps,
    values: cleanValues,
    metadata: {
      frequency,
      hasGaps,
      totalPoints: cleanTimestamps.length
    }
  };
}

