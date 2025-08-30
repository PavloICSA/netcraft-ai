import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import NavigationBar from './NavigationBar';
import NeuralNetworkAnimation from './NeuralNetworkAnimation';
import AIStats from './AIStats';

/**
 * Hero section with animated title and call-to-action
 */
const Hero: React.FC = () => {
  const { t } = useTranslation('landing');
  return (
    <section className="relative py-32 md:py-40 flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-200 dark:bg-primary-400 rounded-full opacity-20 dark:opacity-10"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Neural Network Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <NeuralNetworkAnimation />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent leading-tight">
            NetCraft AI
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-medium leading-relaxed">
            <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent font-semibold">{t('hero.tagline')}</span>
          </p>
        </motion.div>

        {/* AI Stats */}
        <AIStats />

        {/* Navigation Bar positioned between title and CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <NavigationBar />
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl hover:shadow-primary-200/50 dark:hover:shadow-primary-500/20 backdrop-blur-sm" role="button" tabIndex={0} aria-label={t('hero.features.neuralNetworks.ariaLabel')}>
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/50 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary-300/40 dark:group-hover:shadow-primary-500/30 group-hover:scale-110">
              <svg className="w-10 h-10 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 dark:text-gray-100 mb-3 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors duration-300">{t('hero.features.neuralNetworks.title')}</h3>
            <p className="text-base text-secondary-600 dark:text-gray-300 group-hover:text-secondary-700 dark:group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">{t('hero.features.neuralNetworks.description')}</p>
          </div>

          <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl hover:shadow-accent-200/50 dark:hover:shadow-accent-500/20 backdrop-blur-sm" role="button" tabIndex={0} aria-label={t('hero.features.clustering.ariaLabel')}>
            <div className="w-20 h-20 bg-accent-100 dark:bg-accent-900/30 group-hover:bg-accent-200 dark:group-hover:bg-accent-800/50 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-300/40 dark:group-hover:shadow-accent-500/30 group-hover:scale-110">
              <svg className="w-10 h-10 text-accent-600 dark:text-accent-400 group-hover:text-accent-700 dark:group-hover:text-accent-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 dark:text-gray-100 mb-3 group-hover:text-accent-700 dark:group-hover:text-accent-300 transition-colors duration-300">{t('hero.features.clustering.title')}</h3>
            <p className="text-base text-secondary-600 dark:text-gray-300 group-hover:text-secondary-700 dark:group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">{t('hero.features.clustering.description')}</p>
          </div>

          <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl hover:shadow-secondary-200/50 dark:hover:shadow-gray-500/20 backdrop-blur-sm" role="button" tabIndex={0} aria-label={t('hero.features.randomForest.ariaLabel')}>
            <div className="w-20 h-20 bg-secondary-100 dark:bg-gray-700 group-hover:bg-secondary-200 dark:group-hover:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-secondary-300/40 dark:group-hover:shadow-gray-500/30 group-hover:scale-110">
              <svg className="w-10 h-10 text-secondary-600 dark:text-gray-300 group-hover:text-secondary-700 dark:group-hover:text-gray-200 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 dark:text-gray-100 mb-3 group-hover:text-secondary-700 dark:group-hover:text-gray-200 transition-colors duration-300">{t('hero.features.randomForest.title')}</h3>
            <p className="text-base text-secondary-600 dark:text-gray-300 group-hover:text-secondary-700 dark:group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">{t('hero.features.randomForest.description')}</p>
          </div>

          <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 p-6 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-xl hover:shadow-emerald-200/50 dark:hover:shadow-emerald-500/20 backdrop-blur-sm" role="button" tabIndex={0} aria-label={t('hero.features.timeSeries.ariaLabel')}>
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800/50 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-300/40 dark:group-hover:shadow-emerald-500/30 group-hover:scale-110">
              <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 dark:text-gray-100 mb-3 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors duration-300">{t('hero.features.timeSeries.title')}</h3>
            <p className="text-base text-secondary-600 dark:text-gray-300 group-hover:text-secondary-700 dark:group-hover:text-gray-200 transition-colors duration-300 leading-relaxed">{t('hero.features.timeSeries.description')}</p>
          </div>
        </motion.div>

        {/* Additional Get Started button below feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex justify-center mt-12"
        >
          <Link
            to="/data"
            className="relative bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold py-5 px-12 rounded-xl text-xl transition-all duration-300 shadow-2xl hover:shadow-primary-500/25 hover:shadow-2xl transform hover:scale-105 hover:brightness-110 group overflow-hidden"
          >
            <span className="relative z-10">{t('getStarted')}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-xl blur-sm"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;