
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Database, MessageCircle, Network, Move, Plus, Edit, Scissors, Settings, Thermometer } from 'lucide-react';
import { ComponentType, PipelineNode, Connection, Position, ConnectionType } from '@/lib/pipeline-types';
import NodeComponent from './NodeComponent';
import ConnectionLine from './ConnectionLine';

interface PipelineCanvasProps {
  nodes: PipelineNode[];
  connections: Connection[];
  onNodeAdd: (node: PipelineNode) => void;
  onNodeUpdate: (node: PipelineNode) => void;
  onNodeSelect: (nodeId: string | null) => void;
  onNodeDelete: (nodeId: string) => void;
  onConnectionCreate: (connection: Partial<Connection>) => void;
  onConnectionDelete: (connectionId: string) => void;
  selectedNodeId: string | null;
}

const PipelineCanvas: React.FC<PipelineCanvasProps> = ({
  nodes,
  connections,
  onNodeAdd,
  onNodeUpdate,
  onNodeSelect,
  onNodeDelete,
  onConnectionCreate,
  onConnectionDelete,
  selectedNodeId
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<{nodeId: string, portId: string, isOutput: boolean} | null>(null);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const getComponentIcon = (type: ComponentType) => {
    switch (type) {
      case ComponentType.VECTOR_DB:
        return <Database className="h-4 w-4" />;
      case ComponentType.EMBEDDING:
        return <Move className="h-4 w-4" />;
      case ComponentType.LLM:
        return <MessageCircle className="h-4 w-4" />;
      case ComponentType.RAG:
        return <Network className="h-4 w-4" />;
      case ComponentType.PROMPT:
        return <Edit className="h-4 w-4" />;
      case ComponentType.CHUNKING:
        return <Scissors className="h-4 w-4" />;
      case ComponentType.FINE_TUNING:
        return <Settings className="h-4 w-4" />;
      case ComponentType.TEMPERATURE:
        return <Thermometer className="h-4 w-4" />;
      default:
        return <Plus className="h-4 w-4" />;
    }
  };

  // Update canvas offset when the component mounts or the window resizes
  useEffect(() => {
    const updateCanvasOffset = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasOffset({ x: rect.left, y: rect.top });
      }
    };
    
    updateCanvasOffset();
    window.addEventListener('resize', updateCanvasOffset);
    return () => window.removeEventListener('resize', updateCanvasOffset);
  }, []);

  // Handle mouse move for dragging nodes and creating connections
  const handleMouseMove = (e: React.MouseEvent) => {
    const mousePos = {
      x: (e.clientX - canvasOffset.x) / scale,
      y: (e.clientY - canvasOffset.y) / scale
    };
    setMousePosition(mousePos);
    
    if (draggingNodeId) {
      setIsDragging(true);
      const node = nodes.find(n => n.id === draggingNodeId);
      if (node) {
        const newPosition = {
          x: mousePos.x - dragOffset.x,
          y: mousePos.y - dragOffset.y
        };
        
        onNodeUpdate({
          ...node,
          position: newPosition
        });
      }
    }
  };

  // Start dragging a node
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // First select the node
    onNodeSelect(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggingNodeId(nodeId);
    
    const mousePos = {
      x: (e.clientX - canvasOffset.x) / scale,
      y: (e.clientY - canvasOffset.y) / scale
    };
    
    setDragOffset({
      x: mousePos.x - node.position.x,
      y: mousePos.y - node.position.y
    });
  };

  // Stop dragging a node
  const handleMouseUp = () => {
    // If we were just dragging, don't trigger a click on the canvas
    const wasDragging = isDragging;
    setDraggingNodeId(null);
    setIsDragging(false);
    
    if (connectingFrom) {
      setConnectingFrom(null);
    }
    
    // Only deselect if we weren't dragging
    if (!wasDragging && !connectingFrom) {
      onNodeSelect(null);
    }
  };

  // Start creating a connection from a node
  const handleConnectorMouseDown = (nodeId: string, portId: string, isOutput: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectingFrom({ nodeId, portId, isOutput });
  };

  // Finish creating a connection to a node
  const handleConnectorMouseUp = (nodeId: string, portId: string, isOutput: boolean) => {
    if (!connectingFrom) return;
    
    // Don't allow connecting to self
    if (connectingFrom.nodeId === nodeId) {
      setConnectingFrom(null);
      return;
    }
    
    // Only allow connecting from output to input
    if (connectingFrom.isOutput && !isOutput) {
      onConnectionCreate({
        source: connectingFrom.nodeId,
        sourceHandle: connectingFrom.portId,
        target: nodeId,
        targetHandle: portId,
        type: ConnectionType.DATA
      });
    } else if (!connectingFrom.isOutput && isOutput) {
      onConnectionCreate({
        source: nodeId,
        sourceHandle: portId,
        target: connectingFrom.nodeId,
        targetHandle: connectingFrom.portId,
        type: ConnectionType.DATA
      });
    }
    
    setConnectingFrom(null);
  };
  
  // Handle click on the canvas background
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if we're not currently connecting or dragging
    if (!connectingFrom && !isDragging) {
      onNodeSelect(null);
    }
  };
  
  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prevScale => {
      const newScale = prevScale * delta;
      return Math.min(Math.max(0.1, newScale), 2);
    });
  };

  // Find the correct node connection points for drawing lines
  const getPortPosition = (nodeId: string, portId: string, isOutput: boolean): Position | null => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    // Basic positioning logic - in a real app, you'd calculate this more precisely
    const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (!nodeElement) return null;
    
    const nodeRect = nodeElement.getBoundingClientRect();
    
    if (isOutput) {
      return {
        x: node.position.x + 150,  // right side of node
        y: node.position.y + 40    // approximation of port height
      };
    } else {
      return {
        x: node.position.x,        // left side of node
        y: node.position.y + 40    // approximation of port height
      };
    }
  };

  return (
    <div 
      ref={canvasRef} 
      className="relative w-full h-full overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
    >
      {/* Background grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1a1f2c20_1px,transparent_1px),linear-gradient(to_bottom,#1a1f2c20_1px,transparent_1px)]"
        style={{ 
          backgroundSize: `${20 * scale}px ${20 * scale}px`, 
          transform: `scale(${1/scale})`,
          transformOrigin: '0 0' 
        }}
      />
      
      {/* Transformable canvas */}
      <div 
        className="absolute inset-0 origin-top-left" 
        style={{ transform: `scale(${scale})` }}
      >
        {/* Connections */}
        <svg className="absolute inset-0 pointer-events-none">
          {connections.map(connection => (
            <ConnectionLine 
              key={connection.id}
              connection={connection}
              nodes={nodes}
              animated={true}
              onDelete={onConnectionDelete}
              selected={false}
            />
          ))}
          
          {/* Connection line being created */}
          {connectingFrom && (
            <path
              d={`M ${
                getPortPosition(connectingFrom.nodeId, connectingFrom.portId, connectingFrom.isOutput)?.x || 0
              } ${
                getPortPosition(connectingFrom.nodeId, connectingFrom.portId, connectingFrom.isOutput)?.y || 0
              } C ${
                getPortPosition(connectingFrom.nodeId, connectingFrom.portId, connectingFrom.isOutput)?.x 
                ? (getPortPosition(connectingFrom.nodeId, connectingFrom.portId, connectingFrom.isOutput)!.x + (connectingFrom.isOutput ? 70 : -70))
                : 0
              } ${
                getPortPosition(connectingFrom.nodeId, connectingFrom.portId, connectingFrom.isOutput)?.y || 0
              }, ${mousePosition.x - 70} ${mousePosition.y}, ${mousePosition.x} ${mousePosition.y}`}
              stroke="rgba(100, 100, 255, 0.8)"
              strokeWidth={2}
              fill="none"
              strokeDasharray="5,5"
            />
          )}
        </svg>
        
        {/* Nodes */}
        {nodes.map(node => (
          <NodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onDragStart={handleNodeDragStart}
            onConnectorMouseDown={handleConnectorMouseDown}
            onConnectorMouseUp={handleConnectorMouseUp}
            getComponentIcon={getComponentIcon}
          />
        ))}
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <Button variant="outline" size="icon" onClick={() => setScale(s => Math.min(s * 1.2, 2))}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setScale(1)}>
          <span className="text-xs font-bold">{Math.round(scale * 100)}%</span>
        </Button>
        <Button variant="outline" size="icon" onClick={() => setScale(s => Math.max(s / 1.2, 0.1))}>
          <div className="h-4 w-4 flex items-center justify-center">
            <div className="h-0.5 w-3 bg-current" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default PipelineCanvas;
