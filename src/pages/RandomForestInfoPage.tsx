import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * Random Forest information page
 */
const RandomForestInfoPage: React.FC = () => {
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
          {t('randomForestInfo.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-400">
          {t('randomForestInfo.subtitle')}
        </p>

      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('randomForestInfo.whatIs.title')}</h2>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify mb-4">
          {t('randomForestInfo.whatIs.description1')}
        </p>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
          {t('randomForestInfo.whatIs.description2')}
        </p>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('randomForestInfo.howItWorks.title')}</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-green-600 font-bold text-xl">1</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.howItWorks.step1.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('randomForestInfo.howItWorks.step1.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-blue-600 font-bold text-xl">2</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.howItWorks.step2.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('randomForestInfo.howItWorks.step2.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-purple-600 font-bold text-xl">3</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.howItWorks.step3.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('randomForestInfo.howItWorks.step3.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-orange-600 font-bold text-xl">4</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.howItWorks.step4.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('randomForestInfo.howItWorks.step4.description')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Advantages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('randomForestInfo.keyAdvantages.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('randomForestInfo.keyAdvantages.robustness.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('randomForestInfo.keyAdvantages.robustness.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('randomForestInfo.keyAdvantages.interpretability.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('randomForestInfo.keyAdvantages.interpretability.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('randomForestInfo.applications.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('randomForestInfo.applications.classification.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('randomForestInfo.applications.classification.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('randomForestInfo.applications.regression.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('randomForestInfo.applications.regression.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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
        transition={{ delay: 0.5 }}
        className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('randomForestInfo.netcraftImplementation.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('randomForestInfo.netcraftImplementation.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.netcraftImplementation.features.title')}</h3>
              <ul className="space-y-1">
                {(t('randomForestInfo.netcraftImplementation.features.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.netcraftImplementation.capabilities.title')}</h3>
              <ul className="space-y-1">
                {(t('randomForestInfo.netcraftImplementation.capabilities.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Configuration Parameters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('randomForestInfo.configurationParameters.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.configurationParameters.modelStructure.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('randomForestInfo.configurationParameters.modelStructure.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.configurationParameters.randomnessControl.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('randomForestInfo.configurationParameters.randomnessControl.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
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
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('randomForestInfo.gettingStarted.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('randomForestInfo.gettingStarted.description')}
          </p>
          <ol className="space-y-3">
            {(t('randomForestInfo.gettingStarted.steps', { returnObjects: true }) as string[]).map((step: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 flex gap-4">
          <Link to="/predictor" className="btn-primary">
            {t('randomForestInfo.gettingStarted.tryRandomForest')}
          </Link>
          <Link to="/guidelines" className="btn-secondary">
            {t('randomForestInfo.gettingStarted.viewGuidelines')}
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
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('randomForestInfo.bestPractices.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.bestPractices.dataPreparation.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('randomForestInfo.bestPractices.dataPreparation.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('randomForestInfo.bestPractices.modelTuning.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('randomForestInfo.bestPractices.modelTuning.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RandomForestInfoPage;