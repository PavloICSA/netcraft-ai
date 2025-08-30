import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

interface ErrorPageProps {
  error?: Error;
  resetError?: () => void;
}

/**
 * Error boundary page for unexpected errors
 */
const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetError }) => {
  const { t } = useTranslation('pages');
  
  // Ensure page starts from top
  useScrollToTop();

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Error Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-gray-100 mb-4">
          {t('error.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-400 mb-8">
          {t('error.description')}
        </p>
      </motion.div>

      {/* Error Details */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        >
          <h2 className="text-lg font-semibold text-red-900 mb-2">
            Error Details
          </h2>
          <p className="text-red-700 text-sm font-mono">
            {error.message}
          </p>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-4"
      >
        {resetError && (
          <button onClick={resetError} className="btn-primary">
            {t('error.retry')}
          </button>
        )}
        <Link to="/" className="btn-secondary">
          {t('error.backToHome')}
        </Link>
      </motion.div>

      {/* Helpful Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          What can you do?
        </h2>
        <ul className="text-left space-y-2 text-secondary-700 dark:text-gray-300">
          <li>• Try refreshing the page</li>
          <li>• Check your internet connection</li>
          <li>• Clear your browser cache</li>
          <li>• Try a different browser</li>
          <li>• Contact support if the problem persists</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default ErrorPage;