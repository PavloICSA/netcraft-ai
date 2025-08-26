/**
 * Utility functions for clustering analysis
 */

/**
 * Normalize data to [0, 1] range
 */
export function normalizeData(data: number[][]): { normalized: number[][]; mins: number[]; maxs: number[] } {
  if (data.length === 0) return { normalized: [], mins: [], maxs: [] };
  
  const dimensions = data[0].length;
  const mins: number[] = Array(dimensions).fill(Infinity);
  const maxs: number[] = Array(dimensions).fill(-Infinity);
  
  // Find min and max for each dimension
  data.forEach(point => {
    point.forEach((value, dim) => {
      mins[dim] = Math.min(mins[dim], value);
      maxs[dim] = Math.max(maxs[dim], value);
    });
  });
  
  // Normalize data
  const normalized = data.map(point =>
    point.map((value, dim) => {
      const range = maxs[dim] - mins[dim];
      return range === 0 ? 0 : (value - mins[dim]) / range;
    })
  );
  
  return { normalized, mins, maxs };
}

/**
 * Standardize data to zero mean and unit variance
 */
export function standardizeData(data: number[][]): { standardized: number[][]; means: number[]; stds: number[] } {
  if (data.length === 0) return { standardized: [], means: [], stds: [] };
  
  const dimensions = data[0].length;
  const means: number[] = Array(dimensions).fill(0);
  const stds: number[] = Array(dimensions).fill(0);
  
  // Calculate means
  data.forEach(point => {
    point.forEach((value, dim) => {
      means[dim] += value;
    });
  });
  means.forEach((sum, dim) => {
    means[dim] = sum / data.length;
  });
  
  // Calculate standard deviations
  data.forEach(point => {
    point.forEach((value, dim) => {
      stds[dim] += Math.pow(value - means[dim], 2);
    });
  });
  stds.forEach((sum, dim) => {
    stds[dim] = Math.sqrt(sum / data.length);
  });
  
  // Standardize data
  const standardized = data.map(point =>
    point.map((value, dim) => {
      return stds[dim] === 0 ? 0 : (value - means[dim]) / stds[dim];
    })
  );
  
  return { standardized, means, stds };
}

/**
 * Calculate pairwise distances between points
 */
export function calculateDistanceMatrix(data: number[][]): number[][] {
  const n = data.length;
  const distances: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const distance = euclideanDistance(data[i], data[j]);
      distances[i][j] = distance;
      distances[j][i] = distance;
    }
  }
  
  return distances;
}

/**
 * Calculate Euclidean distance between two points
 */
export function euclideanDistance(point1: number[], point2: number[]): number {
  let sum = 0;
  for (let i = 0; i < point1.length; i++) {
    const diff = point1[i] - point2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Perform Principal Component Analysis for dimensionality reduction
 */
export function performPCA(data: number[][], components: number = 2): { transformed: number[][]; explained: number[] } {
  // This is a simplified PCA implementation
  // For production use, consider using a more robust library
  
  if (data.length === 0 || components <= 0) {
    return { transformed: [], explained: [] };
  }
  
  const dimensions = data[0].length;
  components = Math.min(components, dimensions);
  
  // Center the data
  const means = Array(dimensions).fill(0);
  data.forEach(point => {
    point.forEach((value, dim) => {
      means[dim] += value;
    });
  });
  means.forEach((sum, dim) => {
    means[dim] = sum / data.length;
  });
  
  const centeredData = data.map(point =>
    point.map((value, dim) => value - means[dim])
  );
  
  // For simplicity, just return the first two dimensions
  // A full PCA implementation would compute eigenvectors of the covariance matrix
  const transformed = centeredData.map(point => point.slice(0, components));
  const explained = Array(components).fill(1 / components);
  
  return { transformed, explained };
}