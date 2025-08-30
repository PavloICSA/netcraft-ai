import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * Data Analysis information page
 */
const DataAnalysisInfoPage: React.FC = () => {
  const { t, i18n } = useTranslation('pages');
  
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
          {t('dataAnalysisInfo.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-400">
          {t('dataAnalysisInfo.subtitle')}
        </p>

      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('dataAnalysisInfo.whatIs.title')}</h2>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify mb-4">
          {t('dataAnalysisInfo.whatIs.description1')}
        </p>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
          {t('dataAnalysisInfo.whatIs.description2')}
        </p>
      </motion.div>

      {/* Data Analysis Process */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('dataAnalysisInfo.process.title')}</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.process.step1.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('dataAnalysisInfo.process.step1.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-green-600 font-bold text-xl">2</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.process.step2.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('dataAnalysisInfo.process.step2.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-purple-600 font-bold text-xl">3</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.process.step3.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('dataAnalysisInfo.process.step3.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-orange-600 font-bold text-xl">4</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.process.step4.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('dataAnalysisInfo.process.step4.description')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('dataAnalysisInfo.dataTypes.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-secondary-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('dataAnalysisInfo.dataTypes.numeric.title')}</h3>
            <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed mb-3">
              {t('dataAnalysisInfo.dataTypes.numeric.description')}
            </p>
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{i18n.language === 'uk' ? 'Приклади:' : 'Examples:'}</h4>
              <ul className="space-y-1 text-sm text-secondary-700 dark:text-gray-300">
                {(t('dataAnalysisInfo.dataTypes.numeric.examples', { returnObjects: true }) as string[]).map((example: string, index: number) => (
                  <li key={index}>• {example}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border border-secondary-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('dataAnalysisInfo.dataTypes.categorical.title')}</h3>
            <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed mb-3">
              {t('dataAnalysisInfo.dataTypes.categorical.description')}
            </p>
            <div>
              <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{i18n.language === 'uk' ? 'Приклади:' : 'Examples:'}</h4>
              <ul className="space-y-1 text-sm text-secondary-700 dark:text-gray-300">
                {(t('dataAnalysisInfo.dataTypes.categorical.examples', { returnObjects: true }) as string[]).map((example: string, index: number) => (
                  <li key={index}>• {example}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('dataAnalysisInfo.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('dataAnalysisInfo.features.upload.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('dataAnalysisInfo.features.upload.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('dataAnalysisInfo.features.exploration.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('dataAnalysisInfo.features.exploration.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Common Data Issues */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('dataAnalysisInfo.issues.title')}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.issues.quality.title')}</h3>
              <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
                {(t('dataAnalysisInfo.issues.quality.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.issues.solutions.title')}</h3>
              <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
                {(t('dataAnalysisInfo.issues.solutions.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
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
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('dataAnalysisInfo.netcraftImplementation.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('dataAnalysisInfo.netcraftImplementation.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.netcraftImplementation.features.title')}</h3>
              <ul className="space-y-1">
                {(t('dataAnalysisInfo.netcraftImplementation.features.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.netcraftImplementation.privacy.title')}</h3>
              <ul className="space-y-1">
                {(t('dataAnalysisInfo.netcraftImplementation.privacy.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('dataAnalysisInfo.gettingStarted.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('dataAnalysisInfo.gettingStarted.description')}
          </p>
          <ol className="space-y-3">
            {(t('dataAnalysisInfo.gettingStarted.steps', { returnObjects: true }) as string[]).map((step: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 flex gap-4">
          <Link to="/data" className="btn-primary">
            {t('dataAnalysisInfo.gettingStarted.tryDataAnalysis')}
          </Link>
          <Link to="/guidelines" className="btn-secondary">
            {t('dataAnalysisInfo.gettingStarted.viewGuidelines')}
          </Link>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('dataAnalysisInfo.bestPractices.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.bestPractices.dataPreparation.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('dataAnalysisInfo.bestPractices.dataPreparation.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('dataAnalysisInfo.bestPractices.qualityChecks.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('dataAnalysisInfo.bestPractices.qualityChecks.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataAnalysisInfoPage;