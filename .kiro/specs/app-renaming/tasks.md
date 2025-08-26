# Implementation Plan

- [x] 1. Update core configuration files





  - Update package.json name field to "netcraft-ai"
  - Update index.html title tag to "NetCraft AI - Crafting artificial neural networks, clustering, and forecasts in the browser"
  - Update HTML meta descriptions to reference NetCraft AI
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 2. Update type definitions and core utilities





  - Update global type definitions header comment in src/types.d.ts
  - Update any string constants or configuration objects that reference the old name
  - _Requirements: 2.3, 3.4_

- [x] 3. Implement localStorage migration utility





  - Create migration function to handle neuroxl-project-state → netcraft-project-state
  - Create migration function to handle neuroxl-datasets → netcraft-datasets
  - Implement backward compatibility to read from old keys if new keys don't exist
  - Add cleanup function to remove old keys after successful migration
  - _Requirements: 2.3, 4.3_

- [x] 4. Update main navigation and branding components





  - Update LandingPage.tsx navigation brand text to "NetCraft AI"
  - Update LandingPage.tsx footer references to "NetCraft AI"
  - Update LandingPage.tsx copyright text to reference NetCraft AI
  - Add motto "Crafting artificial neural networks, clustering, and forecasts in the browser" to hero section
  - _Requirements: 1.2, 1.4, 1.5_

- [x] 5. Update export functionality and file naming





  - Update Topbar.tsx export file naming from neuroxl_project_ to netcraft_project_
  - Update any other export functionality to use "netcraft" prefix
  - _Requirements: 2.3, 4.3_

- [x] 6. Update data management and localStorage usage









  - Update DataPage.tsx localStorage key from neuroxl-datasets to netcraft-datasets
  - Update PredictorPage.tsx localStorage key from neuroxl-project-state to netcraft-project-state
  - Update ClusterizerPage.tsx localStorage usage to use new keys
  - Implement migration calls in components that use localStorage
  - _Requirements: 2.3, 4.1_

- [x] 7. Update legal and informational pages





  - Update TermsPage.tsx to replace all "NeuroXL Web" references with "NetCraft AI"
  - Update PrivacyPage.tsx to replace all "NeuroXL Web" references with "NetCraft AI"
  - Update contact information and URLs in legal pages
  - Update GuidelinesPage.tsx subtitle to reference NetCraft AI
  - _Requirements: 3.1, 3.3_

- [x] 8. Update steering and documentation files





  - Update .kiro/steering/product.md to use "NetCraft AI" and include new motto
  - Update README.md title, description, and all references throughout document
  - Update README.md installation commands to reference netcraft-ai
  - Update README.md contact information and URLs
  - _Requirements: 3.1, 3.2_

- [x] 9. Update remaining UI components and pages





  - Search for and update any remaining components with "NeuroXL" references
  - Update AboutPage.tsx if it contains product name references
  - Update ContactPage.tsx if it contains product name references
  - Update ResultsPage.tsx if it contains product name references
  - _Requirements: 1.2, 3.3_

- [x] 10. Update test files and descriptions





  - Update test file descriptions and assertions to use "NetCraft AI"
  - Update any test data or mock objects that reference the old name
  - Verify tests pass with new naming
  - _Requirements: 4.4_

- [x] 11. Perform comprehensive verification and cleanup





  - Search entire codebase for remaining "NeuroXL" references
  - Test localStorage migration functionality
  - Verify all export functionality uses new naming
  - Test that all pages display "NetCraft AI" correctly
  - Verify motto appears prominently on landing page
  - _Requirements: 4.1, 4.2, 4.3_