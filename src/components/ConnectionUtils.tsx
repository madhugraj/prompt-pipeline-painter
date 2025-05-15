
import React from 'react';
import { PipelineNode, Connection, Position, ConnectionType } from '@/lib/pipeline-types';

export const getPortPosition = (nodeId: string, portId: string, isOutput: boolean): Position | null => {
  const node = document.querySelector(`[data-node-id="${nodeId}"]`);
  if (!node) return null;
  
  const nodeRect = node.getBoundingClientRect();
  const port = node.querySelector(`[data-port-id="${portId}"]`);
  
  if (!port) return null;
  
  const portRect = port.getBoundingClientRect();
  
  // Calculate position relative to the node
  return {
    x: isOutput ? nodeRect.width : 0,
    y: portRect.top - nodeRect.top + portRect.height / 2
  };
};

export const isPortCompatible = (sourceNode: PipelineNode, targetNode: PipelineNode, sourcePortId: string, targetPortId: string): boolean => {
  // Simple compatibility check - in a real app, this would be more sophisticated
  return true;
};

interface ConnectionLineProps {
  connection: Connection;
  nodes: PipelineNode[];
  animated?: boolean;
  selected?: boolean;
  onDelete: (id: string) => void;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection, nodes, animated = false, selected = false, onDelete }) => {
  const sourceNode = nodes.find(node => node.id === connection.source);
  const targetNode = nodes.find(node => node.id === connection.target);
  
  if (!sourceNode || !targetNode) return null;
  
  // Calculate positions
  const sourcePosition = getPortPosition(connection.source, connection.sourceHandle || 'output', true);
  const targetPosition = getPortPosition(connection.target, connection.targetHandle || 'input', false);
  
  if (!sourcePosition || !targetPosition) return null;
  
  // Adjust positions based on node positions
  const startX = sourceNode.position.x + sourcePosition.x;
  const startY = sourceNode.position.y + sourcePosition.y;
  const endX = targetNode.position.x + targetPosition.x;
  const endY = targetNode.position.y + targetPosition.y;
  
  // Calculate control points for the bezier curve
  const midX = (startX + endX) / 2;
  
  // Create the SVG path
  const path = `
    M ${startX} ${startY} 
    C ${startX + 50} ${startY}, ${endX - 50} ${endY}, ${endX} ${endY}
  `;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(connection.id);
  };
  
  return (
    <g>
      <path
        d={path}
        stroke={selected ? '#ff3e00' : '#aaa'}
        strokeWidth={2}
        fill="none"
        strokeDasharray={animated ? "5,5" : ""}
        className={animated ? "animate-dash" : ""}
      />
      
      {/* Connection label */}
      <text
        x={midX}
        y={((startY + endY) / 2) - 10}
        textAnchor="middle"
        fill="#666"
        fontSize={12}
        pointerEvents="none"
      >
        {connection.type}
      </text>
      
      {/* Delete button - only show when selected */}
      {selected && (
        <g transform={`translate(${midX - 10}, ${(startY + endY) / 2 - 10})`} onClick={handleDelete} className="cursor-pointer">
          <circle cx="10" cy="10" r="8" fill="white" stroke="#ff3e00" />
          <text x="10" y="14" textAnchor="middle" fontSize="14" fill="#ff3e00">×</text>
        </g>
      )}
    </g>
  );
};

export default ConnectionLine;
