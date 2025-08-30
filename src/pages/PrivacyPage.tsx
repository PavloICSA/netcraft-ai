import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * Privacy Policy page
 */
const PrivacyPage: React.FC = () => {
  const { t } = useTranslation('legal');

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
          {t('privacy.title')}
        </h1>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      >
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-secondary-700 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            {t('privacy.placeholder')}
          </p>
        </div>
        <div className="mt-6 text-sm text-secondary-600 dark:text-gray-400 text-center">
          <p>{t('privacy.effectiveDate')}</p>
          <p>{t('privacy.lastUpdated')}</p>
        </div>
      </motion.div>

      {/* Introduction Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card"
      >
        <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
          {t('privacy.introduction')}
        </p>
      </motion.div>

      {/* Privacy Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('privacy.privacyByDesign.title')}
        </h2>
        <div className="space-y-4 text-secondary-700 dark:text-gray-300">
          <p className="text-justify leading-relaxed">
            <strong>{t('privacy.privacyByDesign.clientSide.title')}</strong> {t('privacy.privacyByDesign.clientSide.content')}
          </p>
          <p className="text-justify leading-relaxed">
            <strong>{t('privacy.privacyByDesign.noServer.title')}</strong> {t('privacy.privacyByDesign.noServer.content')}
          </p>
          <p className="text-justify leading-relaxed">
            <strong>{t('privacy.privacyByDesign.localStorage.title')}</strong> {t('privacy.privacyByDesign.localStorage.content')}
          </p>
        </div>
      </motion.div>

      {/* Data Collection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('privacy.dataCollection.title')}
        </h2>
        <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
          {t('privacy.dataCollection.content')}
        </p>
      </motion.div>

      {/* Local Processing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('privacy.localProcessing.title')}
        </h2>
        <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
          {t('privacy.localProcessing.content')}
        </p>
      </motion.div>

      {/* Browser Storage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('privacy.browserStorage.title')}
        </h2>
        <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
          {t('privacy.browserStorage.content')}
        </p>
      </motion.div>

      {/* Third Party Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('privacy.thirdParty.title')}
        </h2>
        <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
          {t('privacy.thirdParty.content')}
        </p>
      </motion.div>

      {/* Data Retention */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('privacy.dataRetention.title')}
        </h2>
        <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
          {t('privacy.dataRetention.content')}
        </p>
      </motion.div>

      {/* What Data We Don't Collect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('privacy.whatWeDoNotCollect.title')}
        </h2>
        <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
          {(t('privacy.whatWeDoNotCollect.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('privacy.contact.title')}
        </h2>
        <p className="text-secondary-700 dark:text-gray-300 text-justify leading-relaxed">
          {t('privacy.contact.content')}
        </p>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;