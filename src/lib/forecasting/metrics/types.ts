// Metrics-related types

export interface ForecastMetrics {
  mae: number;  // Mean Absolute Error
  rmse: number; // Root Mean Square Error
  mape: number; // Mean Absolute Percentage Error
  r2?: number;  // R-squared (for regression-like forecasts)
}

export interface MetricCalculationOptions {
  excludeZeros?: boolean; // For MAPE calculation
  absoluteValues?: boolean;
  weightedByRecency?: boolean;
}