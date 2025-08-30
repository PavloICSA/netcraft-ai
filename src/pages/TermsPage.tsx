import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * Terms of Service page
 */
const TermsPage: React.FC = () => {
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
          {t('terms.title')}
        </h1>
      </motion.div>



      {/* Terms Content */}
      <div className="space-y-8">
        {/* Acceptance of Terms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.acceptance.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.acceptance.content')}
          </p>
        </motion.div>

        {/* Service Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.description.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.description.content')}
          </p>
        </motion.div>

        {/* Product Information - Core Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.productInfo.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 mb-4 text-justify">
            {t('terms.productInfo.content')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-gray-300">
            {(t('terms.productInfo.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* Target Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.37 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.targetUsers.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.targetUsers.content')}
          </p>
        </motion.div>

        {/* Key Differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.39 }}
          className="card bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.keyDifferentiators.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 mb-4 text-justify">
            {t('terms.keyDifferentiators.content')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-gray-300">
            {(t('terms.keyDifferentiators.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* User Responsibilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.userResponsibilities.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 mb-4 text-justify">
            {t('terms.userResponsibilities.content')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-gray-300">
            {(t('terms.userResponsibilities.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* Data Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.dataPrivacy.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 mb-4 text-justify">
            {t('terms.dataPrivacy.content')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-gray-300">
            {(t('terms.dataPrivacy.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* Intellectual Property */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.intellectualProperty.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.intellectualProperty.content')}
          </p>
        </motion.div>

        {/* Disclaimers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.disclaimers.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 mb-4 text-justify">
            {t('terms.disclaimers.content')}
          </p>
          <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-gray-300">
            {(t('terms.disclaimers.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </motion.div>

        {/* Limitation of Liability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.limitation.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.limitation.content')}
          </p>
        </motion.div>

        {/* Modifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.modifications.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.modifications.content')}
          </p>
        </motion.div>

        {/* Termination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.termination.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.termination.content')}
          </p>
        </motion.div>

        {/* Governing Law */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.governingLaw.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.governingLaw.content')}
          </p>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="card"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('terms.contact.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 leading-relaxed text-justify">
            {t('terms.contact.content')}
          </p>
        </motion.div>
      </div>

      {/* Open Source Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('license.title')}
        </h2>
        <p className="text-secondary-700 dark:text-gray-300 mb-4">
          NetCraft AI is an open source project. Please refer to the project repository 
          for the current license terms and conditions.
        </p>
        <a
          href="https://github.com/PavloICSA/netcraft-ai"
          className="btn-primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('license.openSource')}
        </a>
      </motion.div>
    </div>
  );
};

export default TermsPage;