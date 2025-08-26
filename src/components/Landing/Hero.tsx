import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NavigationBar from './NavigationBar';

/**
 * Hero section with animated title and call-to-action
 */
const Hero: React.FC = () => {
  return (
    <section className="relative py-32 md:py-40 flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-200 rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-medium leading-relaxed">
            <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent font-semibold">Forecast the future.</span>{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-semibold">Find the patterns.</span>{' '}
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-semibold">All in your browser.</span>
          </p>
        </motion.div>

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
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto"
        >
          <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 p-6 rounded-2xl hover:bg-white/80 hover:shadow-xl hover:shadow-primary-200/50 backdrop-blur-sm">
            <div className="w-20 h-20 bg-primary-100 group-hover:bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary-300/40 group-hover:scale-110">
              <svg className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-primary-700 transition-colors duration-300">Neural Networks</h3>
            <p className="text-base text-secondary-600 group-hover:text-secondary-700 transition-colors duration-300 leading-relaxed">Build and train custom neural networks for regression and classification</p>
          </div>

          <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 p-6 rounded-2xl hover:bg-white/80 hover:shadow-xl hover:shadow-accent-200/50 backdrop-blur-sm">
            <div className="w-20 h-20 bg-accent-100 group-hover:bg-accent-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-accent-300/40 group-hover:scale-110">
              <svg className="w-10 h-10 text-accent-600 group-hover:text-accent-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-accent-700 transition-colors duration-300">Clustering</h3>
            <p className="text-base text-secondary-600 group-hover:text-secondary-700 transition-colors duration-300 leading-relaxed">Discover patterns with K-means and Self-Organizing Maps</p>
          </div>

          <div className="text-center group cursor-pointer transition-all duration-300 hover:transform hover:scale-105 p-6 rounded-2xl hover:bg-white/80 hover:shadow-xl hover:shadow-secondary-200/50 backdrop-blur-sm">
            <div className="w-20 h-20 bg-secondary-100 group-hover:bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-secondary-300/40 group-hover:scale-110">
              <svg className="w-10 h-10 text-secondary-600 group-hover:text-secondary-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-secondary-700 transition-colors duration-300">Export & Share</h3>
            <p className="text-base text-secondary-600 group-hover:text-secondary-700 transition-colors duration-300 leading-relaxed">Save models and export results in multiple formats</p>
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
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-xl blur-sm"></div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;