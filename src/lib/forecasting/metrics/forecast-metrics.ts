/**
 * Forecast accuracy metrics implementation
 * Provides MAE, RMSE, and MAPE calculations for time series forecasting evaluation
 */

export interface ForecastMetrics {
  mae: number;  // Mean Absolute Error
  rmse: number; // Root Mean Square Error
  mape: number; // Mean Absolute Percentage Error
}

/**
 * Calculate Mean Absolute Error (MAE)
 * MAE = (1/n) * Σ|actual - predicted|
 */
export function calculateMAE(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length) {
    throw new Error('Actual and predicted arrays must have the same length');
  }
  
  if (actual.length === 0) {
    throw new Error('Arrays cannot be empty');
  }

  const sumAbsoluteErrors = actual.reduce((sum, actualValue, index) => {
    return sum + Math.abs(actualValue - predicted[index]);
  }, 0);

  return sumAbsoluteErrors / actual.length;
}

/**
 * Calculate Root Mean Square Error (RMSE)
 * RMSE = √((1/n) * Σ(actual - predicted)²)
 */
export function calculateRMSE(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length) {
    throw new Error('Actual and predicted arrays must have the same length');
  }
  
  if (actual.length === 0) {
    throw new Error('Arrays cannot be empty');
  }

  const sumSquaredErrors = actual.reduce((sum, actualValue, index) => {
    const error = actualValue - predicted[index];
    return sum + (error * error);
  }, 0);

  const meanSquaredError = sumSquaredErrors / actual.length;
  return Math.sqrt(meanSquaredError);
}

/**
 * Calculate Mean Absolute Percentage Error (MAPE)
 * MAPE = (100/n) * Σ|(actual - predicted) / actual|
 * Note: Returns NaN if any actual values are zero
 */
export function calculateMAPE(actual: number[], predicted: number[]): number {
  if (actual.length !== predicted.length) {
    throw new Error('Actual and predicted arrays must have the same length');
  }
  
  if (actual.length === 0) {
    throw new Error('Arrays cannot be empty');
  }

  // Check for zero values in actual data
  const hasZeroValues = actual.some(value => value === 0);
  if (hasZeroValues) {
    return NaN; // MAPE is undefined when actual values contain zeros
  }

  const sumPercentageErrors = actual.reduce((sum, actualValue, index) => {
    const percentageError = Math.abs((actualValue - predicted[index]) / actualValue);
    return sum + percentageError;
  }, 0);

  return (sumPercentageErrors / actual.length) * 100;
}

/**
 * Calculate all forecast metrics at once
 */
export function calculateAllMetrics(actual: number[], predicted: number[]): ForecastMetrics {
  return {
    mae: calculateMAE(actual, predicted),
    rmse: calculateRMSE(actual, predicted),
    mape: calculateMAPE(actual, predicted)
  };
}

/**
 * Format metrics for display with appropriate precision
 */
export function formatMetrics(metrics: ForecastMetrics): Record<string, string> {
  return {
    MAE: metrics.mae.toFixed(4),
    RMSE: metrics.rmse.toFixed(4),
    MAPE: isNaN(metrics.mape) ? 'N/A' : `${metrics.mape.toFixed(2)}%`
  };
}