import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DataPage from './pages/DataPage';
import PredictorPage from './pages/PredictorPage';
import ClusterizerPage from './pages/ClusterizerPage';
import ResultsPage from './pages/ResultsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import GuidelinesPage from './pages/GuidelinesPage';
import ContributionPage from './pages/ContributionsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';

/**
 * Application routing configuration
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/data" element={<DataPage />} />
      <Route path="/predictor" element={<PredictorPage />} />
      <Route path="/clusterizer" element={<ClusterizerPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/guidelines" element={<GuidelinesPage />} />
      <Route path="/contribution" element={<ContributionPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
    </Routes>
  );
};

export default AppRoutes;