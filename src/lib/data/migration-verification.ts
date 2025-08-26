/**
 * Manual verification script for migration utilities
 * This can be run in the browser console to test migration functionality
 */

import { 
  performFullMigration, 
  storageUtils, 
  isMigrationNeeded,
  migrateProjectState,
  migrateDatasets,
  migrateContacts
} from './migration-utils';

export function testMigrationUtility() {
  console.log('🧪 Testing Migration Utility...');
  
  // Clear localStorage first
  localStorage.clear();
  console.log('✅ Cleared localStorage');
  
  // Test 1: Check if migration is needed (should be false)
  console.log('📋 Test 1: isMigrationNeeded() with no old keys');
  const needsMigration1 = isMigrationNeeded();
  console.log(`Result: ${needsMigration1} (expected: false)`);
  
  // Test 2: Add old keys and check if migration is needed
  console.log('📋 Test 2: Adding old keys and checking isMigrationNeeded()');
  localStorage.setItem('neuroxl-project-state', '{"models":{},"results":{}}');
  localStorage.setItem('neuroxl-datasets', '[{"name":"test","data":[]}]');
  localStorage.setItem('neuroxl-contacts', '[{"name":"John","email":"john@example.com"}]');
  
  const needsMigration2 = isMigrationNeeded();
  console.log(`Result: ${needsMigration2} (expected: true)`);
  
  // Test 3: Perform full migration
  console.log('📋 Test 3: Performing full migration');
  const migrationResult = performFullMigration();
  console.log('Migration result:', migrationResult);
  
  // Test 4: Check that new keys exist and old keys are gone
  console.log('📋 Test 4: Verifying migration results');
  console.log('New keys:');
  console.log('  netcraft-project-state:', localStorage.getItem('netcraft-project-state'));
  console.log('  netcraft-datasets:', localStorage.getItem('netcraft-datasets'));
  console.log('  netcraft-contacts:', localStorage.getItem('netcraft-contacts'));
  
  console.log('Old keys (should be null):');
  console.log('  neuroxl-project-state:', localStorage.getItem('neuroxl-project-state'));
  console.log('  neuroxl-datasets:', localStorage.getItem('neuroxl-datasets'));
  console.log('  neuroxl-contacts:', localStorage.getItem('neuroxl-contacts'));
  
  // Test 5: Test storageUtils with fallback
  console.log('📋 Test 5: Testing storageUtils fallback functionality');
  localStorage.clear();
  localStorage.setItem('neuroxl-project-state', '{"test":"fallback"}');
  
  const fallbackResult = storageUtils.getProjectState();
  console.log('Fallback result:', fallbackResult);
  console.log('New key after fallback:', localStorage.getItem('netcraft-project-state'));
  console.log('Old key after fallback:', localStorage.getItem('neuroxl-project-state'));
  
  // Test 6: Test individual migration functions
  console.log('📋 Test 6: Testing individual migration functions');
  localStorage.clear();
  localStorage.setItem('neuroxl-project-state', '{"individual":"test1"}');
  localStorage.setItem('neuroxl-datasets', '{"individual":"test2"}');
  localStorage.setItem('neuroxl-contacts', '{"individual":"test3"}');
  
  const result1 = migrateProjectState();
  const result2 = migrateDatasets();
  const result3 = migrateContacts();
  
  console.log('Individual migration results:', { result1, result2, result3 });
  console.log('Final localStorage state:', {
    'netcraft-project-state': localStorage.getItem('netcraft-project-state'),
    'netcraft-datasets': localStorage.getItem('netcraft-datasets'),
    'netcraft-contacts': localStorage.getItem('netcraft-contacts')
  });
  
  console.log('✅ Migration utility testing complete!');
  
  return {
    needsMigration1,
    needsMigration2,
    migrationResult,
    fallbackResult,
    individualResults: { result1, result2, result3 }
  };
}