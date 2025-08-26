/**
 * Basic tests for NetCraft AI K-means clustering implementation
 */

import { kMeans, euclideanDistance } from '../lib/cluster/kmeans';

describe('K-means Clustering', () => {
  test('should calculate euclidean distance correctly', () => {
    const point1 = [0, 0];
    const point2 = [3, 4];
    
    const distance = euclideanDistance(point1, point2);
    
    expect(distance).toBe(5); // 3-4-5 triangle
  });

  test('should perform k-means clustering', () => {
    // Simple 2D data with clear clusters
    const data = [
      [1, 1], [1, 2], [2, 1], [2, 2], // Cluster 1
      [8, 8], [8, 9], [9, 8], [9, 9]  // Cluster 2
    ];

    const result = kMeans(data, { k: 2 });

    expect(result.clusters).toHaveLength(8);
    expect(result.centroids).toHaveLength(2);
    expect(result.inertia).toBeGreaterThan(0);
    
    // Check that clusters are assigned (0 or 1)
    result.clusters.forEach(cluster => {
      expect([0, 1]).toContain(cluster);
    });
  });

  test('should handle edge cases', () => {
    // Single point
    const singlePoint = [[1, 2]];
    const result1 = kMeans(singlePoint, { k: 1 });
    expect(result1.clusters).toEqual([0]);
    
    // Empty data should throw error
    expect(() => kMeans([], { k: 2 })).toThrow();
    
    // k > data length should throw error
    expect(() => kMeans([[1, 2]], { k: 2 })).toThrow();
  });
});