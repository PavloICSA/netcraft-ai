import { BaseForecaster } from '../base-forecaster';
import { TimeSeriesData, ForecastResult, ForecastConfig } from '../types';
import { calculateAllMetrics } from '../metrics/forecast-metrics';

/**
 * Linear Trend Forecaster
 * 
 * Implements linear regression to fit a trend line to time series data
 * and extrapolate future values based on the fitted trend.
 */
export class LinearTrendForecaster extends BaseForecaster {
  private slope: number = 0;
  private intercept: number = 0;
  private fittedValues: number[] = [];

  getMethodName(): string {
    return 'linear-trend';
  }

  fit(data: TimeSeriesData, config: ForecastConfig): void {
    this.validateData(data);
    this.validateConfig(config);

    if (config.method !== 'linear-trend') {
      throw new Error('Invalid method for LinearTrendForecaster');
    }

    this.trainingData = data;
    this.config = config;

    // Perform linear regression
    this.calculateLinearRegression();
    
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

    // Generate predictions by extrapolating the linear trend
    const dataLength = this.trainingData.values.length;
    
    for (let i = 1; i <= horizon; i++) {
      const futureIndex = dataLength + i - 1; // Continue the index sequence
      const prediction = this.slope * futureIndex + this.intercept;
      predictions.push(prediction);
      
      // Generate future timestamps
      const lastTimestamp = timestamps[timestamps.length - 1];
      const nextTimestamp = new Date(lastTimestamp);
      nextTimestamp.setDate(nextTimestamp.getDate() + i);
      forecastTimestamps.push(nextTimestamp);
    }

    // Calculate confidence intervals
    const confidenceIntervals = this.calculateConfidenceIntervals(predictions, horizon);

    // Calculate metrics
    const metrics = this.calculateMetrics();

    return {
      method: this.getMethodName(),
      fittedValues: [...this.fittedValues],
      predictions,
      confidenceIntervals,
      metrics,
      timestamps: {
        historical: [...timestamps],
        forecast: forecastTimestamps
      }
    };
  }

  private calculateLinearRegression(): void {
    const values = this.trainingData!.values;
    const n = values.length;

    // Create x values as indices (0, 1, 2, ...)
    const xValues = Array.from({ length: n }, (_, i) => i);

    // Calculate means
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const yMean = values.reduce((sum, y) => sum + y, 0) / n;

    // Calculate slope using least squares formula
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (xValues[i] - xMean) * (values[i] - yMean);
      denominator += Math.pow(xValues[i] - xMean, 2);
    }

    if (denominator === 0) {
      // All x values are the same (shouldn't happen with indices)
      this.slope = 0;
      this.intercept = yMean;
    } else {
      this.slope = numerator / denominator;
      this.intercept = yMean - this.slope * xMean;
    }

    // Calculate fitted values
    this.fittedValues = xValues.map(x => this.slope * x + this.intercept);
  } 
 private calculateConfidenceIntervals(
    predictions: number[], 
    horizon: number
  ): { lower: number[]; upper: number[] } {
    if (!this.trainingData || !this.config) {
      throw new Error('Training data and config required for confidence intervals');
    }

    const values = this.trainingData.values;
    const n = values.length;

    // Calculate residuals
    const residuals = values.map((actual, i) => actual - this.fittedValues[i]);

    // Calculate residual standard error
    const sumSquaredResiduals = residuals.reduce((sum, r) => sum + r * r, 0);
    const residualStandardError = Math.sqrt(sumSquaredResiduals / (n - 2)); // n-2 degrees of freedom

    // Calculate standard error of prediction
    const xValues = Array.from({ length: n }, (_, i) => i);
    const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
    const sumSquaredDeviations = xValues.reduce((sum, x) => sum + Math.pow(x - xMean, 2), 0);

    const confidenceLevel = this.config.confidenceLevel;
    const tScore = this.getTScore(confidenceLevel, n - 2);

    const lower: number[] = [];
    const upper: number[] = [];

    for (let i = 0; i < horizon; i++) {
      const futureX = n + i; // Future x value
      
      // Standard error increases with distance from mean and for extrapolation
      const standardError = residualStandardError * Math.sqrt(
        1 + 1/n + Math.pow(futureX - xMean, 2) / sumSquaredDeviations
      );
      
      const marginOfError = Math.max(tScore * standardError, 0.1); // Ensure minimum interval width
      
      lower.push(predictions[i] - marginOfError);
      upper.push(predictions[i] + marginOfError);
    }

    return { lower, upper };
  }

  private calculateMetrics(): { mae: number; rmse: number; mape: number; r2: number } {
    if (!this.trainingData) {
      throw new Error('Training data required for metrics calculation');
    }

    const values = this.trainingData.values;
    const fitted = this.fittedValues;
    const n = values.length;

    // Use centralized metrics calculation
    const metrics = calculateAllMetrics(values, fitted);

    // R-squared (coefficient of determination)
    const actualMean = values.reduce((sum, v) => sum + v, 0) / n;
    const totalSumSquares = values.reduce((sum, v) => sum + Math.pow(v - actualMean, 2), 0);
    const residualSumSquares = values.reduce((sum, actual, i) => {
      return sum + Math.pow(actual - fitted[i], 2);
    }, 0);
    
    const r2 = totalSumSquares === 0 ? 1 : 1 - (residualSumSquares / totalSumSquares);

    return { ...metrics, r2 };
  }

  private getTScore(confidenceLevel: number, degreesOfFreedom: number): number {
    // Approximate t-scores for common confidence levels and reasonable df
    // For simplicity, using z-scores as approximation for df > 30
    if (degreesOfFreedom > 30) {
      return this.getZScore(confidenceLevel);
    }

    // Simplified t-table for small degrees of freedom
    const tTable: { [key: number]: { [key: number]: number } } = {
      1: { 0.80: 3.078, 0.90: 6.314, 0.95: 12.706, 0.99: 63.657 },
      2: { 0.80: 1.886, 0.90: 2.920, 0.95: 4.303, 0.99: 9.925 },
      3: { 0.80: 1.638, 0.90: 2.353, 0.95: 3.182, 0.99: 5.841 },
      4: { 0.80: 1.533, 0.90: 2.132, 0.95: 2.776, 0.99: 4.604 },
      5: { 0.80: 1.476, 0.90: 2.015, 0.95: 2.571, 0.99: 4.032 },
      10: { 0.80: 1.372, 0.90: 1.812, 0.95: 2.228, 0.99: 3.169 },
      20: { 0.80: 1.325, 0.90: 1.725, 0.95: 2.086, 0.99: 2.845 },
      30: { 0.80: 1.310, 0.90: 1.697, 0.95: 2.042, 0.99: 2.750 }
    };

    // Find closest degrees of freedom
    const availableDf = Object.keys(tTable).map(Number).sort((a, b) => a - b);
    let closestDf = availableDf[0];
    
    for (const df of availableDf) {
      if (Math.abs(df - degreesOfFreedom) < Math.abs(closestDf - degreesOfFreedom)) {
        closestDf = df;
      }
    }

    // Find closest confidence level
    const availableLevels = Object.keys(tTable[closestDf]).map(Number);
    let closestLevel = availableLevels[0];
    
    for (const level of availableLevels) {
      if (Math.abs(level - confidenceLevel) < Math.abs(closestLevel - confidenceLevel)) {
        closestLevel = level;
      }
    }

    return tTable[closestDf][closestLevel];
  }

  private getZScore(confidenceLevel: number): number {
    // Approximate z-scores for common confidence levels
    if (confidenceLevel >= 0.99) return 2.576;
    if (confidenceLevel >= 0.95) return 1.96;
    if (confidenceLevel >= 0.90) return 1.645;
    if (confidenceLevel >= 0.80) return 1.282;
    return 1.96; // Default to 95% confidence
  }

  /**
   * Get the slope of the fitted linear trend
   */
  public getSlope(): number {
    return this.slope;
  }

  /**
   * Get the intercept of the fitted linear trend
   */
  public getIntercept(): number {
    return this.intercept;
  }
}