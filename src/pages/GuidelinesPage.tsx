import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * Guidelines page with usage instructions and best practices
 */
const GuidelinesPage: React.FC = () => {
  const { t } = useTranslation(['pages', 'guides']);
  
  // Ensure page starts from top
  useScrollToTop();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-gray-100 mb-4">
          {t('guides:title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-400">
          {t('guides:subtitle')}
        </p>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('guides:gettingStarted.title')}</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">{t('guides:gettingStarted.steps.uploadData.title')}</h3>
              <p className="text-secondary-600 dark:text-gray-400">
                {t('guides:gettingStarted.steps.uploadData.description')}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">{t('guides:gettingStarted.steps.exploreData.title')}</h3>
              <p className="text-secondary-600 dark:text-gray-400">
                {t('guides:gettingStarted.steps.exploreData.description')}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">{t('guides:gettingStarted.steps.chooseAnalysis.title')}</h3>
              <p className="text-secondary-600 dark:text-gray-400">
                {t('guides:gettingStarted.steps.chooseAnalysis.description')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Neural Network Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('guides:neuralNetwork.title')}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:neuralNetwork.dataPreparation.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:neuralNetwork.dataPreparation.cleanData')}</li>
              <li>• {t('guides:neuralNetwork.dataPreparation.numericFeatures')}</li>
              <li>• {t('guides:neuralNetwork.dataPreparation.scaleConsideration')}</li>
              <li>• {t('guides:neuralNetwork.dataPreparation.sampleSize')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:neuralNetwork.architectureSelection.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:neuralNetwork.architectureSelection.startSimple')}</li>
              <li>• {t('guides:neuralNetwork.architectureSelection.layerSize')}</li>
              <li>• {t('guides:neuralNetwork.architectureSelection.activationFunctions')}</li>
              <li>• {t('guides:neuralNetwork.architectureSelection.outputLayer')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:neuralNetwork.trainingParameters.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:neuralNetwork.trainingParameters.learningRate')}</li>
              <li>• {t('guides:neuralNetwork.trainingParameters.epochs')}</li>
              <li>• {t('guides:neuralNetwork.trainingParameters.batchSize')}</li>
              <li>• {t('guides:neuralNetwork.trainingParameters.monitorTraining')}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Random Forest Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('guides:randomForest.title')}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:randomForest.dataPreparation.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:randomForest.dataPreparation.mixedDataTypes')}</li>
              <li>• {t('guides:randomForest.dataPreparation.missingValues')}</li>
              <li>• {t('guides:randomForest.dataPreparation.featureSelection')}</li>
              <li>• {t('guides:randomForest.dataPreparation.sampleSize')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:randomForest.modelConfiguration.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:randomForest.modelConfiguration.numberOfTrees')}</li>
              <li>• {t('guides:randomForest.modelConfiguration.maxDepth')}</li>
              <li>• {t('guides:randomForest.modelConfiguration.minSamplesSplit')}</li>
              <li>• {t('guides:randomForest.modelConfiguration.featureSampling')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:randomForest.performanceOptimization.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:randomForest.performanceOptimization.featureImportance')}</li>
              <li>• {t('guides:randomForest.performanceOptimization.crossValidation')}</li>
              <li>• {t('guides:randomForest.performanceOptimization.ensembleSize')}</li>
              <li>• {t('guides:randomForest.performanceOptimization.interpretability')}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Clustering Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('guides:clustering.title')}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:clustering.featureSelection.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:clustering.featureSelection.relevantFeatures')}</li>
              <li>• {t('guides:clustering.featureSelection.numericOnly')}</li>
              <li>• {t('guides:clustering.featureSelection.featureScaling')}</li>
              <li>• {t('guides:clustering.featureSelection.dimensionality')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:clustering.kmeansGuidelines.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:clustering.kmeansGuidelines.numberOfClusters')}</li>
              <li>• {t('guides:clustering.kmeansGuidelines.dataShape')}</li>
              <li>• {t('guides:clustering.kmeansGuidelines.initialization')}</li>
              <li>• {t('guides:clustering.kmeansGuidelines.evaluation')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:clustering.som.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:clustering.som.gridSize')}</li>
              <li>• {t('guides:clustering.som.trainingEpochs')}</li>
              <li>• {t('guides:clustering.som.learningRate')}</li>
              <li>• {t('guides:clustering.som.topology')}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Time Series Forecasting Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('guides:timeSeries.title')}</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:timeSeries.dataRequirements.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:timeSeries.dataRequirements.timeColumn')}</li>
              <li>• {t('guides:timeSeries.dataRequirements.regularIntervals')}</li>
              <li>• {t('guides:timeSeries.dataRequirements.sufficientHistory')}</li>
              <li>• {t('guides:timeSeries.dataRequirements.dataQuality')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:timeSeries.algorithmSelection.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:timeSeries.algorithmSelection.movingAverage')}</li>
              <li>• {t('guides:timeSeries.algorithmSelection.exponentialSmoothing')}</li>
              <li>• {t('guides:timeSeries.algorithmSelection.linearTrend')}</li>
              <li>• {t('guides:timeSeries.algorithmSelection.combination')}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:timeSeries.validationAndTuning.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:timeSeries.validationAndTuning.trainTestSplit')}</li>
              <li>• {t('guides:timeSeries.validationAndTuning.forecastHorizon')}</li>
              <li>• {t('guides:timeSeries.validationAndTuning.errorMetrics')}</li>
              <li>• {t('guides:timeSeries.validationAndTuning.seasonality')}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Data Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('guides:dataRequirements.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:dataRequirements.fileFormat.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:dataRequirements.fileFormat.csvWithHeaders')}</li>
              <li>• {t('guides:dataRequirements.fileFormat.utf8Encoding')}</li>
              <li>• {t('guides:dataRequirements.fileFormat.commaSeparated')}</li>
              <li>• {t('guides:dataRequirements.fileFormat.maxFileSize')}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:dataRequirements.dataQuality.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:dataRequirements.dataQuality.consistentDataTypes')}</li>
              <li>• {t('guides:dataRequirements.dataQuality.minimalMissingValues')}</li>
              <li>• {t('guides:dataRequirements.dataQuality.meaningfulColumnNames')}</li>
              <li>• {t('guides:dataRequirements.dataQuality.sufficientSampleSize')}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Troubleshooting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('guides:troubleshooting.title')}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('guides:troubleshooting.trainingIssues.title')}</h3>
            <ul className="space-y-1 text-sm text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:troubleshooting.trainingIssues.lossNotDecreasing')}</li>
              <li>• {t('guides:troubleshooting.trainingIssues.trainingTooSlow')}</li>
              <li>• {t('guides:troubleshooting.trainingIssues.poorAccuracy')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('guides:troubleshooting.randomForestIssues.title')}</h3>
            <ul className="space-y-1 text-sm text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:troubleshooting.randomForestIssues.overfitting')}</li>
              <li>• {t('guides:troubleshooting.randomForestIssues.poorPerformance')}</li>
              <li>• {t('guides:troubleshooting.randomForestIssues.slowTraining')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('guides:troubleshooting.clusteringIssues.title')}</h3>
            <ul className="space-y-1 text-sm text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:troubleshooting.clusteringIssues.poorClusters')}</li>
              <li>• {t('guides:troubleshooting.clusteringIssues.noClearPatterns')}</li>
              <li>• {t('guides:troubleshooting.clusteringIssues.somNotConverging')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('guides:troubleshooting.forecastingIssues.title')}</h3>
            <ul className="space-y-1 text-sm text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:troubleshooting.forecastingIssues.poorAccuracy')}</li>
              <li>• {t('guides:troubleshooting.forecastingIssues.unstableForecasts')}</li>
              <li>• {t('guides:troubleshooting.forecastingIssues.noTrendCaptured')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('guides:troubleshooting.dataIssues.title')}</h3>
            <ul className="space-y-1 text-sm text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:troubleshooting.dataIssues.uploadFails')}</li>
              <li>• {t('guides:troubleshooting.dataIssues.wrongDataTypes')}</li>
              <li>• {t('guides:troubleshooting.dataIssues.missingValues')}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Performance Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('guides:performanceTips.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:performanceTips.browserPerformance.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:performanceTips.browserPerformance.modernBrowsers')}</li>
              <li>• {t('guides:performanceTips.browserPerformance.closeUnnecessaryTabs')}</li>
              <li>• {t('guides:performanceTips.browserPerformance.sufficientRAM')}</li>
              <li>• {t('guides:performanceTips.browserPerformance.useDesktop')}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('guides:performanceTips.modelOptimization.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• {t('guides:performanceTips.modelOptimization.startSmaller')}</li>
              <li>• {t('guides:performanceTips.modelOptimization.appropriateBatchSizes')}</li>
              <li>• {t('guides:performanceTips.modelOptimization.monitorProgress')}</li>
              <li>• {t('guides:performanceTips.modelOptimization.saveRegularly')}</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GuidelinesPage;