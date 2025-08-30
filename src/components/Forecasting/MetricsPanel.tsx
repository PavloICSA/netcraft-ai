import React from 'react';
import { ForecastResult } from '../../types';
import { formatMetrics } from '../../lib/forecasting/metrics/forecast-metrics';
import { useTranslation } from 'react-i18next';

interface MetricsPanelProps {
  results: ForecastResult[];
  className?: string;
}

interface MetricRowProps {
  label: string;
  value: string;
  isHighlighted?: boolean;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, isHighlighted = false }) => (
  <div className={`flex justify-between py-2 px-3 ${isHighlighted ? 'bg-blue-50 dark:bg-blue-900/20 font-semibold' : ''}`}>
    <span className="text-gray-700">{label}</span>
    <span className={`font-mono ${isHighlighted ? 'text-blue-700' : 'text-gray-900'}`}>
      {value}
    </span>
  </div>
);

const MetricsPanel: React.FC<MetricsPanelProps> = ({ results, className = '' }) => {
  const { t } = useTranslation('forecasting');
  if (!results || results.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('results.metrics.title')}</h3>
        <p className="text-gray-500 text-center py-8">
          {t('results.metrics.noResults')}
        </p>
      </div>
    );
  }

  // Find the best performing method for each metric
  const getBestMethod = (metricKey: 'mae' | 'rmse' | 'mape') => {
    const validResults = results.filter(r => !isNaN(r.metrics[metricKey]));
    if (validResults.length === 0) return null;
    
    return validResults.reduce((best, current) => 
      current.metrics[metricKey] < best.metrics[metricKey] ? current : best
    );
  };

  const bestMAE = getBestMethod('mae');
  const bestRMSE = getBestMethod('rmse');
  const bestMAPE = getBestMethod('mape');

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900">{t('results.metrics.title')}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {t('results.metrics.description')}
        </p>
      </div>

      <div className="p-6 space-y-6">
        {results.map((result, index) => {
          const formattedMetrics = formatMetrics(result.metrics);
          const isMAEBest = bestMAE?.method === result.method;
          const isRMSEBest = bestRMSE?.method === result.method;
          const isMAPEBest = bestMAPE?.method === result.method;

          return (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900">
                  {result.method.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
              </div>
              
              <div className="divide-y divide-gray-100">
                <MetricRow
                  label={t('results.metrics.mae')}
                  value={formattedMetrics.MAE}
                  isHighlighted={isMAEBest}
                />
                <MetricRow
                  label={t('results.metrics.rmse')}
                  value={formattedMetrics.RMSE}
                  isHighlighted={isRMSEBest}
                />
                <MetricRow
                  label={t('results.metrics.mape')}
                  value={formattedMetrics.MAPE}
                  isHighlighted={isMAPEBest}
                />
                {result.metrics.r2 !== undefined && (
                  <MetricRow
                    label={t('results.metrics.r2')}
                    value={result.metrics.r2.toFixed(4)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {results.length > 1 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 mb-3">{t('results.metrics.comparison.title')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">{t('results.metrics.comparison.bestMAE')}</div>
              <div className="text-blue-600 font-semibold">
                {bestMAE ? bestMAE.method.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
              </div>
              <div className="text-gray-500 font-mono">
                {bestMAE ? formatMetrics(bestMAE.metrics).MAE : 'N/A'}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">{t('results.metrics.comparison.bestRMSE')}</div>
              <div className="text-blue-600 font-semibold">
                {bestRMSE ? bestRMSE.method.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
              </div>
              <div className="text-gray-500 font-mono">
                {bestRMSE ? formatMetrics(bestRMSE.metrics).RMSE : 'N/A'}
              </div>
            </div>
            
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">{t('results.metrics.comparison.bestMAPE')}</div>
              <div className="text-blue-600 font-semibold">
                {bestMAPE ? bestMAPE.method.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
              </div>
              <div className="text-gray-500 font-mono">
                {bestMAPE ? formatMetrics(bestMAPE.metrics).MAPE : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;