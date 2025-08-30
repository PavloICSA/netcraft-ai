import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProjectState, Dataset, ANNModel, PredictionResult, ClusterResult, RandomForestModel, RandomForestPrediction, ForecastModel, ForecastResult } from '../types';
import { storageUtils } from '../lib/data/migration-utils';

/**
 * Results page showing comprehensive analysis results
 */
const ResultsPage: React.FC = () => {
  const [projectState, setProjectState] = useState<ProjectState>({
    models: {},
    results: {}
  });

  // Load project state on mount
  useEffect(() => {
    const parsed = storageUtils.getProjectStateWithDates();
    if (parsed) {
      setProjectState(parsed);
    }
  }, []);

  /**
   * Export comprehensive report
   */
  const exportReport = () => {
    try {
      const report = {
        timestamp: new Date().toISOString(),
        dataset: projectState.currentDataset ? {
          name: projectState.currentDataset.name,
          rows: projectState.currentDataset.data.length,
          columns: projectState.currentDataset.columns.length,
          columnTypes: projectState.currentDataset.columns.map(col => ({
            name: col.name,
            type: col.type,
            stats: col.stats
          }))
        } : null,
        models: {
          neuralNetwork: projectState.models.ann ? {
            architecture: `${projectState.models.ann.config.inputSize} → ${projectState.models.ann.config.hiddenLayers.join(' → ')} → ${projectState.models.ann.config.outputSize}`,
            taskType: projectState.models.ann.config.taskType,
            activationFunction: projectState.models.ann.config.activationFunction,
            learningRate: projectState.models.ann.config.learningRate,
            epochs: projectState.models.ann.config.epochs,
            trained: projectState.models.ann.trained,
            finalLoss: projectState.models.ann.trainingHistory.loss[projectState.models.ann.trainingHistory.loss.length - 1]
          } : null,
          randomForest: projectState.models.randomForest ? {
            numTrees: projectState.models.randomForest.config.numTrees,
            maxDepth: projectState.models.randomForest.config.maxDepth,
            taskType: projectState.models.randomForest.config.taskType,
            featureSamplingRatio: projectState.models.randomForest.config.featureSamplingRatio,
            oobScore: projectState.models.randomForest.oobScore,
            trained: projectState.models.randomForest.trained,
            trainingTime: projectState.models.randomForest.trainingHistory.trainingTime
          } : null,
          forecast: projectState.models.forecast ? {
            method: projectState.models.forecast.config.method,
            forecastHorizon: projectState.models.forecast.config.forecastHorizon,
            confidenceLevel: projectState.models.forecast.config.confidenceLevel,
            trainTestSplit: projectState.models.forecast.config.trainTestSplit,
            parameters: projectState.models.forecast.config.parameters,
            trained: projectState.models.forecast.trained,
            createdAt: projectState.models.forecast.createdAt
          } : null
        },
        results: {
          predictions: projectState.results.predictions ? {
            metrics: projectState.results.predictions.metrics,
            sampleCount: projectState.results.predictions.predictions.length
          } : null,
          clusters: projectState.results.clusters ? {
            clusterCount: [...new Set(projectState.results.clusters.clusters)].length,
            sampleCount: projectState.results.clusters.clusters.length,
            inertia: projectState.results.clusters.inertia
          } : null,
          randomForest: projectState.results.randomForest ? {
            sampleCount: projectState.results.randomForest.length,
            highConfidenceCount: projectState.results.randomForest.filter(r => r.confidence && r.confidence > 0.8).length
          } : null,
          forecast: projectState.results.forecast ? {
            method: projectState.results.forecast.method,
            forecastHorizon: projectState.results.forecast.predictions.length,
            metrics: projectState.results.forecast.metrics
          } : null
        }
      };

      const reportJson = JSON.stringify(report, null, 2);
      const blob = new Blob([reportJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `netcraft_report_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const hasResults = projectState.results.predictions || projectState.results.clusters || projectState.results.randomForest || projectState.results.forecast;

  if (!hasResults) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-2">No Results Available</h2>
        <p className="text-secondary-600 dark:text-gray-400 mb-6">Train a model or run clustering analysis to see results here.</p>
        <div className="flex gap-4 justify-center">
          <a href="/predictor" className="btn-primary">
            Train Models
          </a>
          <a href="/clusterizer" className="btn-secondary">
            Run Clustering
          </a>
          <a href="/forecasting" className="btn-secondary">
            Time Series Forecasting
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-gray-100 mb-2">
            Analysis Results
          </h1>
          <p className="text-secondary-600 dark:text-gray-400">
            Comprehensive results from your machine learning analysis
          </p>
        </div>
        <button
          onClick={exportReport}
          className="btn-primary"
        >
          Export Report
        </button>
      </motion.div>

      {/* Dataset Summary */}
      {projectState.currentDataset && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            Dataset Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {projectState.currentDataset.data.length}
              </div>
              <div className="text-sm text-blue-700">Total Samples</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {projectState.currentDataset.columns.length}
              </div>
              <div className="text-sm text-green-700">Total Features</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {projectState.currentDataset.columns.filter(col => col.type === 'numeric').length}
              </div>
              <div className="text-sm text-purple-700">Numeric Features</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {projectState.currentDataset.columns.filter(col => col.type === 'categorical').length}
              </div>
              <div className="text-sm text-orange-700">Categorical Features</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Neural Network Results */}
      {projectState.results.predictions && projectState.models.ann && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
            Neural Network Results
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Info */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Model Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Task Type:</span>
                  <span className="font-medium">{projectState.models.ann.config.taskType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Architecture:</span>
                  <span className="font-medium">
                    {projectState.models.ann.config.inputSize} → {projectState.models.ann.config.hiddenLayers.join(' → ')} → {projectState.models.ann.config.outputSize}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Activation:</span>
                  <span className="font-medium">{projectState.models.ann.config.activationFunction}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Learning Rate:</span>
                  <span className="font-medium">{projectState.models.ann.config.learningRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Epochs:</span>
                  <span className="font-medium">{projectState.models.ann.config.epochs}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Performance Metrics</h3>
              {projectState.models.ann.config.taskType === 'regression' ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {projectState.results.predictions.metrics.mse?.toFixed(6)}
                    </div>
                    <div className="text-sm text-blue-700">Mean Squared Error</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {projectState.results.predictions.metrics.mae?.toFixed(6)}
                    </div>
                    <div className="text-sm text-green-700">Mean Absolute Error</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {projectState.results.predictions.metrics.r2?.toFixed(4)}
                    </div>
                    <div className="text-sm text-purple-700">R² Score</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {(projectState.results.predictions.metrics.accuracy! * 100).toFixed(2)}%
                    </div>
                    <div className="text-sm text-green-700">Accuracy</div>
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-gray-400">
                    Predictions: {projectState.results.predictions.predictions.length} samples
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Random Forest Results */}
      {projectState.results.randomForest && projectState.models.randomForest && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
            Random Forest Results
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Info */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Model Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Task Type:</span>
                  <span className="font-medium">{projectState.models.randomForest.config.taskType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Number of Trees:</span>
                  <span className="font-medium">{projectState.models.randomForest.config.numTrees}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Max Depth:</span>
                  <span className="font-medium">{projectState.models.randomForest.config.maxDepth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Feature Sampling:</span>
                  <span className="font-medium">{projectState.models.randomForest.config.featureSamplingRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Training Time:</span>
                  <span className="font-medium">{(projectState.models.randomForest.trainingHistory.trainingTime / 1000).toFixed(2)}s</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {projectState.models.randomForest.config.taskType === 'classification' 
                      ? `${(projectState.models.randomForest.oobScore * 100).toFixed(2)}%`
                      : projectState.models.randomForest.oobScore.toFixed(4)
                    }
                  </div>
                  <div className="text-sm text-green-700">
                    {projectState.models.randomForest.config.taskType === 'classification' ? 'OOB Accuracy' : 'OOB Score'}
                  </div>
                </div>
                <div className="text-sm text-secondary-600 dark:text-gray-400">
                  Predictions: {Array.isArray(projectState.results.randomForest) 
                    ? projectState.results.randomForest.length 
                    : 1} samples
                </div>
                {Array.isArray(projectState.results.randomForest) && (
                  <div className="text-sm text-secondary-600 dark:text-gray-400">
                    High Confidence (&gt;80%): {projectState.results.randomForest.filter(r => r.confidence && r.confidence > 0.8).length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Clustering Results */}
      {projectState.results.clusters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
            Clustering Results
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cluster Summary */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Cluster Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Total Samples:</span>
                  <span className="font-medium">{projectState.results.clusters.clusters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Number of Clusters:</span>
                  <span className="font-medium">{[...new Set(projectState.results.clusters.clusters)].length}</span>
                </div>
                {projectState.results.clusters.inertia && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-gray-400">Inertia:</span>
                    <span className="font-medium">{projectState.results.clusters.inertia.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cluster Distribution */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Cluster Distribution</h3>
              <div className="space-y-2">
                {[...new Set(projectState.results.clusters.clusters)].map(cluster => {
                  const count = projectState.results.clusters!.clusters.filter(c => c === cluster).length;
                  const percentage = (count / projectState.results.clusters!.clusters.length) * 100;
                  
                  return (
                    <div key={cluster} className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600 dark:text-gray-400">Cluster {cluster}:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-secondary-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Forecasting Results */}
      {projectState.results.forecast && projectState.models.forecast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
            Time Series Forecasting Results
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Model Info */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Model Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Method:</span>
                  <span className="font-medium capitalize">{projectState.models.forecast.config.method.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Forecast Horizon:</span>
                  <span className="font-medium">{projectState.models.forecast.config.forecastHorizon} periods</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Confidence Level:</span>
                  <span className="font-medium">{(projectState.models.forecast.config.confidenceLevel * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600 dark:text-gray-400">Train/Test Split:</span>
                  <span className="font-medium">{(projectState.models.forecast.config.trainTestSplit * 100).toFixed(0)}%</span>
                </div>
                {projectState.models.forecast.config.parameters.windowSize && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-gray-400">Window Size:</span>
                    <span className="font-medium">{projectState.models.forecast.config.parameters.windowSize}</span>
                  </div>
                )}
                {projectState.models.forecast.config.parameters.alpha && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-gray-400">Alpha (α):</span>
                    <span className="font-medium">{projectState.models.forecast.config.parameters.alpha}</span>
                  </div>
                )}
                {projectState.models.forecast.config.parameters.polynomialDegree && (
                  <div className="flex justify-between">
                    <span className="text-secondary-600 dark:text-gray-400">Polynomial Degree:</span>
                    <span className="font-medium">{projectState.models.forecast.config.parameters.polynomialDegree}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {projectState.results.forecast.metrics.mae.toFixed(4)}
                  </div>
                  <div className="text-sm text-blue-700">Mean Absolute Error</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {projectState.results.forecast.metrics.rmse.toFixed(4)}
                  </div>
                  <div className="text-sm text-green-700">Root Mean Squared Error</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {projectState.results.forecast.metrics.mape.toFixed(2)}%
                  </div>
                  <div className="text-sm text-purple-700">Mean Absolute Percentage Error</div>
                </div>
                {projectState.results.forecast.metrics.r2 && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      {projectState.results.forecast.metrics.r2.toFixed(4)}
                    </div>
                    <div className="text-sm text-orange-700">R² Score</div>
                  </div>
                )}
                <div className="text-sm text-secondary-600 dark:text-gray-400">
                  Forecast Points: {projectState.results.forecast.predictions.length}
                </div>
                <div className="text-sm text-secondary-600 dark:text-gray-400">
                  Historical Points: {projectState.results.forecast.fittedValues.length}
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Summary */}
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-4">Forecast Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-secondary-900 dark:text-gray-100">
                  {Math.min(...projectState.results.forecast.predictions).toFixed(2)}
                </div>
                <div className="text-sm text-secondary-600 dark:text-gray-400">Minimum Forecast</div>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-secondary-900 dark:text-gray-100">
                  {(projectState.results.forecast.predictions.reduce((a, b) => a + b, 0) / projectState.results.forecast.predictions.length).toFixed(2)}
                </div>
                <div className="text-sm text-secondary-600 dark:text-gray-400">Average Forecast</div>
              </div>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-secondary-900 dark:text-gray-100">
                  {Math.max(...projectState.results.forecast.predictions).toFixed(2)}
                </div>
                <div className="text-sm text-secondary-600 dark:text-gray-400">Maximum Forecast</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 justify-center"
      >
        <a href="/predictor" className="btn-secondary">
          Train New Model
        </a>
        <a href="/clusterizer" className="btn-secondary">
          Run New Clustering
        </a>
        <a href="/forecasting" className="btn-secondary">
          Run New Forecast
        </a>
        <a href="/data" className="btn-secondary">
          Load New Dataset
        </a>
      </motion.div>
    </div>
  );
};

export default ResultsPage;