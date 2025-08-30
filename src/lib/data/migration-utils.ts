/**
 * localStorage Migration Utilities
 * Handles migration from NeuroXL keys to NetCraft AI keys
 */

export interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
}

/**
 * Migration mapping from old keys to new keys
 */
const MIGRATION_MAP: Record<string, string> = {
  'neuroxl-project-state': 'netcraft-project-state',
  'neuroxl-datasets': 'netcraft-datasets',
  'neuroxl-contacts': 'netcraft-contacts'
};

/**
 * Migrates a single localStorage key from old to new format
 */
function migrateKey(oldKey: string, newKey: string): boolean {
  try {
    const oldValue = localStorage.getItem(oldKey);
    
    // If old key doesn't exist, nothing to migrate
    if (oldValue === null) {
      return true;
    }
    
    // If new key already exists, don't overwrite it
    const newValue = localStorage.getItem(newKey);
    if (newValue !== null) {
      return true;
    }
    
    // Migrate the data
    localStorage.setItem(newKey, oldValue);
    return true;
  } catch (error) {
    console.error(`Failed to migrate ${oldKey} to ${newKey}:`, error);
    return false;
  }
}

/**
 * Removes old localStorage keys after successful migration
 */
function cleanupOldKeys(keysToCleanup: string[]): boolean {
  try {
    keysToCleanup.forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to cleanup old keys:', error);
    return false;
  }
}

/**
 * Migrates project state from neuroxl-project-state to netcraft-project-state
 */
export function migrateProjectState(): boolean {
  return migrateKey('neuroxl-project-state', 'netcraft-project-state');
}

/**
 * Migrates datasets from neuroxl-datasets to netcraft-datasets
 */
export function migrateDatasets(): boolean {
  return migrateKey('neuroxl-datasets', 'netcraft-datasets');
}

/**
 * Migrates contacts from neuroxl-contacts to netcraft-contacts
 */
export function migrateContacts(): boolean {
  return migrateKey('neuroxl-contacts', 'netcraft-contacts');
}

/**
 * Performs complete migration of all localStorage keys
 */
export function performFullMigration(): MigrationResult {
  const result: MigrationResult = {
    success: true,
    migratedKeys: [],
    errors: []
  };
  
  // Migrate each key
  for (const [oldKey, newKey] of Object.entries(MIGRATION_MAP)) {
    const migrationSuccess = migrateKey(oldKey, newKey);
    
    if (migrationSuccess) {
      // Check if data was actually migrated (old key existed)
      const oldValue = localStorage.getItem(oldKey);
      if (oldValue !== null) {
        result.migratedKeys.push(`${oldKey} → ${newKey}`);
      }
    } else {
      result.success = false;
      result.errors.push(`Failed to migrate ${oldKey} to ${newKey}`);
    }
  }
  
  // If migration was successful, cleanup old keys
  if (result.success && result.migratedKeys.length > 0) {
    const oldKeys = Object.keys(MIGRATION_MAP);
    const cleanupSuccess = cleanupOldKeys(oldKeys);
    
    if (!cleanupSuccess) {
      result.errors.push('Migration successful but cleanup failed');
    }
  }
  
  return result;
}

/**
 * Gets data from localStorage with backward compatibility
 * Tries new key first, falls back to old key if new key doesn't exist
 */
export function getWithFallback(newKey: string, oldKey: string): string | null {
  // Try new key first
  const newValue = localStorage.getItem(newKey);
  if (newValue !== null) {
    return newValue;
  }
  
  // Fall back to old key
  const oldValue = localStorage.getItem(oldKey);
  if (oldValue !== null) {
    // Migrate the data immediately when accessed
    localStorage.setItem(newKey, oldValue);
    localStorage.removeItem(oldKey);
    return oldValue;
  }
  
  return null;
}

/**
 * Recursively converts date strings back to Date objects in an object
 */
function deserializeDates(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    // Check if string looks like an ISO date
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
      const date = new Date(obj);
      return isNaN(date.getTime()) ? obj : date;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deserializeDates);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = deserializeDates(value);
    }
    return result;
  }
  
  return obj;
}

/**
 * Convenience functions for specific data types with backward compatibility
 */
export const storageUtils = {
  /**
   * Get project state with backward compatibility
   */
  getProjectState(): string | null {
    return getWithFallback('netcraft-project-state', 'neuroxl-project-state');
  },
  
  /**
   * Get project state with date deserialization
   */
  getProjectStateWithDates(): any | null {
    const stateStr = this.getProjectState();
    if (!stateStr) return null;
    
    try {
      const parsed = JSON.parse(stateStr);
      return deserializeDates(parsed);
    } catch (error) {
      console.error('Failed to parse project state:', error);
      return null;
    }
  },
  
  /**
   * Get datasets with backward compatibility
   */
  getDatasets(): string | null {
    return getWithFallback('netcraft-datasets', 'neuroxl-datasets');
  },
  
  /**
   * Get contacts with backward compatibility
   */
  getContacts(): string | null {
    return getWithFallback('netcraft-contacts', 'neuroxl-contacts');
  },
  
  /**
   * Set project state using new key
   */
  setProjectState(value: string): void {
    localStorage.setItem('netcraft-project-state', value);
  },
  
  /**
   * Set datasets using new key
   */
  setDatasets(value: string): void {
    localStorage.setItem('netcraft-datasets', value);
  },
  
  /**
   * Set contacts using new key
   */
  setContacts(value: string): void {
    localStorage.setItem('netcraft-contacts', value);
  }
};

/**
 * Check if migration is needed (any old keys exist)
 */
export function isMigrationNeeded(): boolean {
  return Object.keys(MIGRATION_MAP).some(oldKey => 
    localStorage.getItem(oldKey) !== null
  );
}