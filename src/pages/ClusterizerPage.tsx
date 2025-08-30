import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';
import ClusterizerForm from '../components/Clusterizer/ClusterizerForm';
import ClusterResults from '../components/Clusterizer/ClusterResults';
import { ClusterConfig, ClusterResult } from '../types';
import { kMeans } from '../lib/cluster/kmeans';
import { trainSOM } from '../lib/cluster/som';
import { useProject } from '../contexts/ProjectContext';

/**
 * Clustering analysis page
 */
const ClusterizerPage: React.FC = () => {
  // Ensure page starts from top
  useScrollToTop();
  
  const { t } = useTranslation('clusterizer');
  const { projectState, updateModel, updateResults } = useProject();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ step: string; progress: number } | null>(null);

  const currentDataset = projectState.currentDataset || null;
  const results = projectState.results.clusters || null;

  /**
   * Handle clustering
   */
  const handleCluster = async (config: ClusterConfig, data: number[][]) => {
    try {
      setIsProcessing(true);
      setProcessingProgress({ step: t('page.processing.initializing'), progress: 0 });

      let clusterResult: ClusterResult;

      if (config.method === 'kmeans') {
        setProcessingProgress({ step: t('page.processing.runningKmeans'), progress: 25 });
        
        clusterResult = kMeans(data, {
          k: config.k!,
          maxIterations: 100,
          tolerance: 1e-6,
          initMethod: 'kmeans++'
        });
        
        setProcessingProgress({ step: t('page.processing.calculatingMetrics'), progress: 75 });
      } else {
        setProcessingProgress({ step: t('page.processing.trainingSOM'), progress: 25 });
        
        const somResult = trainSOM(data, {
          gridSize: config.gridSize!,
          epochs: config.epochs,
          learningRate: config.learningRate || 0.1,
          neighborhoodRadius: Math.max(config.gridSize![0], config.gridSize![1]) / 2
        });
        
        // Pass the full SOM result for visualization
        clusterResult = somResult;
        
        setProcessingProgress({ step: t('page.processing.finalizingSOM'), progress: 75 });
      }

      setProcessingProgress({ step: t('page.processing.complete'), progress: 100 });
      
      // Update project state through context
      updateModel('cluster', clusterResult);
      updateResults('clusters', clusterResult);

      // Clear progress after a short delay
      setTimeout(() => setProcessingProgress(null), 1000);

    } catch (error) {
      console.error('Clustering failed:', error);
      alert(t('page.clusteringFailed', { error: error instanceof Error ? error.message : 'Unknown error' }));
      setProcessingProgress(null);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentDataset) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-2">{t('page.noDataset')}</h2>
        <p className="text-secondary-600 dark:text-gray-400 mb-6">{t('page.noDatasetMessage')}</p>
        <a href="/data" className="btn-primary">
          {t('page.goToDataPage')}
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
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-gray-100 mb-2">
          {t('page.title')}
        </h1>
        <p className="text-secondary-600 dark:text-gray-400">
          {t('page.description')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ClusterizerForm
            dataset={currentDataset}
            onCluster={handleCluster}
            isProcessing={isProcessing}
            processingProgress={processingProgress}
          />
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ClusterResults
            results={results}
            dataset={currentDataset}
            isProcessing={isProcessing}
            processingProgress={processingProgress}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ClusterizerPage;