import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  id: number;
  x: number;
  y: number;
  progress: number;
  type: 'input' | 'processing' | 'output';
}

/**
 * Animated data flow visualization showing AI processing pipeline
 */
const DataFlowAnimation: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);

  useEffect(() => {
    const createDataPoint = (id: number): DataPoint => ({
      id,
      x: -20,
      y: 50 + Math.random() * 100,
      progress: 0,
      type: 'input'
    });

    // Initialize with some data points
    const initialPoints = Array.from({ length: 3 }, (_, i) => createDataPoint(i));
    setDataPoints(initialPoints);

    // Add new data points periodically
    const interval = setInterval(() => {
      setDataPoints(prev => {
        const newPoints = prev
          .map(point => ({
            ...point,
            progress: point.progress + 0.02,
            type: (point.progress < 0.3 ? 'input' : 
                  point.progress < 0.7 ? 'processing' : 'output') as 'input' | 'processing' | 'output'
          }))
          .filter(point => point.progress < 1);

        // Add new point occasionally
        if (Math.random() < 0.3 && newPoints.length < 5) {
          newPoints.push(createDataPoint(Date.now()));
        }

        return newPoints;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getPointColor = (type: string, progress: number) => {
    switch (type) {
      case 'input':
        return '#3b82f6'; // Blue
      case 'processing':
        return '#8b5cf6'; // Purple
      case 'output':
        return '#10b981'; // Green
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <svg width="100%" height="100%" className="absolute inset-0">
        {/* Processing pipeline path */}
        <defs>
          <linearGradient id="pipelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Pipeline background */}
        <rect
          x="0"
          y="40%"
          width="100%"
          height="20%"
          fill="url(#pipelineGradient)"
          rx="20"
        />

        {/* Data points */}
        {dataPoints.map(point => {
          const x = point.progress * window.innerWidth;
          const size = point.type === 'processing' ? 8 : 6;
          
          return (
            <motion.circle
              key={point.id}
              cx={x}
              cy={point.y}
              r={size}
              fill={getPointColor(point.type, point.progress)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: point.type === 'processing' ? 0.8 : 0.6,
                r: size
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          );
        })}

        {/* Processing stages labels */}
        <text x="5%" y="35%" className="fill-slate-400 text-xs font-medium opacity-50">
          Data Input
        </text>
        <text x="45%" y="35%" className="fill-slate-400 text-xs font-medium opacity-50">
          AI Processing
        </text>
        <text x="85%" y="35%" className="fill-slate-400 text-xs font-medium opacity-50">
          Results
        </text>
      </svg>
    </div>
  );
};

export default DataFlowAnimation;