// Preprocessing-related types

export interface PreprocessingOptions {
  missingValueStrategy: 'interpolate' | 'forward-fill' | 'drop';
  resampleFrequency?: 'daily' | 'weekly' | 'monthly';
  outlierDetection?: boolean;
  smoothing?: {
    enabled: boolean;
    windowSize: number;
  };
}

export interface DataQualityReport {
  totalPoints: number;
  missingValues: number;
  duplicateTimestamps: number;
  outliers: number[];
  irregularIntervals: boolean;
  recommendations: string[];
}