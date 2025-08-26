/**
 * Migration initialization utility
 * This should be called when the app starts to ensure data migration
 */

import { performFullMigration, isMigrationNeeded } from './migration-utils';

/**
 * Initialize migration on app startup
 * This function should be called once when the app loads
 */
export function initializeMigration(): void {
  try {
    // Check if migration is needed
    if (isMigrationNeeded()) {
      console.log('🔄 NetCraft AI: Migrating localStorage data from NeuroXL...');
      
      const result = performFullMigration();
      
      if (result.success) {
        if (result.migratedKeys.length > 0) {
          console.log('✅ NetCraft AI: Migration completed successfully');
          console.log('📦 Migrated keys:', result.migratedKeys);
        } else {
          console.log('ℹ️ NetCraft AI: No data to migrate');
        }
      } else {
        console.warn('⚠️ NetCraft AI: Migration completed with errors:', result.errors);
      }
    } else {
      console.log('ℹ️ NetCraft AI: No migration needed');
    }
  } catch (error) {
    console.error('❌ NetCraft AI: Migration failed:', error);
  }
}

/**
 * Check if the app has been migrated (for debugging)
 */
export function getMigrationStatus(): {
  needsMigration: boolean;
  hasNewKeys: boolean;
  hasOldKeys: boolean;
} {
  const oldKeys = ['neuroxl-project-state', 'neuroxl-datasets', 'neuroxl-contacts'];
  const newKeys = ['netcraft-project-state', 'netcraft-datasets', 'netcraft-contacts'];
  
  const hasOldKeys = oldKeys.some(key => localStorage.getItem(key) !== null);
  const hasNewKeys = newKeys.some(key => localStorage.getItem(key) !== null);
  
  return {
    needsMigration: isMigrationNeeded(),
    hasNewKeys,
    hasOldKeys
  };
}