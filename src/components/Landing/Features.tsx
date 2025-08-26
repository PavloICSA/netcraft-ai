import React from 'react';
import { motion } from 'framer-motion';

/**
 * Features section showcasing main capabilities
 */
const Features: React.FC = () => {
  const features = [
    {
      title: 'Neural Network Predictor',
      description: 'Build custom multilayer perceptrons for regression and classification tasks with real-time training visualization and comprehensive evaluation metrics.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'primary',
      features: [
        'Configurable architecture',
        'Multiple activation functions',
        'Real-time training progress',
        'Comprehensive metrics'
      ]
    },
    {
      title: 'Advanced Clustering',
      description: 'Discover hidden patterns in your data using K-means clustering and Self-Organizing Maps with interactive visualizations and quality metrics.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      color: 'accent',
      features: [
        'K-means clustering',
        'Self-Organizing Maps',
        'Quality metrics',
        'Visual cluster analysis'
      ]
    },
    {
      title: 'Smart Data Management',
      description: 'Upload CSV files with automatic type inference, data preview, and intelligent column selection for comprehensive data analysis workflows.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'secondary',
      features: [
        'Drag & drop CSV upload',
        'Automatic type inference',
        'Data statistics & preview',
        'Demo datasets included'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary-100',
          text: 'text-primary-600',
          border: 'border-primary-200'
        };
      case 'accent':
        return {
          bg: 'bg-accent-100',
          text: 'text-accent-600',
          border: 'border-accent-200'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary-100',
          text: 'text-secondary-600',
          border: 'border-secondary-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  return (
    <section className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-bold">Powerful AI Tools for Data Analysis</span>
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Everything you need to build, train, and deploy machine learning models with an intuitive interface
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl p-8 shadow-sm border ${colors.border} hover:shadow-lg transition-shadow duration-300 text-center`}
              >
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mb-6 mx-auto`}>
                  <div className={colors.text}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-secondary-600 mb-6 text-justify leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.features.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-secondary-700">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
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
          className="mt-20 bg-white rounded-2xl p-8 shadow-sm border border-secondary-200"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-bold">Built with Modern Technology</span>
            </h3>
            <p className="text-secondary-600">
              Production-ready architecture with clean code and best practices
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">TS</span>
              </div>
              <h4 className="font-medium text-secondary-900 mb-1">TypeScript</h4>
              <p className="text-sm text-secondary-600">Type-safe development</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-600 font-bold text-lg">⚛</span>
              </div>
              <h4 className="font-medium text-secondary-900 mb-1">React</h4>
              <p className="text-sm text-secondary-600">Modern UI framework</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-teal-600 font-bold text-lg">🎨</span>
              </div>
              <h4 className="font-medium text-secondary-900 mb-1">Tailwind</h4>
              <p className="text-sm text-secondary-600">Utility-first CSS</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">🧠</span>
              </div>
              <h4 className="font-medium text-secondary-900 mb-1">Pure ML</h4>
              <p className="text-sm text-secondary-600">No external ML deps</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;