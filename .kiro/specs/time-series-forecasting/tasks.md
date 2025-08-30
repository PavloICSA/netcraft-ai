# Implementation Plan

- [x] 1. Core Setup





  - Create `src/lib/forecasting/` folder structure
  - Add time series types (TimeSeriesPoint, ForecastResult) in `src/types.d.ts`
  - Provide a base interface for forecasters (fit, predict methods)
  - _Requirements: 1.1, 2.1, 5.3_

- [x] 2. Preprocessing (Minimal)














  - Extend CSV parser to detect datetime columns (ISO, common formats)
  - Add basic missing value handling (forward fill or drop)
  - Assume roughly regular intervals (skip complex resampling for v1)
  - _Requirements: 1.1, 1.3_

- [x] 3. Forecasting Algorithms (Basics Only)





- [x] 3.1 Simple Moving Average


  - Implement configurable window size
  - Create unit tests with known datasets
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [x] 3.2 Exponential Smoothing (Simple)


  - Implement simple exponential smoothing
  - Optionally add double exponential smoothing for trend
  - Skip triple exponential smoothing and full seasonal decomposition for v1
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [x] 3.3 Linear Trend Regression


  - Implement least squares regression
  - Start with linear only (no polynomial for v1)
  - Create tests for trend pattern detection
  - _Requirements: 2.1, 2.2, 3.1, 3.2_

- [x] 4. Metrics





  - Implement MAE, RMSE, MAPE (just the essentials)
  - Display in results panel with one metric table per method
  - Write unit tests for metric accuracy
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 5. React Components





- [x] 5.1 ForecastingForm.tsx


  - Select method, horizon, params (window size, alpha, etc.)
  - Add form validation and basic user guidance
  - _Requirements: 2.1, 2.2, 6.3_

- [x] 5.2 TimeSeriesChart.tsx


  - Plot historical vs forecast using Chart.js
  - Distinguish between historical, fitted, and predicted values visually
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5.3 ForecastingResults.tsx


  - Show metrics and simple comparison table
  - Display results for multiple methods side by side
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 6. Integration




- [x] 6.1 Add ForecastingPage.tsx


  - Create complete workflow: upload → configure → forecast → results
  - Integrate all forecasting components into single page
  - _Requirements: 1.1, 2.1_

- [x] 6.2 Add route and navigation


  - Add forecasting route to `src/routes.tsx`
  - Update navigation components to include "Forecasting" entry
  - _Requirements: 1.1, 2.1_

- [x] 6.3 Results export


  - Allow CSV export of timestamps and forecast values
  - Include basic metadata in export
  - _Requirements: 5.1, 5.3_

- [ ] 7. Extras (Optional for polish)
- [ ] 7.1 Demo datasets
  - Provide 1-2 demo datasets (e.g. sales, temperature)
  - Pre-load with reasonable default parameters
  - _Requirements: 6.1, 6.2_

- [ ] 7.2 Educational features
  - Add tooltips/help with short method explanations
  - Provide guidance on when to use each technique
  - _Requirements: 6.3, 6.4_

- [ ] 7.3 Model persistence
  - Add JSON save/load of forecasts (if model persistence already exists)
  - Integrate with existing project state management
  - _Requirements: 5.2, 5.4_