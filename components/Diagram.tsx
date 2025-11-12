import React from 'react';
import { DiagramData } from '../types';

interface DiagramProps {
  data: DiagramData;
}

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;
const V_SPACING = 70;
const H_SPACING = 50;
const PADDING = 20;

export const Diagram: React.FC<DiagramProps> = ({ data }) => {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return null;
  }

  const levels: { [key: number]: string[] } = {};
  const nodeLevels: { [key: string]: number } = {};
  const nodePositions: { [key: string]: { x: number; y: number } } = {};

  const nodes = data.nodes;
  const edges = data.edges || [];
  
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const adj: { [key: string]: string[] } = {};
  const inDegree: { [key: string]: number } = {};

  nodes.forEach(node => {
    adj[node.id] = [];
    inDegree[node.id] = 0;
  });

  edges.forEach(edge => {
    if(nodeMap.has(edge.from) && nodeMap.has(edge.to)){
        adj[edge.from].push(edge.to);
        inDegree[edge.to]++;
    }
  });

  const queue = nodes.filter(node => inDegree[node.id] === 0).map(n => n.id);
  let level = 0;
  
  while(queue.length > 0) {
      const levelSize = queue.length;
      levels[level] = [];
      for(let i=0; i<levelSize; i++) {
          const u = queue.shift()!;
          nodeLevels[u] = level;
          levels[level].push(u);
          adj[u]?.forEach(v => {
              inDegree[v]--;
              if(inDegree[v] === 0) {
                  queue.push(v);
              }
          })
      }
      level++;
  }

  const maxNodesPerLevel = Math.max(...Object.values(levels).map(l => l.length));
  const totalWidth = maxNodesPerLevel * (NODE_WIDTH + H_SPACING) - H_SPACING + 2 * PADDING;
  const totalHeight = Object.keys(levels).length * (NODE_HEIGHT + V_SPACING) - V_SPACING + 2 * PADDING;

  Object.entries(levels).forEach(([lvl, nodeIds]) => {
      const y = PADDING + parseInt(lvl) * (NODE_HEIGHT + V_SPACING);
      const levelWidth = nodeIds.length * (NODE_WIDTH + H_SPACING) - H_SPACING;
      const startX = (totalWidth - levelWidth) / 2;

      nodeIds.forEach((nodeId, i) => {
          const x = startX + i * (NODE_WIDTH + H_SPACING);
          nodePositions[nodeId] = { x, y };
      });
  });


  return (
    <svg width={totalWidth} height={totalHeight} className="font-sans">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
        </marker>
      </defs>

      {edges.map((edge, i) => {
        const fromPos = nodePositions[edge.from];
        const toPos = nodePositions[edge.to];
        if (!fromPos || !toPos) return null;

        const startX = fromPos.x + NODE_WIDTH / 2;
        const startY = fromPos.y + NODE_HEIGHT;
        const endX = toPos.x + NODE_WIDTH / 2;
        const endY = toPos.y;
        
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        return (
          <g key={`edge-${i}`}>
            <path
              d={`M${startX},${startY} L${endX},${endY}`}
              stroke="#4b5563"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />
            {edge.label && (
                <text x={midX} y={midY} fill="#9ca3af" fontSize="12" textAnchor="middle" dy="-5">
                    {edge.label}
                </text>
            )}
          </g>
        );
      })}

      {nodes.map(node => {
        const pos = nodePositions[node.id];
        if (!pos) return null;
        return (
          <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
            <rect
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              rx="8"
              fill="#1f2937"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <foreignObject width={NODE_WIDTH} height={NODE_HEIGHT}>
                <div className="flex items-center justify-center h-full text-center p-2 text-sm text-gray-200 leading-tight">
                    {node.label}
                </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
};
