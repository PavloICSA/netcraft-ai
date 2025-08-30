import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useScrollToTop } from '../utils/useScrollToTop';

/**
 * Contribution Guidelines page with comprehensive information for contributors
 */
const ContributionsPage: React.FC = () => {
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
          {t('about.contributing.title')}
        </h1>
        <p className="text-xl text-secondary-600 dark:text-gray-300">
          {t('about.contributing.subtitle')}
        </p>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('about.contributing.gettingStarted.title')}
        </h2>
        <div className="prose prose-secondary max-w-none">
          <p className="text-justify leading-relaxed text-secondary-700 dark:text-gray-300 mb-4">
            {t('about.contributing.gettingStarted.description')}
          </p>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">Steps:</h3>
            <ol className="space-y-2 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.gettingStarted.steps', { returnObjects: true })) ?
                (t('about.contributing.gettingStarted.steps', { returnObjects: true }) as string[]).map((step: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5 text-primary-600 font-bold text-sm">
                      {index + 1}
                    </span>
                    <span className="font-mono text-sm bg-secondary-100 px-2 py-1 rounded">{step}</span>
                  </li>
                )) : (
                  <li className="text-secondary-600 dark:text-gray-400">Loading steps...</li>
                )
              }
            </ol>
          </div>
        </div>
      </motion.div>

      {/* Development Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
          {t('about.contributing.developmentGuidelines.title')}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Code Standards */}
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">
              {t('about.contributing.developmentGuidelines.codeStandards.title')}
            </h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.developmentGuidelines.codeStandards.items', { returnObjects: true })) &&
                (t('about.contributing.developmentGuidelines.codeStandards.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* Testing Requirements */}
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">
              {t('about.contributing.developmentGuidelines.testingRequirements.title')}
            </h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.developmentGuidelines.testingRequirements.items', { returnObjects: true })) &&
                (t('about.contributing.developmentGuidelines.testingRequirements.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* Code Review */}
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">
              {t('about.contributing.developmentGuidelines.codeReview.title')}
            </h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.developmentGuidelines.codeReview.items', { returnObjects: true })) &&
                (t('about.contributing.developmentGuidelines.codeReview.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Types of Contributions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
          {t('about.contributing.contributionTypes.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Bug Reports */}
          <div className="border border-secondary-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-2">
              {t('about.contributing.contributionTypes.bugReports.title')}
            </h3>
            <p className="text-secondary-600 dark:text-gray-400 text-sm mb-3">
              {t('about.contributing.contributionTypes.bugReports.description')}
            </p>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.contributionTypes.bugReports.items', { returnObjects: true })) &&
                (t('about.contributing.contributionTypes.bugReports.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-red-50 dark:bg-red-900/200 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* Feature Requests */}
          <div className="border border-secondary-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-2">
              {t('about.contributing.contributionTypes.featureRequests.title')}
            </h3>
            <p className="text-secondary-600 dark:text-gray-400 text-sm mb-3">
              {t('about.contributing.contributionTypes.featureRequests.description')}
            </p>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.contributionTypes.featureRequests.items', { returnObjects: true })) &&
                (t('about.contributing.contributionTypes.featureRequests.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-50 dark:bg-blue-900/200 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* Documentation */}
          <div className="border border-secondary-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-2">
              {t('about.contributing.contributionTypes.documentation.title')}
            </h3>
            <p className="text-secondary-600 dark:text-gray-400 text-sm mb-3">
              {t('about.contributing.contributionTypes.documentation.description')}
            </p>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.contributionTypes.documentation.items', { returnObjects: true })) &&
                (t('about.contributing.contributionTypes.documentation.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-50 dark:bg-green-900/200 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* Code Contributions */}
          <div className="border border-secondary-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-2">
              {t('about.contributing.contributionTypes.codeContributions.title')}
            </h3>
            <p className="text-secondary-600 dark:text-gray-400 text-sm mb-3">
              {t('about.contributing.contributionTypes.codeContributions.description')}
            </p>
            <ul className="space-y-1 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.contributionTypes.codeContributions.items', { returnObjects: true })) &&
                (t('about.contributing.contributionTypes.codeContributions.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-50 dark:bg-purple-900/200 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Internationalization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
          {t('about.contributing.internationalization.title')}
        </h2>
        <p className="text-secondary-700 dark:text-gray-300 mb-6">
          {t('about.contributing.internationalization.description')}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">
              {t('about.contributing.internationalization.translationGuidelines.title')}
            </h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.internationalization.translationGuidelines.items', { returnObjects: true })) &&
                (t('about.contributing.internationalization.translationGuidelines.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-50 dark:bg-blue-900/200 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">
              {t('about.contributing.internationalization.supportedLanguages.title')}
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-secondary-800 dark:text-gray-200 text-sm mb-1">Current:</h4>
                <ul className="space-y-1">
                  {Array.isArray(t('about.contributing.internationalization.supportedLanguages.current', { returnObjects: true })) &&
                    (t('about.contributing.internationalization.supportedLanguages.current', { returnObjects: true }) as string[]).map((lang: string, index: number) => (
                      <li key={index} className="text-sm text-secondary-700 dark:text-gray-300 flex items-center">
                        <span className="w-2 h-2 bg-green-50 dark:bg-green-900/200 rounded-full mr-2"></span>
                        {lang}
                      </li>
                    ))
                  }
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-secondary-800 dark:text-gray-200 text-sm mb-1">Wanted:</h4>
                <ul className="space-y-1">
                  {Array.isArray(t('about.contributing.internationalization.supportedLanguages.wanted', { returnObjects: true })) &&
                    (t('about.contributing.internationalization.supportedLanguages.wanted', { returnObjects: true }) as string[]).map((lang: string, index: number) => (
                      <li key={index} className="text-sm text-secondary-600 dark:text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-secondary-400 rounded-full mr-2"></span>
                        {lang}
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-gray-100 mb-6">
          {t('about.contributing.communityGuidelines.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">
              {t('about.contributing.communityGuidelines.codeOfConduct.title')}
            </h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.communityGuidelines.codeOfConduct.items', { returnObjects: true })) &&
                (t('about.contributing.communityGuidelines.codeOfConduct.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-gray-100 mb-3">
              {t('about.contributing.communityGuidelines.communication.title')}
            </h3>
            <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
              {Array.isArray(t('about.contributing.communityGuidelines.communication.items', { returnObjects: true })) &&
                (t('about.contributing.communityGuidelines.communication.items', { returnObjects: true }) as string[]).map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Recognition & Resources */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recognition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('about.contributing.recognition.title')}
          </h2>
          <p className="text-secondary-700 dark:text-gray-300 mb-4">
            {t('about.contributing.recognition.description')}
          </p>
          <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
            {Array.isArray(t('about.contributing.recognition.methods', { returnObjects: true })) &&
              (t('about.contributing.recognition.methods', { returnObjects: true }) as string[]).map((method: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-green-50 dark:bg-green-900/200 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  <span className="text-sm">{method}</span>
                </li>
              ))
            }
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
            {t('about.contributing.resources.title')}
          </h2>
          <div className="space-y-3">
            {Array.isArray(t('about.contributing.resources.links', { returnObjects: true })) &&
              (t('about.contributing.resources.links', { returnObjects: true }) as Array<{ title: string, url: string, description: string }>).map((link, index: number) => (
                <div key={index} className="border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                  <h3 className="font-medium text-secondary-900 dark:text-gray-100 text-sm mb-1">
                    {link.title}
                  </h3>
                  <p className="text-xs text-secondary-600 dark:text-gray-400 mb-1">
                    {link.url}
                  </p>
                  <p className="text-xs text-secondary-700 dark:text-gray-300">
                    {link.description}
                  </p>
                </div>
              ))
            }
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContributionsPage;