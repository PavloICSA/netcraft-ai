import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataUploader from '../components/Data/DataUploader';
import DataPreview from '../components/Data/DataPreview';
import { Dataset } from '../types';
import { storageUtils } from '../lib/data/migration-utils';

/**
 * Data management page for uploading and previewing datasets
 */
const DataPage: React.FC = () => {
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [savedDatasets, setSavedDatasets] = useState<Dataset[]>([]);

  // Load saved datasets from localStorage on mount
  useEffect(() => {
    const saved = storageUtils.getDatasets();
    if (saved) {
      try {
        const datasets = JSON.parse(saved);
        setSavedDatasets(datasets);
      } catch (error) {
        console.error('Failed to load saved datasets:', error);
      }
    }
  }, []);

  // Save datasets to localStorage when they change
  useEffect(() => {
    if (savedDatasets.length > 0) {
      storageUtils.setDatasets(JSON.stringify(savedDatasets));
    }
  }, [savedDatasets]);

  /**
   * Handle new dataset upload
   */
  const handleDatasetLoaded = (dataset: Dataset) => {
    setCurrentDataset(dataset);
    
    // Add to saved datasets if not already present
    setSavedDatasets(prev => {
      const exists = prev.find(d => d.id === dataset.id);
      if (!exists) {
        return [dataset, ...prev.slice(0, 9)]; // Keep only 10 most recent
      }
      return prev;
    });

    // Save to project state
    const projectState = JSON.parse(storageUtils.getProjectState() || '{"models":{},"results":{}}');
    projectState.currentDataset = dataset;
    storageUtils.setProjectState(JSON.stringify(projectState));
    
    // Notify App component of storage update
    window.dispatchEvent(new CustomEvent('netcraft-storage-update'));
  };

  /**
   * Load a saved dataset
   */
  const loadSavedDataset = (dataset: Dataset) => {
    setCurrentDataset(dataset);
    
    // Save to project state
    const projectState = JSON.parse(storageUtils.getProjectState() || '{"models":{},"results":{}}');
    projectState.currentDataset = dataset;
    storageUtils.setProjectState(JSON.stringify(projectState));
    
    // Notify App component of storage update
    window.dispatchEvent(new CustomEvent('netcraft-storage-update'));
  };

  /**
   * Delete a saved dataset
   */
  const deleteSavedDataset = (datasetId: string) => {
    setSavedDatasets(prev => prev.filter(d => d.id !== datasetId));
    
    if (currentDataset?.id === datasetId) {
      setCurrentDataset(null);
      
      // Clear from project state as well
      const projectState = JSON.parse(storageUtils.getProjectState() || '{"models":{},"results":{}}');
      delete projectState.currentDataset;
      storageUtils.setProjectState(JSON.stringify(projectState));
      
      // Notify App component of storage update
      window.dispatchEvent(new CustomEvent('netcraft-storage-update'));
    }
  };

  /**
   * Clear all datasets
   */
  const clearAllDatasets = () => {
    if (window.confirm('Are you sure you want to clear all datasets? This action cannot be undone.')) {
      setSavedDatasets([]);
      setCurrentDataset(null);
      
      // Clear from project state as well
      const projectState = JSON.parse(storageUtils.getProjectState() || '{"models":{},"results":{}}');
      delete projectState.currentDataset;
      storageUtils.setProjectState(JSON.stringify(projectState));
      
      // Clear saved datasets from localStorage
      storageUtils.setDatasets('[]');
      
      // Notify App component of storage update
      window.dispatchEvent(new CustomEvent('netcraft-storage-update'));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Data Management
        </h1>
        <p className="text-secondary-600">
          Upload and manage your datasets for analysis
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <DataUploader onDatasetLoaded={handleDatasetLoaded} />
        </div>

        {/* Saved Datasets Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-secondary-900">
              Recent Datasets
            </h3>
            {savedDatasets.length > 0 && (
              <button
                onClick={clearAllDatasets}
                className="text-xs text-secondary-500 hover:text-red-500 transition-colors duration-200"
              >
                Clear All
              </button>
            )}
          </div>
          
          {savedDatasets.length === 0 ? (
            <p className="text-secondary-500 text-sm">
              No saved datasets yet. Upload a CSV file to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {savedDatasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    currentDataset?.id === dataset.id
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                  onClick={() => loadSavedDataset(dataset)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-secondary-900 truncate">
                        {dataset.name}
                      </h4>
                      <p className="text-xs text-secondary-500 mt-1">
                        {dataset.data.length} rows • {dataset.columns.length} columns
                      </p>
                      <p className="text-xs text-secondary-400 mt-1">
                        {new Date(dataset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSavedDataset(dataset.id);
                      }}
                      className="text-secondary-400 hover:text-red-500 ml-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Data Preview */}
      {currentDataset && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataPreview dataset={currentDataset} />
        </motion.div>
      )}
    </div>
  );
};

export default DataPage;