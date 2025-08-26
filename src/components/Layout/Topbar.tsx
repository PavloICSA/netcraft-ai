import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProjectState, Dataset } from '../../types';

interface TopbarProps {
  projectState: ProjectState;
  onDatasetUpdate: (dataset: Dataset) => void;
}

/**
 * Top navigation bar with project info and quick actions
 */
const Topbar: React.FC<TopbarProps> = ({ projectState, onDatasetUpdate }) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  /**
   * Export project data
   */
  const exportProject = (format: 'json' | 'csv') => {
    try {
      if (format === 'json') {
        const dataStr = JSON.stringify(projectState, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `netcraft_project_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv' && projectState.currentDataset) {
        const csv = convertToCSV(projectState.currentDataset.data);
        const dataBlob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${projectState.currentDataset.name}_export.csv`;
        link.click();
        URL.revokeObjectURL(url);
      }
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  /**
   * Convert data to CSV format
   */
  const convertToCSV = (data: Record<string, any>[]): string => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  /**
   * Quick upload CSV
   */
  const handleQuickUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      // Redirect to data page for proper upload handling
      window.location.href = '/data';
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-secondary-200 px-6 py-4"
    >
      <div className="flex justify-between items-center">
        {/* Project Info */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-lg font-semibold text-secondary-900">
              {projectState.currentDataset?.name || 'No Data Uploaded'}
            </h1>
            {projectState.currentDataset && (
              <p className="text-sm text-secondary-600">
                {projectState.currentDataset.data.length} rows • {projectState.currentDataset.columns.length} columns
              </p>
            )}
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            {projectState.models.ann?.trained && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                ANN Trained
              </span>
            )}
            {projectState.results.clusters && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Clustered
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick Upload */}
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleQuickUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </button>

            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50"
              >
                <button
                  onClick={() => exportProject('json')}
                  className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                >
                  Export Project (JSON)
                </button>
                {projectState.currentDataset && (
                  <button
                    onClick={() => exportProject('csv')}
                    className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                  >
                    Export Data (CSV)
                  </button>
                )}
              </motion.div>
            )}
          </div>


        </div>
      </div>

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExportMenu(false)}
        />
      )}
    </motion.header>
  );
};

export default Topbar;