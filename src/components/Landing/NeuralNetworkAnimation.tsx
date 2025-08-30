import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  x: number;
  y: number;
  layer: number;
  active: boolean;
}

interface Connection {
  from: string;
  to: string;
  weight: number;
  active: boolean;
}

/**
 * Animated neural network visualization for the landing page
 */
const NeuralNetworkAnimation: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentPulse, setCurrentPulse] = useState(0);

  // Initialize network structure
  useEffect(() => {
    const layers = [3, 4, 4, 2]; // Input, hidden1, hidden2, output
    const newNodes: Node[] = [];
    const newConnections: Connection[] = [];

    // Create nodes
    layers.forEach((nodeCount, layerIndex) => {
      for (let i = 0; i < nodeCount; i++) {
        const x = (layerIndex * 120) + 40;
        const y = (i * 60) + (120 - (nodeCount - 1) * 30);
        
        newNodes.push({
          id: `${layerIndex}-${i}`,
          x,
          y,
          layer: layerIndex,
          active: false
        });
      }
    });

    // Create connections
    for (let layer = 0; layer < layers.length - 1; layer++) {
      const currentLayerNodes = newNodes.filter(n => n.layer === layer);
      const nextLayerNodes = newNodes.filter(n => n.layer === layer + 1);

      currentLayerNodes.forEach(fromNode => {
        nextLayerNodes.forEach(toNode => {
          newConnections.push({
            from: fromNode.id,
            to: toNode.id,
            weight: Math.random() * 0.8 + 0.2,
            active: false
          });
        });
      });
    }

    setNodes(newNodes);
    setConnections(newConnections);
  }, []);

  // Animate forward pass
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPulse(prev => (prev + 1) % 4);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Update active states based on current pulse
  useEffect(() => {
    setNodes(prev => prev.map(node => ({
      ...node,
      active: node.layer <= currentPulse
    })));

    setConnections(prev => {
      return prev.map(conn => {
        // Parse layer info from connection IDs
        const fromLayer = parseInt(conn.from.split('-')[0]);
        const toLayer = parseInt(conn.to.split('-')[0]);
        
        return {
          ...conn,
          active: fromLayer === currentPulse && toLayer === currentPulse + 1
        };
      });
    });
  }, [currentPulse]);

  return (
    <div className="relative w-full h-64 flex items-center justify-center opacity-20">
      <svg
        width="400"
        height="240"
        viewBox="0 0 400 240"
        className="absolute"
      >
        {/* Connections */}
        {connections.map((conn, index) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={conn.active ? '#6366f1' : '#e2e8f0'}
              strokeWidth={conn.active ? 2 : 1}
              opacity={conn.active ? 0.8 : 0.3}
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                stroke: conn.active ? '#6366f1' : '#e2e8f0',
                strokeWidth: conn.active ? 2 : 1,
                opacity: conn.active ? 0.8 : 0.3
              }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.01
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.active ? 8 : 6}
            fill={node.active ? '#6366f1' : '#cbd5e1'}
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              r: node.active ? 8 : 6,
              fill: node.active ? '#6366f1' : '#cbd5e1'
            }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.05
            }}
          />
        ))}

        {/* Layer labels */}
        <text x="40" y="220" className="fill-slate-400 text-xs font-medium">Input</text>
        <text x="140" y="220" className="fill-slate-400 text-xs font-medium">Hidden</text>
        <text x="260" y="220" className="fill-slate-400 text-xs font-medium">Hidden</text>
        <text x="340" y="220" className="fill-slate-400 text-xs font-medium">Output</text>
      </svg>
    </div>
  );
};

export default NeuralNetworkAnimation;