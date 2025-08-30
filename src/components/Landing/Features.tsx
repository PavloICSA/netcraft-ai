import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * Features section showcasing main capabilities
 */
const Features: React.FC = () => {
  const { t } = useTranslation('landing');
  const getFeatureArray = (key: string): string[] => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result.filter((item): item is string => typeof item === 'string') : [];
  };

  const features = [
    {
      title: t('features.neuralNetworkPredictor.title'),
      description: t('features.neuralNetworkPredictor.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'primary',
      features: getFeatureArray('features.neuralNetworkPredictor.features')
    },
    {
      title: t('features.randomForestClassifier.title'),
      description: t('features.randomForestClassifier.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'tertiary',
      features: getFeatureArray('features.randomForestClassifier.features')
    },
    {
      title: t('features.advancedClustering.title'),
      description: t('features.advancedClustering.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: 'accent',
      features: getFeatureArray('features.advancedClustering.features')
    },
    {
      title: t('features.timeSeriesForecasting.title'),
      description: t('features.timeSeriesForecasting.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z M16 3v4m0 0v4m0-4h4m-4 0H12" />
        </svg>
      ),
      color: 'secondary',
      features: getFeatureArray('features.timeSeriesForecasting.features')
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-100 dark:bg-primary-900/30',
          text: 'text-primary-600 dark:text-primary-400',
          border: 'border-primary-200 dark:border-primary-700'
        };
      case 'accent':
        return {
          bg: 'bg-accent-100 dark:bg-accent-900/30',
          text: 'text-accent-600 dark:text-accent-400',
          border: 'border-accent-200 dark:border-accent-700'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-100 dark:bg-gray-700',
          text: 'text-secondary-600 dark:text-gray-400',
          border: 'border-secondary-200 dark:border-gray-600'
        };
      case 'tertiary':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-700'
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-600'
        };
    }
  };

  return (
    <section className="py-20 bg-secondary-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-4xl">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-bold">{t('features.title')}</span>
            </h2>
          </div>
          <p className="text-xl text-secondary-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border ${colors.border} hover:shadow-lg transition-all duration-300 text-center group relative overflow-hidden`}
              >
                {/* AI Processing Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-1">
                    <motion.div
                      className={`w-2 h-2 ${colors.bg} rounded-full`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className={`w-2 h-2 ${colors.bg} rounded-full`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className={`w-2 h-2 ${colors.bg} rounded-full`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </div>
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  <div className={colors.text}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-gray-100 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-secondary-600 dark:text-gray-400 mb-6 text-justify leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-sm text-secondary-700 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-secondary-200 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-bold">{t('features.technology.title')}</span>
            </h3>
            <p className="text-secondary-600 dark:text-gray-400">
              {t('features.technology.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">TS</span>
              </div>
              <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">{t('features.technology.typescript.title')}</h4>
              <p className="text-sm text-secondary-600 dark:text-gray-400">{t('features.technology.typescript.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">⚛</span>
              </div>
              <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">{t('features.technology.react.title')}</h4>
              <p className="text-sm text-secondary-600 dark:text-gray-400">{t('features.technology.react.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 dark:text-teal-400 font-bold text-lg">🎨</span>
              </div>
              <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">{t('features.technology.tailwind.title')}</h4>
              <p className="text-sm text-secondary-600 dark:text-gray-400">{t('features.technology.tailwind.description')}</p>
            </div>

            <div className="text-center relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg relative z-10">🧠</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800/50 dark:to-pink-800/50 opacity-0"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h4 className="font-medium text-secondary-900 dark:text-gray-100 mb-1">{t('features.technology.pureAI.title')}</h4>
              <p className="text-sm text-secondary-600 dark:text-gray-400">{t('features.technology.pureAI.description')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;