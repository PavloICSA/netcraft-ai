/**
 * Self-Organizing Map (SOM) Implementation
 * Kohonen neural network for unsupervised learning and visualization
 */

import { ClusterResult } from '../../types';

/**
 * SOM configuration parameters
 */
export interface SOMConfig {
  gridSize: [number, number]; // [width, height]
  epochs: number;
  learningRate?: number;
  neighborhoodRadius?: number;
  topology?: 'rectangular' | 'hexagonal';
}

/**
 * SOM neuron/node
 */
export interface SOMNode {
  weights: number[];
  x: number;
  y: number;
}

/**
 * SOM training result
 */
export interface SOMResult extends ClusterResult {
  nodes: SOMNode[];
  gridSize: [number, number];
  quantizationError: number;
  topographicError: number;
}

/**
 * Create and train a Self-Organizing Map
 */
export function trainSOM(
  data: number[][],
  config: SOMConfig
): SOMResult {
  const {
    gridSize,
    epochs,
    learningRate = 0.1,
    neighborhoodRadius = Math.max(gridSize[0], gridSize[1]) / 2,
    topology = 'rectangular'
  } = config;

  if (data.length === 0) {
    throw new Error('Data cannot be empty');
  }

  const [gridWidth, gridHeight] = gridSize;
  const dimensions = data[0].length;

  // Initialize SOM nodes
  const nodes = initializeNodes(gridWidth, gridHeight, dimensions, data);

  // Training parameters
  let currentLearningRate = learningRate;
  let currentRadius = neighborhoodRadius;

  // Training loop
  for (let epoch = 0; epoch < epochs; epoch++) {
    // Decay learning rate and neighborhood radius
    const timeConstant = epochs / Math.log(neighborhoodRadius);
    currentLearningRate = learningRate * Math.exp(-epoch / timeConstant);
    currentRadius = neighborhoodRadius * Math.exp(-epoch / timeConstant);

    // Shuffle data for each epoch
    const shuffledData = [...data].sort(() => Math.random() - 0.5);

    // Process each data point
    for (const dataPoint of shuffledData) {
      // Find Best Matching Unit (BMU)
      const bmu = findBestMatchingUnit(nodes, dataPoint);

      // Update BMU and its neighbors
      updateNodes(
        nodes,
        dataPoint,
        bmu,
        currentLearningRate,
        currentRadius,
        gridWidth,
        gridHeight,
        topology
      );
    }
  }

  // Assign data points to clusters (nearest nodes)
  const clusters = data.map(dataPoint => {
    const bmu = findBestMatchingUnit(nodes, dataPoint);
    return bmu.y * gridWidth + bmu.x; // Convert 2D coordinates to cluster ID
  });

  // Calculate quality metrics
  const quantizationError = calculateQuantizationError(data, nodes);
  const topographicError = calculateTopographicError(data, nodes, gridWidth, gridHeight);

  // Convert nodes to centroids format
  const centroids = nodes.map(node => [...node.weights]);

  return {
    clusters,
    centroids,
    somWeights: convertNodesToWeights(nodes, gridWidth, gridHeight, dimensions),
    nodes,
    gridSize,
    quantizationError,
    topographicError
  };
}

/**
 * Initialize SOM nodes with random weights
 */
function initializeNodes(
  width: number,
  height: number,
  dimensions: number,
  data: number[][]
): SOMNode[] {
  const nodes: SOMNode[] = [];

  // Calculate data bounds for better initialization
  const mins = Array(dimensions).fill(Infinity);
  const maxs = Array(dimensions).fill(-Infinity);

  data.forEach(point => {
    point.forEach((value, dim) => {
      mins[dim] = Math.min(mins[dim], value);
      maxs[dim] = Math.max(maxs[dim], value);
    });
  });

  // Create nodes
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const weights: number[] = [];
      
      // Initialize weights randomly within data bounds
      for (let dim = 0; dim < dimensions; dim++) {
        const range = maxs[dim] - mins[dim];
        weights.push(mins[dim] + Math.random() * range);
      }

      nodes.push({ weights, x, y });
    }
  }

  return nodes;
}

/**
 * Find the Best Matching Unit (BMU) for a data point
 */
function findBestMatchingUnit(nodes: SOMNode[], dataPoint: number[]): SOMNode {
  let bestNode = nodes[0];
  let minDistance = euclideanDistance(dataPoint, bestNode.weights);

  for (let i = 1; i < nodes.length; i++) {
    const distance = euclideanDistance(dataPoint, nodes[i].weights);
    if (distance < minDistance) {
      minDistance = distance;
      bestNode = nodes[i];
    }
  }

  return bestNode;
}

/**
 * Update node weights based on BMU and neighborhood function
 */
function updateNodes(
  nodes: SOMNode[],
  dataPoint: number[],
  bmu: SOMNode,
  learningRate: number,
  neighborhoodRadius: number,
  gridWidth: number,
  gridHeight: number,
  topology: 'rectangular' | 'hexagonal'
): void {
  nodes.forEach(node => {
    // Calculate distance from BMU
    const distance = topology === 'hexagonal'
      ? hexagonalDistance(bmu, node)
      : euclideanGridDistance(bmu, node);

    // Apply neighborhood function (Gaussian)
    const influence = Math.exp(-(distance * distance) / (2 * neighborhoodRadius * neighborhoodRadius));

    // Update weights if within neighborhood
    if (influence > 0.01) { // Threshold to avoid tiny updates
      const effectiveLearningRate = learningRate * influence;

      for (let dim = 0; dim < node.weights.length; dim++) {
        const delta = dataPoint[dim] - node.weights[dim];
        node.weights[dim] += effectiveLearningRate * delta;
      }
    }
  });
}

/**
 * Calculate Euclidean distance between two points
 */
function euclideanDistance(point1: number[], point2: number[]): number {
  let sum = 0;
  for (let i = 0; i < point1.length; i++) {
    const diff = point1[i] - point2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

/**
 * Calculate grid distance between two nodes (rectangular topology)
 */
function euclideanGridDistance(node1: SOMNode, node2: SOMNode): number {
  const dx = node1.x - node2.x;
  const dy = node1.y - node2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate hexagonal distance between two nodes
 */
function hexagonalDistance(node1: SOMNode, node2: SOMNode): number {
  // Convert to axial coordinates for hexagonal grid
  const q1 = node1.x - Math.floor(node1.y / 2);
  const r1 = node1.y;
  const q2 = node2.x - Math.floor(node2.y / 2);
  const r2 = node2.y;

  return Math.max(Math.abs(q1 - q2), Math.abs(r1 - r2), Math.abs((q1 + r1) - (q2 + r2)));
}

/**
 * Calculate quantization error (average distance from data points to their BMUs)
 */
function calculateQuantizationError(data: number[][], nodes: SOMNode[]): number {
  let totalError = 0;

  data.forEach(dataPoint => {
    const bmu = findBestMatchingUnit(nodes, dataPoint);
    totalError += euclideanDistance(dataPoint, bmu.weights);
  });

  return totalError / data.length;
}

/**
 * Calculate topographic error (percentage of data points for which first and second BMUs are not adjacent)
 */
function calculateTopographicError(
  data: number[][],
  nodes: SOMNode[],
  gridWidth: number,
  gridHeight: number
): number {
  let topographicErrors = 0;

  data.forEach(dataPoint => {
    // Find first and second BMUs
    const distances = nodes.map(node => ({
      node,
      distance: euclideanDistance(dataPoint, node.weights)
    }));

    distances.sort((a, b) => a.distance - b.distance);
    const firstBMU = distances[0].node;
    const secondBMU = distances[1].node;

    // Check if they are adjacent
    const dx = Math.abs(firstBMU.x - secondBMU.x);
    const dy = Math.abs(firstBMU.y - secondBMU.y);

    // Adjacent if distance is 1 in grid coordinates
    const isAdjacent = (dx <= 1 && dy <= 1) && (dx + dy > 0);

    if (!isAdjacent) {
      topographicErrors++;
    }
  });

  return topographicErrors / data.length;
}

/**
 * Convert nodes to 3D weights array for visualization
 */
function convertNodesToWeights(
  nodes: SOMNode[],
  width: number,
  height: number,
  dimensions: number
): number[][][] {
  const weights: number[][][] = [];

  for (let y = 0; y < height; y++) {
    weights[y] = [];
    for (let x = 0; x < width; x++) {
      const nodeIndex = y * width + x;
      weights[y][x] = [...nodes[nodeIndex].weights];
    }
  }

  return weights;
}

/**
 * Get the U-Matrix (Unified Distance Matrix) for visualization
 */
export function calculateUMatrix(
  nodes: SOMNode[],
  gridWidth: number,
  gridHeight: number
): number[][] {
  const uMatrix: number[][] = [];

  for (let y = 0; y < gridHeight; y++) {
    uMatrix[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      const currentNode = nodes[y * gridWidth + x];
      let totalDistance = 0;
      let neighborCount = 0;

      // Check all 8 neighbors (or fewer at edges)
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue; // Skip self

          const nx = x + dx;
          const ny = y + dy;

          if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            const neighborNode = nodes[ny * gridWidth + nx];
            totalDistance += euclideanDistance(currentNode.weights, neighborNode.weights);
            neighborCount++;
          }
        }
      }

      uMatrix[y][x] = neighborCount > 0 ? totalDistance / neighborCount : 0;
    }
  }

  return uMatrix;
}

/**
 * Map data points to SOM grid coordinates
 */
export function mapDataToGrid(
  data: number[][],
  nodes: SOMNode[]
): Array<{ x: number; y: number; dataIndex: number }> {
  return data.map((dataPoint, index) => {
    const bmu = findBestMatchingUnit(nodes, dataPoint);
    return {
      x: bmu.x,
      y: bmu.y,
      dataIndex: index
    };
  });
}

/**
 * Get component planes for visualization (one per input dimension)
 */
export function getComponentPlanes(
  nodes: SOMNode[],
  gridWidth: number,
  gridHeight: number
): number[][][] {
  const dimensions = nodes[0].weights.length;
  const componentPlanes: number[][][] = [];

  for (let dim = 0; dim < dimensions; dim++) {
    const plane: number[][] = [];
    
    for (let y = 0; y < gridHeight; y++) {
      plane[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        const nodeIndex = y * gridWidth + x;
        plane[y][x] = nodes[nodeIndex].weights[dim];
      }
    }
    
    componentPlanes.push(plane);
  }

  return componentPlanes;
}