# localStorage Migration Utility

This utility handles the migration of localStorage data from the old NeuroXL Web keys to the new NetCraft AI keys.

## Overview

The migration utility provides:
- Automatic migration of localStorage keys from `neuroxl-*` to `netcraft-*`
- Backward compatibility for reading old keys when new keys don't exist
- Safe cleanup of old keys after successful migration
- Comprehensive error handling and logging

## Key Mappings

| Old Key | New Key |
|---------|---------|
| `neuroxl-project-state` | `netcraft-project-state` |
| `neuroxl-datasets` | `netcraft-datasets` |
| `neuroxl-contacts` | `netcraft-contacts` |

## Usage

### Automatic Migration (Recommended)

```typescript
import { initializeMigration } from './migration-init';

// Call this once when the app starts
initializeMigration();
```

### Manual Migration

```typescript
import { performFullMigration } from './migration-utils';

const result = performFullMigration();
if (result.success) {
  console.log('Migration completed:', result.migratedKeys);
} else {
  console.error('Migration errors:', result.errors);
}
```

### Using Storage Utils with Backward Compatibility

```typescript
import { storageUtils } from './migration-utils';

// These functions automatically handle fallback to old keys
const projectState = storageUtils.getProjectState();
const datasets = storageUtils.getDatasets();
const contacts = storageUtils.getContacts();

// These functions always use new keys
storageUtils.setProjectState(JSON.stringify(data));
storageUtils.setDatasets(JSON.stringify(datasets));
storageUtils.setContacts(JSON.stringify(contacts));
```

### Individual Migration Functions

```typescript
import { 
  migrateProjectState, 
  migrateDatasets, 
  migrateContacts 
} from './migration-utils';

// Migrate specific keys
const success1 = migrateProjectState();
const success2 = migrateDatasets();
const success3 = migrateContacts();
```

## Testing

To test the migration utility in the browser console:

```typescript
import { testMigrationUtility } from './migration-verification';

// Run comprehensive tests
const results = testMigrationUtility();
console.log('Test results:', results);
```

## Migration Behavior

1. **Safety First**: Never overwrites existing new keys
2. **Backward Compatibility**: Reads from old keys if new keys don't exist
3. **Automatic Cleanup**: Removes old keys only after successful migration
4. **Error Handling**: Continues operation even if some migrations fail
5. **Logging**: Provides clear console output about migration status

## Integration Points

The migration should be integrated at these points in the application:

1. **App Initialization**: Call `initializeMigration()` in `App.tsx`
2. **Component Updates**: Update components to use `storageUtils` instead of direct localStorage calls
3. **New Development**: Always use new key names for any new localStorage usage

## Files

- `migration-utils.ts`: Core migration functions and utilities
- `migration-init.ts`: App initialization helper
- `migration-verification.ts`: Testing and verification utilities
- `README-migration.md`: This documentation file