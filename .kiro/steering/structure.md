# Project Structure

## Directory Organization

```
src/
├── components/           # Reusable UI components
│   ├── Common/          # Shared components (Button, Modal)
│   ├── Data/            # Data upload and preview components
│   ├── Predictor/       # Neural network and Random Forest UI components
│   ├── Clusterizer/     # Clustering UI components
│   ├── Forecasting/     # Time series forecasting UI components
│   ├── Landing/         # Landing page components
│   └── Layout/          # Layout components (Topbar, Sidebar)
├── lib/                 # Core logic libraries
│   ├── ann/             # Neural network implementation
│   │   ├── ann-logic-1.ts   # Model definition, forward pass
│   │   └── ann-logic-2.ts   # Training, metrics, serialization
│   ├── random-forest/   # Random Forest implementation
│   │   ├── RandomForest.ts  # Random Forest classifier
│   │   ├── DecisionTree.ts  # Decision tree implementation
│   │   ├── feature-importance.ts # Feature importance analysis
│   │   └── rf-utils.ts      # Random Forest utilities
│   ├── forecasting/     # Time series forecasting algorithms
│   │   ├── algorithms/      # Forecasting algorithm implementations
│   │   ├── metrics/         # Forecasting evaluation metrics
│   │   └── base-forecaster.ts # Base forecasting interface
│   ├── cluster/         # Clustering algorithms
│   │   ├── kmeans.ts        # K-means implementation
│   │   ├── som.ts           # Self-Organizing Map
│   │   └── cluster-utils.ts # Clustering utilities
│   └── data/            # Data processing utilities
├── pages/               # Page components (one per route)
├── __tests__/           # Test files
├── types.d.ts          # Global TypeScript type definitions
└── utils.ts            # General utility functions
```

## Architecture Patterns

### Component Organization
- **Pages**: Top-level route components in `src/pages/`
- **Feature Components**: Grouped by domain (Data, Predictor, Clusterizer, Forecasting)
- **Common Components**: Reusable UI elements with consistent props interface
- **Layout Components**: App shell components (navigation, sidebars)

### Business Logic Separation
- **Pure Logic**: All ML algorithms in `src/lib/` with no React dependencies
- **UI Components**: Handle presentation and user interaction only
- **Type Safety**: Comprehensive TypeScript interfaces in `types.d.ts`

### File Naming Conventions
- **Components**: PascalCase (e.g., `DataUploader.tsx`)
- **Pages**: PascalCase with "Page" suffix (e.g., `LandingPage.tsx`)
- **Utilities**: kebab-case (e.g., `cluster-utils.ts`)
- **Types**: Descriptive interfaces (e.g., `ANNConfig`, `ClusterResult`)

### State Management
- **Local State**: React hooks for component-specific state
- **Global State**: Context or props drilling for shared data
- **Persistence**: Local storage for models and project state