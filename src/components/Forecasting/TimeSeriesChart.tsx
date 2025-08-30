import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TimeSeriesData, ForecastResult } from '../../types';
import ChartWrapper from '../Common/ChartWrapper';
import { useTranslation } from 'react-i18next';
import useLocale from '../../hooks/useLocale';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeSeriesChartProps {
  timeSeriesData: TimeSeriesData;
  forecastResults?: ForecastResult[];
  selectedMethods?: string[];
  showConfidenceIntervals?: boolean;
  height?: number;
}

/**
 * Interactive time series chart with forecast visualization
 */
const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  timeSeriesData,
  forecastResults = [],
  selectedMethods = [],
  showConfidenceIntervals = true,
  height = 400
}) => {
  const { t } = useTranslation('forecasting');
  const { getLocaleCode } = useLocale();
  const locale = getLocaleCode();
  const chartData = useMemo((): ChartData<'line', {x: string; y: number}[]> => {
    const datasets: ChartData<'line', {x: string; y: number}[]>['datasets'] = [];
    
    // Historical data - ensure timestamps are Date objects
    const historicalLabels = timeSeriesData.timestamps.map(ts => {
      const date = ts instanceof Date ? ts : new Date(ts);
      return date.toLocaleDateString(locale, { 
        month: 'short', 
        day: 'numeric',
        year: timeSeriesData.timestamps.length > 365 ? 'numeric' : undefined
      });
    });
    
    datasets.push({
      label: t('results.chart.historical'),
      data: timeSeriesData.values.map((value, i) => ({
        x: historicalLabels[i],
        y: value
      })),
      borderColor: 'rgb(59, 130, 246)', // blue-500
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 4,
      tension: 0.1,
      fill: false
    });

    // Forecast results
    const methodColors = [
      'rgb(239, 68, 68)',   // red-500
      'rgb(34, 197, 94)',   // green-500
      'rgb(168, 85, 247)',  // purple-500
      'rgb(245, 158, 11)',  // amber-500
      'rgb(236, 72, 153)'   // pink-500
    ];

    forecastResults.forEach((result, index) => {
      if (selectedMethods.length === 0 || selectedMethods.includes(result.method)) {
        const color = methodColors[index % methodColors.length];
        const colorRgba = color.replace('rgb', 'rgba').replace(')', ', 0.1)');
        
        // Create combined timeline for fitted + forecast - ensure timestamps are Date objects
        const fittedLabels = result.timestamps.historical.map(ts => {
          const date = ts instanceof Date ? ts : new Date(ts);
          return date.toLocaleDateString(locale, { 
            month: 'short', 
            day: 'numeric',
            year: result.timestamps.historical.length > 365 ? 'numeric' : undefined
          });
        });
        
        const forecastLabels = result.timestamps.forecast.map(ts => {
          const date = ts instanceof Date ? ts : new Date(ts);
          return date.toLocaleDateString(locale, { 
            month: 'short', 
            day: 'numeric',
            year: result.timestamps.forecast.length > 365 ? 'numeric' : undefined
          });
        });

        // Fitted values (on historical timeline)
        datasets.push({
          label: t('results.chart.fitted', { method: result.method }),
          data: result.fittedValues.map((value, i) => ({
            x: fittedLabels[i],
            y: value
          })),
          borderColor: color,
          backgroundColor: colorRgba,
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 1,
          pointHoverRadius: 3,
          tension: 0.1,
          fill: false
        });

        // Forecast values (future timeline)
        const lastHistoricalPoint = {
          x: fittedLabels[fittedLabels.length - 1],
          y: result.fittedValues[result.fittedValues.length - 1]
        };

        const forecastData = [
          lastHistoricalPoint,
          ...result.predictions.map((value, i) => ({
            x: forecastLabels[i],
            y: value
          }))
        ];

        datasets.push({
          label: t('results.chart.forecastLabel', { method: result.method }),
          data: forecastData,
          borderColor: color,
          backgroundColor: colorRgba,
          borderWidth: 3,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.1,
          fill: false
        });

        // Confidence intervals
        if (showConfidenceIntervals && result.confidenceIntervals) {
          const upperBoundData = [
            {
              x: lastHistoricalPoint.x,
              y: lastHistoricalPoint.y
            },
            ...result.confidenceIntervals.upper.map((value, i) => ({
              x: forecastLabels[i],
              y: value
            }))
          ];

          const lowerBoundData = [
            {
              x: lastHistoricalPoint.x,
              y: lastHistoricalPoint.y
            },
            ...result.confidenceIntervals.lower.map((value, i) => ({
              x: forecastLabels[i],
              y: value
            }))
          ];

          // Upper bound
          datasets.push({
            label: t('results.chart.upperCI', { method: result.method }),
            data: upperBoundData,
            borderColor: color.replace(')', ', 0.3)').replace('rgb', 'rgba'),
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderDash: [2, 2],
            pointRadius: 0,
            tension: 0.1,
            fill: false
          });

          // Lower bound with fill
          datasets.push({
            label: t('results.chart.lowerCI', { method: result.method }),
            data: lowerBoundData,
            borderColor: color.replace(')', ', 0.3)').replace('rgb', 'rgba'),
            backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
            borderWidth: 1,
            borderDash: [2, 2],
            pointRadius: 0,
            tension: 0.1,
            fill: '-1' // Fill to previous dataset (upper bound)
          });
        }
      }
    });

    // Create combined labels for x-axis
    const allLabels = [...historicalLabels];
    if (forecastResults.length > 0) {
      const firstResult = forecastResults[0];
      const forecastLabels = firstResult.timestamps.forecast.map(ts => {
        const date = ts instanceof Date ? ts : new Date(ts);
        return date.toLocaleDateString(locale, { 
          month: 'short', 
          day: 'numeric',
          year: firstResult.timestamps.forecast.length > 365 ? 'numeric' : undefined
        });
      });
      allLabels.push(...forecastLabels);
    }

    return {
      labels: allLabels,
      datasets
    };
  }, [timeSeriesData, forecastResults, selectedMethods, showConfidenceIntervals, locale]);

  const chartOptions = useMemo((): ChartOptions<'line'> => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: t('results.chart.title'),
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      legend: {
        position: 'top',
        labels: {
          filter: (legendItem) => {
            // Hide confidence interval bounds from legend
            return !legendItem.text?.includes('CI');
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return t('results.chart.dateLabel', { date: context[0].label });
          },
          label: (context) => {
            const value = typeof context.parsed.y === 'number' 
              ? context.parsed.y.toFixed(3)
              : context.parsed.y;
            return t('results.chart.valueLabel', { label: context.dataset.label, value });
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: t('results.chart.xAxisTitle')
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: t('results.chart.yAxisTitle')
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    },
    elements: {
      line: {
        tension: 0.1
      },
      point: {
        hoverRadius: 6
      }
    }
  }), [t]);

  return (
    <ChartWrapper title={t('results.chart.title')}>
      <div style={{ height: `${height}px`, width: '100%' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </ChartWrapper>
  );
};

export default TimeSeriesChart;