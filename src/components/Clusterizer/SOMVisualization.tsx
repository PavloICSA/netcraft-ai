import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { SOMResult } from '../../lib/cluster/som';
import { calculateUMatrix, getComponentPlanes, mapDataToGrid } from '../../lib/cluster/som';
import { downloadElementAsImage } from '../../utils';
import Button from '../Common/Button';

interface SOMVisualizationProps {
  somResult: SOMResult;
  originalData: number[][];
  showUMatrix?: boolean;
  showComponentPlanes?: boolean;
  showDataMapping?: boolean;
}

/**
 * Self-Organizing Map visualization component
 */
const SOMVisualization: React.FC<SOMVisualizationProps> = ({
  somResult,
  originalData,
  showUMatrix = true,
  showComponentPlanes = false,
  showDataMapping = true
}) => {
  const { nodes, gridSize, quantizationError, topographicError } = somResult;
  const [gridWidth, gridHeight] = gridSize;
  
  // Refs for download functionality
  const uMatrixRef = useRef<HTMLDivElement>(null);
  const dataMappingRef = useRef<HTMLDivElement>(null);
  const componentPlanesRef = useRef<HTMLDivElement>(null);

  // Calculate visualization data
  const uMatrix = useMemo(() => 
    calculateUMatrix(nodes, gridWidth, gridHeight), 
    [nodes, gridWidth, gridHeight]
  );

  const componentPlanes = useMemo(() => 
    getComponentPlanes(nodes, gridWidth, gridHeight), 
    [nodes, gridWidth, gridHeight]
  );

  const dataMapping = useMemo(() => 
    mapDataToGrid(originalData, nodes), 
    [originalData, nodes]
  );

  // Color mapping functions
  const getUMatrixColor = (value: number, min: number, max: number): string => {
    const normalized = (value - min) / (max - min);
    const intensity = Math.floor(255 * (1 - normalized)); // Darker = higher distance
    return `rgb(${intensity}, ${intensity}, ${intensity})`;
  };

  const getComponentColor = (value: number, min: number, max: number): string => {
    const normalized = (value - min) / (max - min);
    const red = Math.floor(255 * normalized);
    const blue = Math.floor(255 * (1 - normalized));
    return `rgb(${red}, 0, ${blue})`;
  };

  const getDataPointColor = (clusterIndex: number): string => {
    const colors = [
      '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', 
      '#EF4444', '#06B6D4', '#84CC16', '#F97316'
    ];
    return colors[clusterIndex % colors.length];
  };

  // Download handlers
  const handleDownloadUMatrix = (format: 'png' | 'jpeg' | 'svg') => {
    if (uMatrixRef.current) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      downloadElementAsImage(uMatrixRef.current, `som-umatrix-${timestamp}`, format);
    }
  };

  const handleDownloadDataMapping = (format: 'png' | 'jpeg' | 'svg') => {
    if (dataMappingRef.current) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      downloadElementAsImage(dataMappingRef.current, `som-data-mapping-${timestamp}`, format);
    }
  };

  const handleDownloadComponentPlanes = (format: 'png' | 'jpeg' | 'svg') => {
    if (componentPlanesRef.current) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      downloadElementAsImage(componentPlanesRef.current, `som-component-planes-${timestamp}`, format);
    }
  };

  // Calculate min/max for normalization
  const uMatrixFlat = uMatrix.flat();
  const uMatrixMin = Math.min(...uMatrixFlat);
  const uMatrixMax = Math.max(...uMatrixFlat);

  return (
    <div className="space-y-6">
      {/* SOM Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">Quantization Error</h4>
          <p className="text-2xl font-bold text-blue-700">{quantizationError.toFixed(4)}</p>
          <p className="text-sm text-blue-600">Average distance to BMU</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-1">Topographic Error</h4>
          <p className="text-2xl font-bold text-purple-700">{(topographicError * 100).toFixed(2)}%</p>
          <p className="text-sm text-purple-600">Non-adjacent BMU pairs</p>
        </div>
      </div>

      {/* U-Matrix Visualization */}
      {showUMatrix && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg border border-secondary-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-secondary-900">U-Matrix (Distance Map)</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadUMatrix('png')}
                className="text-xs flex items-center gap-1"
                title="Download as PNG"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadUMatrix('svg')}
                className="text-xs flex items-center gap-1"
                title="Download as SVG"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                SVG
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div 
              ref={uMatrixRef}
              className="grid gap-1 p-4 bg-secondary-50 rounded-lg"
              style={{ 
                gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
                maxWidth: '400px'
              }}
            >
              {uMatrix.map((row, y) =>
                row.map((value, x) => (
                  <div
                    key={`${x}-${y}`}
                    className="w-8 h-8 border border-secondary-300 flex items-center justify-center text-xs font-mono"
                    style={{
                      backgroundColor: getUMatrixColor(value, uMatrixMin, uMatrixMax),
                      color: value > (uMatrixMin + uMatrixMax) / 2 ? 'white' : 'black'
                    }}
                    title={`Node (${x}, ${y}): ${value.toFixed(3)}`}
                  >
                    {value.toFixed(2)}
                  </div>
                ))
              )}
            </div>
            <p className="text-sm text-secondary-600 mt-2">
              Darker cells indicate higher distances between neighboring nodes
            </p>
          </div>
        </motion.div>
      )}

      {/* Data Point Mapping */}
      {showDataMapping && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg border border-secondary-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-secondary-900">Data Point Distribution</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadDataMapping('png')}
                className="text-xs flex items-center gap-1"
                title="Download as PNG"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadDataMapping('svg')}
                className="text-xs flex items-center gap-1"
                title="Download as SVG"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                SVG
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div 
              ref={dataMappingRef}
              className="grid gap-1 p-4 bg-secondary-50 rounded-lg relative"
              style={{ 
                gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
                maxWidth: '400px'
              }}
            >
              {/* Grid cells */}
              {Array.from({ length: gridHeight }, (_, y) =>
                Array.from({ length: gridWidth }, (_, x) => {
                  const pointsInCell = dataMapping.filter(point => point.x === x && point.y === y);
                  const clusterCounts = pointsInCell.reduce((acc, point) => {
                    const cluster = somResult.clusters[point.dataIndex];
                    acc[cluster] = (acc[cluster] || 0) + 1;
                    return acc;
                  }, {} as Record<number, number>);
                  
                  const dominantCluster = Object.entries(clusterCounts)
                    .sort(([,a], [,b]) => b - a)[0]?.[0];

                  return (
                    <div
                      key={`${x}-${y}`}
                      className="w-8 h-8 border border-secondary-300 flex items-center justify-center text-xs font-bold relative"
                      style={{
                        backgroundColor: dominantCluster !== undefined 
                          ? getDataPointColor(parseInt(dominantCluster)) + '40'
                          : '#f8f9fa'
                      }}
                      title={`Cell (${x}, ${y}): ${pointsInCell.length} points`}
                    >
                      {pointsInCell.length > 0 && (
                        <span className="text-secondary-700">
                          {pointsInCell.length}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-sm text-secondary-600 mt-2">
              Numbers show data points per cell, colors indicate dominant cluster
            </p>
          </div>
        </motion.div>
      )}

      {/* Component Planes */}
      {showComponentPlanes && componentPlanes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg border border-secondary-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-secondary-900">Component Planes</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadComponentPlanes('png')}
                className="text-xs flex items-center gap-1"
                title="Download as PNG"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PNG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadComponentPlanes('svg')}
                className="text-xs flex items-center gap-1"
                title="Download as SVG"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                SVG
              </Button>
            </div>
          </div>
          <div ref={componentPlanesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {componentPlanes.slice(0, 6).map((plane, dimIndex) => {
              const planeFlat = plane.flat();
              const planeMin = Math.min(...planeFlat);
              const planeMax = Math.max(...planeFlat);
              
              return (
                <div key={dimIndex} className="text-center">
                  <h5 className="font-medium text-secondary-700 mb-2">
                    Feature {dimIndex + 1}
                  </h5>
                  <div 
                    className="grid gap-1 p-2 bg-secondary-50 rounded-lg mx-auto"
                    style={{ 
                      gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
                      maxWidth: '200px'
                    }}
                  >
                    {plane.map((row, y) =>
                      row.map((value, x) => (
                        <div
                          key={`${x}-${y}`}
                          className="w-4 h-4 border border-secondary-200"
                          style={{
                            backgroundColor: getComponentColor(value, planeMin, planeMax)
                          }}
                          title={`Feature ${dimIndex + 1} at (${x}, ${y}): ${value.toFixed(3)}`}
                        />
                      ))
                    )}
                  </div>
                  <p className="text-xs text-secondary-500 mt-1">
                    Range: {planeMin.toFixed(2)} - {planeMax.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
          {componentPlanes.length > 6 && (
            <p className="text-sm text-secondary-500 mt-4 text-center">
              Showing first 6 of {componentPlanes.length} features
            </p>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="bg-secondary-50 p-4 rounded-lg">
        <h4 className="font-medium text-secondary-900 mb-2">Legend</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>U-Matrix:</strong> Shows distances between neighboring nodes. 
            Darker areas indicate cluster boundaries.
          </div>
          <div>
            <strong>Data Distribution:</strong> Shows how many data points map to each grid cell.
            Colors indicate the dominant cluster in each cell.
          </div>
          {showComponentPlanes && (
            <div className="md:col-span-2">
              <strong>Component Planes:</strong> Show the weight values for each input feature across the grid.
              Red indicates high values, blue indicates low values.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOMVisualization;