import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppRoutes from './routes';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/Common/ScrollToTop';
import LanguageToggle from './components/Common/LanguageToggle';
import ThemeToggle from './components/Common/ThemeToggle';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { i18nUtils, getRouteNamespaces, verifyCriticalNamespaces } from './lib/i18n/index';

/**
 * Main application layout component
 */
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const { i18n } = useTranslation();
  const { projectState, updateDataset } = useProject();

  // Initialize i18n and language detection
  useEffect(() => {
    const initializeI18n = () => {
      try {
        // Verify critical namespaces are loaded (all loaded synchronously now)
        const criticalVerified = verifyCriticalNamespaces();
        if (!criticalVerified) {
          console.warn('Some critical namespaces may not be loaded');
        }
        
        // Set initial HTML lang attribute
        document.documentElement.lang = i18n.language;
        
        // Verify route-specific namespaces are loaded
        const requiredNamespaces = getRouteNamespaces(location.pathname);
        requiredNamespaces.forEach(ns => {
          const verified = i18nUtils.verifyNamespace(ns);
          if (!verified) {
            console.warn(`Namespace ${ns} may not be loaded for route ${location.pathname}`);
          }
        });
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
      }
    };

    initializeI18n();
  }, [i18n, location.pathname]);

  // Handle language changes and HTML lang attribute updates
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      // Update HTML lang attribute
      document.documentElement.lang = lng;
      
      // Persist language preference in localStorage
      localStorage.setItem('i18nextLng', lng);
      
      // Announce language change to screen readers
      const announcement = lng === 'uk' 
        ? 'Мова змінена на українську' 
        : 'Language changed to English';
      
      // Create announcement element for screen readers
      const announcementEl = document.createElement('div');
      announcementEl.setAttribute('aria-live', 'polite');
      announcementEl.setAttribute('aria-atomic', 'true');
      announcementEl.style.position = 'absolute';
      announcementEl.style.left = '-10000px';
      announcementEl.style.width = '1px';
      announcementEl.style.height = '1px';
      announcementEl.style.overflow = 'hidden';
      
      document.body.appendChild(announcementEl);
      announcementEl.textContent = announcement;
      
      // Remove after announcement
      setTimeout(() => {
        if (document.body.contains(announcementEl)) {
          document.body.removeChild(announcementEl);
        }
      }, 1000);
    };

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);
    
    // Set initial language if not already set
    if (!localStorage.getItem('i18nextLng')) {
      localStorage.setItem('i18nextLng', i18n.language);
    }

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);





  // Define data-related pages that need the dashboard layout
  const dataPages = ['/data', '/predictor', '/clusterizer', '/forecasting', '/results'];
  const isDashboardPage = dataPages.includes(location.pathname);

  // Landing page has its own layout
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
        <ScrollToTop />
        <AppRoutes />
      </div>
    );
  }

  // Dashboard layout for data-related pages
  if (isDashboardPage) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-gray-900 flex">
        <ScrollToTop />
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar 
            projectState={projectState}
            onDatasetUpdate={updateDataset}
          />
          <main className="flex-1 p-6 overflow-auto">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  // Simple layout for info/static pages
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-gray-900 flex">
      <ScrollToTop />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Simple header with language and theme toggles for static pages */}
        <header className="bg-white dark:bg-gray-800 border-b border-secondary-200 dark:border-gray-700 px-6 py-4">
          <div className="flex justify-end items-center space-x-3">
            <ThemeToggle variant="topbar" />
            <LanguageToggle variant="topbar" showLabel={false} />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
};

/**
 * Main application component with context providers
 */
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <AppLayout />
      </ProjectProvider>
    </ThemeProvider>
  );
};

export default App;