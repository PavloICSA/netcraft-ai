// Base interface and abstract class for all forecasting algorithms

import { TimeSeriesData, ForecastResult, ForecastConfig } from './types';

export interface IForecaster {
  /**
   * Fit the forecasting model to historical data
   * @param data Time series data for training
   * @param config Configuration parameters for the forecasting method
   */
  fit(data: TimeSeriesData, config: ForecastConfig): void;

  /**
   * Generate predictions for future time periods
   * @param horizon Number of periods to forecast into the future
   * @returns Forecast results including predictions and confidence intervals
   */
  predict(horizon: number): ForecastResult;

  /**
   * Check if the model has been trained
   * @returns True if the model is ready for predictions
   */
  isTrained(): boolean;

  /**
   * Get the name/type of the forecasting method
   * @returns String identifier for the forecasting method
   */
  getMethodName(): string;
}

export abstract class BaseForecaster implements IForecaster {
  protected trainingData: TimeSeriesData | null = null;
  protected config: ForecastConfig | null = null;
  protected trained: boolean = false;

  abstract fit(data: TimeSeriesData, config: ForecastConfig): void;
  abstract predict(horizon: number): ForecastResult;
  abstract getMethodName(): string;

  isTrained(): boolean {
    return this.trained;
  }

  protected validateData(data: TimeSeriesData): void {
    if (!data || !data.values || !data.timestamps) {
      throw new Error('Invalid time series data: missing values or timestamps');
    }

    if (data.values.length !== data.timestamps.length) {
      throw new Error('Time series data: values and timestamps must have the same length');
    }

    if (data.values.length < 2) {
      throw new Error('Time series data: minimum 2 data points required');
    }

    // Check for NaN values
    if (data.values.some(value => isNaN(value))) {
      throw new Error('Time series data: contains NaN values');
    }
  }

  protected validateConfig(config: ForecastConfig): void {
    if (!config) {
      throw new Error('Forecast configuration is required');
    }

    if (config.forecastHorizon <= 0) {
      throw new Error('Forecast horizon must be positive');
    }

    if (config.trainTestSplit < 0 || config.trainTestSplit > 1) {
      throw new Error('Train/test split must be between 0 and 1');
    }

    if (config.confidenceLevel < 0 || config.confidenceLevel > 1) {
      throw new Error('Confidence level must be between 0 and 1');
    }
  }
}