import type { DecisionTreeNode, DecisionTree as DecisionTreeType } from '../../types';

/**
 * Decision Tree implementation using CART algorithm
 */
export class DecisionTree {
  private config: {
    maxDepth: number;
    minSamplesLeaf: number;
    taskType: 'regression' | 'classification';
  };
  private root: DecisionTreeNode | null = null;
  private featureIndices: number[] = [];
  private oobIndices: number[] = [];

  constructor(config: { maxDepth: number; minSamplesLeaf: number; taskType: 'regression' | 'classification' }) {
    this.config = config;
  }

  /**
   * Train the decision tree using CART algorithm
   */
  train(features: number[][], targets: number[], featureIndices: number[], oobIndices: number[] = []): DecisionTreeType {
    this.featureIndices = featureIndices;
    this.oobIndices = oobIndices;
    
    // Create sample indices for training
    const sampleIndices = Array.from({ length: features.length }, (_, i) => i);
    
    // Build the tree recursively
    this.root = this.buildTree(features, targets, sampleIndices, 0);
    
    return this.getTree()!;
  }

  /**
   * Recursively build the decision tree
   */
  private buildTree(
    features: number[][],
    targets: number[],
    sampleIndices: number[],
    depth: number
  ): DecisionTreeNode {
    const samples = sampleIndices.length;
    
    // Calculate impurity for current node
    const impurity = this.calculateImpurity(targets, sampleIndices);
    
    // Base cases for stopping recursion
    if (
      depth >= this.config.maxDepth ||
      samples < this.config.minSamplesLeaf * 2 ||
      impurity === 0 ||
      this.isPure(targets, sampleIndices)
    ) {
      return this.createLeafNode(targets, sampleIndices, impurity);
    }

    // Find the best split
    const bestSplit = this.findBestSplit(features, targets, sampleIndices);
    
    if (!bestSplit) {
      return this.createLeafNode(targets, sampleIndices, impurity);
    }

    // Split the data
    const { leftIndices, rightIndices } = this.splitData(
      features,
      sampleIndices,
      bestSplit.featureIndex,
      bestSplit.threshold
    );

    // Check if split is valid
    if (leftIndices.length < this.config.minSamplesLeaf || rightIndices.length < this.config.minSamplesLeaf) {
      return this.createLeafNode(targets, sampleIndices, impurity);
    }

    // Create internal node and recursively build children
    const node: DecisionTreeNode = {
      isLeaf: false,
      featureIndex: bestSplit.featureIndex,
      threshold: bestSplit.threshold,
      samples,
      impurity,
      left: this.buildTree(features, targets, leftIndices, depth + 1),
      right: this.buildTree(features, targets, rightIndices, depth + 1)
    };

    return node;
  }

  /**
   * Find the best split for the current node
   */
  private findBestSplit(
    features: number[][],
    targets: number[],
    sampleIndices: number[]
  ): { featureIndex: number; threshold: number; impurityReduction: number } | null {
    let bestSplit: { featureIndex: number; threshold: number; impurityReduction: number } | null = null;
    let bestImpurityReduction = 0;

    const currentImpurity = this.calculateImpurity(targets, sampleIndices);

    // Try each feature
    for (const featureIndex of this.featureIndices) {
      // Get unique values for this feature
      const featureValues = sampleIndices.map(i => features[i][featureIndex]);
      const uniqueValues = [...new Set(featureValues)].sort((a, b) => a - b);

      // Try each possible threshold
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;

        // Split the data
        const { leftIndices, rightIndices } = this.splitData(features, sampleIndices, featureIndex, threshold);

        if (leftIndices.length === 0 || rightIndices.length === 0) continue;

        // Calculate weighted impurity after split
        const leftImpurity = this.calculateImpurity(targets, leftIndices);
        const rightImpurity = this.calculateImpurity(targets, rightIndices);
        
        const leftWeight = leftIndices.length / sampleIndices.length;
        const rightWeight = rightIndices.length / sampleIndices.length;
        
        const weightedImpurity = leftWeight * leftImpurity + rightWeight * rightImpurity;
        const impurityReduction = currentImpurity - weightedImpurity;

        if (impurityReduction > bestImpurityReduction) {
          bestImpurityReduction = impurityReduction;
          bestSplit = { featureIndex, threshold, impurityReduction };
        }
      }
    }

    return bestSplit;
  }

  /**
   * Split data based on feature and threshold
   */
  private splitData(
    features: number[][],
    sampleIndices: number[],
    featureIndex: number,
    threshold: number
  ): { leftIndices: number[]; rightIndices: number[] } {
    const leftIndices: number[] = [];
    const rightIndices: number[] = [];

    for (const index of sampleIndices) {
      if (features[index][featureIndex] <= threshold) {
        leftIndices.push(index);
      } else {
        rightIndices.push(index);
      }
    }

    return { leftIndices, rightIndices };
  }

  /**
   * Calculate impurity (Gini for classification, MSE for regression)
   */
  private calculateImpurity(targets: number[], sampleIndices: number[]): number {
    if (sampleIndices.length === 0) return 0;

    if (this.config.taskType === 'classification') {
      return this.calculateGiniImpurity(targets, sampleIndices);
    } else {
      return this.calculateMSE(targets, sampleIndices);
    }
  }

  /**
   * Calculate Gini impurity for classification
   */
  private calculateGiniImpurity(targets: number[], sampleIndices: number[]): number {
    const classCounts = new Map<number, number>();
    
    // Count classes
    for (const index of sampleIndices) {
      const target = targets[index];
      classCounts.set(target, (classCounts.get(target) || 0) + 1);
    }

    const totalSamples = sampleIndices.length;
    let gini = 1.0;

    // Calculate Gini impurity
    for (const count of classCounts.values()) {
      const probability = count / totalSamples;
      gini -= probability * probability;
    }

    return gini;
  }

  /**
   * Calculate Mean Squared Error for regression
   */
  private calculateMSE(targets: number[], sampleIndices: number[]): number {
    if (sampleIndices.length === 0) return 0;

    // Calculate mean
    const sum = sampleIndices.reduce((acc, index) => acc + targets[index], 0);
    const mean = sum / sampleIndices.length;

    // Calculate MSE
    const mse = sampleIndices.reduce((acc, index) => {
      const diff = targets[index] - mean;
      return acc + diff * diff;
    }, 0) / sampleIndices.length;

    return mse;
  }

  /**
   * Check if the node is pure (all targets are the same)
   */
  private isPure(targets: number[], sampleIndices: number[]): boolean {
    if (sampleIndices.length <= 1) return true;
    
    const firstTarget = targets[sampleIndices[0]];
    return sampleIndices.every(index => targets[index] === firstTarget);
  }

  /**
   * Create a leaf node
   */
  private createLeafNode(targets: number[], sampleIndices: number[], impurity: number): DecisionTreeNode {
    let prediction: number | number[];

    if (this.config.taskType === 'classification') {
      // For classification, return class probabilities
      const classCounts = new Map<number, number>();
      
      for (const index of sampleIndices) {
        const target = targets[index];
        classCounts.set(target, (classCounts.get(target) || 0) + 1);
      }

      // Find the most common class
      let maxCount = 0;
      let majorityClass = 0;
      
      for (const [classLabel, count] of classCounts.entries()) {
        if (count > maxCount) {
          maxCount = count;
          majorityClass = classLabel;
        }
      }

      prediction = majorityClass;
    } else {
      // For regression, return the mean
      const sum = sampleIndices.reduce((acc, index) => acc + targets[index], 0);
      prediction = sum / sampleIndices.length;
    }

    return {
      isLeaf: true,
      prediction,
      samples: sampleIndices.length,
      impurity
    };
  }

  /**
   * Make prediction with the tree
   */
  predict(features: number[]): number | number[] {
    if (!this.root) {
      throw new Error('Tree has not been trained yet');
    }

    return this.traverseTree(this.root, features);
  }

  /**
   * Traverse the tree to make a prediction
   */
  private traverseTree(node: DecisionTreeNode, features: number[]): number | number[] {
    if (node.isLeaf) {
      return node.prediction!;
    }

    const featureValue = features[node.featureIndex!];
    
    if (featureValue <= node.threshold!) {
      return this.traverseTree(node.left!, features);
    } else {
      return this.traverseTree(node.right!, features);
    }
  }

  /**
   * Get the tree structure
   */
  getTree(): DecisionTreeType | null {
    if (!this.root) return null;
    
    return {
      root: this.root,
      config: this.config,
      featureIndices: this.featureIndices,
      oobIndices: this.oobIndices
    };
  }
}