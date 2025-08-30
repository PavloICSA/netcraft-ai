import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dataset, DataColumn } from '../../types';
import { useTranslation } from 'react-i18next';
import { useProject } from '../../contexts/ProjectContext';
import LocaleNumber from '../Common/LocaleNumber';
import LocaleDate from '../Common/LocaleDate';

interface DataPreviewProps {
  dataset: Dataset;
}

/**
 * Data preview component with column statistics and type information
 */
const DataPreview: React.FC<DataPreviewProps> = ({ dataset }) => {
  const { t } = useTranslation(['data', 'errors']);
  const { projectState, updateModel, updateResults } = useProject();
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
   * Validate selected columns for analysis
   */
  const validateSelectedColumns = (): string | null => {
    if (selectedColumns.length === 0) {
      return t('validation.noColumnsSelected');
    }
    
    if (selectedColumns.length > 50) {
      return t('validation.tooManyColumns', { max: 50 });
    }

    // Check for columns with insufficient data
    for (const columnName of selectedColumns) {
      const column = dataset.columns.find(col => col.name === columnName);
      if (column && column.stats && column.stats.nullCount === dataset.data.length) {
        return t('validation.emptyColumnValues', { column: columnName });
      }
    }

    return null;
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

  /**
   * Get translated type name
   */
  const getTypeName = (type: DataColumn['type']) => {
    return t(`types.${type}`);
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
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-gray-100 mb-2">
              {dataset.name}
            </h2>
            <p className="text-secondary-600 dark:text-gray-400">
              {t('preview.rowsAndColumns', { rows: dataset.data.length, columns: dataset.columns.length })}
            </p>
          </div>
          <div className="text-right text-sm text-secondary-500">
            <p>{t('preview.uploaded')}: <LocaleDate value={dataset.createdAt} /></p>
            <p>{t('preview.id')}: {dataset.id}</p>
          </div>
        </div>

        {/* Column Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              <LocaleNumber value={dataset.columns.filter(col => col.type === 'numeric').length} />
            </div>
            <div className="text-sm text-blue-700">{t('statistics.numericColumns')}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              <LocaleNumber value={dataset.columns.filter(col => col.type === 'categorical').length} />
            </div>
            <div className="text-sm text-green-700">{t('statistics.categoricalColumns')}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              <LocaleNumber value={dataset.columns.filter(col => col.type === 'datetime').length} />
            </div>
            <div className="text-sm text-purple-700">{t('statistics.datetimeColumns')}</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              <LocaleNumber value={selectedColumns.length} />
            </div>
            <div className="text-sm text-orange-700">{t('statistics.selectedColumns')}</div>
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
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('preview.columnInformation')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-2 px-3">{t('preview.select')}</th>
                <th className="text-left py-2 px-3">{t('preview.column')}</th>
                <th className="text-left py-2 px-3">{t('preview.type')}</th>
                <th className="text-left py-2 px-3">{t('preview.unique')}</th>
                <th className="text-left py-2 px-3">{t('preview.null')}</th>
                <th className="text-left py-2 px-3">{t('preview.statistics')}</th>
              </tr>
            </thead>
            <tbody>
              {dataset.columns.map((column) => (
                <tr key={column.name} className="border-b border-secondary-100">
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.name)}
                      onChange={() => toggleColumn(column.name)}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="py-2 px-3 font-medium text-secondary-900 dark:text-gray-100">
                    {column.name}
                  </td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(column.type)}`}>
                      {getTypeName(column.type)}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-secondary-600 dark:text-gray-400">
                    <LocaleNumber value={column.stats?.unique || 0} />
                  </td>
                  <td className="py-2 px-3 text-secondary-600 dark:text-gray-400">
                    <LocaleNumber value={column.stats?.nullCount || 0} />
                  </td>
                  <td className="py-2 px-3 text-sm text-secondary-600 dark:text-gray-400">
                    {column.type === 'numeric' && column.stats ? (
                      <div>
                        <div>{t('statistics.min')}: <LocaleNumber value={column.stats.min || 0} options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} /></div>
                        <div>{t('statistics.max')}: <LocaleNumber value={column.stats.max || 0} options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} /></div>
                        <div>{t('statistics.mean')}: <LocaleNumber value={column.stats.mean || 0} options={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} /></div>
                      </div>
                    ) : (
                      <div>{t('preview.nonNumeric')}</div>
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
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-gray-100">
            {t('preview.title')}
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-sm text-secondary-600 dark:text-gray-400">
              {t('preview.showing', { start: startIndex + 1, end: endIndex, total: dataset.data.length })}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1 text-sm border border-secondary-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
              >
                {t('preview.previous')}
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 text-sm border border-secondary-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
              >
                {t('preview.next')}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200 bg-secondary-50">
                {dataset.columns.map((column) => (
                  <th key={column.name} className="text-left py-2 px-3 font-medium text-secondary-900 dark:text-gray-100">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-secondary-100 hover:bg-secondary-50">
                  {dataset.columns.map((column) => (
                    <td key={column.name} className="py-2 px-3 text-secondary-700 dark:text-gray-300">
                      {(() => {
                        const value = row[column.name];
                        if (value === null || value === undefined || value === '') {
                          return '—';
                        }
                        
                        // Format numeric values with locale-aware formatting
                        if (column.type === 'numeric' && !isNaN(Number(value))) {
                          return <LocaleNumber value={Number(value)} options={{ maximumFractionDigits: 6 }} />;
                        }
                        
                        // Format datetime values with locale-aware formatting
                        if (column.type === 'datetime') {
                          const date = new Date(value);
                          if (!isNaN(date.getTime())) {
                            return <LocaleDate value={date} />;
                          }
                        }
                        
                        // Return as string for categorical values (preserving technical terms)
                        return value.toString();
                      })()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="mt-4 text-center text-sm text-secondary-500">
          {t('preview.page', { current: currentPage + 1, total: totalPages })}
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
                {t('preview.columnsSelected', { count: selectedColumns.length })}
              </h4>
              <p className="text-sm text-primary-700">
                {t('preview.readyForAnalysis')}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const validationError = validateSelectedColumns();
                  if (validationError) {
                    alert(validationError);
                    return;
                  }
                  // Store selected columns in localStorage for the predictor page
                  localStorage.setItem('netcraft-selected-columns', JSON.stringify(selectedColumns));
                  window.location.href = '/predictor';
                }}
                className="btn-primary"
              >
                {t('preview.useForPrediction')}
              </button>
              <button
                onClick={() => {
                  const validationError = validateSelectedColumns();
                  if (validationError) {
                    alert(validationError);
                    return;
                  }
                  // Store selected columns in localStorage for the clusterizer page
                  localStorage.setItem('netcraft-selected-columns', JSON.stringify(selectedColumns));
                  window.location.href = '/clusterizer';
                }}
                className="btn-primary"
              >
                {t('preview.useForClustering')}
              </button>
              <button
                onClick={() => {
                  const validationError = validateSelectedColumns();
                  if (validationError) {
                    alert(validationError);
                    return;
                  }
                  // Store selected columns in localStorage for the forecasting page
                  localStorage.setItem('netcraft-selected-columns', JSON.stringify(selectedColumns));
                  window.location.href = '/forecasting';
                }}
                className="btn-primary"
              >
                {t('preview.useForForecasting')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DataPreview;