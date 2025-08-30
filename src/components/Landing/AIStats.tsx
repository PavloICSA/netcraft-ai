import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Stat {
  label: string;
  value: number;
  suffix: string;
  color: string;
}

/**
 * Animated AI statistics component
 */
const AIStats: React.FC = () => {
  const { t } = useTranslation('landing');
  
  const [values, setValues] = useState([0, 0, 0, 0]);
  const targetValues = [10, 8, 100, 95];
  const suffixes = ['+', '', 'K+', '%'];
  const colors = ['text-primary-600', 'text-accent-600', 'text-secondary-600 dark:text-gray-400', 'text-emerald-600'];

  // Get current labels (will update when language changes)
  const labels = [
    t('aiStats.neuralLayers'),
    t('aiStats.mlAlgorithms'),
    t('aiStats.dataPoints'),
    t('aiStats.predictions')
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => prev.map((value, index) => 
        Math.min(value + Math.ceil(targetValues[index] / 20), targetValues[index])
      ));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mt-8 mb-8"
    >
      {values.map((value, index) => (
        <div key={index} className="text-center">
          <motion.div
            className={`text-2xl md:text-3xl font-bold ${colors[index]} mb-1`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {value}{suffixes[index]}
          </motion.div>
          <div className="text-sm text-secondary-600 dark:text-gray-400 font-medium">
            {labels[index]}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default AIStats;