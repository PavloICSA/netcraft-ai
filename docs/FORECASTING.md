# Time Series Forecasting Guide

NetCraft AI provides comprehensive time series forecasting capabilities with multiple algorithms, automatic preprocessing, and detailed evaluation metrics.

## Overview

Time series forecasting in NetCraft AI supports:
- **Multiple algorithms**: Moving Average, Exponential Smoothing, Linear Trend
- **Automatic preprocessing**: Frequency detection, missing value handling
- **Comprehensive metrics**: MAE, RMSE, MAPE, R²
- **Confidence intervals**: Uncertainty quantification for predictions
- **Interactive visualization**: Historical data and forecast plots

## Supported Algorithms

### Moving Average

Simple moving average forecasting that uses the average of the last N values to predict future values.

**Best for:**
- Data with no clear trend or seasonality
- Short-term forecasting
- Smoothing noisy data

**Parameters:**
- `windowSize`: Number of historical points to average (default: 3)

**Example:**
```typescript
const config: ForecastConfig = {
  method: 'moving-average',
  parameters: { windowSize: 5 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};
```

### Exponential Smoothing

Weighted average forecasting that gives more weight to recent observations.

**Variants:**
- **Simple Exponential Smoothing**: For data without trend
- **Double Exponential Smoothing (Holt's method)**: For data with trend

**Best for:**
- Data with trend but no seasonality
- Medium-term forecasting
- Adaptive forecasting that responds to recent changes

**Parameters:**
- `alpha`: Smoothing parameter for level (0 < α < 1, default: 0.3)
- `beta`: Smoothing parameter for trend (0 < β < 1, optional)

**Examples:**
```typescript
// Simple exponential smoothing
const simpleConfig: ForecastConfig = {
  method: 'exponential-smoothing',
  parameters: { alpha: 0.3 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};

// Double exponential smoothing (with trend)
const doubleConfig: ForecastConfig = {
  method: 'exponential-smoothing',
  parameters: { alpha: 0.3, beta: 0.2 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};
```

### Linear Trend

Linear regression-based forecasting that fits a trend line to the data.

**Best for:**
- Data with clear linear trend
- Long-term forecasting
- Understanding underlying growth patterns

**Parameters:**
- `polynomialDegree`: Degree of polynomial fit (default: 1 for linear)

**Example:**
```typescript
const config: ForecastConfig = {
  method: 'linear-trend',
  parameters: { polynomialDegree: 1 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};
```

## Data Requirements

### Time Series Format

Time series data must include:
- **Timestamps**: Date/time values in chronological order
- **Values**: Numeric values corresponding to each timestamp

**Supported timestamp formats:**
- ISO 8601: `2023-01-01T10:30:00`
- Date only: `2023-01-01`
- US format: `01/15/2023`
- Custom formats with automatic detection

### Data Quality

**Requirements:**
- Minimum 2 data points (recommended: 20+ for reliable forecasting)
- Numeric values only (no missing values in target column)
- Chronologically ordered timestamps

**Automatic handling:**
- Missing timestamp detection and removal
- Frequency detection (daily, weekly, monthly, irregular)
- Data validation and error reporting

## Evaluation Metrics

### Mean Absolute Error (MAE)

Average of absolute differences between actual and predicted values.

**Formula:** `MAE = (1/n) * Σ|actual - predicted|`

**Interpretation:**
- Lower values indicate better accuracy
- Same units as the original data
- Robust to outliers

### Root Mean Square Error (RMSE)

Square root of the average squared differences.

**Formula:** `RMSE = √((1/n) * Σ(actual - predicted)²)`

**Interpretation:**
- Lower values indicate better accuracy
- Penalizes larger errors more than MAE
- Same units as the original data

### Mean Absolute Percentage Error (MAPE)

Average of absolute percentage errors.

**Formula:** `MAPE = (100/n) * Σ|(actual - predicted) / actual|`

**Interpretation:**
- Expressed as percentage
- Scale-independent metric
- Returns NaN if actual values contain zeros

### R-squared (R²)

Coefficient of determination indicating explained variance.

**Formula:** `R² = 1 - (SS_res / SS_tot)`

**Interpretation:**
- Values between 0 and 1 (higher is better)
- 1.0 indicates perfect fit
- Negative values indicate worse than naive mean prediction

## Confidence Intervals

All forecasting algorithms provide confidence intervals to quantify prediction uncertainty.

### Calculation Methods

**Moving Average:**
- Based on historical residual variance
- Constant width intervals

**Exponential Smoothing:**
- Widening intervals based on forecast horizon
- Accounts for model uncertainty

**Linear Trend:**
- Statistical confidence intervals from regression
- Accounts for extrapolation uncertainty

### Interpretation

- **Lower bound**: Minimum expected value at given confidence level
- **Upper bound**: Maximum expected value at given confidence level
- **Confidence level**: Probability that actual value falls within interval (e.g., 95%)

## Usage Examples

### Basic Forecasting

```typescript
import { MovingAverageForecaster } from './lib/forecasting/algorithms/moving-average';
import { createTimeSeriesData } from './lib/data/csv-utils';

// Prepare data
const timestamps = [/* Date objects */];
const values = [/* numeric values */];
const timeSeriesData = createTimeSeriesData(timestamps, values);

// Configure and train forecaster
const forecaster = new MovingAverageForecaster();
const config: ForecastConfig = {
  method: 'moving-average',
  parameters: { windowSize: 5 },
  forecastHorizon: 10,
  trainTestSplit: 0.8,
  confidenceLevel: 0.95
};

forecaster.fit(timeSeriesData, config);

// Generate forecast
const result = forecaster.predict(10);

// Access results
console.log('Predictions:', result.predictions);
console.log('Confidence Intervals:', result.confidenceIntervals);
console.log('Metrics:', result.metrics);
```

### Comparing Multiple Methods

```typescript
const methods = [
  { name: 'Moving Average', forecaster: new MovingAverageForecaster() },
  { name: 'Exponential Smoothing', forecaster: new ExponentialSmoothingForecaster() },
  { name: 'Linear Trend', forecaster: new LinearTrendForecaster() }
];

const results = [];

for (const method of methods) {
  const config = {
    method: method.name.toLowerCase().replace(' ', '-'),
    parameters: getDefaultParameters(method.name),
    forecastHorizon: 10,
    trainTestSplit: 0.8,
    confidenceLevel: 0.95
  };
  
  method.forecaster.fit(timeSeriesData, config);
  const result = method.forecaster.predict(10);
  
  results.push({
    method: method.name,
    mae: result.metrics.mae,
    rmse: result.metrics.rmse,
    mape: result.metrics.mape
  });
}

// Find best method by MAE
const bestMethod = results.reduce((best, current) => 
  current.mae < best.mae ? current : best
);
```

## Best Practices

### Data Preparation

1. **Clean your data**: Remove or handle missing values appropriately
2. **Check for outliers**: Extreme values can skew forecasts
3. **Ensure chronological order**: Timestamps should be sorted
4. **Validate frequency**: Consistent time intervals improve accuracy
5. **Consider seasonality**: Current algorithms don't handle seasonality directly

### Algorithm Selection

1. **Moving Average**: Use for stable data without trend
2. **Exponential Smoothing**: Use for data with trend but no seasonality
3. **Linear Trend**: Use for data with clear linear growth/decline

### Parameter Tuning

1. **Window Size (Moving Average)**: 
   - Smaller windows: More responsive to recent changes
   - Larger windows: Smoother, less sensitive to noise

2. **Alpha (Exponential Smoothing)**:
   - Higher values (0.7-0.9): More responsive to recent changes
   - Lower values (0.1-0.3): Smoother, more stable forecasts

3. **Forecast Horizon**:
   - Shorter horizons: Generally more accurate
   - Longer horizons: Higher uncertainty, wider confidence intervals

### Validation

1. **Use train/test split**: Reserve recent data for validation
2. **Cross-validation**: Test on multiple time periods if data allows
3. **Monitor multiple metrics**: Don't rely on single metric
4. **Check residuals**: Look for patterns in forecast errors
5. **Validate assumptions**: Ensure algorithm assumptions are met

## Limitations

### Current Limitations

1. **No seasonality handling**: Algorithms don't account for seasonal patterns
2. **Linear assumptions**: Limited ability to capture complex non-linear patterns
3. **No external variables**: Cannot incorporate external predictors
4. **Single-step forecasting**: No multi-step ahead optimization

### Data Limitations

1. **Minimum data requirements**: Need sufficient historical data
2. **Regular intervals**: Irregular time series may reduce accuracy
3. **Stationarity**: Some methods assume stable statistical properties
4. **No missing values**: Current implementation requires complete data

## Future Enhancements

### Planned Features

1. **Seasonal decomposition**: Handle seasonal patterns
2. **ARIMA models**: Advanced time series modeling
3. **External variables**: Incorporate additional predictors
4. **Automatic model selection**: Choose best algorithm automatically
5. **Multi-step optimization**: Optimize for multi-step forecasts
6. **Anomaly detection**: Identify unusual patterns in forecasts

### Advanced Algorithms

1. **Seasonal ARIMA**: For data with seasonality and trend
2. **Exponential Smoothing with seasonality**: Holt-Winters method
3. **Prophet**: Facebook's forecasting algorithm
4. **Neural networks**: LSTM/GRU for complex patterns

## Troubleshooting

### Common Issues

**"Insufficient data points"**
- Ensure at least 2 data points
- Recommended: 20+ points for reliable forecasting

**"Invalid timestamp format"**
- Check timestamp column format
- Ensure chronological order
- Use supported date formats

**"NaN in forecast metrics"**
- Check for zero values in actual data (affects MAPE)
- Ensure numeric values only
- Validate data preprocessing

**"Poor forecast accuracy"**
- Try different algorithms
- Adjust parameters (window size, alpha)
- Check for seasonality or non-linear patterns
- Consider data preprocessing (detrending, differencing)

### Performance Issues

**Slow training**
- Reduce data size for initial testing
- Use smaller forecast horizons
- Consider data sampling for large datasets

**Memory issues**
- Process data in chunks
- Reduce forecast horizon
- Clear unused variables

## API Reference

See [API Documentation](API.md#time-series-forecasting) for complete API reference including:
- Class constructors and methods
- Configuration options
- Return value structures
- Error handling
- Type definitions

## Examples

Complete examples are available in the application:
1. Load demo time series data
2. Navigate to Forecasting page
3. Try different algorithms and parameters
4. Compare results and metrics
5. Export forecasts and models