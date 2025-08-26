import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PredictorForm from '../components/Predictor/PredictorForm';
import PredictorResults from '../components/Predictor/PredictorResults';
import { Dataset, ANNConfig, ANNModel, PredictionResult } from '../types';
import { createModel } from '../lib/ann/ann-logic-1';
import { trainModel, evaluateModel } from '../lib/ann/ann-logic-2';
import { storageUtils } from '../lib/data/migration-utils';

/**
 * Neural network predictor page
 */
const PredictorPage: React.FC = () => {
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [model, setModel] = useState<ANNModel | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<{ epoch: number; loss: number; accuracy?: number } | null>(null);
  const [results, setResults] = useState<PredictionResult | null>(null);

  // Load project state on mount
  useEffect(() => {
    const projectState = JSON.parse(storageUtils.getProjectState() || '{"models":{},"results":{}}');
    if (projectState.currentDataset) {
      setCurrentDataset(projectState.currentDataset);
    }
    if (projectState.models.ann) {
      setModel(projectState.models.ann);
    }
    if (projectState.results.predictions) {
      setResults(projectState.results.predictions);
    }
  }, []);

  /**
   * Handle model training
   */
  const handleTrain = async (config: ANNConfig, trainData: { inputs: number[][]; targets: number[][] }) => {
    try {
      setIsTraining(true);
      setTrainingProgress(null);
      setResults(null);

      // Create new model
      const newModel = createModel(config);
      
      // Train model with progress callback
      await trainModel(
        newModel,
        trainData.inputs,
        trainData.targets,
        (epoch, loss, accuracy) => {
          setTrainingProgress({ epoch, loss, accuracy });
        }
      );

      // Evaluate model
      const evaluation = evaluateModel(newModel, trainData.inputs, trainData.targets);
      
      setModel(newModel);
      setResults(evaluation);

      // Save to project state
      const projectState = JSON.parse(storageUtils.getProjectState() || '{"models":{},"results":{}}');
      projectState.models.ann = newModel;
      projectState.results.predictions = evaluation;
      storageUtils.setProjectState(JSON.stringify(projectState));

    } catch (error) {
      console.error('Training failed:', error);
      alert(`Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTraining(false);
    }
  };

  if (!currentDataset) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">No Dataset Loaded</h2>
        <p className="text-secondary-600 mb-6">Please upload a dataset first to start building neural network models.</p>
        <a href="/data" className="btn-primary">
          Go to Data Page
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Neural Network Predictor
        </h1>
        <p className="text-secondary-600">
          Build and train neural networks for regression and classification tasks
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PredictorForm
            dataset={currentDataset}
            onTrain={handleTrain}
            isTraining={isTraining}
            trainingProgress={trainingProgress}
          />
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PredictorResults
            model={model}
            results={results}
            isTraining={isTraining}
            trainingProgress={trainingProgress}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default PredictorPage;