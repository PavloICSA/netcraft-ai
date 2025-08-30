import { BaseForecaster } from '../base-forecaster';
import { TimeSeriesData, ForecastResult, ForecastConfig } from '../types';
import { calculateAllMetrics } from '../metrics/forecast-metrics';

/**
 * Simple Moving Average Forecaster
 * 
 * Implements a simple moving average forecasting algorithm that uses
 * the average of the last N values to predict future values.
 */
export class MovingAverageForecaster extends BaseForecaster {
  private windowSize: number = 3;
  private movingAverages: number[] = [];

  getMethodName(): string {
    return 'moving-average';
  }

  fit(data: TimeSeriesData, config: ForecastConfig): void {
    this.validateData(data);
    this.validateConfig(config);

    if (config.method !== 'moving-average') {
      throw new Error('Invalid method for MovingAverageForecaster');
    }

    // Set window size from config or use default
    this.windowSize = config.parameters.windowSize ?? 3;
    
    if (this.windowSize <= 0) {
      throw new Error('Window size must be positive');
    }

    if (this.windowSize > data.values.length) {
      throw new Error(`Window size (${this.windowSize}) cannot be larger than data length (${data.values.length})`);
    }

    this.trainingData = data;
    this.config = config;

    // Calculate moving averages for the training data
    this.calculateMovingAverages();
    
    this.trained = true;
  }

  predict(horizon: number): ForecastResult {
    if (!this.trained || !this.trainingData || !this.config) {
      throw new Error('Model must be trained before making predictions');
    }

    if (horizon <= 0) {
      throw new Error('Forecast horizon must be positive');
    }

    const values = this.trainingData.values;
    const timestamps = this.trainingData.timestamps;

    // Generate future predictions
    const predictions: number[] = [];
    const forecastTimestamps: Date[] = [];

    // Use the last moving average as the prediction for all future periods
    const lastMovingAverage = this.movingAverages[this.movingAverages.length - 1];
    
    for (let i = 0; i < horizon; i++) {
      predictions.push(lastMovingAverage);
      
      // Generate future timestamps (assuming daily frequency for now)
      const lastTimestamp = timestamps[timestamps.length - 1];
      const nextTimestamp = new Date(lastTimestamp);
      nextTimestamp.setDate(nextTimestamp.getDate() + i + 1);
      forecastTimestamps.push(nextTimestamp);
    }

    // Calculate confidence intervals based on historical variance
    const confidenceIntervals = this.calculateConfidenceIntervals(predictions);

    // Calculate metrics on fitted values vs actual values
    const metrics = this.calculateMetrics();

    return {
      method: this.getMethodName(),
      fittedValues: [...this.movingAverages],
      predictions,
      confidenceIntervals,
      metrics,
      timestamps: {
        historical: [...timestamps],
        forecast: forecastTimestamps
      }
    };
  }

  private calculateMovingAverages(): void {
    const values = this.trainingData!.values;
    this.movingAverages = [];

    // Calculate moving averages starting from the window size
    for (let i = this.windowSize - 1; i < values.length; i++) {
      let sum = 0;
      for (let j = i - this.windowSize + 1; j <= i; j++) {
        sum += values[j];
      }
      this.movingAverages.push(sum / this.windowSize);
    }
  }

  private calculateConfidenceIntervals(predictions: number[]): { lower: number[]; upper: number[] } {
    if (!this.trainingData || !this.config) {
      throw new Error('Training data and config required for confidence intervals');
    }

    // Calculate residuals from fitted values
    const values = this.trainingData.values;
    const residuals: number[] = [];

    // Calculate residuals for periods where we have moving averages
    for (let i = 0; i < this.movingAverages.length; i++) {
      const actualIndex = i + this.windowSize - 1;
      if (actualIndex < values.length) {
        residuals.push(values[actualIndex] - this.movingAverages[i]);
      }
    }

    // Calculate standard deviation of residuals
    const meanResidual = residuals.reduce((sum, r) => sum + r, 0) / residuals.length;
    const variance = residuals.reduce((sum, r) => sum + Math.pow(r - meanResidual, 2), 0) / residuals.length;
    const stdDev = Math.sqrt(variance);

    // Use confidence level to determine interval width
    const confidenceLevel = this.config.confidenceLevel;
    const zScore = this.getZScore(confidenceLevel);
    // Ensure minimum interval width to avoid zero-width intervals
    const intervalWidth = Math.max(zScore * stdDev, 0.1);

    const lower = predictions.map(pred => pred - intervalWidth);
    const upper = predictions.map(pred => pred + intervalWidth);

    return { lower, upper };
  }

  private calculateMetrics(): { mae: number; rmse: number; mape: number; r2?: number } {
    if (!this.trainingData) {
      throw new Error('Training data required for metrics calculation');
    }

    const values = this.trainingData.values;
    const fitted = this.movingAverages;

    // Calculate metrics only for periods where we have fitted values
    const actualValues: number[] = [];
    const fittedValues: number[] = [];

    for (let i = 0; i < fitted.length; i++) {
      const actualIndex = i + this.windowSize - 1;
      if (actualIndex < values.length) {
        actualValues.push(values[actualIndex]);
        fittedValues.push(fitted[i]);
      }
    }

    if (actualValues.length === 0) {
      return { mae: 0, rmse: 0, mape: 0 };
    }

    // Use centralized metrics calculation
    const metrics = calculateAllMetrics(actualValues, fittedValues);

    // Calculate R-squared
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