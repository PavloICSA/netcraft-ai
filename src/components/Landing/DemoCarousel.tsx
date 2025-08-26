import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Demo carousel showcasing application features
 */
const DemoCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const demos = [
    {
      title: 'Data Upload & Preview',
      description: 'Upload CSV files with automatic type inference and comprehensive data statistics for intelligent analysis preparation',
      image: '/api/placeholder/600/400',
      features: ['Drag & drop upload', 'Automatic type detection', 'Data statistics', 'Column selection']
    },
    {
      title: 'Neural Network Training',
      description: 'Configure and train custom neural networks with real-time progress monitoring and comprehensive performance evaluation',
      image: '/api/placeholder/600/400',
      features: ['Custom architecture', 'Real-time training', 'Loss visualization', 'Performance metrics']
    },
    {
      title: 'Clustering Analysis',
      description: 'Discover hidden patterns with K-means and Self-Organizing Maps using advanced visualization and quality assessment',
      image: '/api/placeholder/600/400',
      features: ['K-means clustering', 'SOM visualization', 'Cluster quality metrics', 'Interactive results']
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % demos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + demos.length) % demos.length);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Demo Display */}
      <div className="relative h-96 bg-white rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex"
          >
            {/* Demo Image/Placeholder */}
            <div className="flex-1 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {currentSlide === 0 && (
                    <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  {currentSlide === 1 && (
                    <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {currentSlide === 2 && (
                    <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  )}
                </div>
                <div className="text-primary-600 font-medium">
                  Interactive Demo Preview
                </div>
              </div>
            </div>

            {/* Demo Info */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                {demos[currentSlide].title}
              </h3>
              <p className="text-secondary-600 mb-6 text-justify leading-relaxed">
                {demos[currentSlide].description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {demos[currentSlide].features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-secondary-700">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="btn-primary w-fit">
                Try This Feature
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-50 transition-colors"
        >
          <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-50 transition-colors"
        >
          <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {demos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary-600' : 'bg-secondary-300'
            }`}
          />
        ))}
      </div>

      {/* Demo Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
      >
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-secondary-200">
          <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
          <div className="text-sm text-secondary-600">Client-Side Processing</div>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-secondary-200">
          <div className="text-3xl font-bold text-accent-600 mb-2">0</div>
          <div className="text-sm text-secondary-600">External Dependencies</div>
        </div>
        
        <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-secondary-200">
          <div className="text-3xl font-bold text-secondary-600 mb-2">∞</div>
          <div className="text-sm text-secondary-600">Data Privacy</div>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoCarousel;