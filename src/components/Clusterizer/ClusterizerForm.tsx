import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dataset, ClusterConfig } from '../../types';

interface ClusterizerFormProps {
  dataset: Dataset;
  onCluster: (config: ClusterConfig, data: number[][]) => void;
  isProcessing: boolean;
  processingProgress: { step: string; progress: number } | null;
}

/**
 * Clustering configuration form
 */
const ClusterizerForm: React.FC<ClusterizerFormProps> = ({
  dataset,
  onCluster,
  isProcessing,
  processingProgress
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [method, setMethod] = useState<'kmeans' | 'som'>('kmeans');
  const [k, setK] = useState(3);
  const [gridWidth, setGridWidth] = useState(5);
  const [gridHeight, setGridHeight] = useState(5);
  const [epochs, setEpochs] = useState(100);
  const [learningRate, setLearningRate] = useState(0.1);

  const numericColumns = dataset.columns.filter(col => col.type === 'numeric');

  // Auto-select numeric columns
  useEffect(() => {
    if (numericColumns.length > 0 && selectedColumns.length === 0) {
      setSelectedColumns(numericColumns.slice(0, 4).map(col => col.name));
    }
  }, [dataset]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedColumns.length === 0) {
      alert('Please select at least one column for clustering');
      return;
    }

    // Prepare data
    const data: number[][] = dataset.data.map(row => {
      return selectedColumns.map(col => {
        const value = row[col];
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      });
    });

    // Create configuration
    const config: ClusterConfig = {
      method,
      epochs,
      ...(method === 'kmeans' ? { k } : {
        gridSize: [gridWidth, gridHeight] as [number, number],
        learningRate
      })
    };

    onCluster(config, data);
  };

  /**
   * Toggle column selection
   */
  const toggleColumn = (columnName: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnName)
        ? prev.filter(name => name !== columnName)
        : [...prev, columnName]
    );
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-secondary-900 mb-6">
        Clustering Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Feature Selection */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Feature Selection</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Select Features for Clustering
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-secondary-200 rounded-lg p-3">
              {numericColumns.map(column => (
                <label key={column.name} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.name)}
                    onChange={() => toggleColumn(column.name)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-secondary-700">{column.name}</span>
                  {column.stats && (
                    <span className="ml-auto text-xs text-secondary-500">
                      {column.stats.min?.toFixed(2)} - {column.stats.max?.toFixed(2)}
                    </span>
                  )}
                </label>
              ))}
            </div>
            <p className="text-xs text-secondary-500 mt-1">
              Selected: {selectedColumns.length} features
            </p>
          </div>
        </div>

        {/* Method Selection */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Clustering Method</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              method === 'kmeans' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
            }`}>
              <input
                type="radio"
                value="kmeans"
                checked={method === 'kmeans'}
                onChange={(e) => setMethod(e.target.value as 'kmeans')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-lg font-semibold text-secondary-900 mb-2">K-Means</div>
                <div className="text-sm text-secondary-600">
                  Partitions data into k clusters by minimizing within-cluster variance
                </div>
              </div>
            </label>

            <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              method === 'som' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-primary-300'
            }`}>
              <input
                type="radio"
                value="som"
                checked={method === 'som'}
                onChange={(e) => setMethod(e.target.value as 'som')}
                className="sr-only"
              />
              <div className="text-center">
                <div className="text-lg font-semibold text-secondary-900 mb-2">Self-Organizing Map</div>
                <div className="text-sm text-secondary-600">
                  Neural network that creates a topology-preserving map of the data
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Method-specific Parameters */}
        <div>
          <h3 className="text-lg font-medium text-secondary-900 mb-4">Parameters</h3>
          
          {method === 'kmeans' ? (
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Number of Clusters (k)
              </label>
              <input
                type="number"
                value={k}
                onChange={(e) => setK(parseInt(e.target.value) || 3)}
                min="2"
                max="20"
                className="input-field"
                onInvalid={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('Please enter a number between 2 and 20');
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.setCustomValidity('');
                }}
              />
              <p className="text-xs text-secondary-500 mt-1">
                Choose the number of clusters to create (2-20)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Grid Width
                  </label>
                  <input
                    type="number"
                    value={gridWidth}
                    onChange={(e) => setGridWidth(parseInt(e.target.value) || 5)}
                    min="2"
                    max="20"
                    className="input-field"
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('Please enter a number between 2 and 20');
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('');
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Grid Height
                  </label>
                  <input
                    type="number"
                    value={gridHeight}
                    onChange={(e) => setGridHeight(parseInt(e.target.value) || 5)}
                    min="2"
                    max="20"
                    className="input-field"
                    onInvalid={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('Please enter a number between 2 and 20');
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      target.setCustomValidity('');
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Learning Rate
                </label>
                <input
                  type="number"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value) || 0.1)}
                  min="0.001"
                  max="1"
                  step="0.01"
                  className="input-field"
                  onInvalid={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.validity.rangeUnderflow) {
                      target.setCustomValidity('Please enter a value between 0.001 and 1');
                    } else if (target.validity.rangeOverflow) {
                      target.setCustomValidity('Please enter a value between 0.001 and 1');
                    } else if (target.validity.stepMismatch) {
                      target.setCustomValidity('Please enter a valid decimal number');
                    } else {
                      target.setCustomValidity('Please enter a valid learning rate between 0.001 and 1');
                    }
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.setCustomValidity('');
                  }}
                />
                <p className="text-xs text-secondary-500 mt-1">
                  Controls how quickly the network adapts (0.001-1.0)
                </p>
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Training Epochs
            </label>
            <input
              type="number"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value) || 100)}
              min="10"
              max="1000"
              className="input-field"
              onInvalid={(e) => {
                const target = e.target as HTMLInputElement;
                target.setCustomValidity('Please enter a number between 10 and 1000');
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.setCustomValidity('');
              }}
            />
            <p className="text-xs text-secondary-500 mt-1">
              Number of training iterations (10-1000)
            </p>
          </div>
        </div>

        {/* Processing Progress */}
        {isProcessing && processingProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary-50 border border-primary-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-primary-900">
                {processingProgress.step}
              </span>
              <span className="text-sm text-primary-700">
                {processingProgress.progress}%
              </span>
            </div>
            <div className="w-full bg-primary-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${processingProgress.progress}%` }}
              />
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || selectedColumns.length === 0}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Run ${method === 'kmeans' ? 'K-Means' : 'SOM'} Clustering`}
        </button>
      </form>

      {/* Data Summary */}
      <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
        <h4 className="font-medium text-secondary-900 mb-2">Data Summary</h4>
        <div className="text-sm text-secondary-600 space-y-1">
          <div>Total samples: {dataset.data.length}</div>
          <div>Selected features: {selectedColumns.length}</div>
          <div>Method: {method === 'kmeans' ? 'K-Means' : 'Self-Organizing Map'}</div>
          {method === 'kmeans' ? (
            <div>Target clusters: {k}</div>
          ) : (
            <div>SOM grid: {gridWidth} × {gridHeight} = {gridWidth * gridHeight} nodes</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClusterizerForm;