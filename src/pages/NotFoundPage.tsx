import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * 404 Not Found page
 */
const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('pages');
  
  // Ensure page starts from top
  useScrollToTop();

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* 404 Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-9xl font-bold text-primary-200 mb-4">404</div>
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-gray-100 mb-4">
          {t('notFound.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-400 mb-8">
          {t('notFound.description')}
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <Link to="/" className="btn-primary">
          {t('notFound.backToHome')}
        </Link>
      </motion.div>

      {/* Helpful Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          Popular Pages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/predictor" className="text-primary-600 hover:text-primary-700 transition-colors">
            Neural Networks
          </Link>
          <Link to="/clusterizer" className="text-primary-600 hover:text-primary-700 transition-colors">
            Clustering Analysis
          </Link>
          <Link to="/forecasting" className="text-primary-600 hover:text-primary-700 transition-colors">
            Time Series Forecasting
          </Link>
          <Link to="/about" className="text-primary-600 hover:text-primary-700 transition-colors">
            About NetCraft AI
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;