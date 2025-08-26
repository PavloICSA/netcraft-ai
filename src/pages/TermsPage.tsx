import React from 'react';
import { motion } from 'framer-motion';

/**
 * Terms of Use page
 */
const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Terms of Use
        </h1>
        <p className="text-xl text-secondary-600">
          Last updated: January 2025
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Introduction</h2>
        <p className="text-secondary-700 leading-relaxed">
          Welcome to NetCraft AI. These Terms of Use ("Terms") govern your use of our 
          web application and services. By accessing or using NetCraft AI, you agree 
          to be bound by these Terms. If you do not agree to these Terms, please do 
          not use our service.
        </p>
      </motion.div>

      {/* Service Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Service Description</h2>
        <p className="text-secondary-700 leading-relaxed mb-4">
          NetCraft AI is a client-side web application that provides machine learning 
          tools for data analysis, including neural network prediction and clustering 
          analysis. The service operates entirely within your web browser and does not 
          transmit your data to external servers.
        </p>
        <p className="text-secondary-700 leading-relaxed">
          Key features include:
        </p>
        <ul className="list-disc list-inside text-secondary-700 mt-2 space-y-1">
          <li>Neural network training and prediction</li>
          <li>K-means and SOM clustering analysis</li>
          <li>Data visualization and export capabilities</li>
          <li>Local data storage and model persistence</li>
        </ul>
      </motion.div>

      {/* Acceptable Use */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Acceptable Use</h2>
        <div className="space-y-4 text-secondary-700">
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">You may use NetCraft AI to:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Analyze your own data for legitimate purposes</li>
              <li>Build and train machine learning models</li>
              <li>Export and share results from your analysis</li>
              <li>Use the service for educational or research purposes</li>
              <li>Integrate the service into commercial applications</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">You may not use NetCraft AI to:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Process illegal, harmful, or malicious data</li>
              <li>Attempt to reverse engineer or modify the service</li>
              <li>Use the service to harm others or violate their privacy</li>
              <li>Overload or attempt to disrupt the service</li>
              <li>Remove or modify copyright notices or attributions</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Data and Privacy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-green-50 border-green-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Data and Privacy</h2>
        <div className="space-y-4 text-secondary-700">
          <p>
            <strong>Client-Side Processing:</strong> All data processing occurs within 
            your web browser. Your data is never transmitted to our servers or any 
            third-party services.
          </p>
          <p>
            <strong>Local Storage:</strong> Data, models, and results are stored locally 
            on your device using browser storage mechanisms. You have full control over 
            this data and can delete it at any time.
          </p>
          <p>
            <strong>No Data Collection:</strong> We do not collect, store, or analyze 
            your personal data or the datasets you upload to the application.
          </p>
          <p>
            <strong>Your Responsibility:</strong> You are responsible for ensuring that 
            any data you upload complies with applicable laws and regulations, including 
            data protection and privacy laws.
          </p>
        </div>
      </motion.div>

      {/* Intellectual Property */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Intellectual Property</h2>
        <div className="space-y-4 text-secondary-700">
          <p>
            <strong>Open Source License:</strong> NetCraft AI is released under the MIT 
            License. You are free to use, modify, and distribute the software in 
            accordance with the license terms.
          </p>
          <p>
            <strong>Your Data:</strong> You retain all rights to the data you upload 
            and the models you create using the service. We claim no ownership over 
            your data or results.
          </p>
          <p>
            <strong>Trademarks:</strong> "NetCraft AI" and associated logos are 
            trademarks. You may not use these trademarks without explicit permission.
          </p>
        </div>
      </motion.div>

      {/* Disclaimers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-yellow-50 border-yellow-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Disclaimers</h2>
        <div className="space-y-4 text-secondary-700">
          <p>
            <strong>No Warranty:</strong> NetCraft AI is provided "as is" without any 
            warranties, express or implied. We do not guarantee that the service will 
            be error-free or uninterrupted.
          </p>
          <p>
            <strong>Accuracy:</strong> While we strive for accuracy in our machine 
            learning implementations, we make no guarantees about the correctness or 
            reliability of results produced by the service.
          </p>
          <p>
            <strong>Educational Purpose:</strong> This service is designed for 
            educational and research purposes. For critical applications, please 
            validate results using additional tools and methods.
          </p>
        </div>
      </motion.div>

      {/* Limitation of Liability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Limitation of Liability</h2>
        <p className="text-secondary-700 leading-relaxed">
          To the maximum extent permitted by law, we shall not be liable for any 
          indirect, incidental, special, consequential, or punitive damages, or any 
          loss of profits or revenues, whether incurred directly or indirectly, or 
          any loss of data, use, goodwill, or other intangible losses resulting from 
          your use of the service.
        </p>
      </motion.div>

      {/* Changes to Terms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Changes to Terms</h2>
        <p className="text-secondary-700 leading-relaxed">
          We reserve the right to modify these Terms at any time. Changes will be 
          effective immediately upon posting. Your continued use of the service after 
          any changes constitutes acceptance of the new Terms. We encourage you to 
          review these Terms periodically.
        </p>
      </motion.div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Contact Information</h2>
        <p className="text-secondary-700 leading-relaxed">
          If you have any questions about these Terms of Use, please contact us at:
        </p>
        <div className="mt-4 text-secondary-700">
          <p>Email: support@netcraft-ai.com</p>
          <p>GitHub: <a href="https://github.com/netcraft-ai" className="text-primary-600 hover:text-primary-700">https://github.com/netcraft-ai</a></p>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsPage;