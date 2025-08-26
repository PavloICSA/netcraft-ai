import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import Footer from './components/Layout/Footer';
import { ProjectState, Dataset } from './types';
import { storageUtils } from './lib/data/migration-utils';
import { initializeMigration } from './lib/data/migration-init';

/**
 * Main application component with layout and state management
 */
const App: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  const [projectState, setProjectState] = useState<ProjectState>({
    models: {},
    results: {}
  });

  // Initialize migration and load project state from localStorage on mount
  useEffect(() => {
    // Initialize migration first
    initializeMigration();
    
    // Load project state function
    const loadProjectState = () => {
      const savedState = storageUtils.getProjectState();
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setProjectState(parsed);
        } catch (error) {
          console.error('Failed to load project state:', error);
        }
      }
    };
    
    // Load initial state
    loadProjectState();
    
    // Listen for storage changes (when other components update localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'netcraft_project_state') {
        loadProjectState();
      }
    };
    
    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadProjectState();
    };
    
    window.addEventListener('netcraft-storage-update', handleCustomStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('netcraft-storage-update', handleCustomStorageChange);
    };
  }, []);

  // Save project state to localStorage when it changes
  useEffect(() => {
    storageUtils.setProjectState(JSON.stringify(projectState));
  }, [projectState]);

  const updateDataset = (dataset: Dataset) => {
    setProjectState(prev => ({
      ...prev,
      currentDataset: dataset
    }));
  };

  const updateModel = (type: 'ann' | 'cluster', model: any) => {
    setProjectState(prev => ({
      ...prev,
      models: {
        ...prev.models,
        [type]: model
      }
    }));
  };

  const updateResults = (type: 'predictions' | 'clusters', results: any) => {
    setProjectState(prev => ({
      ...prev,
      results: {
        ...prev.results,
        [type]: results
      }
    }));
  };

  // Landing page has its own layout
  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        <AppRoutes />
      </div>
    );
  }

  // Dashboard layout for all other pages
  return (
    <div className="min-h-screen bg-secondary-50 flex">
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
};

export default App;