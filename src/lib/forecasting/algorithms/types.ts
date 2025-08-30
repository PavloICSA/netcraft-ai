// Algorithm-specific types and interfaces

export interface AlgorithmParameters {
  // Moving Average parameters
  windowSize?: number;
  
  // Exponential Smoothing parameters
  alpha?: number;
  beta?: number;
  gamma?: number;
  seasonalPeriods?: number;
  
  // Linear Trend parameters
  polynomialDegree?: number;
}

export interface AlgorithmValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}