
import React from 'react';
import { ComponentType, PipelineNode } from '@/lib/pipeline-types';
import { cn } from '@/lib/utils';
import { Database, MessageCircle, Network, Move, Edit, Scissors, Settings, Thermometer } from 'lucide-react';

interface NodeComponentProps {
  node: PipelineNode;
  isSelected: boolean;
  onNodeSelect: (nodeId: string) => void;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ 
  node, 
  isSelected,
  onNodeSelect
}) => {
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
        return null;
    }
  };

  const getIconBgColor = (type: ComponentType) => {
    switch (type) {
      case ComponentType.VECTOR_DB:
        return 'bg-indigo-950 text-indigo-300';
      case ComponentType.EMBEDDING:
        return 'bg-blue-950 text-blue-300';
      case ComponentType.LLM:
        return 'bg-emerald-950 text-emerald-300';
      case ComponentType.PROMPT:
        return 'bg-amber-950 text-amber-300';
      case ComponentType.RAG:
        return 'bg-violet-950 text-violet-300';
      case ComponentType.CHUNKING:
        return 'bg-rose-950 text-rose-300';
      case ComponentType.FINE_TUNING:
        return 'bg-cyan-950 text-cyan-300';
      case ComponentType.TEMPERATURE:
        return 'bg-orange-950 text-orange-300';
      default:
        return 'bg-muted';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeSelect(node.id);
  };

  return (
    <div
      data-node-id={node.id}
      className={cn(
        "absolute bg-white border rounded-md shadow-md p-4",
        isSelected && "border-primary shadow-lg"
      )}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: "200px",
        zIndex: isSelected ? 10 : 5
      }}
      onClick={handleClick}
    >
      {/* Node header */}
      <div className="flex items-center mb-2">
        <div className={cn("p-1 rounded-md mr-2", getIconBgColor(node.type))}>
          {getComponentIcon(node.type)}
        </div>
        <div className="font-medium truncate">
          {node.type}
        </div>
      </div>
      
      {/* Node content - will vary by node type */}
      <div className="text-xs text-gray-500 mb-4">
        {node.data?.provider || 'No provider selected'}
        
        {node.type === ComponentType.LLM && (
          <div className="mt-1">
            Model: {(node.data as any)?.model || 'Not specified'}
          </div>
        )}
        
        {node.type === ComponentType.PROMPT && (
          <div className="mt-1 truncate">
            Template: {(node.data as any)?.template?.substring(0, 20) || 'Not specified'}...
          </div>
        )}
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
};

export default NodeComponent;
