// Export all forecasting algorithms

export { MovingAverageForecaster } from './moving-average';
export { ExponentialSmoothingForecaster } from './exponential-smoothing';
export { LinearTrendForecaster } from './linear-trend';

// Re-export base classes and interfaces
export { BaseForecaster } from '../base-forecaster';
export type { IForecaster } from '../base-forecaster';
export * from '../types';