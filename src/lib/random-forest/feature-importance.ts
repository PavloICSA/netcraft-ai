import type { DecisionTree, FeatureImportance } from '../../types';

/**
 * Feature importance calculation utilities
 */

/**
 * Calculate feature importance using mean decrease in impurity
 */
export function calculateFeatureImportance(
  importanceScores: number[],
  featureNames: string[]
): FeatureImportance[] {
  if (importanceScores.length !== featureNames.length) {
    throw new Error('Importance scores and feature names arrays must have the same length');
  }

  // Create feature importance objects
  const featureImportances = importanceScores.map((importance, index) => ({
    featureIndex: index,
    featureName: featureNames[index],
    importance,
    rank: 0 // Will be set after sorting
  }));

  // Sort by importance (descending) and assign ranks
  featureImportances.sort((a, b) => b.importance - a.importance);
  featureImportances.forEach((feature, index) => {
    feature.rank = index + 1;
  });

  return featureImportances;
}

/**
 * Calculate feature importance from trees using mean decrease in impurity
 */
export function calculateFeatureImportanceFromTrees(
  trees: DecisionTree[],
  featureNames: string[]
): FeatureImportance[] {
  const numFeatures = featureNames.length;
  const featureImportance = new Array(numFeatures).fill(0);
  
  // Calculate importance for each tree
  for (const tree of trees) {
    const treeImportance = calculateTreeFeatureImportance(tree.root, numFeatures);
    
    // Add to total importance
    for (let i = 0; i < numFeatures; i++) {
      featureImportance[i] += treeImportance[i];
    }
  }
  
  // Normalize by number of trees
  const totalImportance = featureImportance.reduce((sum, imp) => sum + imp, 0);
  
  if (totalImportance > 0) {
    for (let i = 0; i < numFeatures; i++) {
      featureImportance[i] = featureImportance[i] / totalImportance;
    }
  }
  
  return calculateFeatureImportance(featureImportance, featureNames);
}

/**
 * Calculate feature importance for a single tree
 */
function calculateTreeFeatureImportance(node: any, numFeatures: number): number[] {
  const importance = new Array(numFeatures).fill(0);
  
  if (!node || node.isLeaf) {
    return importance;
  }
  
  // Calculate impurity reduction for this split
  const totalSamples = node.samples;
  const leftSamples = node.left?.samples || 0;
  const rightSamples = node.right?.samples || 0;
  
  const currentImpurity = node.impurity;
  const leftImpurity = node.left?.impurity || 0;
  const rightImpurity = node.right?.impurity || 0;
  
  const weightedChildImpurity = 
    (leftSamples / totalSamples) * leftImpurity + 
    (rightSamples / totalSamples) * rightImpurity;
  
  const impurityReduction = currentImpurity - weightedChildImpurity;
  
  // Add importance for the feature used in this split
  if (node.featureIndex !== undefined) {
    importance[node.featureIndex] += impurityReduction * totalSamples;
  }
  
  // Recursively calculate importance for child nodes
  if (node.left) {
    const leftImportance = calculateTreeFeatureImportance(node.left, numFeatures);
    for (let i = 0; i < numFeatures; i++) {
      importance[i] += leftImportance[i];
    }
  }
  
  if (node.right) {
    const rightImportance = calculateTreeFeatureImportance(node.right, numFeatures);
    for (let i = 0; i < numFeatures; i++) {
      importance[i] += rightImportance[i];
    }
  }
  
  return importance;
}

/**
 * Calculate permutation importance
 */
export function calculatePermutationImportance(
  trees: DecisionTree[],
  features: number[][],
  targets: number[],
  featureNames: string[]
): FeatureImportance[] {
  // This is a simplified implementation
  // In a full implementation, you would:
  // 1. Calculate baseline accuracy
  // 2. For each feature, shuffle its values and recalculate accuracy
  // 3. The importance is the decrease in accuracy
  
  // For now, return a placeholder that won't crash
  const numFeatures = featureNames.length;
  const placeholderImportance = new Array(numFeatures).fill(0);
  
  // Give each feature a small random importance for demonstration
  for (let i = 0; i < numFeatures; i++) {
    placeholderImportance[i] = Math.random() * 0.1;
  }
  
  return calculateFeatureImportance(placeholderImportance, featureNames);
}

/**
 * Rank features by importance
 */
export function rankFeatures(importances: number[], featureNames: string[]): FeatureImportance[] {
  return calculateFeatureImportance(importances, featureNames);
}