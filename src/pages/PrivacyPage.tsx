import React from 'react';
import { motion } from 'framer-motion';

/**
 * Privacy Policy page
 */
const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Privacy Policy
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
        className="card bg-green-50 border-green-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Privacy-First Design</h2>
        <p className="text-secondary-700 leading-relaxed mb-4">
          NetCraft AI is designed with privacy as a core principle. Unlike traditional 
          web applications, all data processing happens entirely within your web browser. 
          Your data never leaves your device, ensuring complete privacy and security.
        </p>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-green-800 font-medium">
            🔒 Zero Data Collection: We do not collect, store, or transmit any of your personal data or datasets.
          </p>
        </div>
      </motion.div>

      {/* What We Don't Collect */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">What We Don't Collect</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Personal Data</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• No user accounts or registration</li>
              <li>• No personal information collection</li>
              <li>• No email addresses or contact details</li>
              <li>• No demographic information</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Usage Data</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• No analytics or tracking</li>
              <li>• No usage statistics</li>
              <li>• No behavioral data</li>
              <li>• No performance metrics</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* How Your Data Stays Private */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">How Your Data Stays Private</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Client-Side Processing</h3>
              <p className="text-secondary-700">
                All machine learning computations, data analysis, and model training 
                happen directly in your web browser using JavaScript and WebAssembly. 
                No data is sent to external servers.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Local Storage Only</h3>
              <p className="text-secondary-700">
                Your datasets, trained models, and results are stored locally in your 
                browser's storage. This data remains on your device and is never 
                transmitted elsewhere.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">No Network Transmission</h3>
              <p className="text-secondary-700">
                After the initial application load, no network requests are made for 
                data processing. Your data never leaves your device's memory.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Local Storage Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Local Storage Details</h2>
        <div className="space-y-4 text-secondary-700">
          <p>
            NetCraft AI uses your browser's local storage mechanisms to save your work:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">What's Stored Locally:</h3>
              <ul className="space-y-1">
                <li>• Uploaded datasets</li>
                <li>• Trained neural network models</li>
                <li>• Clustering results</li>
                <li>• Application preferences</li>
                <li>• Project state</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-2">Your Control:</h3>
              <ul className="space-y-1">
                <li>• Clear data anytime via browser settings</li>
                <li>• Export data to your own files</li>
                <li>• No automatic data sharing</li>
                <li>• Complete data ownership</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Form Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card bg-blue-50 border-blue-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Contact Form Data</h2>
        <p className="text-secondary-700 leading-relaxed mb-4">
          When you use the contact form on our website, the information you provide 
          is stored locally in your browser and is not transmitted to our servers. 
          This is for demonstration purposes only.
        </p>
        <p className="text-secondary-700 leading-relaxed">
          For actual support requests, we recommend using the provided email address 
          or GitHub repository links to contact us directly.
        </p>
      </motion.div>

      {/* Third-Party Services */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Third-Party Services</h2>
        <div className="space-y-4 text-secondary-700">
          <p>
            NetCraft AI is designed to minimize dependencies on third-party services:
          </p>
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">What We Use:</h3>
            <ul className="space-y-2">
              <li>• <strong>Web Fonts:</strong> Google Fonts for typography (loaded from CDN)</li>
              <li>• <strong>Hosting:</strong> Static file hosting (no server-side processing)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-secondary-900 mb-2">What We Don't Use:</h3>
            <ul className="space-y-2">
              <li>• No analytics services (Google Analytics, etc.)</li>
              <li>• No advertising networks</li>
              <li>• No social media tracking</li>
              <li>• No external APIs for data processing</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Your Rights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Your Rights</h2>
        <div className="space-y-4 text-secondary-700">
          <p>
            Since we don't collect your data, traditional data protection rights 
            don't apply in the usual sense. However, you have complete control:
          </p>
          <ul className="space-y-2">
            <li>• <strong>Data Ownership:</strong> You own all data you upload and create</li>
            <li>• <strong>Data Portability:</strong> Export your data anytime in standard formats</li>
            <li>• <strong>Data Deletion:</strong> Clear your data through browser settings</li>
            <li>• <strong>Transparency:</strong> Full source code available for review</li>
          </ul>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Security</h2>
        <div className="space-y-4 text-secondary-700">
          <p>
            While we don't handle your data on our servers, we still implement 
            security best practices:
          </p>
          <ul className="space-y-2">
            <li>• <strong>HTTPS:</strong> All connections are encrypted</li>
            <li>• <strong>Content Security Policy:</strong> Protection against XSS attacks</li>
            <li>• <strong>No External Scripts:</strong> Minimal third-party dependencies</li>
            <li>• <strong>Open Source:</strong> Code is publicly auditable</li>
          </ul>
        </div>
      </motion.div>

      {/* Changes to Privacy Policy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Changes to This Policy</h2>
        <p className="text-secondary-700 leading-relaxed">
          We may update this Privacy Policy from time to time. Any changes will be 
          posted on this page with an updated revision date. Since we don't collect 
          your contact information, we cannot notify you directly of changes. We 
          encourage you to review this policy periodically.
        </p>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Questions?</h2>
        <p className="text-secondary-700 leading-relaxed">
          If you have any questions about this Privacy Policy or our privacy practices, 
          please contact us at:
        </p>
        <div className="mt-4 text-secondary-700">
          <p>Email: privacy@netcraft-ai.com</p>
          <p>GitHub: <a href="https://github.com/netcraft-ai" className="text-primary-600 hover:text-primary-700">https://github.com/netcraft-ai</a></p>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage;