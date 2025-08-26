import React from 'react';
import { motion } from 'framer-motion';

/**
 * About page with project information
 */
const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          About NetCraft AI
        </h1>
        <p className="text-xl text-secondary-600">
          AI-powered data analysis platform for neural networks and clustering
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Our Mission</h2>
        <p className="text-secondary-700 leading-relaxed text-justify">
          NetCraft AI democratizes machine learning by providing an intuitive, browser-based platform 
          for neural network prediction and clustering analysis. We believe that powerful AI tools 
          should be accessible to everyone, regardless of their technical background or computational resources.
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Neural Networks</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• Custom multilayer perceptron architecture</li>
              <li>• Regression and classification support</li>
              <li>• Real-time training visualization</li>
              <li>• Comprehensive performance metrics</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Clustering Analysis</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• K-means clustering with k-means++</li>
              <li>• Self-Organizing Maps (SOM)</li>
              <li>• Interactive cluster visualization</li>
              <li>• Quality assessment metrics</li>
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
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-xl">⚛</span>
            </div>
            <h3 className="font-medium text-secondary-900 mb-2">Frontend</h3>
            <p className="text-sm text-secondary-600">React 18, TypeScript, Tailwind CSS</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold text-xl">🧠</span>
            </div>
            <h3 className="font-medium text-secondary-900 mb-2">Machine Learning</h3>
            <p className="text-sm text-secondary-600">Pure TypeScript implementation</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold text-xl">🎨</span>
            </div>
            <h3 className="font-medium text-secondary-900 mb-2">Design</h3>
            <p className="text-sm text-secondary-600">Framer Motion, Responsive UI</p>
          </div>
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-green-50 border-green-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Privacy & Security</h2>
        <div className="space-y-4 text-secondary-700">
          <p className="text-justify leading-relaxed">
            <strong>100% Client-Side Processing:</strong> All data processing happens in your browser ensuring complete privacy and security. 
            Your data never leaves your device, providing maximum protection for sensitive information.
          </p>
          <p className="text-justify leading-relaxed">
            <strong>No Server Dependencies:</strong> The application runs entirely in your browser without requiring external servers or cloud services. 
            This eliminates latency issues and ensures consistent performance across all environments.
          </p>
          <p className="text-justify leading-relaxed">
            <strong>Local Storage Only:</strong> Models and results are saved locally on your device with full user control. 
            You can export your data at any time and maintain complete ownership of your work.
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
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Open Source</h2>
        <p className="text-secondary-700 mb-4 text-justify leading-relaxed">
          NetCraft AI is built with transparency and community collaboration in mind, fostering an open development environment. 
          The source code is available for review, contribution, and learning to support the broader developer community.
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/netcraft-ai"
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <a
            href="/contribution"
            className="btn-secondary"
          >
            Contribution Guidelines
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
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Development</h2>
        <p className="text-secondary-700 text-justify leading-relaxed">
          NetCraft AI is developed with modern web technologies and best practices, 
          focusing on performance, accessibility, and user experience. The project 
          follows strict TypeScript typing, comprehensive testing, and clean architecture principles.
        </p>
      </motion.div>
    </div>
  );
};

export default AboutPage;