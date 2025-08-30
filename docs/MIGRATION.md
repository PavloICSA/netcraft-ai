# Data Migration System Guide

NetCraft AI includes a comprehensive data migration system that handles the transition from legacy localStorage keys to the new naming convention, ensuring seamless upgrades and backward compatibility.

## Overview

The migration system provides:
- **Automatic migration** from `neuroxl-*` to `netcraft-*` localStorage keys
- **Backward compatibility** for reading legacy data
- **Safe cleanup** of old keys after successful migration
- **Error handling** and comprehensive logging
- **Verification tools** for testing migration functionality

## Migration Scope

### Key Mappings

| Legacy Key | New Key | Purpose |
|------------|---------|---------|
| `neuroxl-project-state` | `netcraft-project-state` | Main project state and models |
| `neuroxl-datasets` | `netcraft-datasets` | Uploaded datasets and metadata |
| `neuroxl-contacts` | `netcraft-contacts` | Contact form submissions |

### Data Preserved
- **Neural network models** with full configuration and weights
- **Random Forest models** with trees and feature importance
- **Clustering results** and configurations
- **Time series forecasting models** and results
- **Dataset uploads** and column configurations
- **User preferences** and settings
- **Contact form data** and submissions

## How Migration Works

### 1. Automatic Detection
```typescript
// Check if migration is needed
const isMigrationNeeded = (): boolean => {
  const hasOldKeys = OLD_KEYS.some(key => localStorage.getItem(key) !== null);
  const hasNewKeys = NEW_KEYS.some(key => localStorage.getItem(key) !== null);
  return hasOldKeys && !hasNewKeys;
};
```

### 2. Safe Migration Process
```typescript
// Migration with safety checks
const migrateKey = (oldKey: string, newKey: string): boolean => {
  try {
    // Never overwrite existing new keys
    if (localStorage.getItem(newKey) !== null) {
      console.log(`Skipping migration: ${newKey} already exists`);
      return true;
    }

    const oldValue = localStorage.getItem(oldKey);
    if (oldValue !== null) {
      // Validate data before migration
      JSON.parse(oldValue); // Throws if invalid JSON
      
      // Migrate data
      localStorage.setItem(newKey, oldValue);
      
      // Verify migration success
      const migratedValue = localStorage.getItem(newKey);
      if (migratedValue === oldValue) {
        // Safe cleanup of old key
        localStorage.removeItem(oldKey);
        console.log(`✓ Migrated: ${oldKey} → ${newKey}`);
        return true;
      }
    }
  } catch (error) {
    console.error(`✗ Migration failed: ${oldKey} → ${newKey}`, error);
  }
  return false;
};
```

### 3. Backward Compatibility
```typescript
// Storage utilities with fallback
export const storageUtils = {
  getProjectState(): string | null {
    // Try new key first, fallback to old key
    return localStorage.getItem('netcraft-project-state') || 
           localStorage.getItem('neuroxl-project-state');
  },
  
  setProjectState(value: string): void {
    // Always use new key for writes
    localStorage.setItem('netcraft-project-state', value);
  }
};
```

## Integration

### App Initialization
```typescript
// In App.tsx or main.tsx
import { initializeMigration } from './lib/data/migration-init';

// Call once when app starts
useEffect(() => {
  initializeMigration();
}, []);
```

### Component Updates
```typescript
// Replace direct localStorage calls
// OLD:
const data = localStorage.getItem('neuroxl-project-state');

// NEW:
import { storageUtils } from './lib/data/migration-utils';
const data = storageUtils.getProjectState();
```

## Migration Functions

### Core Migration Functions

#### `performFullMigration(): MigrationResult`
Performs complete migration of all localStorage keys.

```typescript
interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
  skippedKeys: string[];
}

const result = performFullMigration();
if (result.success) {
  console.log('Migration completed successfully');
  console.log('Migrated keys:', result.migratedKeys);
} else {
  console.error('Migration had errors:', result.errors);
}
```

#### Individual Migration Functions
```typescript
// Migrate specific data types
const success1 = migrateProjectState();
const success2 = migrateDatasets();
const success3 = migrateContacts();
```

#### Utility Functions
```typescript
// Check if migration is needed
const needed = isMigrationNeeded();

// Get migration status
const status = getMigrationStatus();

// Verify migration integrity
const valid = verifyMigrationIntegrity();
```

### Storage Utilities

#### Safe Data Access
```typescript
import { storageUtils } from './lib/data/migration-utils';

// These functions handle fallback automatically
const projectState = storageUtils.getProjectState();
const datasets = storageUtils.getDatasets();
const contacts = storageUtils.getContacts();

// These functions always use new keys
storageUtils.setProjectState(JSON.stringify(newState));
storageUtils.setDatasets(JSON.stringify(datasets));
storageUtils.setContacts(JSON.stringify(contacts));
```

## Testing and Verification

### Manual Testing
```typescript
// In browser console
import { testMigrationUtility } from './lib/data/migration-verification';

// Run comprehensive tests
const results = testMigrationUtility();
console.log('Test results:', results);
```

### Test Scenarios
```typescript
const testScenarios = [
  'Fresh installation (no existing data)',
  'Legacy data only (needs migration)',
  'New data only (no migration needed)',
  'Mixed data (partial migration)',
  'Corrupted legacy data (error handling)',
  'Storage quota exceeded (graceful failure)'
];
```

### Verification Functions
```typescript
// Verify data integrity after migration
const verifyDataIntegrity = (): boolean => {
  try {
    const projectState = storageUtils.getProjectState();
    if (projectState) {
      const parsed = JSON.parse(projectState);
      // Validate structure
      return validateProjectStateStructure(parsed);
    }
    return true;
  } catch (error) {
    console.error('Data integrity check failed:', error);
    return false;
  }
};
```

## Error Handling

### Common Error Scenarios

#### Storage Quota Exceeded
```typescript
try {
  localStorage.setItem(newKey, oldValue);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error('Storage quota exceeded during migration');
    // Attempt cleanup of old data
    cleanupOldData();
  }
}
```

#### Corrupted Data
```typescript
try {
  JSON.parse(oldValue);
} catch (error) {
  console.error(`Corrupted data in ${oldKey}, skipping migration`);
  // Log for manual recovery
  logCorruptedData(oldKey, oldValue);
  return false;
}
```

#### Partial Migration
```typescript
const handlePartialMigration = () => {
  const status = getMigrationStatus();
  if (status.partial) {
    console.warn('Partial migration detected');
    // Attempt to complete migration
    const remaining = status.remainingKeys;
    remaining.forEach(key => attemptKeyMigration(key));
  }
};
```

### Recovery Procedures

#### Manual Recovery
```typescript
// For corrupted or failed migrations
const manualRecovery = {
  // Backup current state
  backup: () => {
    const backup = {};
    Object.keys(localStorage).forEach(key => {
      backup[key] = localStorage.getItem(key);
    });
    return backup;
  },
  
  // Restore from backup
  restore: (backup: Record<string, string>) => {
    localStorage.clear();
    Object.entries(backup).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  },
  
  // Force migration reset
  reset: () => {
    OLD_KEYS.forEach(key => localStorage.removeItem(key));
    NEW_KEYS.forEach(key => localStorage.removeItem(key));
  }
};
```

## Migration Logging

### Console Output
```
NetCraft AI - Data Migration
============================
Checking for legacy data...
✓ Found legacy project state (125.4 KB)
✓ Found legacy datasets (45.2 KB)
✗ No legacy contacts found

Starting migration...
✓ Migrated: neuroxl-project-state → netcraft-project-state
✓ Migrated: neuroxl-datasets → netcraft-datasets
✓ Skipped: neuroxl-contacts (no data)

Migration completed successfully!
Migrated 2 keys, skipped 1 key, 0 errors
Total data migrated: 170.6 KB
```

### Detailed Logging
```typescript
const logMigrationDetails = (result: MigrationResult) => {
  console.group('Migration Details');
  console.log('Success:', result.success);
  console.log('Migrated keys:', result.migratedKeys);
  console.log('Skipped keys:', result.skippedKeys);
  console.log('Errors:', result.errors);
  console.groupEnd();
};
```

## Performance Considerations

### Migration Timing
- **App startup**: Automatic migration during initialization
- **Lazy migration**: Only migrate when data is accessed
- **Background migration**: Non-blocking migration process

### Memory Usage
- **Streaming migration**: Process large data in chunks
- **Cleanup timing**: Remove old keys immediately after successful migration
- **Error recovery**: Maintain old keys if migration fails

### Storage Optimization
```typescript
// Optimize storage during migration
const optimizeDuringMigration = (data: string): string => {
  try {
    const parsed = JSON.parse(data);
    // Remove deprecated fields
    delete parsed.deprecated;
    // Compress data structure
    return JSON.stringify(parsed);
  } catch {
    return data; // Return original if parsing fails
  }
};
```

## Best Practices

### For Developers

1. **Always use storageUtils**: Never access localStorage directly
```typescript
// ✅ CORRECT
import { storageUtils } from './lib/data/migration-utils';
const data = storageUtils.getProjectState();

// ❌ INCORRECT
const data = localStorage.getItem('netcraft-project-state');
```

2. **Test migration scenarios**: Include migration tests in development
```typescript
// Test with legacy data
localStorage.setItem('neuroxl-project-state', testData);
initializeMigration();
// Verify migration worked
```

3. **Handle migration errors gracefully**: Don't break app if migration fails
```typescript
try {
  initializeMigration();
} catch (error) {
  console.error('Migration failed, continuing with fallback');
  // App should still work with legacy keys
}
```

### For Users

1. **Backup important data**: Export models before major updates
2. **Clear browser cache carefully**: May trigger re-migration
3. **Report migration issues**: Help improve the migration system

### For Deployment

1. **Test migration paths**: Verify all migration scenarios work
2. **Monitor migration success**: Track migration completion rates
3. **Provide fallback options**: Allow manual data export/import

## Troubleshooting

### Common Issues

#### Migration Not Triggered
```bash
Problem: Migration doesn't run automatically
Solution: Check if initializeMigration() is called in App.tsx
Verify: Look for migration logs in browser console
```

#### Data Loss After Migration
```bash
Problem: Data missing after migration
Solution: Check browser console for migration errors
Verify: Use storageUtils instead of direct localStorage access
Recovery: Check if old keys still exist for manual recovery
```

#### Partial Migration
```bash
Problem: Some data migrated, some didn't
Solution: Run performFullMigration() manually
Verify: Check getMigrationStatus() for details
Recovery: Use individual migration functions for failed keys
```

#### Storage Quota Issues
```bash
Problem: Migration fails due to storage limits
Solution: Clear unnecessary data before migration
Verify: Check available storage space
Recovery: Use manual cleanup and retry migration
```

### Debug Tools

#### Migration Status Check
```typescript
// Check current migration status
const status = getMigrationStatus();
console.log('Migration status:', status);
```

#### Data Integrity Verification
```typescript
// Verify all data is accessible
const integrity = verifyMigrationIntegrity();
console.log('Data integrity:', integrity);
```

#### Manual Migration Trigger
```typescript
// Force migration if automatic migration failed
const result = performFullMigration();
console.log('Manual migration result:', result);
```

## Future Enhancements

### Planned Improvements
- **Incremental migration**: Migrate data as it's accessed
- **Compression**: Reduce storage usage during migration
- **Validation**: Enhanced data validation during migration
- **Recovery tools**: Better tools for handling migration failures
- **Analytics**: Track migration success rates and common issues

### Advanced Features
- **Cross-browser migration**: Migrate data between browsers
- **Cloud backup**: Backup data before migration
- **Version migration**: Handle data format changes between versions
- **Selective migration**: Allow users to choose what to migrate

## API Reference

### Migration Functions
```typescript
// Core migration
performFullMigration(): MigrationResult
migrateProjectState(): boolean
migrateDatasets(): boolean
migrateContacts(): boolean

// Utilities
isMigrationNeeded(): boolean
getMigrationStatus(): MigrationStatus
verifyMigrationIntegrity(): boolean

// Storage utilities
storageUtils.getProjectState(): string | null
storageUtils.setProjectState(value: string): void
storageUtils.getDatasets(): string | null
storageUtils.setDatasets(value: string): void
storageUtils.getContacts(): string | null
storageUtils.setContacts(value: string): void
```

### Types
```typescript
interface MigrationResult {
  success: boolean;
  migratedKeys: string[];
  errors: string[];
  skippedKeys: string[];
}

interface MigrationStatus {
  needed: boolean;
  completed: boolean;
  partial: boolean;
  remainingKeys: string[];
}
```

This migration system ensures that users can seamlessly upgrade from the legacy NeuroXL Web application to NetCraft AI without losing any of their valuable data, models, or configurations.