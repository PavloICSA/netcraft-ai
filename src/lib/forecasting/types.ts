// Core types for time series forecasting

export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
}

export interface TimeSeriesData {
  timestamps: Date[];
  values: number[];
  metadata: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'irregular';
    hasGaps: boolean;
    totalPoints: number;
  };
}

export interface ForecastConfig {
  method: 'moving-average' | 'exponential-smoothing' | 'linear-trend';
  parameters: {
    // Moving Average
    windowSize?: number;
    
    // Exponential Smoothing
    alpha?: number;
    beta?: number;
    gamma?: number;
    seasonalPeriods?: number;
    
    // Linear Trend
    polynomialDegree?: number;
  };
  forecastHorizon: number;
  trainTestSplit: number;
  confidenceLevel: number;
}

export interface ForecastResult {
  method: string;
  fittedValues: number[];
  predictions: number[];
  confidenceIntervals: {
    lower: number[];
    upper: number[];
  };
  metrics: {
    mae: number;
    rmse: number;
    mape: number;
    r2?: number;
  };
  timestamps: {
    historical: Date[];
    forecast: Date[];
  };
}

export interface ForecastModel {
  config: ForecastConfig;
  result: ForecastResult;
  trained: boolean;
  trainingData: TimeSeriesData;
  createdAt: Date;
}