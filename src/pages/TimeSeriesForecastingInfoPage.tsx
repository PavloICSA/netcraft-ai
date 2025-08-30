import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

// Custom styles for text justification
const justifiedTextStyle = {
  textAlign: 'justify' as const,
  textAlignLast: 'justify' as const,
  hyphens: 'auto' as const,
  wordSpacing: '0.1em'
};

/**
 * Time Series Forecasting information page
 */
const TimeSeriesForecastingInfoPage: React.FC = () => {
  const { t } = useTranslation('pages');

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
          {t('timeSeriesInfo.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-300">
          {t('timeSeriesInfo.subtitle')}
        </p>

      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('timeSeriesInfo.whatIs.title')}</h2>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify mb-4">
          {t('timeSeriesInfo.whatIs.description1')}
        </p>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
          {t('timeSeriesInfo.whatIs.description2')}
        </p>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('timeSeriesInfo.howItWorks.title')}</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.howItWorks.step1.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 leading-relaxed" style={justifiedTextStyle}>
                {t('timeSeriesInfo.howItWorks.step1.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-green-600 font-bold text-xl">2</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.howItWorks.step2.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 leading-relaxed" style={justifiedTextStyle}>
                {t('timeSeriesInfo.howItWorks.step2.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-purple-600 font-bold text-xl">3</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.howItWorks.step3.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 leading-relaxed" style={justifiedTextStyle}>
                {t('timeSeriesInfo.howItWorks.step3.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-orange-600 font-bold text-xl">4</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.howItWorks.step4.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 leading-relaxed" style={justifiedTextStyle}>
                {t('timeSeriesInfo.howItWorks.step4.description')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Forecasting Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('timeSeriesInfo.methods.title')}</h2>
        <div className="space-y-6">
          <div className="border-l-4 border-blue-400 pl-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.methods.movingAverage.title')}</h3>
            <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
              {t('timeSeriesInfo.methods.movingAverage.description')}
            </p>
          </div>

          <div className="border-l-4 border-green-400 pl-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.methods.exponentialSmoothing.title')}</h3>
            <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
              {t('timeSeriesInfo.methods.exponentialSmoothing.description')}
            </p>
          </div>

          <div className="border-l-4 border-purple-400 pl-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.methods.linearTrend.title')}</h3>
            <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
              {t('timeSeriesInfo.methods.linearTrend.description')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key Components */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('timeSeriesInfo.components.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('timeSeriesInfo.components.trend.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.components.trend.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('timeSeriesInfo.components.seasonality.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.components.seasonality.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('timeSeriesInfo.components.cyclical.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.components.cyclical.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('timeSeriesInfo.components.irregular.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.components.irregular.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('timeSeriesInfo.applications.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('timeSeriesInfo.applications.business.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.applications.business.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('timeSeriesInfo.applications.operations.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.applications.operations.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('timeSeriesInfo.applications.science.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.applications.science.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('timeSeriesInfo.applications.technology.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.applications.technology.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* NetCraft AI Implementation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('timeSeriesInfo.netcraftImplementation.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('timeSeriesInfo.netcraftImplementation.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.netcraftImplementation.algorithms.title')}</h3>
              <ul className="space-y-1">
                {(t('timeSeriesInfo.netcraftImplementation.algorithms.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.netcraftImplementation.features.title')}</h3>
              <ul className="space-y-1">
                {(t('timeSeriesInfo.netcraftImplementation.features.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Evaluation Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('timeSeriesInfo.evaluation.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.evaluation.accuracy.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• <strong>MAE:</strong> {t('timeSeriesInfo.evaluation.accuracy.mae')}</li>
              <li>• <strong>RMSE:</strong> {t('timeSeriesInfo.evaluation.accuracy.rmse')}</li>
              <li>• <strong>MAPE:</strong> {t('timeSeriesInfo.evaluation.accuracy.mape')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.evaluation.statistical.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• <strong>R²:</strong> {t('timeSeriesInfo.evaluation.statistical.r2')}</li>
              <li>• <strong>AIC/BIC:</strong> {t('timeSeriesInfo.evaluation.statistical.aic')}</li>
              <li>• <strong>Residual Analysis:</strong> {t('timeSeriesInfo.evaluation.statistical.residual')}</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('timeSeriesInfo.gettingStarted.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('timeSeriesInfo.gettingStarted.description')}
          </p>
          <div className="space-y-4">
            {(t('timeSeriesInfo.gettingStarted.steps', { returnObjects: true }) as string[]).map((step: string, index: number) => (
              <div key={index} className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="text-secondary-600 dark:text-gray-400 leading-relaxed" style={justifiedTextStyle}>
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <Link to="/forecasting" className="btn-primary">
            {t('timeSeriesInfo.gettingStarted.tryForecasting')}
          </Link>
          <Link to="/guidelines" className="btn-secondary">
            {t('timeSeriesInfo.gettingStarted.viewGuidelines')}
          </Link>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('timeSeriesInfo.bestPractices.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.bestPractices.dataPreparation.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.bestPractices.dataPreparation.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('timeSeriesInfo.bestPractices.modelSelection.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('timeSeriesInfo.bestPractices.modelSelection.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeSeriesForecastingInfoPage;