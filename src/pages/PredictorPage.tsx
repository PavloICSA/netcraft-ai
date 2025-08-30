import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollToTop } from '../utils/useScrollToTop';
import PredictorForm from '../components/Predictor/PredictorForm';
import PredictorResults from '../components/Predictor/PredictorResults';
import RandomForestForm from '../components/Predictor/RandomForestForm';
import RandomForestResults from '../components/Predictor/RandomForestResults';
import { ANNConfig, RandomForestConfig } from '../types';
import { createModel } from '../lib/ann/ann-logic-1';
import { trainModel, evaluateModel } from '../lib/ann/ann-logic-2';
import { RandomForest } from '../lib/random-forest/RandomForest';
import { useProject } from '../contexts/ProjectContext';

/**
 * Machine learning predictor page with Neural Networks and Random Forest
 */
const PredictorPage: React.FC = () => {
  // Ensure page starts from top
  useScrollToTop();

  const { projectState, updateModel, updateResults } = useProject();
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'neural-network' | 'random-forest'>('neural-network');

  const currentDataset = projectState.currentDataset || null;

  // Neural Network state
  const [isAnnTraining, setIsAnnTraining] = useState(false);
  const [annTrainingProgress, setAnnTrainingProgress] = useState<{ epoch: number; loss: number; accuracy?: number } | null>(null);

  // Random Forest state
  const [rfFeatureNames, setRfFeatureNames] = useState<string[]>([]);
  const [isRfTraining, setIsRfTraining] = useState(false);
  const [rfTrainingProgress, setRfTrainingProgress] = useState<{ progress: number; treesCompleted: number; totalTrees: number } | null>(null);

  // Get models and results from project state
  const annModel = projectState.models.ann || null;
  const annResults = projectState.results.predictions || null;
  const rfModel = projectState.models.randomForest || null;
  const rfResults = projectState.results.randomForest || null;

  /**
   * Handle Neural Network training
   */
  const handleAnnTrain = async (config: ANNConfig, trainData: {
    inputs: number[][];
    targets: number[][];
    inputNormalizationStats?: { mean: number; std: number }[];
    targetNormalizationStats?: { mean: number; std: number }[];
  }) => {
    try {
      setIsAnnTraining(true);
      setAnnTrainingProgress(null);

      // Create new model
      const newModel = createModel(config);

      // Store normalization stats in the model for later use
      (newModel as any).inputNormalizationStats = trainData.inputNormalizationStats;
      (newModel as any).targetNormalizationStats = trainData.targetNormalizationStats;

      // Train model with progress callback
      await trainModel(
        newModel,
        trainData.inputs,
        trainData.targets,
        (epoch, loss, accuracy) => {
          setAnnTrainingProgress({ epoch, loss, accuracy });
        }
      );

      // Evaluate model
      const evaluation = evaluateModel(newModel, trainData.inputs, trainData.targets);

      // Update project state through context
      updateModel('ann', newModel);
      updateResults('predictions', evaluation);

    } catch (error) {
      console.error('Neural Network training failed:', error);
      alert(`Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnnTraining(false);
    }
  };

  /**
   * Handle Random Forest training
   */
  const handleRfTrain = async (config: RandomForestConfig, trainData: {
    features: number[][];
    targets: number[];
    featureNames: string[];
    taskType: 'regression' | 'classification';
  }) => {
    try {
      setIsRfTraining(true);
      setRfTrainingProgress(null);
      setRfFeatureNames(trainData.featureNames);

      // Create and train Random Forest
      const rf = new RandomForest(config);

      await rf.train(
        trainData.features,
        trainData.targets,
        trainData.featureNames,
        (progress, treesCompleted) => {
          setRfTrainingProgress({
            progress,
            treesCompleted,
            totalTrees: config.numTrees
          });
        }
      );

      // Make predictions on training data for evaluation
      const predictions = rf.predictBatch(trainData.features);

      // Serialize model
      const serializedModel = rf.serialize();

      // Update project state through context
      updateModel('randomForest', serializedModel);
      updateResults('randomForest', predictions);

    } catch (error) {
      console.error('Random Forest training failed:', error);
      alert(`Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRfTraining(false);
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
          Machine Learning Predictor
        </h1>
        <p className="text-secondary-600">
          Build and train neural networks or random forests for regression and classification tasks
        </p>
      </motion.div>

      {/* Algorithm Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Select Algorithm</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedAlgorithm('neural-network')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedAlgorithm === 'neural-network'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
          >
            Neural Network
          </button>
          <button
            onClick={() => setSelectedAlgorithm('random-forest')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedAlgorithm === 'random-forest'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
          >
            Random Forest
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {selectedAlgorithm === 'neural-network' ? (
            <PredictorForm
              dataset={currentDataset}
              onTrain={handleAnnTrain}
              isTraining={isAnnTraining}
              trainingProgress={annTrainingProgress}
            />
          ) : (
            <RandomForestForm
              dataset={currentDataset}
              onTrain={handleRfTrain}
              isTraining={isRfTraining}
              trainingProgress={rfTrainingProgress}
            />
          )}
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {selectedAlgorithm === 'neural-network' ? (
            <PredictorResults
              model={annModel}
              results={annResults}
              isTraining={isAnnTraining}
              trainingProgress={annTrainingProgress}
            />
          ) : (
            <RandomForestResults
              model={rfModel}
              results={rfResults}
              featureNames={rfFeatureNames}
              isTraining={isRfTraining}
              trainingProgress={rfTrainingProgress}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PredictorPage;