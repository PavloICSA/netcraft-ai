import { BaseForecaster } from '../base-forecaster';
import { TimeSeriesData, ForecastResult, ForecastConfig } from '../types';
import { calculateAllMetrics } from '../metrics/forecast-metrics';

/**
 * Exponential Smoothing Forecaster
 * 
 * Implements simple and double exponential smoothing algorithms.
 * Simple exponential smoothing for data without trend.
 * Double exponential smoothing (Holt's method) for data with trend.
 */
export class ExponentialSmoothingForecaster extends BaseForecaster {
  private alpha: number = 0.3;  // Smoothing parameter for level
  private beta?: number;        // Smoothing parameter for trend (optional)
  private smoothedValues: number[] = [];
  private trendValues: number[] = [];
  private hastrend: boolean = false;

  getMethodName(): string {
    return 'exponential-smoothing';
  }

  fit(data: TimeSeriesData, config: ForecastConfig): void {
    this.validateData(data);
    this.validateConfig(config);

    if (config.method !== 'exponential-smoothing') {
      throw new Error('Invalid method for ExponentialSmoothingForecaster');
    }

    // Set parameters from config
    this.alpha = config.parameters.alpha ?? 0.3;
    this.beta = config.parameters.beta;
    
    if (this.alpha <= 0 || this.alpha >= 1) {
      throw new Error('Alpha must be between 0 and 1 (exclusive)');
    }

    if (this.beta !== undefined) {
      if (this.beta <= 0 || this.beta >= 1) {
        throw new Error('Beta must be between 0 and 1 (exclusive)');
      }
      this.hastrend = true;
    } else {
      this.hastrend = false;
    }

    this.trainingData = data;
    this.config = config;

    // Calculate smoothed values
    if (this.hastrend) {
      this.calculateDoubleExponentialSmoothing();
    } else {
      this.calculateSimpleExponentialSmoothing();
    }
    
    this.trained = true;
  }

  predict(horizon: number): ForecastResult {
    if (!this.trained || !this.trainingData || !this.config) {
      throw new Error('Model must be trained before making predictions');
    }

    if (horizon <= 0) {
      throw new Error('Forecast horizon must be positive');
    }

    const timestamps = this.trainingData.timestamps;
    const predictions: number[] = [];
    const forecastTimestamps: Date[] = [];

    // Generate predictions based on the method used
    if (this.hastrend) {
      this.generateTrendPredictions(horizon, predictions);
    } else {
      this.generateSimplePredictions(horizon, predictions);
    }

    // Generate future timestamps
    for (let i = 0; i < horizon; i++) {
      const lastTimestamp = timestamps[timestamps.length - 1];
      const nextTimestamp = new Date(lastTimestamp);
      nextTimestamp.setDate(nextTimestamp.getDate() + i + 1);
      forecastTimestamps.push(nextTimestamp);
    }

    // Calculate confidence intervals
    const confidenceIntervals = this.calculateConfidenceIntervals(predictions);

    // Calculate metrics
    const metrics = this.calculateMetrics();

    return {
      method: this.getMethodName(),
      fittedValues: [...this.smoothedValues],
      predictions,
      confidenceIntervals,
      metrics,
      timestamps: {
        historical: [...timestamps],
        forecast: forecastTimestamps
      }
    };
  }

  private calculateSimpleExponentialSmoothing(): void {
    const values = this.trainingData!.values;
    this.smoothedValues = [];

    // Initialize with first value
    let smoothedValue = values[0];
    this.smoothedValues.push(smoothedValue);

    // Apply exponential smoothing formula: S_t = α * X_t + (1-α) * S_{t-1}
    for (let i = 1; i < values.length; i++) {
      smoothedValue = this.alpha * values[i] + (1 - this.alpha) * smoothedValue;
      this.smoothedValues.push(smoothedValue);
    }
  }

  private calculateDoubleExponentialSmoothing(): void {
    const values = this.trainingData!.values;
    this.smoothedValues = [];
    this.trendValues = [];

    if (values.length < 2) {
      throw new Error('Double exponential smoothing requires at least 2 data points');
    }

    // Initialize level and trend
    let level = values[0];
    let trend = values[1] - values[0];
    
    this.smoothedValues.push(level);
    this.trendValues.push(trend);

    // Apply Holt's double exponential smoothing
    for (let i = 1; i < values.length; i++) {
      const previousLevel = level;
      const previousTrend = trend;

      // Update level: L_t = α * X_t + (1-α) * (L_{t-1} + T_{t-1})
      level = this.alpha * values[i] + (1 - this.alpha) * (previousLevel + previousTrend);
      
      // Update trend: T_t = β * (L_t - L_{t-1}) + (1-β) * T_{t-1}
      trend = this.beta! * (level - previousLevel) + (1 - this.beta!) * previousTrend;

      this.smoothedValues.push(level);
      this.trendValues.push(trend);
    }
  }

  private generateSimplePredictions(horizon: number, predictions: number[]): void {
    // For simple exponential smoothing, all future predictions are the last smoothed value
    const lastSmoothedValue = this.smoothedValues[this.smoothedValues.length - 1];
    
    for (let i = 0; i < horizon; i++) {
      predictions.push(lastSmoothedValue);
    }
  }

  private generateTrendPredictions(horizon: number, predictions: number[]): void {
    // For double exponential smoothing, extrapolate using level and trend
    const lastLevel = this.smoothedValues[this.smoothedValues.length - 1];
    const lastTrend = this.trendValues[this.trendValues.length - 1];
    
    for (let i = 1; i <= horizon; i++) {
      const prediction = lastLevel + i * lastTrend;
      predictions.push(prediction);
    }
  }

  private calculateConfidenceIntervals(predictions: number[]): { lower: number[]; upper: number[] } {
    if (!this.trainingData || !this.config) {
      throw new Error('Training data and config required for confidence intervals');
    }

    // Calculate residuals
    const values = this.trainingData.values;
    const residuals: number[] = [];

    for (let i = 1; i < values.length; i++) {
      residuals.push(values[i] - this.smoothedValues[i]);
    }

    // Calculate standard deviation of residuals
    const meanResidual = residuals.reduce((sum, r) => sum + r, 0) / residuals.length;
    const variance = residuals.reduce((sum, r) => sum + Math.pow(r - meanResidual, 2), 0) / residuals.length;
    const stdDev = Math.sqrt(variance);

    // Use confidence level to determine interval width
    const confidenceLevel = this.config.confidenceLevel;
    const zScore = this.getZScore(confidenceLevel);
    
    // For exponential smoothing, prediction intervals widen over time
    const lower: number[] = [];
    const upper: number[] = [];

    for (let i = 0; i < predictions.length; i++) {
      // Interval width increases with forecast horizon
      const intervalWidth = Math.max(zScore * stdDev * Math.sqrt(i + 1), 0.1);
      lower.push(predictions[i] - intervalWidth);
      upper.push(predictions[i] + intervalWidth);
    }

    return { lower, upper };
  }

  private calculateMetrics(): { mae: number; rmse: number; mape: number; r2?: number } {
    if (!this.trainingData) {
      throw new Error('Training data required for metrics calculation');
    }

    const values = this.trainingData.values;
    const fitted = this.smoothedValues;

    // Calculate one-step-ahead forecast errors (skip first value for simple smoothing)
    const actualValues: number[] = [];
    const fittedValues: number[] = [];

    for (let i = 1; i < values.length; i++) {
      actualValues.push(values[i]);
      fittedValues.push(fitted[i - 1]); // Use previous smoothed value as forecast
    }

    if (actualValues.length === 0) {
      return { mae: 0, rmse: 0, mape: 0 };
    }

    // Use centralized metrics calculation
    const metrics = calculateAllMetrics(actualValues, fittedValues);

    // R-squared
    const actualMean = actualValues.reduce((sum, v) => sum + v, 0) / actualValues.length;
    const totalSumSquares = actualValues.reduce((sum, v) => sum + Math.pow(v - actualMean, 2), 0);
    const residualSumSquares = actualValues.reduce((sum, actual, i) => {
      return sum + Math.pow(actual - fittedValues[i], 2);
    }, 0);
    
    const r2 = totalSumSquares === 0 ? 1 : 1 - (residualSumSquares / totalSumSquares);

    return { ...metrics, r2 };
  }

  private getZScore(confidenceLevel: number): number {
    // Approximate z-scores for common confidence levels
    if (confidenceLevel >= 0.99) return 2.576;
    if (confidenceLevel >= 0.95) return 1.96;
    if (confidenceLevel >= 0.90) return 1.645;
    if (confidenceLevel >= 0.80) return 1.282;
    return 1.96; // Default to 95% confidence
  }
}