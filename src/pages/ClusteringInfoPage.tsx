import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * Clustering information page
 */
const ClusteringInfoPage: React.FC = () => {
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
          {t('clusteringInfo.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-400">
          {t('clusteringInfo.subtitle')}
        </p>

      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('clusteringInfo.whatIs.title')}</h2>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify mb-4">
          {t('clusteringInfo.whatIs.description1')}
        </p>
        <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
          {t('clusteringInfo.whatIs.description2')}
        </p>
      </motion.div>

      {/* Clustering Algorithms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">{t('clusteringInfo.algorithms.title')}</h2>
        <div className="space-y-6">
          <div className="border border-secondary-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-xl">K</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-secondary-900 dark:text-gray-100">{t('clusteringInfo.algorithms.kmeans.title')}</h3>
                <p className="text-secondary-600 dark:text-gray-400">{t('clusteringInfo.algorithms.kmeans.description')}</p>
              </div>
            </div>
            <div className="space-y-3 text-secondary-700 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{i18n.language === 'uk' ? 'Переваги:' : 'Advantages:'}</h4>
                  <ul className="space-y-1 text-sm">
                    {(t('clusteringInfo.algorithms.kmeans.advantages', { returnObjects: true }) as string[]).map((advantage: string, index: number) => (
                      <li key={index}>• {advantage}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-secondary-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-bold text-xl">S</span>
              </div>
              <div>
                <h3 className="text-xl font-medium text-secondary-900 dark:text-gray-100">{t('clusteringInfo.algorithms.som.title')}</h3>
                <p className="text-secondary-600 dark:text-gray-400">{t('clusteringInfo.algorithms.som.description')}</p>
              </div>
            </div>
            <div className="space-y-3 text-secondary-700 dark:text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{i18n.language === 'uk' ? 'Переваги:' : 'Advantages:'}</h4>
                  <ul className="space-y-1 text-sm">
                    {(t('clusteringInfo.algorithms.som.advantages', { returnObjects: true }) as string[]).map((advantage: string, index: number) => (
                      <li key={index}>• {advantage}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* How Clustering Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('clusteringInfo.howItWorks.title')}</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('clusteringInfo.howItWorks.step1.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('clusteringInfo.howItWorks.step1.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-green-600 font-bold text-xl">2</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('clusteringInfo.howItWorks.step2.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('clusteringInfo.howItWorks.step2.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-purple-600 font-bold text-xl">3</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('clusteringInfo.howItWorks.step3.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('clusteringInfo.howItWorks.step3.description')}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-orange-600 font-bold text-xl">4</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('clusteringInfo.howItWorks.step4.title')}</h3>
              <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
                {t('clusteringInfo.howItWorks.step4.description')}
              </p>
            </div>
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
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('clusteringInfo.applications.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('clusteringInfo.applications.business.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('clusteringInfo.applications.business.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('clusteringInfo.applications.science.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('clusteringInfo.applications.science.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Quality Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('clusteringInfo.evaluation.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('clusteringInfo.evaluation.metrics.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              <li>• <strong>{i18n.language === 'uk' ? 'Інерція:' : 'Inertia:'}</strong> {t('clusteringInfo.evaluation.metrics.inertia')}</li>
              <li>• <strong>{i18n.language === 'uk' ? 'Силует оцінка:' : 'Silhouette Score:'}</strong> {t('clusteringInfo.evaluation.metrics.silhouette')}</li>
              <li>• <strong>{i18n.language === 'uk' ? 'Згуртованість:' : 'Cohesion:'}</strong> {t('clusteringInfo.evaluation.metrics.cohesion')}</li>
              <li>• <strong>{i18n.language === 'uk' ? 'Розділення:' : 'Separation:'}</strong> {t('clusteringInfo.evaluation.metrics.separation')}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">{t('clusteringInfo.evaluation.validation.title')}</h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {(t('clusteringInfo.evaluation.validation.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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
        className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('clusteringInfo.netcraftImplementation.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('clusteringInfo.netcraftImplementation.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('clusteringInfo.netcraftImplementation.features.title')}</h3>
              <ul className="space-y-1">
                {(t('clusteringInfo.netcraftImplementation.features.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('clusteringInfo.netcraftImplementation.visualization.title')}</h3>
              <ul className="space-y-1">
                {(t('clusteringInfo.netcraftImplementation.visualization.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
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
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('clusteringInfo.gettingStarted.title')}</h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            {t('clusteringInfo.gettingStarted.description')}
          </p>
          <ol className="space-y-3">
            {(t('clusteringInfo.gettingStarted.steps', { returnObjects: true }) as string[]).map((step: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary-100 text-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-6 flex gap-4">
          <Link to="/clusterizer" className="btn-primary">
            {t('clusteringInfo.gettingStarted.tryClustering')}
          </Link>
          <Link to="/guidelines" className="btn-secondary">
            {t('clusteringInfo.gettingStarted.viewGuidelines')}
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
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">{t('clusteringInfo.bestPractices.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('clusteringInfo.bestPractices.dataPreparation.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('clusteringInfo.bestPractices.dataPreparation.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 dark:text-gray-100 mb-2">{t('clusteringInfo.bestPractices.parameterSelection.title')}</h3>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {(t('clusteringInfo.bestPractices.parameterSelection.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClusteringInfoPage;