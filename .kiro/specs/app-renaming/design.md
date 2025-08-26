# Design Document

## Overview

This design outlines the comprehensive approach to rename the application from "NeuroXL Web" to "NetCraft AI" with the motto "Crafting artificial neural networks, clustering, and forecasts in the browser". The renaming will be systematic and thorough, covering all user-facing elements, code references, configuration files, and documentation.

## Architecture

### Naming Strategy
- **Application Name**: "NetCraft AI" (display name)
- **Package Name**: "netcraft-ai" (kebab-case for technical contexts)
- **Motto**: "Crafting artificial neural networks, clustering, and forecasts in the browser"
- **File Naming**: Export files will use "netcraft" prefix instead of "neuroxl"

### Scope of Changes
The renaming affects multiple layers of the application:

1. **User Interface Layer**: All visible text, titles, headers, and branding
2. **Configuration Layer**: Package.json, HTML metadata, build configurations
3. **Code Layer**: String literals, comments, type definitions, localStorage keys
4. **Documentation Layer**: README, steering files, legal pages
5. **Asset Layer**: Export file names, project state keys

## Components and Interfaces

### 1. Configuration Files
**Files to Update:**
- `package.json`: Update name field to "netcraft-ai"
- `index.html`: Update title tag and meta descriptions
- `vite.config.ts`: No changes needed (uses package.json name)

**Interface Changes:**
- Package name follows npm naming conventions (lowercase, kebab-case)
- HTML title will be "NetCraft AI - Crafting artificial neural networks, clustering, and forecasts in the browser"

### 2. User Interface Components
**Components Requiring Updates:**
- `src/pages/LandingPage.tsx`: Navigation brand, hero section, footer
- `src/components/Layout/Topbar.tsx`: Export file naming
- `src/components/Landing/Hero.tsx`: Main branding and motto display
- All page components with references to the old name

**Interface Changes:**
- Brand display will show "NetCraft AI"
- Motto will be prominently featured on landing page
- Footer copyright will reference "NetCraft AI"
- Export files will use "netcraft" prefix

### 3. Data Storage and State Management
**Storage Keys to Update:**
- `neuroxl-project-state` → `netcraft-project-state`
- `neuroxl-datasets` → `netcraft-datasets`
- Export file prefixes: `neuroxl_project_` → `netcraft_project_`

**Migration Strategy:**
- Implement backward compatibility to read old keys
- Migrate data to new keys on first load
- Clean up old keys after successful migration

### 4. Documentation and Legal Pages
**Files Requiring Updates:**
- `README.md`: Complete rebranding throughout
- `.kiro/steering/product.md`: Update product description
- `src/pages/TermsPage.tsx`: Legal references and contact information
- `src/pages/PrivacyPage.tsx`: Service name references
- `src/pages/AboutPage.tsx`: Company/product information
- `src/pages/GuidelinesPage.tsx`: Product references

**Content Strategy:**
- Maintain same structure and information
- Replace all instances of "NeuroXL Web" with "NetCraft AI"
- Update contact information and URLs where applicable
- Preserve legal compliance and accuracy

## Data Models

### Project State Migration
```typescript
interface MigrationHandler {
  migrateProjectState(): void;
  migrateDatasets(): void;
  cleanupOldKeys(): void;
}
```

### Brand Configuration
```typescript
interface BrandConfig {
  appName: string;           // "NetCraft AI"
  packageName: string;       // "netcraft-ai"
  motto: string;            // "Crafting artificial neural networks..."
  exportPrefix: string;     // "netcraft"
  storagePrefix: string;    // "netcraft"
}
```

## Error Handling

### Migration Errors
- **Data Loss Prevention**: Always backup existing data before migration
- **Fallback Strategy**: If migration fails, continue using old keys temporarily
- **User Notification**: Inform users if migration encounters issues
- **Retry Mechanism**: Allow manual retry of failed migrations

### Validation
- **Completeness Check**: Verify all references have been updated
- **Functional Testing**: Ensure all features work with new naming
- **Storage Validation**: Confirm data migration completed successfully

## Testing Strategy

### Automated Testing
1. **Unit Tests**: Update test descriptions and assertions to use new name
2. **Integration Tests**: Verify localStorage migration works correctly
3. **Component Tests**: Ensure UI components display new branding
4. **Build Tests**: Confirm package.json changes don't break build process

### Manual Testing
1. **Visual Verification**: Check all pages display "NetCraft AI" correctly
2. **Export Testing**: Verify exported files use new naming convention
3. **Storage Testing**: Confirm data persists correctly with new keys
4. **Cross-browser Testing**: Ensure changes work across different browsers

### Test Cases
- Landing page displays new brand and motto
- Navigation shows "NetCraft AI" in all locations
- Export functionality uses "netcraft" prefix
- localStorage migration preserves all user data
- All legal pages reference correct company name
- Search functionality finds no remaining "NeuroXL" references

### Regression Testing
- Verify all existing functionality continues to work
- Confirm no broken links or missing references
- Ensure export/import features maintain compatibility
- Validate that user workflows remain unchanged

## Implementation Phases

### Phase 1: Configuration and Core Files
- Update package.json and index.html
- Modify core type definitions and comments
- Update steering files for immediate context

### Phase 2: User Interface Components
- Update all React components with user-facing text
- Implement localStorage migration logic
- Update export file naming

### Phase 3: Documentation and Legal
- Comprehensive README update
- Update all legal and informational pages
- Verify all external references

### Phase 4: Testing and Validation
- Run comprehensive test suite
- Perform manual verification
- Clean up any remaining references