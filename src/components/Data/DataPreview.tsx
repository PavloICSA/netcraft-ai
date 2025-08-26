import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dataset, DataColumn } from '../../types';
import { storageUtils } from '../../lib/data/migration-utils';

interface DataPreviewProps {
  dataset: Dataset;
}

/**
 * Data preview component with column statistics and type information
 */
const DataPreview: React.FC<DataPreviewProps> = ({ dataset }) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(dataset.data.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, dataset.data.length);
  const currentData = dataset.data.slice(startIndex, endIndex);

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

  /**
   * Get type badge color
   */
  const getTypeBadgeColor = (type: DataColumn['type']) => {
    switch (type) {
      case 'numeric':
        return 'bg-blue-100 text-blue-800';
      case 'categorical':
        return 'bg-green-100 text-green-800';
      case 'datetime':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Dataset Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              {dataset.name}
            </h2>
            <p className="text-secondary-600">
              {dataset.data.length} rows • {dataset.columns.length} columns
            </p>
          </div>
          <div className="text-right text-sm text-secondary-500">
            <p>Uploaded: {new Date(dataset.createdAt).toLocaleString()}</p>
            <p>ID: {dataset.id}</p>
          </div>
        </div>

        {/* Column Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {dataset.columns.filter(col => col.type === 'numeric').length}
            </div>
            <div className="text-sm text-blue-700">Numeric Columns</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {dataset.columns.filter(col => col.type === 'categorical').length}
            </div>
            <div className="text-sm text-green-700">Categorical Columns</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {dataset.columns.filter(col => col.type === 'datetime').length}
            </div>
            <div className="text-sm text-purple-700">DateTime Columns</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {selectedColumns.length}
            </div>
            <div className="text-sm text-orange-700">Selected Columns</div>
          </div>
        </div>
      </motion.div>

      {/* Column Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Column Information
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-2 px-3">Select</th>
                <th className="text-left py-2 px-3">Column</th>
                <th className="text-left py-2 px-3">Type</th>
                <th className="text-left py-2 px-3">Unique</th>
                <th className="text-left py-2 px-3">Null</th>
                <th className="text-left py-2 px-3">Statistics</th>
              </tr>
            </thead>
            <tbody>
              {dataset.columns.map((column, index) => (
                <tr key={column.name} className="border-b border-secondary-100">
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.name)}
                      onChange={() => toggleColumn(column.name)}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="py-2 px-3 font-medium text-secondary-900">
                    {column.name}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(column.type)}`}>
                      {column.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-secondary-600">
                    {column.stats?.unique || 0}
                  </td>
                  <td className="py-2 px-3 text-secondary-600">
                    {column.stats?.nullCount || 0}
                  </td>
                  <td className="py-2 px-3 text-sm text-secondary-600">
                    {column.type === 'numeric' && column.stats ? (
                      <div>
                        <div>Min: {column.stats.min?.toFixed(2)}</div>
                        <div>Max: {column.stats.max?.toFixed(2)}</div>
                        <div>Mean: {column.stats.mean?.toFixed(2)}</div>
                      </div>
                    ) : (
                      <div>Non-numeric</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Data Preview Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">
            Data Preview
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-600">
              Showing {startIndex + 1}-{endIndex} of {dataset.data.length} rows
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 text-sm border border-secondary-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 text-sm border border-secondary-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200 bg-secondary-50">
                {dataset.columns.map((column) => (
                  <th key={column.name} className="text-left py-2 px-3 font-medium text-secondary-900">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-secondary-100 hover:bg-secondary-50">
                  {dataset.columns.map((column) => (
                    <td key={column.name} className="py-2 px-3 text-secondary-700">
                      {row[column.name]?.toString() || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="mt-4 text-center text-sm text-secondary-500">
          Page {currentPage + 1} of {totalPages}
        </div>
      </motion.div>

      {/* Action Buttons */}
      {selectedColumns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-primary-50 border-primary-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-primary-900 mb-1">
                {selectedColumns.length} columns selected
              </h4>
              <p className="text-sm text-primary-700">
                Ready to use for prediction or clustering analysis
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Navigate to predictor with selected columns
                  const projectState = JSON.parse(storageUtils.getProjectState() || '{"models":{},"results":{}}');
                  projectState.selectedColumns = selectedColumns;
                  storageUtils.setProjectState(JSON.stringify(projectState));
                  window.location.href = '/predictor';
                }}
                className="btn-primary"
              >
                Use for Prediction
              </button>
              <button
                onClick={() => {
                  // Navigate to clusterizer with selected columns
                  const projectState = JSON.parse(storageUtils.getProjectState() || '{"models":{},"results":{}}');
                  projectState.selectedColumns = selectedColumns;
                  storageUtils.setProjectState(JSON.stringify(projectState));
                  window.location.href = '/clusterizer';
                }}
                className="btn-secondary"
              >
                Use for Clustering
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DataPreview;