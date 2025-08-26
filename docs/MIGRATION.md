# Data Migration System

NetCraft AI includes a robust data migration system that automatically handles the transition from legacy localStorage keys to the new naming convention. This ensures seamless upgrades and backward compatibility.

## Overview

The migration system automatically detects and migrates data from previous versions of the application, ensuring that users don't lose their work when upgrading.

### Migration Mapping

| Legacy Key | New Key | Description |
|------------|---------|-------------|
| `neuroxl-project-state` | `netcraft-project-state` | Project state and models |
| `neuroxl-datasets` | `netcraft-datasets` | Saved datasets |
| `neuroxl-contacts` | `netcraft-contacts` | Contact form submissions |

## How It Works

### Automatic Migration

The migration system runs automatically when the application starts:

1. **Detection**: Checks if any legacy keys exist in localStorage
2. **Migration**: Copies data from old keys to new keys
3. **Cleanup**: Removes old keys after successful migration
4. **Logging**: Provides console feedback about the migration process

### Migration Process

```typescript
import { initializeMigration } from './lib/data/migration-init';

// Called automatically in App.tsx
initializeMigration();
```

### Backward Compatibility

The storage utilities provide automatic fallback to legacy keys:

```typescript
import { storageUtils } from './lib/data/migration-utils';

// Automatically tries new key first, falls back to old key
const projectState = storageUtils.getProjectState();
```

## API Reference

### Core Functions

#### `performFullMigration()`
Performs complete migration of all localStorage keys.

```typescript
const result = performFullMigration();
console.log(result.success); // boolean
console.log(result.migratedKeys); // string[]
console.log(result.errors); // string[]
```

#### `isMigrationNeeded()`
Checks if migration is required.

```typescript
const needsMigration = isMigrationNeeded();
```

#### `storageUtils`
Provides backward-compatible storage access.

```typescript
// Get data with automatic fallback
const projectState = storageUtils.getProjectState();
const datasets = storageUtils.getDatasets();
const contacts = storageUtils.getContacts();

// Set data using new keys
storageUtils.setProjectState(jsonString);
storageUtils.setDatasets(jsonString);
storageUtils.setContacts(jsonString);
```

## Migration Status

### Console Messages

The migration system provides clear console feedback:

- `🔄 NetCraft AI: Migrating localStorage data from NeuroXL...`
- `✅ NetCraft AI: Migration completed successfully`
- `ℹ️ NetCraft AI: No migration needed`
- `⚠️ NetCraft AI: Migration completed with errors`
- `❌ NetCraft AI: Migration failed`

### Debugging

Check migration status programmatically:

```typescript
import { getMigrationStatus } from './lib/data/migration-init';

const status = getMigrationStatus();
console.log(status.needsMigration); // boolean
console.log(status.hasNewKeys); // boolean
console.log(status.hasOldKeys); // boolean
```

## Error Handling

The migration system is designed to be fault-tolerant:

- **Non-destructive**: Original data is preserved until migration succeeds
- **Graceful degradation**: Application continues to work even if migration fails
- **Error reporting**: Detailed error messages for debugging
- **Partial migration**: Successfully migrated keys are preserved even if others fail

## Testing

The migration system includes comprehensive tests:

```bash
npm test -- migration-utils.test.ts
```

Test coverage includes:
- Successful migration scenarios
- Error handling
- Backward compatibility
- Edge cases (empty data, corrupted data)

## Best Practices

### For Developers

1. **Always use `storageUtils`** instead of direct localStorage access
2. **Test migration scenarios** when adding new storage keys
3. **Update migration mapping** when changing key names
4. **Preserve backward compatibility** in storage utilities

### For Users

The migration system is completely automatic and requires no user action. Users will see console messages indicating the migration status, but the application will continue to work normally regardless of migration success or failure.

## Future Considerations

### Adding New Keys

When adding new localStorage keys:

1. Add the mapping to `MIGRATION_MAP` in `migration-utils.ts`
2. Add utility functions to `storageUtils`
3. Update tests to cover the new key
4. Document the change in this file

### Version Management

Consider implementing version-based migration for future major changes:

```typescript
const MIGRATION_VERSIONS = {
  '1.0.0': migrateToV1,
  '2.0.0': migrateToV2,
  // etc.
};
```

This would allow for more complex migration scenarios in future versions.