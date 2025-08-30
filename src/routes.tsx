import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RouteWrapper from './components/Common/RouteWrapper';
import ErrorPage from './pages/ErrorPage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DataPage = lazy(() => import('./pages/DataPage'));
const PredictorPage = lazy(() => import('./pages/PredictorPage'));
const ClusterizerPage = lazy(() => import('./pages/ClusterizerPage'));
const ForecastingPage = lazy(() => import('./pages/ForecastingPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const GuidelinesPage = lazy(() => import('./pages/GuidelinesPage'));
const ContributionsPage = lazy(() => import('./pages/ContributionsPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NeuralNetworksInfoPage = lazy(() => import('./pages/NeuralNetworksInfoPage'));
const RandomForestInfoPage = lazy(() => import('./pages/RandomForestInfoPage'));
const TimeSeriesForecastingInfoPage = lazy(() => import('./pages/TimeSeriesForecastingInfoPage'));
const ClusteringInfoPage = lazy(() => import('./pages/ClusteringInfoPage'));
const DataAnalysisInfoPage = lazy(() => import('./pages/DataAnalysisInfoPage'));

/**
 * Application routing configuration with lazy loading and translation namespace management
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RouteWrapper><LandingPage /></RouteWrapper>} />
      <Route path="/data" element={<RouteWrapper><DataPage /></RouteWrapper>} />
      <Route path="/predictor" element={<RouteWrapper><PredictorPage /></RouteWrapper>} />
      <Route path="/clusterizer" element={<RouteWrapper><ClusterizerPage /></RouteWrapper>} />
      <Route path="/forecasting" element={<RouteWrapper><ForecastingPage /></RouteWrapper>} />
      <Route path="/results" element={<RouteWrapper><ResultsPage /></RouteWrapper>} />
      <Route path="/contact" element={<RouteWrapper><ContactPage /></RouteWrapper>} />
      <Route path="/about" element={<RouteWrapper><AboutPage /></RouteWrapper>} />
      <Route path="/guidelines" element={<RouteWrapper><GuidelinesPage /></RouteWrapper>} />
      <Route path="/contribution" element={<RouteWrapper><ContributionsPage /></RouteWrapper>} />
      <Route path="/terms" element={<RouteWrapper><TermsPage /></RouteWrapper>} />
      <Route path="/privacy" element={<RouteWrapper><PrivacyPage /></RouteWrapper>} />
      <Route path="/neural-networks" element={<RouteWrapper><NeuralNetworksInfoPage /></RouteWrapper>} />
      <Route path="/random-forest" element={<RouteWrapper><RandomForestInfoPage /></RouteWrapper>} />
      <Route path="/time-series-forecasting" element={<RouteWrapper><TimeSeriesForecastingInfoPage /></RouteWrapper>} />
      <Route path="/clustering" element={<RouteWrapper><ClusteringInfoPage /></RouteWrapper>} />
      <Route path="/data-analysis" element={<RouteWrapper><DataAnalysisInfoPage /></RouteWrapper>} />
      <Route path="/error" element={<RouteWrapper><ErrorPage /></RouteWrapper>} />
      <Route path="*" element={<RouteWrapper><NotFoundPage /></RouteWrapper>} />
    </Routes>
  );
};

export default AppRoutes;