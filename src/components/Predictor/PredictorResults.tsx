import React from 'react';
import { motion } from 'framer-motion';
import { ANNModel, PredictionResult } from '../../types';
import { serializeModel } from '../../lib/ann/ann-logic-2';

interface PredictorResultsProps {
  model: ANNModel | null;
  results: PredictionResult | null;
  isTraining: boolean;
  trainingProgress: { epoch: number; loss: number; accuracy?: number } | null;
}

/**
 * Neural network results display component
 */
const PredictorResults: React.FC<PredictorResultsProps> = ({
  model,
  results,
  isTraining,
  trainingProgress
}) => {
  /**
   * Export model as JSON
   */
  const exportModel = () => {
    if (!model) return;

    try {
      const modelJson = serializeModel(model);
      const blob = new Blob([modelJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `netcraft_model_${new Date().toISOString().split('T')[0]}.json`;
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
        'Index,Prediction',
        ...results.predictions.map((pred, index) => `${index},${pred}`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `netcraft_predictions_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  if (isTraining) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Training Model</h3>
          <p className="text-secondary-600">
            Please wait while the neural network is being trained...
          </p>
          {trainingProgress && (
            <div className="mt-4 text-sm text-secondary-500">
              Epoch {trainingProgress.epoch} • Loss: {trainingProgress.loss.toFixed(6)}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Model Trained</h3>
          <p className="text-secondary-600">
            Configure and train a neural network to see results here.
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
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Trained Model
            </h3>
            <div className="text-sm text-secondary-600 space-y-1">
              <div>Task: {model.config.taskType}</div>
              <div>Architecture: {model.config.inputSize} → {model.config.hiddenLayers.join(' → ')} → {model.config.outputSize}</div>
              <div>Activation: {model.config.activationFunction}</div>
              <div>Learning Rate: {model.config.learningRate}</div>
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
        {model.trainingHistory && (
          <div className="mt-4">
            <h4 className="font-medium text-secondary-900 mb-2">Training History</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-secondary-600">Epochs:</span>
                <span className="ml-2 font-medium">{model.trainingHistory.epochs}</span>
              </div>
              <div>
                <span className="text-secondary-600">Final Loss:</span>
                <span className="ml-2 font-medium">
                  {model.trainingHistory.loss[model.trainingHistory.loss.length - 1]?.toFixed(6)}
                </span>
              </div>
              {model.trainingHistory.accuracy && (
                <div>
                  <span className="text-secondary-600">Final Accuracy:</span>
                  <span className="ml-2 font-medium">
                    {(model.trainingHistory.accuracy[model.trainingHistory.accuracy.length - 1] * 100).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">
            Performance Metrics
          </h3>
          <button
            onClick={exportPredictions}
            className="btn-secondary text-sm"
          >
            Export Predictions
          </button>
        </div>

        {model.config.taskType === 'regression' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {results.metrics.mse?.toFixed(4)}
              </div>
              <div className="text-sm text-blue-700">Mean Squared Error</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {results.metrics.mae?.toFixed(4)}
              </div>
              <div className="text-sm text-green-700">Mean Absolute Error</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {results.metrics.r2?.toFixed(4)}
              </div>
              <div className="text-sm text-purple-700">R² Score</div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(results.metrics.accuracy! * 100).toFixed(2)}%
              </div>
              <div className="text-sm text-green-700">Accuracy</div>
            </div>

            {/* Confusion Matrix */}
            {results.metrics.confusionMatrix && (
              <div>
                <h4 className="font-medium text-secondary-900 mb-2">Confusion Matrix</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="p-2 text-left">Actual \ Predicted</th>
                        {results.metrics.confusionMatrix[0].map((_, index) => (
                          <th key={index} className="p-2 text-center">Class {index}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.metrics.confusionMatrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="p-2 font-medium">Class {rowIndex}</td>
                          {row.map((value, colIndex) => (
                            <td
                              key={colIndex}
                              className={`p-2 text-center ${
                                rowIndex === colIndex ? 'bg-green-100' : 'bg-red-50'
                              }`}
                            >
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Predictions Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Predictions Preview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-2 px-3">Sample</th>
                <th className="text-left py-2 px-3">Prediction</th>
              </tr>
            </thead>
            <tbody>
              {results.predictions.slice(0, 10).map((prediction, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">
                    {model.config.taskType === 'classification'
                      ? `Class ${prediction}`
                      : prediction.toFixed(4)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.predictions.length > 10 && (
          <p className="text-sm text-secondary-500 mt-2">
            Showing first 10 of {results.predictions.length} predictions
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default PredictorResults;