import React from 'react';
import { motion } from 'framer-motion';

/**
 * Guidelines page with usage instructions and best practices
 */
const GuidelinesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Usage Guidelines
        </h1>
        <p className="text-xl text-secondary-600">
          Best practices for effective machine learning with NetCraft AI
        </p>
      </motion.div>

      {/* Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-1">Upload Your Data</h3>
              <p className="text-secondary-600">
                Start by uploading a CSV file with your dataset. The system will automatically 
                detect column types and provide data statistics.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-1">Explore Your Data</h3>
              <p className="text-secondary-600">
                Review the data preview, column statistics, and select relevant features 
                for your analysis.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-1">Choose Your Analysis</h3>
              <p className="text-secondary-600">
                Decide between neural network prediction or clustering analysis based 
                on your goals.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Neural Network Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Neural Network Best Practices</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Data Preparation</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• <strong>Clean Data:</strong> Remove or handle missing values before upload</li>
              <li>• <strong>Numeric Features:</strong> Ensure input features are numeric for best results</li>
              <li>• <strong>Scale Consideration:</strong> Features with similar scales often work better</li>
              <li>• <strong>Sample Size:</strong> Aim for at least 100+ samples for reliable training</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Architecture Selection</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• <strong>Start Simple:</strong> Begin with 1-2 hidden layers</li>
              <li>• <strong>Layer Size:</strong> Use 5-50 neurons per layer initially</li>
              <li>• <strong>Activation Functions:</strong> ReLU works well for most cases</li>
              <li>• <strong>Output Layer:</strong> 1 neuron for regression, multiple for classification</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Training Parameters</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• <strong>Learning Rate:</strong> Start with 0.01, adjust if needed (0.001-0.1)</li>
              <li>• <strong>Epochs:</strong> Begin with 100-500 epochs</li>
              <li>• <strong>Batch Size:</strong> Use 16-64 for small datasets, 32 is often good</li>
              <li>• <strong>Monitor Training:</strong> Watch for overfitting in loss curves</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Clustering Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Clustering Best Practices</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Feature Selection</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• <strong>Relevant Features:</strong> Choose features that define similarity</li>
              <li>• <strong>Numeric Only:</strong> Use numeric features for distance calculations</li>
              <li>• <strong>Feature Scaling:</strong> Consider if features have very different scales</li>
              <li>• <strong>Dimensionality:</strong> 2-10 features often work well for visualization</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">K-Means Guidelines</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• <strong>Number of Clusters:</strong> Start with 2-5 clusters</li>
              <li>• <strong>Data Shape:</strong> Works best with spherical cluster shapes</li>
              <li>• <strong>Initialization:</strong> K-means++ initialization is recommended</li>
              <li>• <strong>Evaluation:</strong> Lower inertia generally indicates better clustering</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Self-Organizing Maps</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• <strong>Grid Size:</strong> Start with 5x5 or 10x10 grids</li>
              <li>• <strong>Training Epochs:</strong> Use 100-1000 epochs for convergence</li>
              <li>• <strong>Learning Rate:</strong> 0.1-0.5 works well for most cases</li>
              <li>• <strong>Topology:</strong> Rectangular topology is simpler to interpret</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Data Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-blue-50 border-blue-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Data Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">File Format</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• CSV files with headers</li>
              <li>• UTF-8 encoding recommended</li>
              <li>• Comma-separated values</li>
              <li>• Maximum file size: 10MB</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Data Quality</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• Consistent data types per column</li>
              <li>• Minimal missing values</li>
              <li>• Meaningful column names</li>
              <li>• Sufficient sample size</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Troubleshooting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Troubleshooting</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">Training Issues</h3>
            <ul className="space-y-1 text-sm text-secondary-700">
              <li>• <strong>Loss not decreasing:</strong> Try lower learning rate or more epochs</li>
              <li>• <strong>Training too slow:</strong> Reduce network size or batch size</li>
              <li>• <strong>Poor accuracy:</strong> Check data quality and feature selection</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">Clustering Issues</h3>
            <ul className="space-y-1 text-sm text-secondary-700">
              <li>• <strong>Poor clusters:</strong> Try different number of clusters or features</li>
              <li>• <strong>No clear patterns:</strong> Data might not have natural clusters</li>
              <li>• <strong>SOM not converging:</strong> Increase epochs or adjust learning rate</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">Data Issues</h3>
            <ul className="space-y-1 text-sm text-secondary-700">
              <li>• <strong>Upload fails:</strong> Check file format and size</li>
              <li>• <strong>Wrong data types:</strong> Manually verify column types</li>
              <li>• <strong>Missing values:</strong> Clean data before upload</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Performance Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-green-50 border-green-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Performance Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Browser Performance</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• Use modern browsers (Chrome, Firefox, Safari)</li>
              <li>• Close unnecessary tabs</li>
              <li>• Ensure sufficient RAM available</li>
              <li>• Use desktop for large datasets</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Model Optimization</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• Start with smaller models</li>
              <li>• Use appropriate batch sizes</li>
              <li>• Monitor training progress</li>
              <li>• Save models regularly</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GuidelinesPage;