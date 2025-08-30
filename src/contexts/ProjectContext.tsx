import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProjectState, Dataset } from '../types';
import { storageUtils } from '../lib/data/migration-utils';
import { initializeMigration } from '../lib/data/migration-init';

interface ProjectContextType {
  projectState: ProjectState;
  updateDataset: (dataset: Dataset | null) => void;
  updateModel: (type: 'ann' | 'cluster' | 'randomForest' | 'forecast', model: any) => void;
  updateResults: (type: 'predictions' | 'clusters' | 'randomForest' | 'forecast', results: any) => void;
  clearProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: ReactNode;
}

/**
 * Project context provider for managing global project state
 */
export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projectState, setProjectState] = useState<ProjectState>({
    models: {},
    results: {}
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize migration and load project state from localStorage on mount
  useEffect(() => {
    // Initialize migration first
    initializeMigration();
    
    // Load project state function
    const loadProjectState = () => {
      const savedState = storageUtils.getProjectStateWithDates();
      if (savedState) {
        try {
          setProjectState(savedState);
        } catch (error) {
          console.error('Failed to load project state:', error);
        }
      }
      setIsInitialized(true);
    };
    
    // Load initial state
    loadProjectState();
    
    // Listen for storage changes (when other components update localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'netcraft-project-state') {
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

  // Save project state to localStorage when it changes (but not during initial load)
  useEffect(() => {
    if (isInitialized) {
      storageUtils.setProjectState(JSON.stringify(projectState));
      // Don't dispatch custom event here to avoid infinite loops
      // Other tabs will still get updates via the 'storage' event
    }
  }, [projectState, isInitialized]);

  const updateDataset = (dataset: Dataset | null) => {
    setProjectState(prev => {
      if (dataset === null) {
        const { currentDataset, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        currentDataset: dataset
      };
    });
  };

  const updateModel = (type: 'ann' | 'cluster' | 'randomForest' | 'forecast', model: any) => {
    setProjectState(prev => ({
      ...prev,
      models: {
        ...prev.models,
        [type]: model
      }
    }));
  };

  const updateResults = (type: 'predictions' | 'clusters' | 'randomForest' | 'forecast', results: any) => {
    setProjectState(prev => ({
      ...prev,
      results: {
        ...prev.results,
        [type]: results
      }
    }));
  };

  const clearProject = () => {
    setProjectState({
      models: {},
      results: {}
    });
  };

  const value: ProjectContextType = {
    projectState,
    updateDataset,
    updateModel,
    updateResults,
    clearProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

/**
 * Hook to use project context
 */
export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};