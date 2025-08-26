import React from 'react';
import { motion } from 'framer-motion';

/**
 * Contribution Guidelines page with information for contributors
 */
const ContributionPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-secondary-900 mb-4">
          Contribution Guidelines
        </h1>
        <p className="text-xl text-secondary-600">
          Help us improve NetCraft AI and make machine learning more accessible
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
        <div className="prose prose-secondary max-w-none">
          <p className="text-justify leading-relaxed text-secondary-700 mb-4">
            We welcome contributions from developers, researchers, and machine learning enthusiasts. 
            NetCraft AI is built with modern web technologies and follows industry best practices 
            to ensure code quality and maintainability. Whether you're fixing bugs, adding features, 
            or improving documentation, your contributions help make machine learning more accessible 
            to everyone.
          </p>
          <p className="text-justify leading-relaxed text-secondary-700">
            Before contributing, please take a moment to review these guidelines to ensure your 
            contributions align with our project standards and contribute effectively to the codebase.
          </p>
        </div>
      </motion.div>

      {/* Development Setup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Development Setup</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Prerequisites</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• <strong>Node.js:</strong> Version 18.0 or higher</li>
              <li>• <strong>npm:</strong> Latest version (comes with Node.js)</li>
              <li>• <strong>Git:</strong> For version control</li>
              <li>• <strong>Modern Browser:</strong> Chrome, Firefox, or Safari for testing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Local Development</h3>
            <div className="bg-secondary-100 rounded-lg p-4 font-mono text-sm">
              <div className="space-y-2">
                <div># Clone the repository</div>
                <div>git clone &lt;repository-url&gt;</div>
                <div>cd netcraft-ai</div>
                <div className="mt-3"># Install dependencies</div>
                <div>npm install</div>
                <div className="mt-3"># Start development server</div>
                <div>npm run dev</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>     
 {/* Code Standards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Code Standards</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">TypeScript Guidelines</h3>
            <p className="text-justify leading-relaxed text-secondary-700 mb-3">
              All code must be written in TypeScript with strict mode enabled. Use proper type 
              annotations and interfaces to ensure type safety throughout the application. 
              Avoid using 'any' type unless absolutely necessary, and prefer explicit typing 
              over implicit inference where it improves code clarity.
            </p>
            <ul className="space-y-2 text-secondary-700">
              <li>• Use strict TypeScript configuration</li>
              <li>• Define interfaces for all data structures</li>
              <li>• Prefer explicit return types for functions</li>
              <li>• Use proper generic types where applicable</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">React Best Practices</h3>
            <p className="text-justify leading-relaxed text-secondary-700 mb-3">
              Follow modern React patterns using functional components and hooks. Ensure proper 
              component composition, avoid prop drilling through context when appropriate, and 
              maintain clean separation between presentation and business logic components.
            </p>
            <ul className="space-y-2 text-secondary-700">
              <li>• Use functional components with hooks</li>
              <li>• Implement proper error boundaries</li>
              <li>• Follow component naming conventions</li>
              <li>• Use React.memo for performance optimization when needed</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Code Formatting</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• <strong>Prettier:</strong> Single quotes, 100 character width, 2 spaces</li>
              <li>• <strong>ESLint:</strong> Follow TypeScript and React hooks rules</li>
              <li>• <strong>Imports:</strong> Group and sort imports logically</li>
              <li>• <strong>Comments:</strong> Use JSDoc for functions and components</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Contribution Process */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card bg-blue-50 border-blue-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Contribution Process</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-1">Fork & Branch</h3>
              <p className="text-justify leading-relaxed text-secondary-600">
                Fork the repository and create a feature branch from main. Use descriptive 
                branch names that clearly indicate the purpose of your changes.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-1">Develop & Test</h3>
              <p className="text-justify leading-relaxed text-secondary-600">
                Implement your changes following our code standards. Write tests for new 
                functionality and ensure all existing tests continue to pass.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
              <span className="text-primary-600 font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-medium text-secondary-900 mb-1">Submit Pull Request</h3>
              <p className="text-justify leading-relaxed text-secondary-600">
                Create a pull request with a clear description of your changes, including 
                the problem solved and any relevant context for reviewers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Areas for Contribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">Areas for Contribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Machine Learning</h3>
            <p className="text-justify leading-relaxed text-secondary-700 mb-3">
              Enhance our neural network implementations, add new clustering algorithms, 
              or improve existing machine learning utilities with better performance 
              and accuracy.
            </p>
            <ul className="space-y-1 text-sm text-secondary-600">
              <li>• Neural network optimizations</li>
              <li>• New activation functions</li>
              <li>• Additional clustering methods</li>
              <li>• Performance improvements</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">User Interface</h3>
            <p className="text-justify leading-relaxed text-secondary-700 mb-3">
              Improve user experience through better visualizations, enhanced accessibility, 
              responsive design improvements, or new interactive features that make 
              machine learning more intuitive.
            </p>
            <ul className="space-y-1 text-sm text-secondary-600">
              <li>• Data visualization enhancements</li>
              <li>• Accessibility improvements</li>
              <li>• Mobile responsiveness</li>
              <li>• Interactive tutorials</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Documentation</h3>
            <p className="text-justify leading-relaxed text-secondary-700 mb-3">
              Help others understand and use NetCraft AI by improving documentation, 
              creating tutorials, or adding code examples that demonstrate best practices 
              and common use cases.
            </p>
            <ul className="space-y-1 text-sm text-secondary-600">
              <li>• API documentation</li>
              <li>• Usage examples</li>
              <li>• Tutorial content</li>
              <li>• Code comments</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Testing & Quality</h3>
            <p className="text-justify leading-relaxed text-secondary-700 mb-3">
              Strengthen the codebase by adding comprehensive tests, improving error handling, 
              or enhancing the development workflow with better tooling and automation.
            </p>
            <ul className="space-y-1 text-sm text-secondary-600">
              <li>• Unit test coverage</li>
              <li>• Integration tests</li>
              <li>• Error handling</li>
              <li>• Development tools</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Community Guidelines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card bg-green-50 border-green-200"
      >
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">Community Guidelines</h2>
        <p className="text-justify leading-relaxed text-secondary-700 mb-4">
          We foster an inclusive and welcoming community where all contributors can learn, 
          share knowledge, and collaborate effectively. Treat all community members with 
          respect and professionalism, regardless of their experience level or background.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Communication</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• Be respectful and constructive</li>
              <li>• Provide clear and helpful feedback</li>
              <li>• Ask questions when uncertain</li>
              <li>• Share knowledge generously</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Collaboration</h3>
            <ul className="space-y-2 text-secondary-700">
              <li>• Review pull requests thoughtfully</li>
              <li>• Respond to feedback positively</li>
              <li>• Help newcomers get started</li>
              <li>• Celebrate community achievements</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContributionPage;