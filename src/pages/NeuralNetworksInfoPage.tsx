import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * Neural Networks information page
 */
const NeuralNetworksInfoPage: React.FC = () => {
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
          {t('neuralNetworksInfo.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-400">
          {t('neuralNetworksInfo.subtitle')}
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('neuralNetworksInfo.whatAre.title')}</h2>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify mb-4">
          {t('neuralNetworksInfo.whatAre.description1')}
        </p>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
          {t('neuralNetworksInfo.whatAre.description2')}
        </p>
      </motion.div>

      {/* How They Work */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('neuralNetworksInfo.howTheyWork.title')}</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('neuralNetworksInfo.howTheyWork.step1.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('neuralNetworksInfo.howTheyWork.step1.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-green-600 font-bold text-xl">2</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('neuralNetworksInfo.howTheyWork.step2.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('neuralNetworksInfo.howTheyWork.step2.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-purple-600 font-bold text-xl">3</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('neuralNetworksInfo.howTheyWork.step3.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('neuralNetworksInfo.howTheyWork.step3.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-orange-600 font-bold text-xl">4</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('neuralNetworksInfo.howTheyWork.step4.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('neuralNetworksInfo.howTheyWork.step4.description')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key Concepts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('neuralNetworksInfo.keyConcepts.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('neuralNetworksInfo.keyConcepts.activationFunctions.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('neuralNetworksInfo.keyConcepts.activationFunctions.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('neuralNetworksInfo.keyConcepts.trainingParameters.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('neuralNetworksInfo.keyConcepts.trainingParameters.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('neuralNetworksInfo.applications.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('neuralNetworksInfo.applications.regression.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('neuralNetworksInfo.applications.regression.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('neuralNetworksInfo.applications.classification.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('neuralNetworksInfo.applications.classification.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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
        className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('neuralNetworksInfo.netcraftImplementation.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('neuralNetworksInfo.netcraftImplementation.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('neuralNetworksInfo.netcraftImplementation.features.title')}</h3>
              <ul className="space-y-1">
                {(t('neuralNetworksInfo.netcraftImplementation.features.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('neuralNetworksInfo.netcraftImplementation.supportedTasks.title')}</h3>
              <ul className="space-y-1">
                {(t('neuralNetworksInfo.netcraftImplementation.supportedTasks.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('neuralNetworksInfo.gettingStarted.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('neuralNetworksInfo.gettingStarted.description')}
          </p>
          <ol className="space-y-3">
            {(t('neuralNetworksInfo.gettingStarted.steps', { returnObjects: true }) as string[]).map((step: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 flex gap-4">
          <Link to="/predictor" className="btn-primary">
            {t('neuralNetworksInfo.gettingStarted.tryNeuralNetworks')}
          </Link>
          <Link to="/guidelines" className="btn-secondary">
            {t('neuralNetworksInfo.gettingStarted.viewGuidelines')}
          </Link>
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('neuralNetworksInfo.bestPractices.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('neuralNetworksInfo.bestPractices.dataPreparation.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('neuralNetworksInfo.bestPractices.dataPreparation.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('neuralNetworksInfo.bestPractices.modelDesign.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('neuralNetworksInfo.bestPractices.modelDesign.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NeuralNetworksInfoPage;