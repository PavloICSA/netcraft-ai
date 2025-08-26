/**
 * K-Means Clustering Implementation
 * Simple and efficient k-means algorithm with multiple initialization strategies
 */

import { ClusterResult } from '../../types';

/**
 * K-means clustering configuration
 */
export interface KMeansConfig {
  k: number;
  maxIterations?: number;
  tolerance?: number;
  initMethod?: 'random' | 'kmeans++';
}

/**
 * Point in n-dimensional space
 */
export interface Point {
  coordinates: number[];
  cluster?: number;
}

/**
 * Perform k-means clustering
 */
export function kMeans(
  data: number[][],
  config: KMeansConfig
): ClusterResult {
  const {
    k,
    maxIterations = 100,
    tolerance = 1e-6,
    initMethod = 'kmeans++'
  } = config;

  if (data.length === 0) {
    throw new Error('Data cannot be empty');
  }

  if (k <= 0 || k > data.length) {
    throw new Error('Invalid number of clusters');
  }

  const points: Point[] = data.map(coordinates => ({ coordinates }));
  const dimensions = data[0].length;

  // Initialize centroids
  let centroids = initMethod === 'kmeans++'
    ? initializeCentroidsKMeansPlusPlus(points, k)
    : initializeCentroidsRandom(points, k);

  let previousInertia = Infinity;
  let iterations = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations++;

    // Assign points to nearest centroids
    assignPointsToClusters(points, centroids);

    // Update centroids
    const newCentroids = updateCentroids(points, k, dimensions);

    // Check for convergence
    const inertia = calculateInertia(points, centroids);
    if (Math.abs(previousInertia - inertia) < tolerance) {
      break;
    }

    centroids = newCentroids;
    previousInertia = inertia;
  }

  // Extract cluster assignments
  const clusters = points.map(point => point.cluster || 0);

  return {
    clusters,
    centroids,
    inertia: calculateInertia(points, centroids)
  };
}

/**
 * Initialize centroids randomly
 */
function initializeCentroidsRandom(points: Point[], k: number): number[][] {
  const centroids: number[][] = [];
  const dimensions = points[0].coordinates.length;

  // Find min/max for each dimension
  const mins = Array(dimensions).fill(Infinity);
  const maxs = Array(dimensions).fill(-Infinity);

  points.forEach(point => {
    point.coordinates.forEach((coord, dim) => {
      mins[dim] = Math.min(mins[dim], coord);
      maxs[dim] = Math.max(maxs[dim], coord);
    });
  });

  // Generate random centroids within data bounds
  for (let i = 0; i < k; i++) {
    const centroid: number[] = [];
    for (let dim = 0; dim < dimensions; dim++) {
      centroid.push(mins[dim] + Math.random() * (maxs[dim] - mins[dim]));
    }
    centroids.push(centroid);
  }

  return centroids;
}

/**
 * Initialize centroids using k-means++ algorithm
 */
function initializeCentroidsKMeansPlusPlus(points: Point[], k: number): number[][] {
  const centroids: number[][] = [];

  // Choose first centroid randomly
  const firstIndex = Math.floor(Math.random() * points.length);
  centroids.push([...points[firstIndex].coordinates]);

  // Choose remaining centroids
  for (let i = 1; i < k; i++) {
    const distances: number[] = [];
    let totalDistance = 0;

    // Calculate squared distance to nearest centroid for each point
    points.forEach(point => {
      let minDistance = Infinity;
      centroids.forEach(centroid => {
        const distance = euclideanDistance(point.coordinates, centroid);
        minDistance = Math.min(minDistance, distance * distance);
      });
      distances.push(minDistance);
      totalDistance += minDistance;
    });

    // Choose next centroid with probability proportional to squared distance
    const random = Math.random() * totalDistance;
    let cumulativeDistance = 0;

    for (let j = 0; j < points.length; j++) {
      cumulativeDistance += distances[j];
      if (cumulativeDistance >= random) {
        centroids.push([...points[j].coordinates]);
        break;
      }
    }
  }

  return centroids;
}

/**
 * Assign each point to the nearest centroid
 */
function assignPointsToClusters(points: Point[], centroids: number[][]): void {
  points.forEach(point => {
    let minDistance = Infinity;
    let nearestCluster = 0;

    centroids.forEach((centroid, clusterIndex) => {
      const distance = euclideanDistance(point.coordinates, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCluster = clusterIndex;
      }
    });

    point.cluster = nearestCluster;
  });
}

/**
 * Update centroids based on current cluster assignments
 */
function updateCentroids(points: Point[], k: number, dimensions: number): number[][] {
  const centroids: number[][] = [];
  const clusterCounts: number[] = Array(k).fill(0);
  const clusterSums: number[][] = Array(k).fill(0).map(() => Array(dimensions).fill(0));

  // Sum coordinates for each cluster
  points.forEach(point => {
    const cluster = point.cluster || 0;
    clusterCounts[cluster]++;
    point.coordinates.forEach((coord, dim) => {
      clusterSums[cluster][dim] += coord;
    });
  });

  // Calculate new centroids as cluster means
  for (let cluster = 0; cluster < k; cluster++) {
    if (clusterCounts[cluster] > 0) {
      const centroid = clusterSums[cluster].map(sum => sum / clusterCounts[cluster]);
      centroids.push(centroid);
    } else {
      // Handle empty cluster by keeping previous centroid or random point
      centroids.push(points[Math.floor(Math.random() * points.length)].coordinates.slice());
    }
  }

  return centroids;
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
 * Calculate within-cluster sum of squares (inertia)
 */
function calculateInertia(points: Point[], centroids: number[][]): number {
  let inertia = 0;

  points.forEach(point => {
    const cluster = point.cluster || 0;
    const centroid = centroids[cluster];
    const distance = euclideanDistance(point.coordinates, centroid);
    inertia += distance * distance;
  });

  return inertia;
}

/**
 * Calculate silhouette score for clustering quality assessment
 */
export function calculateSilhouetteScore(
  data: number[][],
  clusters: number[]
): number {
  const n = data.length;
  if (n <= 1) return 0;

  const uniqueClusters = [...new Set(clusters)];
  if (uniqueClusters.length <= 1) return 0;

  let totalScore = 0;

  for (let i = 0; i < n; i++) {
    const pointCluster = clusters[i];
    
    // Calculate average distance to points in same cluster (a)
    let sameClusterDistance = 0;
    let sameClusterCount = 0;
    
    for (let j = 0; j < n; j++) {
      if (i !== j && clusters[j] === pointCluster) {
        sameClusterDistance += euclideanDistance(data[i], data[j]);
        sameClusterCount++;
      }
    }
    
    const a = sameClusterCount > 0 ? sameClusterDistance / sameClusterCount : 0;
    
    // Calculate minimum average distance to points in other clusters (b)
    let minOtherClusterDistance = Infinity;
    
    for (const otherCluster of uniqueClusters) {
      if (otherCluster === pointCluster) continue;
      
      let otherClusterDistance = 0;
      let otherClusterCount = 0;
      
      for (let j = 0; j < n; j++) {
        if (clusters[j] === otherCluster) {
          otherClusterDistance += euclideanDistance(data[i], data[j]);
          otherClusterCount++;
        }
      }
      
      if (otherClusterCount > 0) {
        const avgDistance = otherClusterDistance / otherClusterCount;
        minOtherClusterDistance = Math.min(minOtherClusterDistance, avgDistance);
      }
    }
    
    const b = minOtherClusterDistance;
    
    // Calculate silhouette score for this point
    const silhouette = (b - a) / Math.max(a, b);
    totalScore += silhouette;
  }

  return totalScore / n;
}

/**
 * Determine optimal number of clusters using elbow method
 */
export function findOptimalK(
  data: number[][],
  maxK: number = 10
): { k: number; inertias: number[]; scores: number[] } {
  const inertias: number[] = [];
  const scores: number[] = [];
  
  for (let k = 1; k <= Math.min(maxK, data.length); k++) {
    if (k === 1) {
      inertias.push(0);
      scores.push(0);
      continue;
    }
    
    const result = kMeans(data, { k });
    inertias.push(result.inertia || 0);
    
    const silhouetteScore = calculateSilhouetteScore(data, result.clusters);
    scores.push(silhouetteScore);
  }
  
  // Find elbow point (simplified)
  let optimalK = 2;
  let maxImprovement = 0;
  
  for (let k = 2; k < inertias.length - 1; k++) {
    const improvement = inertias[k - 1] - inertias[k];
    const nextImprovement = inertias[k] - inertias[k + 1];
    const elbowScore = improvement - nextImprovement;
    
    if (elbowScore > maxImprovement) {
      maxImprovement = elbowScore;
      optimalK = k + 1; // +1 because array is 0-indexed but k starts from 1
    }
  }
  
  return { k: optimalK, inertias, scores };
}