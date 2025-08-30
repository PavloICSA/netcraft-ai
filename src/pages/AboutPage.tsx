import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * About page with project information
 */
const AboutPage: React.FC = () => {
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
          {t('about.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-300">
          {t('about.subtitle')}
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('about.mission.title')}</h2>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
          {t('about.mission.description')}
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('about.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('about.features.neuralNetworks.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('about.features.neuralNetworks.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('about.features.randomForest.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('about.features.randomForest.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('about.features.clustering.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('about.features.clustering.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('about.features.timeSeries.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('about.features.timeSeries.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Technology */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('about.technology.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-xl">⚛</span>
            </div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('about.technology.frontend.title')}</h3>
            <p className="text-sm text-secondary-600 dark:text-gray-400">{t('about.technology.frontend.description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-xl">🧠</span>
            </div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('about.technology.machineLearning.title')}</h3>
            <p className="text-sm text-secondary-600 dark:text-gray-400">{t('about.technology.machineLearning.description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-xl">🎨</span>
            </div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('about.technology.design.title')}</h3>
            <p className="text-sm text-secondary-600 dark:text-gray-400">{t('about.technology.design.description')}</p>
          </div>
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('about.privacy.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            <strong>{t('about.privacy.clientSide.title')}</strong> {t('about.privacy.clientSide.description')}
          </p>
          <p className="text-justify leading-relaxed">
            <strong>{t('about.privacy.noServer.title')}</strong> {t('about.privacy.noServer.description')}
          </p>
          <p className="text-justify leading-relaxed">
            <strong>{t('about.privacy.localStorage.title')}</strong> {t('about.privacy.localStorage.description')}
          </p>
        </div>
      </motion.div>

      {/* Open Source */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('about.openSource.title')}</h2>
        <p className="text-secondary-700 dark:text-gray-300 mb-4 text-justify leading-relaxed">
          {t('about.openSource.description')}
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/PavloICSA/netcraft-ai"
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('about.openSource.viewOnGitHub')}
          </a>
          <a
            href="/contribution"
            className="btn-secondary"
          >
            {t('about.openSource.contributionGuidelines')}
          </a>
        </div>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('about.development.title')}</h2>
        <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
          {t('about.development.description')}
        </p>
      </motion.div>
    </div>
  );
};

export default AboutPage;