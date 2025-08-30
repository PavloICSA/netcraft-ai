import type { RandomForestConfig, RandomForestModel, RandomForestPrediction, DecisionTree as DecisionTreeType } from '../../types';
import { DecisionTree } from './DecisionTree';
import { 
  createBootstrapSample, 
  getFeatureSampleSize, 
  sampleFeatures, 
  aggregatePredictions, 
  calculatePredictionConfidence 
} from './rf-utils';

/**
 * Random Forest implementation for ensemble learning
 */
export class RandomForest {
  private config: RandomForestConfig;
  private model: RandomForestModel | null = null;

  constructor(config: RandomForestConfig) {
    this.config = config;
  }

  /**
   * Train the Random Forest model
   */
  async train(
    features: number[][], 
    targets: number[], 
    featureNames: string[], 
    onProgress?: (progress: number, treesCompleted: number) => void
  ): Promise<RandomForestModel> {
    const startTime = Date.now();
    const trees: DecisionTreeType[] = [];
    const treesCompleted: number[] = [];
    const oobScores: number[] = [];
    
    // Calculate feature sample size
    const featureSampleSize = getFeatureSampleSize(features[0].length, this.config.featureSamplingRatio);
    
    // Determine max depth
    const maxDepth = this.config.maxDepth === 'auto' 
      ? Math.floor(Math.log2(features.length)) + 1 
      : this.config.maxDepth;

    // Train each tree
    for (let treeIndex = 0; treeIndex < this.config.numTrees; treeIndex++) {
      // Create bootstrap sample
      const { indices: bootstrapIndices, oobIndices } = createBootstrapSample(
        features.length, 
        this.config.bootstrapSampleRatio
      );

      // Sample features for this tree
      const selectedFeatures = sampleFeatures(features[0].length, featureSampleSize);

      // Create and train decision tree
      const tree = new DecisionTree({
        maxDepth,
        minSamplesLeaf: this.config.minSamplesLeaf,
        taskType: this.config.taskType
      });

      // Create bootstrap sample data
      const bootstrapFeatures = bootstrapIndices.map(i => features[i]);
      const bootstrapTargets = bootstrapIndices.map(i => targets[i]);

      // Train the tree
      const trainedTree = tree.train(bootstrapFeatures, bootstrapTargets, selectedFeatures, oobIndices);
      trees.push(trainedTree);

      // Calculate OOB score for this tree if we have OOB samples
      let oobScore = 0;
      if (oobIndices.length > 0) {
        oobScore = this.calculateOOBScore(trees, features, targets, oobIndices);
      }
      oobScores.push(oobScore);

      treesCompleted.push(treeIndex + 1);

      // Report progress
      if (onProgress) {
        const progress = ((treeIndex + 1) / this.config.numTrees) * 100;
        onProgress(progress, treeIndex + 1);
      }

      // Allow UI to update by yielding control
      if (treeIndex % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    const trainingTime = Date.now() - startTime;

    // Calculate final OOB score using all trees
    const finalOOBScore = this.calculateFinalOOBScore(trees, features, targets);

    // Calculate feature importance based on impurity reduction
    const featureImportance = this.calculateFeatureImportance(trees, features[0].length);

    this.model = {
      config: this.config,
      trees,
      featureImportance,
      oobScore: finalOOBScore,
      trained: true,
      trainingHistory: {
        treesCompleted,
        oobScores,
        trainingTime
      }
    };

    return this.model;
  }

  /**
   * Make prediction for a single sample
   */
  predict(features: number[]): RandomForestPrediction {
    if (!this.model || !this.model.trained) {
      throw new Error('Model has not been trained yet');
    }

    // Get predictions from all trees
    const treePredictions: (number | number[])[] = [];
    const treeVotes: number[] = [];

    for (const tree of this.model.trees) {
      const treeInstance = new DecisionTree(tree.config);
      // Set the tree's root directly for prediction
      (treeInstance as any).root = tree.root;
      
      const prediction = treeInstance.predict(features);
      treePredictions.push(prediction);
      
      // Store individual tree votes for transparency
      if (typeof prediction === 'number') {
        treeVotes.push(prediction);
      }
    }

    // Aggregate predictions
    const finalPrediction = aggregatePredictions(treePredictions, this.config.taskType);
    
    // Calculate confidence
    const confidence = calculatePredictionConfidence(treePredictions, this.config.taskType);

    return {
      prediction: finalPrediction,
      confidence,
      treeVotes: treeVotes.length > 0 ? treeVotes : undefined
    };
  }

  /**
   * Make batch predictions with the trained model
   */
  predictBatch(features: number[][]): RandomForestPrediction[] {
    if (!this.model || !this.model.trained) {
      throw new Error('Model has not been trained yet');
    }

    return features.map(sampleFeatures => this.predict(sampleFeatures));
  }

  /**
   * Serialize the model to JSON
   */
  serialize(): RandomForestModel {
    if (!this.model) {
      throw new Error('No model to serialize');
    }
    return JSON.parse(JSON.stringify(this.model));
  }

  /**
   * Deserialize a model from RandomForestModel
   */
  static deserialize(model: RandomForestModel): RandomForest {
    const rf = new RandomForest(model.config);
    rf.model = JSON.parse(JSON.stringify(model));
    return rf;
  }

  /**
   * Get the trained model
   */
  getModel(): RandomForestModel | null {
    return this.model;
  }

  /**
   * Calculate Out-of-Bag score for current trees
   */
  private calculateOOBScore(
    trees: DecisionTreeType[], 
    features: number[][], 
    targets: number[], 
    oobIndices: number[]
  ): number {
    if (oobIndices.length === 0 || trees.length === 0) return 0;

    let correctPredictions = 0;
    let totalPredictions = 0;

    for (const sampleIndex of oobIndices) {
      const sampleFeatures = features[sampleIndex];
      const actualTarget = targets[sampleIndex];

      // Get predictions from trees that didn't see this sample
      const treePredictions: (number | number[])[] = [];
      
      for (const tree of trees) {
        if (tree.oobIndices.includes(sampleIndex)) {
          const treeInstance = new DecisionTree(tree.config);
          (treeInstance as any).root = tree.root;
          
          const prediction = treeInstance.predict(sampleFeatures);
          treePredictions.push(prediction);
        }
      }

      if (treePredictions.length > 0) {
        const aggregatedPrediction = aggregatePredictions(treePredictions, this.config.taskType);
        
        if (this.config.taskType === 'classification') {
          if (aggregatedPrediction === actualTarget) {
            correctPredictions++;
          }
        } else {
          // For regression, we'll use a simple threshold-based accuracy
          const error = Math.abs((aggregatedPrediction as number) - actualTarget);
          const threshold = 0.1 * Math.abs(actualTarget); // 10% tolerance
          if (error <= threshold) {
            correctPredictions++;
          }
        }
        totalPredictions++;
      }
    }

    return totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
  }

  /**
   * Calculate feature importance based on mean decrease in impurity
   */
  private calculateFeatureImportance(trees: DecisionTreeType[], numFeatures: number): number[] {
    const featureImportance = new Array(numFeatures).fill(0);
    
    // Calculate importance for each tree
    for (const tree of trees) {
      const treeImportance = this.calculateTreeFeatureImportance(tree.root, numFeatures);
      
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
    
    return featureImportance;
  }

  /**
   * Calculate feature importance for a single tree
   */
  private calculateTreeFeatureImportance(node: DecisionTreeType['root'], numFeatures: number): number[] {
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
      const leftImportance = this.calculateTreeFeatureImportance(node.left, numFeatures);
      for (let i = 0; i < numFeatures; i++) {
        importance[i] += leftImportance[i];
      }
    }
    
    if (node.right) {
      const rightImportance = this.calculateTreeFeatureImportance(node.right, numFeatures);
      for (let i = 0; i < numFeatures; i++) {
        importance[i] += rightImportance[i];
      }
    }
    
    return importance;
  }

  /**
   * Calculate final OOB score using all trees
   */
  private calculateFinalOOBScore(trees: DecisionTreeType[], features: number[][], targets: number[]): number {
    if (trees.length === 0) return 0;

    // Collect all unique OOB indices across all trees
    const allOOBIndices = new Set<number>();
    for (const tree of trees) {
      tree.oobIndices.forEach(index => allOOBIndices.add(index));
    }

    if (allOOBIndices.size === 0) return 0;

    let correctPredictions = 0;
    let totalPredictions = 0;

    for (const sampleIndex of allOOBIndices) {
      const sampleFeatures = features[sampleIndex];
      const actualTarget = targets[sampleIndex];

      // Get predictions from trees that didn't see this sample during training
      const treePredictions: (number | number[])[] = [];
      
      for (const tree of trees) {
        if (tree.oobIndices.includes(sampleIndex)) {
          const treeInstance = new DecisionTree(tree.config);
          (treeInstance as any).root = tree.root;
          
          const prediction = treeInstance.predict(sampleFeatures);
          treePredictions.push(prediction);
        }
      }

      if (treePredictions.length > 0) {
        const aggregatedPrediction = aggregatePredictions(treePredictions, this.config.taskType);
        
        if (this.config.taskType === 'classification') {
          if (aggregatedPrediction === actualTarget) {
            correctPredictions++;
          }
        } else {
          // For regression, calculate R² or use MSE-based metric
          const error = Math.abs((aggregatedPrediction as number) - actualTarget);
          const threshold = 0.1 * Math.abs(actualTarget); // 10% tolerance
          if (error <= threshold) {
            correctPredictions++;
          }
        }
        totalPredictions++;
      }
    }

    return totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
  }
}