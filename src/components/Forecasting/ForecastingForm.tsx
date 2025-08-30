import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dataset, ForecastConfig, TimeSeriesData } from '../../types';
import { useTranslation } from 'react-i18next';

interface ForecastingFormProps {
  dataset: Dataset;
  timeSeriesData: TimeSeriesData | null;
  onForecast: (config: ForecastConfig) => void;
  isForecasting: boolean;
}

/**
 * Time series forecasting configuration form
 */
const ForecastingForm: React.FC<ForecastingFormProps> = ({
  dataset,
  timeSeriesData,
  onForecast,
  isForecasting
}) => {
  const { t } = useTranslation('forecasting');
  const [method, setMethod] = useState<'moving-average' | 'exponential-smoothing' | 'linear-trend'>('moving-average');
  const [forecastHorizon, setForecastHorizon] = useState(10);
  const [trainTestSplit, setTrainTestSplit] = useState(0.8);
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);
  
  // Method-specific parameters
  const [windowSize, setWindowSize] = useState(5);
  const [alpha, setAlpha] = useState(0.3);
  const [beta, setBeta] = useState(0.1);
  const [gamma, setGamma] = useState(0.1);
  const [seasonalPeriods, setSeasonalPeriods] = useState(12);
  const [polynomialDegree, setPolynomialDegree] = useState(1);

  // Auto-adjust parameters based on data size
  useEffect(() => {
    if (timeSeriesData) {
      const dataLength = timeSeriesData.values.length;
      
      // Adjust window size for moving average (5-20% of data, min 3, max 50)
      const suggestedWindow = Math.max(3, Math.min(50, Math.floor(dataLength * 0.1)));
      setWindowSize(suggestedWindow);
      
      // Adjust forecast horizon (5-15% of data, min 1, max 100)
      const suggestedHorizon = Math.max(1, Math.min(100, Math.floor(dataLength * 0.1)));
      setForecastHorizon(suggestedHorizon);
      
      // Detect potential seasonality for seasonal periods
      if (timeSeriesData.metadata.frequency === 'daily') {
        setSeasonalPeriods(7); // Weekly seasonality
      } else if (timeSeriesData.metadata.frequency === 'monthly') {
        setSeasonalPeriods(12); // Yearly seasonality
      } else if (timeSeriesData.metadata.frequency === 'weekly') {
        setSeasonalPeriods(52); // Yearly seasonality
      }
    }
  }, [timeSeriesData]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!timeSeriesData) {
      alert(t('form.validation.noTimeSeriesData'));
      return;
    }

    if (timeSeriesData.values.length < 10) {
      alert(t('form.validation.insufficientData'));
      return;
    }

    // Validate parameters based on method
    if (method === 'moving-average' && windowSize >= timeSeriesData.values.length) {
      alert(t('form.validation.windowSizeTooLarge'));
      return;
    }

    if (forecastHorizon <= 0) {
      alert(t('form.validation.invalidForecastHorizon'));
      return;
    }

    if (trainTestSplit <= 0 || trainTestSplit >= 1) {
      alert(t('form.validation.invalidTrainTestSplit'));
      return;
    }

    // Build parameters object based on selected method
    const parameters: ForecastConfig['parameters'] = {};
    
    if (method === 'moving-average') {
      parameters.windowSize = windowSize;
    } else if (method === 'exponential-smoothing') {
      parameters.alpha = alpha;
      parameters.beta = beta;
      parameters.gamma = gamma;
      parameters.seasonalPeriods = seasonalPeriods;
    } else if (method === 'linear-trend') {
      parameters.polynomialDegree = polynomialDegree;
    }

    const config: ForecastConfig = {
      method,
      parameters,
      forecastHorizon,
      trainTestSplit,
      confidenceLevel
    };

    onForecast(config);
  };

  /**
   * Get method description for user guidance
   */
  const getMethodDescription = (methodName: string): string => {
    switch (methodName) {
      case 'moving-average':
        return t('form.method.descriptions.movingAverage');
      case 'exponential-smoothing':
        return t('form.method.descriptions.exponentialSmoothing');
      case 'linear-trend':
        return t('form.method.descriptions.linearTrend');
      default:
        return '';
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
        {t('form.title')}
      </h2>

      {!timeSeriesData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">{t('form.noTimeSeriesData.title')}</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {t('form.noTimeSeriesData.message')}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Method Selection */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.method.title')}</h3>
          
          <div className="space-y-3">
            {[
              { value: 'moving-average', label: t('form.method.movingAverage') },
              { value: 'exponential-smoothing', label: t('form.method.exponentialSmoothing') },
              { value: 'linear-trend', label: t('form.method.linearTrend') }
            ].map((option) => (
              <label key={option.value} className="flex items-start">
                <input
                  type="radio"
                  value={option.value}
                  checked={method === option.value}
                  onChange={(e) => setMethod(e.target.value as typeof method)}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-secondary-700 dark:text-gray-300">{option.label}</span>
                  <p className="text-xs text-secondary-500 mt-1">
                    {getMethodDescription(option.value)}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Method-specific Parameters */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.parameters.title')}</h3>
          
          {method === 'moving-average' && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.parameters.windowSize')}
              </label>
              <input
                type="number"
                value={windowSize}
                onChange={(e) => setWindowSize(parseInt(e.target.value) || 3)}
                min="3"
                max="100"
                className="input-field"
              />
              <p className="text-xs text-secondary-500 mt-1">
                {t('form.parameters.windowSizeHelp')}
              </p>
            </div>
          )}

          {method === 'exponential-smoothing' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  {t('form.parameters.alpha')}
                </label>
                <input
                  type="number"
                  value={alpha}
                  onChange={(e) => setAlpha(parseFloat(e.target.value) || 0.1)}
                  min="0.01"
                  max="1"
                  step="0.01"
                  className="input-field"
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {t('form.parameters.alphaHelp')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  {t('form.parameters.beta')}
                </label>
                <input
                  type="number"
                  value={beta}
                  onChange={(e) => setBeta(parseFloat(e.target.value) || 0.1)}
                  min="0"
                  max="1"
                  step="0.01"
                  className="input-field"
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {t('form.parameters.betaHelp')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  {t('form.parameters.gamma')}
                </label>
                <input
                  type="number"
                  value={gamma}
                  onChange={(e) => setGamma(parseFloat(e.target.value) || 0.1)}
                  min="0"
                  max="1"
                  step="0.01"
                  className="input-field"
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {t('form.parameters.gammaHelp')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                  {t('form.parameters.seasonalPeriods')}
                </label>
                <input
                  type="number"
                  value={seasonalPeriods}
                  onChange={(e) => setSeasonalPeriods(parseInt(e.target.value) || 12)}
                  min="2"
                  max="365"
                  className="input-field"
                />
                <p className="text-xs text-secondary-500 mt-1">
                  {t('form.parameters.seasonalPeriodsHelp')}
                </p>
              </div>
            </div>
          )}

          {method === 'linear-trend' && (
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.parameters.polynomialDegree')}
              </label>
              <select
                value={polynomialDegree}
                onChange={(e) => setPolynomialDegree(parseInt(e.target.value))}
                className="input-field"
              >
                <option value={1}>{t('form.parameters.linear')}</option>
                <option value={2}>{t('form.parameters.quadratic')}</option>
                <option value={3}>{t('form.parameters.cubic')}</option>
              </select>
              <p className="text-xs text-secondary-500 mt-1">
                {t('form.parameters.polynomialDegreeHelp')}
              </p>
            </div>
          )}
        </div>

        {/* Forecast Configuration */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">{t('form.configuration.title')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.configuration.forecastHorizon')}
              </label>
              <input
                type="number"
                value={forecastHorizon}
                onChange={(e) => setForecastHorizon(parseInt(e.target.value) || 1)}
                min="1"
                max="1000"
                className="input-field"
              />
              <p className="text-xs text-secondary-500 mt-1">
                {t('form.configuration.forecastHorizonHelp')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.configuration.trainTestSplit')}
              </label>
              <input
                type="number"
                value={trainTestSplit}
                onChange={(e) => setTrainTestSplit(parseFloat(e.target.value) || 0.8)}
                min="0.1"
                max="0.95"
                step="0.05"
                className="input-field"
              />
              <p className="text-xs text-secondary-500 mt-1">
                {t('form.configuration.trainTestSplitHelp')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                {t('form.configuration.confidenceLevel')}
              </label>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
                className="input-field"
              >
                <option value={0.90}>90%</option>
                <option value={0.95}>95%</option>
                <option value={0.99}>99%</option>
              </select>
              <p className="text-xs text-secondary-500 mt-1">
                {t('form.configuration.confidenceLevelHelp')}
              </p>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        {timeSeriesData && (
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('form.dataSummary.title')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-secondary-600 dark:text-gray-400">{t('form.dataSummary.totalPoints')}:</span>
                <span className="ml-2 font-medium">{timeSeriesData.values.length}</span>
              </div>
              <div>
                <span className="text-secondary-600 dark:text-gray-400">{t('form.dataSummary.frequency')}:</span>
                <span className="ml-2 font-medium capitalize">{timeSeriesData.metadata.frequency}</span>
              </div>
              <div>
                <span className="text-secondary-600 dark:text-gray-400">{t('form.dataSummary.hasGaps')}:</span>
                <span className="ml-2 font-medium">{timeSeriesData.metadata.hasGaps ? t('form.dataSummary.yes') : t('form.dataSummary.no')}</span>
              </div>
              <div>
                <span className="text-secondary-600 dark:text-gray-400">{t('form.dataSummary.trainingSize')}:</span>
                <span className="ml-2 font-medium">
                  {Math.floor(timeSeriesData.values.length * trainTestSplit)} points
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isForecasting || !timeSeriesData}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isForecasting ? t('buttons.generating') : t('buttons.generateForecast')}
        </button>
      </form>
    </div>
  );
};

export default ForecastingForm;