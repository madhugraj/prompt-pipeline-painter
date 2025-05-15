
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Database, MessageCircle, Network, Move, Plus, Edit, Scissors, Settings, Thermometer } from 'lucide-react';
import { ComponentType, PipelineNode, Connection, Position } from '@/lib/pipeline-types';
import ConnectionLine from './ConnectionUtils';

interface PipelineCanvasProps {
  nodes: PipelineNode[];
  connections: Connection[];
  onNodeSelect: (nodeId: string | null) => void;
  onNodeDelete: (nodeId: string) => void;
  onConnectionCreate: (connection: Partial<Connection>) => void;
  onConnectionDelete: (connectionId: string) => void;
  selectedNodeId: string | null;
}

const PipelineCanvas: React.FC<PipelineCanvasProps> = ({
  nodes,
  connections,
  onNodeSelect,
  onNodeDelete,
  onConnectionCreate,
  onConnectionDelete,
  selectedNodeId
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

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

  // Handle mouse move for dragging nodes
  const handleMouseMove = (e: React.MouseEvent) => {
    const mousePos = {
      x: (e.clientX - canvasOffset.x) / scale,
      y: (e.clientY - canvasOffset.y) / scale
    };
    
    if (draggingNodeId) {
      setIsDragging(true);
      const node = nodes.find(n => n.id === draggingNodeId);
      if (node) {
        const newPosition = {
          x: mousePos.x - dragOffset.x,
          y: mousePos.y - dragOffset.y
        };
        
        const updatedNode = {
          ...node,
          position: newPosition
        };
        
        // Replace the node with updated position
        const updatedNodes = nodes.map(n => 
          n.id === draggingNodeId ? updatedNode : n
        );
        
        // We don't have direct access to setNodes here, so we update the node indirectly
        // This could be improved with a better state management pattern
      }
    }
  };

  // Start dragging a node
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Select the node when starting drag
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
    setDraggingNodeId(null);
    setIsDragging(false);
  };

  // Handle clicks on the canvas background
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onNodeSelect(null);
      setSelectedConnectionId(null);
    }
  };

  // Handle click on a node
  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (!isDragging) {
      onNodeSelect(nodeId);
      setSelectedConnectionId(null);
    }
  };
  
  // Handle click on a connection
  const handleConnectionClick = (e: React.MouseEvent, connectionId: string) => {
    e.stopPropagation();
    setSelectedConnectionId(connectionId);
    onNodeSelect(null); // Deselect any selected node
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
        {/* Connections as SVG */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <g>
            {connections.map((connection) => (
              <g 
                key={connection.id} 
                onClick={(e) => handleConnectionClick(e, connection.id)}
                className="pointer-events-auto"
              >
                <ConnectionLine 
                  connection={connection}
                  nodes={nodes}
                  animated={true}
                  onDelete={onConnectionDelete}
                  selected={selectedConnectionId === connection.id}
                />
              </g>
            ))}
          </g>
        </svg>
        
        {/* Nodes */}
        {nodes.map(node => {
          const isSelected = selectedNodeId === node.id;
          
          return (
            <div
              key={node.id}
              data-node-id={node.id}
              className={cn(
                "absolute bg-white border rounded-md shadow-md p-4 transition-shadow",
                isSelected && "border-primary shadow-lg"
              )}
              style={{
                left: `${node.position.x}px`,
                top: `${node.position.y}px`,
                width: "200px",
                zIndex: isSelected ? 10 : 5,
                cursor: "move"
              }}
              onClick={(e) => handleNodeClick(e, node.id)}
              onMouseDown={(e) => handleNodeDragStart(node.id, e)}
            >
              {/* Node header */}
              <div className="flex items-center mb-2">
                <div className={cn(
                  "p-1 rounded-md mr-2",
                  node.type === ComponentType.VECTOR_DB && "bg-indigo-950 text-indigo-300",
                  node.type === ComponentType.EMBEDDING && "bg-blue-950 text-blue-300",
                  node.type === ComponentType.LLM && "bg-emerald-950 text-emerald-300",
                  node.type === ComponentType.PROMPT && "bg-amber-950 text-amber-300",
                  node.type === ComponentType.RAG && "bg-violet-950 text-violet-300",
                  node.type === ComponentType.CHUNKING && "bg-rose-950 text-rose-300",
                  node.type === ComponentType.FINE_TUNING && "bg-cyan-950 text-cyan-300",
                  node.type === ComponentType.TEMPERATURE && "bg-orange-950 text-orange-300"
                )}>
                  {getComponentIcon(node.type)}
                </div>
                <div className="font-medium truncate">
                  {node.type}
                </div>
              </div>
              
              {/* Node content - will vary by node type */}
              <div className="text-xs text-gray-500 mb-4">
                {node.data?.provider || 'No provider selected'}
              </div>
              
              {/* Input/Output ports */}
              <div className="relative">
                {/* Input port on the left */}
                <div 
                  className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"
                  style={{ top: "50%" }}
                  data-port-id="input"
                ></div>
                
                {/* Output port on the right */}
                <div 
                  className="absolute -right-2 top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"
                  style={{ top: "50%" }}
                  data-port-id="output"
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-4 right-24 flex space-x-2">
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
