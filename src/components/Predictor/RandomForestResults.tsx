import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { RandomForestModel, RandomForestPrediction, FeatureImportance } from '../../types';
import { RandomForest } from '../../lib/random-forest/RandomForest';
import { calculateFeatureImportance } from '../../lib/random-forest/feature-importance';

interface RandomForestResultsProps {
  model: RandomForestModel | null;
  results: RandomForestPrediction[] | null;
  featureNames: string[];
  isTraining: boolean;
  trainingProgress: { progress: number; treesCompleted: number; totalTrees: number } | null;
}

/**
 * Random Forest results display component
 */
const RandomForestResults: React.FC<RandomForestResultsProps> = ({
  model,
  results,
  featureNames,
  isTraining,
  trainingProgress
}) => {
  const featureImportanceRef = useRef<HTMLDivElement>(null);
  const [predictionInput, setPredictionInput] = useState<Record<string, string>>({});
  const [singlePrediction, setSinglePrediction] = useState<RandomForestPrediction | null>(null);
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchPredictions, setBatchPredictions] = useState<RandomForestPrediction[] | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  /**
   * Export model as JSON
   */
  const exportModel = () => {
    if (!model) return;

    try {
      const modelJson = JSON.stringify(model, null, 2);
      const blob = new Blob([modelJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `random_forest_model_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  /**
   * Export predictions as CSV
   */
  const exportPredictions = () => {
    if (!results) return;

    try {
      const csvContent = [
        'Index,Prediction,Confidence',
        ...results.map((result, index) => 
          `${index},${result.prediction},${result.confidence?.toFixed(4) || 'N/A'}`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `random_forest_predictions_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  /**
   * Make a single prediction
   */
  const makeSinglePrediction = () => {
    if (!model) return;

    try {
      const features = featureNames.map(name => {
        const value = parseFloat(predictionInput[name] || '0');
        if (isNaN(value)) {
          throw new Error(`Invalid value for ${name}`);
        }
        return value;
      });

      const rf = RandomForest.deserialize(model);
      const prediction = rf.predict(features);
      setSinglePrediction(prediction);
    } catch (error) {
      alert('Prediction failed: ' + (error as Error).message);
    }
  };

  /**
   * Handle batch CSV file upload
   */
  const handleBatchFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setBatchFile(file);
      setBatchPredictions(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  /**
   * Process batch predictions from CSV
   */
  const processBatchPredictions = async () => {
    if (!batchFile || !model) return;

    setIsBatchProcessing(true);
    try {
      const text = await batchFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim());
      
      // Validate that all required features are present
      const missingFeatures = featureNames.filter(name => !headers.includes(name));
      if (missingFeatures.length > 0) {
        throw new Error(`Missing required features: ${missingFeatures.join(', ')}`);
      }

      // Parse data rows
      const dataRows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Convert to feature arrays and make predictions
      const rf = RandomForest.deserialize(model);
      const predictions: RandomForestPrediction[] = [];

      for (const row of dataRows) {
        try {
          const features = featureNames.map(name => {
            const value = parseFloat(row[name] || '0');
            if (isNaN(value)) {
              throw new Error(`Invalid value for ${name} in row`);
            }
            return value;
          });

          const prediction = rf.predict(features);
          predictions.push(prediction);
        } catch (error) {
          console.warn('Skipping row due to error:', error);
          // Add a placeholder prediction for failed rows
          predictions.push({
            prediction: model.config.taskType === 'classification' ? -1 : 0,
            confidence: 0
          });
        }
      }

      setBatchPredictions(predictions);
    } catch (error) {
      alert('Batch prediction failed: ' + (error as Error).message);
    } finally {
      setIsBatchProcessing(false);
    }
  };

  /**
   * Export batch predictions as CSV
   */
  const exportBatchPredictions = () => {
    if (!batchPredictions) return;

    try {
      const csvContent = [
        'Index,Prediction,Confidence',
        ...batchPredictions.map((result, index) => 
          `${index + 1},${result.prediction},${result.confidence?.toFixed(4) || 'N/A'}`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `batch_predictions_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Calculate feature importance for display
  const featureImportanceData: FeatureImportance[] = model 
    ? calculateFeatureImportance(model.featureImportance, featureNames)
    : [];

  if (isTraining) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">Training Random Forest</h3>
          <p className="text-secondary-600 dark:text-gray-400">
            Building decision trees and calculating feature importance...
          </p>
          {trainingProgress && (
            <div className="mt-4 text-sm text-secondary-500">
              Tree {trainingProgress.treesCompleted} of {trainingProgress.totalTrees} • {trainingProgress.progress.toFixed(1)}% Complete
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!model || !results) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">No Random Forest Trained</h3>
          <p className="text-secondary-600 dark:text-gray-400">
            Configure and train a Random Forest to see results here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-2">
              Trained Random Forest
            </h3>
            <div className="text-sm text-secondary-600 dark:text-gray-400 space-y-1">
              <div>Task: {model.config.taskType}</div>
              <div>Trees: {model.config.numTrees}</div>
              <div>Max Depth: {model.config.maxDepth}</div>
              <div>Min Samples/Leaf: {model.config.minSamplesLeaf}</div>
              <div>Feature Sampling: {model.config.featureSamplingRatio}</div>
            </div>
          </div>
          <button
            onClick={exportModel}
            className="btn-secondary text-sm"
          >
            Export Model
          </button>
        </div>

        {/* Training History */}
        <div className="mt-4">
          <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">Training Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-secondary-600 dark:text-gray-400">Training Time:</span>
              <span className="ml-2 font-medium">{(model.trainingHistory.trainingTime / 1000).toFixed(2)}s</span>
            </div>
            <div>
              <span className="text-secondary-600 dark:text-gray-400">OOB Score:</span>
              <span className="ml-2 font-medium">
                {model.config.taskType === 'classification' 
                  ? `${(model.oobScore * 100).toFixed(2)}%`
                  : model.oobScore.toFixed(4)
                }
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Importance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          Feature Importance
        </h3>
        <div ref={featureImportanceRef} className="space-y-3">
          {featureImportanceData.slice(0, 10).map((feature, index) => {
            const maxImportance = Math.max(...featureImportanceData.map(f => f.importance));
            const widthPercent = maxImportance > 0 ? (feature.importance / maxImportance) * 100 : 0;
            
            return (
              <div key={feature.featureIndex} className="flex items-center space-x-3">
                <div className="w-24 text-sm text-secondary-600 dark:text-gray-400 truncate">
                  {feature.featureName}
                </div>
                <div className="flex-1 bg-secondary-200 rounded-full h-4 relative">
                  <div
                    className="bg-primary-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-secondary-700 dark:text-gray-300 text-right">
                  {(feature.importance * 100).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
        {featureImportanceData.length > 10 && (
          <p className="text-sm text-secondary-500 mt-3">
            Showing top 10 of {featureImportanceData.length} features
          </p>
        )}
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100">
            Performance Overview
          </h3>
          <button
            onClick={exportPredictions}
            className="btn-secondary text-sm"
          >
            Export Predictions
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {model.config.taskType === 'classification' 
                ? `${(model.oobScore * 100).toFixed(2)}%`
                : model.oobScore.toFixed(4)
              }
            </div>
            <div className="text-sm text-green-700">
              {model.config.taskType === 'classification' ? 'OOB Accuracy' : 'OOB Score'}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {results.length}
            </div>
            <div className="text-sm text-blue-700">Predictions Made</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {results.filter(r => r.confidence && r.confidence > 0.8).length}
            </div>
            <div className="text-sm text-purple-700">High Confidence (&gt;80%)</div>
          </div>
        </div>
      </motion.div>

      {/* Single Prediction Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          Make New Prediction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {featureNames.map(name => (
            <div key={name}>
              <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-1">
                {name}
              </label>
              <input
                type="number"
                value={predictionInput[name] || ''}
                onChange={(e) => setPredictionInput(prev => ({
                  ...prev,
                  [name]: e.target.value
                }))}
                className="input-field"
                placeholder="Enter value"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={makeSinglePrediction}
            className="btn-primary"
          >
            Predict
          </button>
          {singlePrediction && (
            <div className="bg-primary-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-primary-700">Prediction: </span>
              <span className="font-semibold text-primary-900">
                {model.config.taskType === 'classification'
                  ? `Class ${singlePrediction.prediction}`
                  : (singlePrediction.prediction as number).toFixed(4)
                }
              </span>
              {singlePrediction.confidence && (
                <span className="text-sm text-primary-600 ml-2">
                  (Confidence: {(singlePrediction.confidence * 100).toFixed(1)}%)
                </span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Batch Prediction Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          Batch Predictions from CSV
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleBatchFileUpload}
              className="block w-full text-sm text-secondary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="text-xs text-secondary-500 mt-1">
              CSV must contain columns: {featureNames.join(', ')}
            </p>
          </div>

          {batchFile && (
            <div className="bg-secondary-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-gray-100">{batchFile.name}</p>
                  <p className="text-xs text-secondary-600 dark:text-gray-400">{(batchFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={processBatchPredictions}
                  disabled={isBatchProcessing}
                  className="btn-primary text-sm disabled:opacity-50"
                >
                  {isBatchProcessing ? 'Processing...' : 'Process'}
                </button>
              </div>
            </div>
          )}

          {batchPredictions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-secondary-900 dark:text-gray-100">
                  Batch Results ({batchPredictions.length} predictions)
                </h4>
                <button
                  onClick={exportBatchPredictions}
                  className="btn-secondary text-sm"
                >
                  Export Results
                </button>
              </div>
              
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-600 dark:text-gray-400">Total Predictions:</span>
                    <span className="ml-2 font-medium">{batchPredictions.length}</span>
                  </div>
                  <div>
                    <span className="text-secondary-600 dark:text-gray-400">High Confidence:</span>
                    <span className="ml-2 font-medium">
                      {batchPredictions.filter(p => p.confidence && p.confidence > 0.8).length}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-600 dark:text-gray-400">Avg Confidence:</span>
                    <span className="ml-2 font-medium">
                      {(batchPredictions.reduce((sum, p) => sum + (p.confidence || 0), 0) / batchPredictions.length * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-2 px-3">Row</th>
                      <th className="text-left py-2 px-3">Prediction</th>
                      <th className="text-left py-2 px-3">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchPredictions.slice(0, 10).map((result, index) => (
                      <tr key={index} className="border-b border-secondary-100">
                        <td className="py-2 px-3">{index + 1}</td>
                        <td className="py-2 px-3">
                          {model.config.taskType === 'classification'
                            ? `Class ${result.prediction}`
                            : (result.prediction as number).toFixed(4)
                          }
                        </td>
                        <td className="py-2 px-3">
                          {result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {batchPredictions.length > 10 && (
                <p className="text-sm text-secondary-500">
                  Showing first 10 of {batchPredictions.length} predictions
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Predictions Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          Predictions Preview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-2 px-3">Sample</th>
                <th className="text-left py-2 px-3">Prediction</th>
                <th className="text-left py-2 px-3">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 10).map((result, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">
                    {model.config.taskType === 'classification'
                      ? `Class ${result.prediction}`
                      : (result.prediction as number).toFixed(4)
                    }
                  </td>
                  <td className="py-2 px-3">
                    {result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.length > 10 && (
          <p className="text-sm text-secondary-500 mt-2">
            Showing first 10 of {results.length} predictions
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default RandomForestResults;