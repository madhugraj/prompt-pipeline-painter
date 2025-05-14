
import React from 'react';
import { Connection, ConnectionType } from '@/lib/pipeline-types';
import { getConnectionLabel } from '@/lib/port-configurations';

interface ConnectionLineProps {
  connection: Connection;
  sourcePosition: { x: number, y: number };
  targetPosition: { x: number, y: number };
  onDelete: (id: string) => void;
  selected: boolean;
}

const getConnectionColor = (type: ConnectionType): string => {
  switch (type) {
    case ConnectionType.DATA: return 'rgba(100, 100, 100, 0.8)';
    case ConnectionType.CONTROL: return 'rgba(255, 165, 0, 0.8)';
    case ConnectionType.TEXT: return 'rgba(0, 128, 255, 0.8)';
    case ConnectionType.EMBEDDING: return 'rgba(128, 0, 255, 0.8)';
    case ConnectionType.VECTOR: return 'rgba(255, 0, 128, 0.8)';
    case ConnectionType.QUERY: return 'rgba(0, 200, 100, 0.8)';
    case ConnectionType.RESULT: return 'rgba(200, 0, 100, 0.8)';
    case ConnectionType.DOCUMENT: return 'rgba(200, 150, 0, 0.8)';
    case ConnectionType.CONFIG: return 'rgba(100, 100, 200, 0.8)';
    default: return 'rgba(100, 100, 100, 0.8)';
  }
};

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  sourcePosition,
  targetPosition,
  onDelete,
  selected
}) => {
  const connectionColor = getConnectionColor(connection.type);
  const connectionLabel = connection.label || getConnectionLabel(connection.type);
  
  // Calculate the path for the bezier curve
  const dx = Math.abs(targetPosition.x - sourcePosition.x);
  const offsetX = Math.min(dx * 0.5, 150);
  
  // Path as a bezier curve from source to target
  const path = `M ${sourcePosition.x} ${sourcePosition.y} C ${sourcePosition.x + offsetX} ${sourcePosition.y}, ${targetPosition.x - offsetX} ${targetPosition.y}, ${targetPosition.x} ${targetPosition.y}`;
  
  // Calculate the midpoint for the label
  const midX = (sourcePosition.x + targetPosition.x) / 2;
  const midY = (sourcePosition.y + targetPosition.y) / 2;
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(connection.id);
  };
  
  return (
    <g>
      {/* Connection path with animation */}
      <path 
        d={path} 
        stroke={connectionColor}
        strokeWidth={selected ? 3 : 2}
        fill="none"
        strokeDasharray={connection.type === ConnectionType.CONTROL ? "4 2" : ""}
        className={`connection-line ${selected ? 'selected-connection' : ''}`}
        style={{
          filter: selected ? 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' : 'none',
        }}
      />
      
      {/* Arrow head */}
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path
            d="M 0 0 L 10 5 L 0 10 z"
            fill={connectionColor}
          />
        </marker>
      </defs>
      
      {/* Connection path with arrow */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        style={{ cursor: 'pointer' }}
        markerEnd={`url(#arrowhead-${connection.id})`}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={handleDelete}
      />
      
      {/* Connection label */}
      <g transform={`translate(${midX}, ${midY})`}>
        <rect
          x={-30}
          y={-12}
          width={60}
          height={18}
          rx={4}
          fill={selected ? 'rgba(60, 60, 70, 0.9)' : 'rgba(40, 40, 50, 0.7)'}
          className="connection-label-bg"
        />
        <text
          textAnchor="middle"
          y={4}
          fontSize={10}
          fontFamily="sans-serif"
          fill="#ffffff"
          className="connection-label"
        >
          {connectionLabel}
        </text>
      </g>
      
      {/* Delete button (only visible when selected) */}
      {selected && (
        <g transform={`translate(${midX + 40}, ${midY})`}>
          <circle
            r={8}
            fill="rgba(255, 60, 60, 0.8)"
            stroke="#ffffff"
            strokeWidth={1}
            style={{ cursor: 'pointer' }}
            onClick={handleDelete}
            className="connection-delete-btn"
          />
          <text
            textAnchor="middle"
            y={4}
            fontSize={12}
            fontFamily="sans-serif"
            fill="#ffffff"
            style={{ cursor: 'pointer', pointerEvents: 'none' }}
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
};

export default ConnectionLine;
