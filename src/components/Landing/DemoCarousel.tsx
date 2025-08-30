import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Demo carousel showcasing application features
 */
const DemoCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation('landing');

  const getFeatureArray = (key: string): string[] => {
    const result = t(key, { returnObjects: true });
    return Array.isArray(result) ? result.filter((item): item is string => typeof item === 'string') : [];
  };

  const demos = [
    {
      title: t('demo.dataUpload.title'),
      description: t('demo.dataUpload.description'),
      image: '/api/placeholder/600/400',
      features: getFeatureArray('demo.dataUpload.features'),
      route: '/data'
    },
    {
      title: t('demo.neuralNetworkTraining.title'),
      description: t('demo.neuralNetworkTraining.description'),
      image: '/api/placeholder/600/400',
      features: getFeatureArray('demo.neuralNetworkTraining.features'),
      route: '/predictor'
    },
    {
      title: t('demo.randomForestAnalysis.title'),
      description: t('demo.randomForestAnalysis.description'),
      image: '/api/placeholder/600/400',
      features: getFeatureArray('demo.randomForestAnalysis.features'),
      route: '/predictor'
    },
    {
      title: t('demo.timeSeriesForecasting.title'),
      description: t('demo.timeSeriesForecasting.description'),
      image: '/api/placeholder/600/400',
      features: getFeatureArray('demo.timeSeriesForecasting.features'),
      route: '/forecasting'
    },
    {
      title: t('demo.clusteringAnalysis.title'),
      description: t('demo.clusteringAnalysis.description'),
      image: '/api/placeholder/600/400',
      features: getFeatureArray('demo.clusteringAnalysis.features'),
      route: '/clusterizer'
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
      <div className="relative h-96 bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex"
          >
            {/* Interactive Demo Preview */}
            <div className="flex-1 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 p-6 flex items-center justify-center">
              {currentSlide === 0 && <DataUploadDemo t={t} />}
              {currentSlide === 1 && <NeuralNetworkDemo t={t} />}
              {currentSlide === 2 && <RandomForestDemo t={t} />}
              {currentSlide === 3 && <TimeSeriesForecastingDemo t={t} />}
              {currentSlide === 4 && <ClusteringDemo t={t} />}
            </div>

            {/* Demo Info */}
            <div className="flex-1 p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-gray-100 mb-4">
                {demos[currentSlide].title}
              </h3>
              <p className="text-secondary-600 dark:text-gray-400 mb-6 text-justify leading-relaxed">
                {demos[currentSlide].description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {demos[currentSlide].features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-secondary-700 dark:text-gray-300">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className="btn-primary w-fit"
                onClick={() => navigate(demos[currentSlide].route)}
              >
                {t('demo.tryThisFeature')}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-50 dark:hover:bg-gray-700 transition-colors"
          aria-label={t('demo.previousDemo')}
        >
          <svg className="w-5 h-5 text-secondary-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center hover:bg-secondary-50 dark:hover:bg-gray-700 transition-colors"
          aria-label={t('demo.nextDemo')}
        >
          <svg className="w-5 h-5 text-secondary-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
            aria-label={t('demo.goToSlide', { number: index + 1 })}
            aria-current={index === currentSlide ? 'true' : 'false'}
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
        <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-secondary-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
          <div className="text-sm text-secondary-600 dark:text-gray-400">{t('demo.stats.clientSideProcessing')}</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-secondary-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-accent-600 mb-2">0</div>
          <div className="text-sm text-secondary-600 dark:text-gray-400">{t('demo.stats.externalDependencies')}</div>
        </div>
        
        <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-secondary-200 dark:border-gray-700">
          <div className="text-3xl font-bold text-secondary-600 dark:text-gray-400 mb-2">∞</div>
          <div className="text-sm text-secondary-600 dark:text-gray-400">{t('demo.stats.dataPrivacy')}</div>
        </div>
      </motion.div>
    </div>
  );
};

// Mini Demo Components
interface MiniDemoProps {
  t: (key: string, options?: any) => string;
}

const DataUploadDemo: React.FC<MiniDemoProps> = ({ t }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          setIsUploaded(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploaded(false);
      }, 2000);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 border-dashed border-primary-300 dark:border-primary-600 p-6 text-center">
        <svg className="w-12 h-12 text-primary-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-secondary-600 dark:text-gray-400 mb-4">{t('demo.miniDemos.dropCsvHere')}</p>
        
        {uploadProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-100"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-secondary-500 mt-1">{uploadProgress}% {t('demo.miniDemos.uploaded')}</p>
          </div>
        )}

        {isUploaded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-600 text-sm"
          >
            ✓ sales_data.csv {t('demo.miniDemos.processed')}
            <div className="text-xs text-secondary-500 mt-1">{t('demo.miniDemos.rowsAndColumns', { rows: '1,247', columns: '8' })}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const NeuralNetworkDemo: React.FC<MiniDemoProps> = ({ t }) => {
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0.95);
  const [accuracy, setAccuracy] = useState(0.12);

  useEffect(() => {
    const interval = setInterval(() => {
      setEpoch(prev => {
        const newEpoch = (prev + 1) % 101;
        if (newEpoch === 0) {
          setLoss(0.95);
          setAccuracy(0.12);
        } else {
          setLoss(Math.max(0.05, 0.95 - (newEpoch * 0.009)));
          setAccuracy(Math.min(0.98, 0.12 + (newEpoch * 0.0086)));
        }
        return newEpoch;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-secondary-800 dark:text-gray-200">{t('demo.miniDemos.neuralNetworkTraining')}</h4>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-50 dark:bg-green-900/200 rounded-full animate-pulse mr-1"></div>
          <span className="text-xs text-green-600">{t('demo.miniDemos.training')}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-secondary-600 dark:text-gray-400 mb-1">
            <span>{t('demo.miniDemos.epoch')}</span>
            <span>{epoch}/100</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-1.5">
            <div 
              className="bg-primary-600 h-1.5 rounded-full transition-all duration-75"
              style={{ width: `${epoch}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 dark:bg-red-900/20 rounded p-2">
            <div className="text-xs text-red-600 font-medium">{t('demo.miniDemos.loss')}</div>
            <div className="text-lg font-bold text-red-700">{loss.toFixed(3)}</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
            <div className="text-xs text-green-600 font-medium">{t('demo.miniDemos.accuracy')}</div>
            <div className="text-lg font-bold text-green-700">{(accuracy * 100).toFixed(1)}%</div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-1 pt-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${i < 3 ? 'bg-primary-400' : 'bg-secondary-300'}`}></div>
              {i < 4 && <div className="w-4 h-0.5 bg-secondary-300 mt-1"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RandomForestDemo: React.FC<MiniDemoProps> = ({ t }) => {
  const [treesBuilt, setTreesBuilt] = useState(0);
  const [oobScore, setOobScore] = useState(0.45);
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = ['Age', 'Income', 'Education', 'Experience'];
  const importance = [0.35, 0.28, 0.22, 0.15];

  useEffect(() => {
    const interval = setInterval(() => {
      setTreesBuilt(prev => {
        const newTrees = (prev + 1) % 101;
        if (newTrees === 0) {
          setOobScore(0.45);
        } else {
          setOobScore(Math.min(0.94, 0.45 + (newTrees * 0.0049)));
        }
        return newTrees;
      });
    }, 60);

    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-secondary-800 dark:text-gray-200">{t('demo.miniDemos.randomForest')}</h4>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-50 dark:bg-green-900/200 rounded-full animate-pulse mr-1"></div>
          <span className="text-xs text-green-600">{t('demo.miniDemos.building')}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-secondary-600 dark:text-gray-400 mb-1">
            <span>{t('demo.miniDemos.treesBuilt')}</span>
            <span>{treesBuilt}/100</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-1.5">
            <div 
              className="bg-green-600 h-1.5 rounded-full transition-all duration-75"
              style={{ width: `${treesBuilt}%` }}
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
          <div className="text-xs text-blue-600 font-medium">{t('demo.miniDemos.oobScore')}</div>
          <div className="text-lg font-bold text-blue-700">{(oobScore * 100).toFixed(1)}%</div>
        </div>

        <div>
          <div className="text-xs text-secondary-600 dark:text-gray-400 mb-2">{t('demo.miniDemos.featureImportance')}</div>
          <div className="space-y-1">
            {features.map((feature, index) => (
              <div key={index} className={`flex items-center transition-all ${
                currentFeature === index ? 'scale-105' : ''
              }`}>
                <div className="w-12 text-xs text-secondary-600 dark:text-gray-400 truncate">{feature}</div>
                <div className="flex-1 bg-secondary-200 rounded-full h-1.5 mx-2">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentFeature === index ? 'bg-primary-600' : 'bg-secondary-400'
                    }`}
                    style={{ width: `${importance[index] * 100}%` }}
                  />
                </div>
                <div className="text-xs text-secondary-500 w-8 text-right">
                  {(importance[index] * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeSeriesForecastingDemo: React.FC<MiniDemoProps> = ({ t }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [forecastProgress, setForecastProgress] = useState(0);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0);
  
  const algorithms = ['Moving Average', 'Exp. Smoothing', 'Linear Trend'];
  const steps = [t('demo.miniDemos.analyzing'), t('demo.miniDemos.forecasting'), t('demo.miniDemos.complete')];
  
  // Sample time series data points for visualization
  const historicalData = [45, 52, 48, 61, 55, 67, 59, 72, 68, 75];
  const forecastData = [78, 82, 79, 85, 88];

  useEffect(() => {
    const interval = setInterval(() => {
      setForecastProgress(prev => {
        const newProgress = (prev + 2) % 102;
        if (newProgress === 0) {
          setCurrentStep(0);
          setCurrentAlgorithm(prev => (prev + 1) % algorithms.length);
        } else if (newProgress < 40) {
          setCurrentStep(0);
        } else if (newProgress < 80) {
          setCurrentStep(1);
        } else {
          setCurrentStep(2);
        }
        return newProgress;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-secondary-800 dark:text-gray-200">{t('demo.miniDemos.timeSeriesForecast')}</h4>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-50 dark:bg-blue-900/200 rounded-full animate-pulse mr-1"></div>
          <span className="text-xs text-blue-600">{steps[currentStep]}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-secondary-600 dark:text-gray-400 mb-1">
            <span>{t('demo.miniDemos.algorithm')}: {algorithms[currentAlgorithm]}</span>
            <span>{forecastProgress}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-75"
              style={{ width: `${forecastProgress}%` }}
            />
          </div>
        </div>

        {/* Time series visualization */}
        <div className="relative h-24 bg-secondary-50 dark:bg-gray-700 rounded overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
            {/* Historical data line */}
            <polyline
              points={historicalData.map((value, index) => 
                `${(index / (historicalData.length - 1)) * 120},${80 - (value / 100) * 60}`
              ).join(' ')}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              className="opacity-80"
            />
            
            {/* Forecast data line (animated based on progress) */}
            {forecastProgress > 60 && (
              <polyline
                points={forecastData.slice(0, Math.floor((forecastProgress - 60) / 10)).map((value, index) => 
                  `${120 + (index / (forecastData.length - 1)) * 60},${80 - (value / 100) * 60}`
                ).join(' ')}
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="4,2"
                className="opacity-90"
              />
            )}
            
            {/* Data points */}
            {historicalData.map((value, index) => (
              <circle
                key={index}
                cx={(index / (historicalData.length - 1)) * 120}
                cy={80 - (value / 100) * 60}
                r="1.5"
                fill="#3B82F6"
                className="opacity-80"
              />
            ))}
            
            {/* Forecast points */}
            {forecastProgress > 60 && forecastData.slice(0, Math.floor((forecastProgress - 60) / 10)).map((value, index) => (
              <circle
                key={`forecast-${index}`}
                cx={120 + (index / (forecastData.length - 1)) * 60}
                cy={80 - (value / 100) * 60}
                r="1.5"
                fill="#10B981"
                className="opacity-90"
              />
            ))}
            
            {/* Divider line between historical and forecast */}
            <line
              x1="120"
              y1="10"
              x2="120"
              y2="70"
              stroke="#6B7280"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="opacity-50"
            />
          </svg>
          
          {/* Labels */}
          <div className="absolute bottom-1 left-2 text-xs text-blue-600 font-medium">{t('demo.miniDemos.historical')}</div>
          <div className="absolute bottom-1 right-2 text-xs text-green-600 font-medium">{t('demo.miniDemos.forecast')}</div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
            <div className="text-xs text-blue-600 font-medium">MAPE</div>
            <div className="text-sm font-bold text-blue-700">
              {currentStep === 2 ? '4.2%' : '—'}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
            <div className="text-xs text-green-600 font-medium">{t('demo.miniDemos.trend')}</div>
            <div className="text-sm font-bold text-green-700">
              {currentStep === 2 ? '↗ +12%' : '—'}
            </div>
          </div>
        </div>

        {/* Confidence interval indicator */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs text-secondary-600 dark:text-gray-400"
          >
            {t('demo.miniDemos.confidenceInterval')}: ±3.2
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ClusteringDemo: React.FC<MiniDemoProps> = ({ t }) => {
  const [activeCluster, setActiveCluster] = useState(0);
  const clusters = [
    { color: 'bg-red-400', points: 12, label: t('demo.miniDemos.highValue') },
    { color: 'bg-blue-400', points: 8, label: t('demo.miniDemos.mediumValue') },
    { color: 'bg-green-400', points: 15, label: t('demo.miniDemos.lowValue') }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCluster(prev => (prev + 1) % clusters.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-secondary-800 dark:text-gray-200">{t('demo.miniDemos.kMeansClustering')}</h4>
        <span className="text-xs text-secondary-500">k=3</span>
      </div>
      
      <div className="relative h-32 bg-secondary-50 dark:bg-gray-700 rounded mb-3 overflow-hidden">
        {/* Simulated scatter plot */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Cluster 1 - Red */}
          <g className={activeCluster === 0 ? 'opacity-100' : 'opacity-60'}>
            <circle cx="40" cy="25" r="2" className="fill-red-400" />
            <circle cx="45" cy="30" r="2" className="fill-red-400" />
            <circle cx="35" cy="35" r="2" className="fill-red-400" />
            <circle cx="50" cy="20" r="2" className="fill-red-400" />
          </g>
          
          {/* Cluster 2 - Blue */}
          <g className={activeCluster === 1 ? 'opacity-100' : 'opacity-60'}>
            <circle cx="100" cy="50" r="2" className="fill-blue-400" />
            <circle cx="95" cy="45" r="2" className="fill-blue-400" />
            <circle cx="105" cy="55" r="2" className="fill-blue-400" />
            <circle cx="90" cy="50" r="2" className="fill-blue-400" />
          </g>
          
          {/* Cluster 3 - Green */}
          <g className={activeCluster === 2 ? 'opacity-100' : 'opacity-60'}>
            <circle cx="160" cy="75" r="2" className="fill-green-400" />
            <circle cx="155" cy="70" r="2" className="fill-green-400" />
            <circle cx="165" cy="80" r="2" className="fill-green-400" />
            <circle cx="150" cy="75" r="2" className="fill-green-400" />
            <circle cx="170" cy="70" r="2" className="fill-green-400" />
          </g>
        </svg>
      </div>

      <div className="space-y-2">
        {clusters.map((cluster, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-2 rounded transition-all ${
              activeCluster === index ? 'bg-secondary-100 scale-105' : 'bg-secondary-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${cluster.color} mr-2`}></div>
              <span className="text-xs font-medium text-secondary-700 dark:text-gray-300">{cluster.label}</span>
            </div>
            <span className="text-xs text-secondary-500">{cluster.points} {t('demo.miniDemos.points')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoCarousel;