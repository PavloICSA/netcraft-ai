import React from 'react';
import { motion } from 'framer-motion';
import { ClusterResult, Dataset } from '../../types';
import SOMVisualization from './SOMVisualization';
import { SOMResult } from '../../lib/cluster/som';

interface ClusterResultsProps {
  results: ClusterResult | null;
  dataset: Dataset;
  isProcessing: boolean;
  processingProgress: { step: string; progress: number } | null;
}

/**
 * Clustering results display component
 */
const ClusterResults: React.FC<ClusterResultsProps> = ({
  results,
  dataset,
  isProcessing,
  processingProgress
}) => {
  /**
   * Export cluster assignments as CSV
   */
  const exportClusters = () => {
    if (!results) return;

    try {
      const csvContent = [
        'Index,Cluster',
        ...results.clusters.map((cluster, index) => `${index},${cluster}`)
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `netcraft_clusters_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  /**
   * Export centroids as CSV
   */
  const exportCentroids = () => {
    if (!results?.centroids) return;

    try {
      const headers = ['Cluster', ...Array.from({ length: results.centroids[0].length }, (_, i) => `Feature_${i + 1}`)];
      const csvContent = [
        headers.join(','),
        ...results.centroids.map((centroid, index) => 
          [index, ...centroid.map(val => val.toFixed(6))].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `netcraft_centroids_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  if (isProcessing) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Processing Clusters</h3>
          <p className="text-secondary-600">
            Please wait while the clustering algorithm is running...
          </p>
          {processingProgress && (
            <div className="mt-4">
              <div className="text-sm text-secondary-500 mb-2">
                {processingProgress.step}
              </div>
              <div className="w-full bg-primary-200 rounded-full h-2 max-w-xs mx-auto">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Clusters Generated</h3>
          <p className="text-secondary-600">
            Configure and run clustering to see results here.
          </p>
        </div>
      </div>
    );
  }

  const uniqueClusters = [...new Set(results.clusters)];
  const clusterCounts = uniqueClusters.map(cluster => ({
    cluster,
    count: results.clusters.filter(c => c === cluster).length
  }));

  return (
    <div className="space-y-6">
      {/* Cluster Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Clustering Results
            </h3>
            <div className="text-sm text-secondary-600 space-y-1">
              <div>Total samples: {results.clusters.length}</div>
              <div>Number of clusters: {uniqueClusters.length}</div>
              {results.inertia && (
                <div>Inertia: {results.inertia.toFixed(4)}</div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportClusters}
              className="btn-secondary text-sm"
            >
              Export Clusters
            </button>
            {results.centroids && (
              <button
                onClick={exportCentroids}
                className="btn-secondary text-sm"
              >
                Export Centroids
              </button>
            )}
          </div>
        </div>

        {/* Cluster Distribution */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clusterCounts.map(({ cluster, count }) => (
            <div key={cluster} className="bg-secondary-50 p-3 rounded-lg text-center">
              <div className="text-lg font-bold text-secondary-900">
                {count}
              </div>
              <div className="text-sm text-secondary-600">
                Cluster {cluster}
              </div>
              <div className="text-xs text-secondary-500">
                {((count / results.clusters.length) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Centroids */}
      {results.centroids && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Cluster Centroids
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-2 px-3">Cluster</th>
                  {results.centroids[0].map((_, index) => (
                    <th key={index} className="text-left py-2 px-3">
                      Feature {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.centroids.map((centroid, clusterIndex) => (
                  <tr key={clusterIndex} className="border-b border-secondary-100">
                    <td className="py-2 px-3 font-medium">
                      Cluster {clusterIndex}
                    </td>
                    {centroid.map((value, featureIndex) => (
                      <td key={featureIndex} className="py-2 px-3">
                        {value.toFixed(4)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Sample Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Sample Assignments (First 20)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-2 px-3">Sample</th>
                <th className="text-left py-2 px-3">Cluster</th>
                <th className="text-left py-2 px-3">Original Data</th>
              </tr>
            </thead>
            <tbody>
              {results.clusters.slice(0, 20).map((cluster, index) => (
                <tr key={index} className="border-b border-secondary-100">
                  <td className="py-2 px-3">{index + 1}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cluster === 0 ? 'bg-blue-100 text-blue-800' :
                      cluster === 1 ? 'bg-green-100 text-green-800' :
                      cluster === 2 ? 'bg-purple-100 text-purple-800' :
                      cluster === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Cluster {cluster}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-xs text-secondary-600">
                    {dataset.data[index] ? 
                      Object.entries(dataset.data[index])
                        .slice(0, 3)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ') + (Object.keys(dataset.data[index]).length > 3 ? '...' : '')
                      : 'N/A'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {results.clusters.length > 20 && (
          <p className="text-sm text-secondary-500 mt-2">
            Showing first 20 of {results.clusters.length} samples
          </p>
        )}
      </motion.div>

      {/* SOM Visualization */}
      {results.somWeights && 'nodes' in results && 'gridSize' in results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Self-Organizing Map
          </h3>
          <SOMVisualization
            somResult={results as SOMResult}
            originalData={dataset.data.map(row => 
              dataset.columns
                .filter(col => col.type === 'numeric')
                .map(col => parseFloat(row[col.name]) || 0)
            )}
            showUMatrix={true}
            showDataMapping={true}
            showComponentPlanes={false}
          />
        </motion.div>
      )}
    </div>
  );
};

export default ClusterResults;