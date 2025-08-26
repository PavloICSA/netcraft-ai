/**
 * Tests for NetCraft AI localStorage migration utilities
 * These tests verify migration from old NeuroXL keys to new NetCraft keys
 */

import {
  migrateProjectState,
  migrateDatasets,
  migrateContacts,
  performFullMigration,
  getWithFallback,
  storageUtils,
  isMigrationNeeded
} from '../lib/data/migration-utils';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Migration Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('migrateProjectState', () => {
    it('should migrate project state from old key to new key', () => {
      const testData = '{"models":{},"results":{}}';
      localStorage.setItem('neuroxl-project-state', testData);
      
      const result = migrateProjectState();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('netcraft-project-state')).toBe(testData);
    });

    it('should not overwrite existing new key', () => {
      const oldData = '{"models":{},"results":{}}';
      const newData = '{"models":{"ann":{}},"results":{}}';
      
      localStorage.setItem('neuroxl-project-state', oldData);
      localStorage.setItem('netcraft-project-state', newData);
      
      const result = migrateProjectState();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('netcraft-project-state')).toBe(newData);
    });

    it('should return true when old key does not exist', () => {
      const result = migrateProjectState();
      expect(result).toBe(true);
    });
  });

  describe('migrateDatasets', () => {
    it('should migrate datasets from old key to new key', () => {
      const testData = '[{"name":"test","data":[]}]';
      localStorage.setItem('neuroxl-datasets', testData);
      
      const result = migrateDatasets();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('netcraft-datasets')).toBe(testData);
    });
  });

  describe('migrateContacts', () => {
    it('should migrate contacts from old key to new key', () => {
      const testData = '[{"name":"John","email":"john@example.com"}]';
      localStorage.setItem('neuroxl-contacts', testData);
      
      const result = migrateContacts();
      
      expect(result).toBe(true);
      expect(localStorage.getItem('netcraft-contacts')).toBe(testData);
    });
  });

  describe('performFullMigration', () => {
    it('should migrate all keys and cleanup old ones', () => {
      const projectData = '{"models":{},"results":{}}';
      const datasetsData = '[{"name":"test","data":[]}]';
      const contactsData = '[{"name":"John","email":"john@example.com"}]';
      
      localStorage.setItem('neuroxl-project-state', projectData);
      localStorage.setItem('neuroxl-datasets', datasetsData);
      localStorage.setItem('neuroxl-contacts', contactsData);
      
      const result = performFullMigration();
      
      expect(result.success).toBe(true);
      expect(result.migratedKeys).toHaveLength(3);
      expect(result.errors).toHaveLength(0);
      
      // Check new keys exist
      expect(localStorage.getItem('netcraft-project-state')).toBe(projectData);
      expect(localStorage.getItem('netcraft-datasets')).toBe(datasetsData);
      expect(localStorage.getItem('netcraft-contacts')).toBe(contactsData);
      
      // Check old keys are removed
      expect(localStorage.getItem('neuroxl-project-state')).toBeNull();
      expect(localStorage.getItem('neuroxl-datasets')).toBeNull();
      expect(localStorage.getItem('neuroxl-contacts')).toBeNull();
    });

    it('should return success with no migrations when no old keys exist', () => {
      const result = performFullMigration();
      
      expect(result.success).toBe(true);
      expect(result.migratedKeys).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('getWithFallback', () => {
    it('should return new key value when it exists', () => {
      const newValue = 'new-data';
      const oldValue = 'old-data';
      
      localStorage.setItem('new-key', newValue);
      localStorage.setItem('old-key', oldValue);
      
      const result = getWithFallback('new-key', 'old-key');
      
      expect(result).toBe(newValue);
    });

    it('should return old key value and migrate when new key does not exist', () => {
      const oldValue = 'old-data';
      localStorage.setItem('old-key', oldValue);
      
      const result = getWithFallback('new-key', 'old-key');
      
      expect(result).toBe(oldValue);
      expect(localStorage.getItem('new-key')).toBe(oldValue);
      expect(localStorage.getItem('old-key')).toBeNull();
    });

    it('should return null when neither key exists', () => {
      const result = getWithFallback('new-key', 'old-key');
      expect(result).toBeNull();
    });
  });

  describe('storageUtils', () => {
    it('should get project state with fallback', () => {
      const testData = '{"models":{},"results":{}}';
      localStorage.setItem('neuroxl-project-state', testData);
      
      const result = storageUtils.getProjectState();
      
      expect(result).toBe(testData);
      expect(localStorage.getItem('netcraft-project-state')).toBe(testData);
      expect(localStorage.getItem('neuroxl-project-state')).toBeNull();
    });

    it('should set project state with new key', () => {
      const testData = '{"models":{},"results":{}}';
      
      storageUtils.setProjectState(testData);
      
      expect(localStorage.getItem('netcraft-project-state')).toBe(testData);
    });

    it('should get datasets with fallback', () => {
      const testData = '[{"name":"test","data":[]}]';
      localStorage.setItem('neuroxl-datasets', testData);
      
      const result = storageUtils.getDatasets();
      
      expect(result).toBe(testData);
      expect(localStorage.getItem('netcraft-datasets')).toBe(testData);
    });

    it('should get contacts with fallback', () => {
      const testData = '[{"name":"John","email":"john@example.com"}]';
      localStorage.setItem('neuroxl-contacts', testData);
      
      const result = storageUtils.getContacts();
      
      expect(result).toBe(testData);
      expect(localStorage.getItem('netcraft-contacts')).toBe(testData);
    });
  });

  describe('isMigrationNeeded', () => {
    it('should return true when old keys exist', () => {
      localStorage.setItem('neuroxl-project-state', '{}');
      
      const result = isMigrationNeeded();
      
      expect(result).toBe(true);
    });

    it('should return false when no old keys exist', () => {
      const result = isMigrationNeeded();
      
      expect(result).toBe(false);
    });
  });
});