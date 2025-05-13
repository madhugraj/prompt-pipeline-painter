
import React from "react";
import { Connection, PipelineNode } from "@/lib/pipeline-types";
import { cn } from "@/lib/utils";

interface ConnectionLineProps {
  connection: Connection;
  nodes: PipelineNode[];
  animated?: boolean;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection, nodes, animated = false }) => {
  const sourceNode = nodes.find((node) => node.id === connection.source);
  const targetNode = nodes.find((node) => node.id === connection.target);
  
  // If either node doesn't exist, don't render the connection
  if (!sourceNode || !targetNode) {
    return null;
  }
  
  // Calculate source and target points
  const sourceX = sourceNode.position.x + 150; // Right side of source node
  const sourceY = sourceNode.position.y + 40;  // Middle of source node
  const targetX = targetNode.position.x;       // Left side of target node
  const targetY = targetNode.position.y + 40;  // Middle of target node
  
  // Calculate control points for the bezier curve
  const sourceControlX = sourceX + 70;
  const sourceControlY = sourceY;
  const targetControlX = targetX - 70;
  const targetControlY = targetY;
  
  // Path data for the bezier curve
  const path = `M ${sourceX} ${sourceY} C ${sourceControlX} ${sourceControlY}, ${targetControlX} ${targetControlY}, ${targetX} ${targetY}`;
  
  return (
    <path
      d={path}
      className={cn("connector-path", animated && "active")}
      fill="none"
    />
  );
};

export default ConnectionLine;
