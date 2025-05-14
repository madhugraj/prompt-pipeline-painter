
import React from 'react';
import { getDefaultPorts } from '@/lib/port-configurations';
import { ComponentType, PipelineNode, ConnectionType, Port } from '@/lib/pipeline-types';
import { cn } from '@/lib/utils';

interface NodeComponentProps {
  node: PipelineNode;
  isSelected: boolean;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onConnectorMouseDown: (nodeId: string, portId: string, isOutput: boolean, e: React.MouseEvent) => void;
  onConnectorMouseUp: (nodeId: string, portId: string, isOutput: boolean) => void;
  getComponentIcon: (type: ComponentType) => JSX.Element;
}

const getNodeClassByType = (type: ComponentType): string => {
  switch (type) {
    case ComponentType.VECTOR_DB:
      return 'node-vectordb';
    case ComponentType.EMBEDDING:
      return 'node-embedding';
    case ComponentType.LLM:
      return 'node-llm';
    case ComponentType.PROMPT:
      return 'node-prompt';
    case ComponentType.RAG:
      return 'node-rag';
    case ComponentType.CHUNKING:
      return 'node-chunking';
    case ComponentType.FINE_TUNING:
      return 'node-finetuning';
    case ComponentType.TEMPERATURE:
      return 'node-temperature';
    default:
      return '';
  }
};

const getLabelByType = (type: ComponentType): string => {
  switch (type) {
    case ComponentType.VECTOR_DB:
      return 'Vector Database';
    case ComponentType.EMBEDDING:
      return 'Embedding Model';
    case ComponentType.LLM:
      return 'Language Model';
    case ComponentType.PROMPT:
      return 'Prompt Engineering';
    case ComponentType.RAG:
      return 'RAG';
    case ComponentType.CHUNKING:
      return 'Chunking';
    case ComponentType.FINE_TUNING:
      return 'Fine-Tuning';
    case ComponentType.TEMPERATURE:
      return 'Temperature';
    default:
      return 'Node';
  }
};

const getProviderText = (node: PipelineNode): string => {
  if ('provider' in node.data) {
    return node.data.provider as string;
  }
  if ('option' in node.data) {
    return node.data.option as string;
  }
  return '';
};

const NodeComponent: React.FC<NodeComponentProps> = ({ 
  node, 
  isSelected, 
  onDragStart, 
  onConnectorMouseDown,
  onConnectorMouseUp,
  getComponentIcon 
}) => {
  const nodeTypeClass = getNodeClassByType(node.type);
  const label = getLabelByType(node.type);
  const provider = getProviderText(node);
  
  // Get default ports if not defined in the node
  const ports = {
    inputs: node.inputs || getDefaultPorts(node.type).inputs,
    outputs: node.outputs || getDefaultPorts(node.type).outputs,
  };
  
  // Handler for dragging the node
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDragStart(node.id, e);
  };
  
  return (
    <div 
      className={cn(
        'component-node border rounded-md p-3 w-64 min-h-[80px] animate-fade-in shadow-sm',
        nodeTypeClass,
        isSelected && 'selected shadow-md ring-2 ring-primary/30'
      )}
      style={{ 
        position: 'absolute',
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.1s ease-out'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Input Ports */}
      <div className="absolute -left-3 top-0 h-full flex flex-col justify-around items-start">
        {ports.inputs.map((port, index) => (
          <div 
            key={`input-${port.id}`}
            className="relative mb-1"
          >
            <div 
              className="connector-handle input w-3 h-3 rounded-full bg-blue-500 border border-blue-600 cursor-pointer hover:ring-2 hover:ring-blue-300"
              title={port.label}
              onMouseDown={(e) => onConnectorMouseDown(node.id, port.id, false, e)}
              onMouseUp={() => onConnectorMouseUp(node.id, port.id, false)}
            />
            {isSelected && (
              <div className="absolute -left-1 top-0 -translate-x-full whitespace-nowrap text-xs bg-background/80 px-1 rounded">
                {port.label}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Output Ports */}
      <div className="absolute -right-3 top-0 h-full flex flex-col justify-around items-end">
        {ports.outputs.map((port, index) => (
          <div 
            key={`output-${port.id}`} 
            className="relative mb-1"
          >
            <div 
              className="connector-handle output w-3 h-3 rounded-full bg-green-500 border border-green-600 cursor-pointer hover:ring-2 hover:ring-green-300"
              title={port.label}
              onMouseDown={(e) => onConnectorMouseDown(node.id, port.id, true, e)}
              onMouseUp={() => onConnectorMouseUp(node.id, port.id, true)}
            />
            {isSelected && (
              <div className="absolute -right-1 top-0 translate-x-full whitespace-nowrap text-xs bg-background/80 px-1 rounded">
                {port.label}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Node Content */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-1.5 rounded-md",
            {
              'bg-indigo-900/50': node.type === ComponentType.VECTOR_DB,
              'bg-blue-900/50': node.type === ComponentType.EMBEDDING,
              'bg-emerald-900/50': node.type === ComponentType.LLM,
              'bg-amber-900/50': node.type === ComponentType.PROMPT,
              'bg-violet-900/50': node.type === ComponentType.RAG,
              'bg-rose-900/50': node.type === ComponentType.CHUNKING,
              'bg-cyan-900/50': node.type === ComponentType.FINE_TUNING,
              'bg-orange-900/50': node.type === ComponentType.TEMPERATURE,
            }
          )}>
            {getComponentIcon(node.type)}
          </div>
          <div className="text-sm font-medium truncate flex-1">{label}</div>
        </div>
        
        <div className="text-xs font-semibold text-foreground/80 truncate">
          {provider}
        </div>
        
        {/* When selected, we could show a preview of the configuration */}
        {isSelected && Object.entries(node.data).length > 1 && (
          <div className="mt-1 text-xs bg-muted/20 rounded p-1 max-h-20 overflow-auto">
            {Object.entries(node.data)
              .filter(([key]) => key !== 'provider' && key !== 'option')
              .slice(0, 4) // Show only first 4 properties to avoid clutter
              .map(([key, value]) => (
                <div key={key} className="flex justify-between mb-0.5">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-mono truncate max-w-[120px]">
                    {typeof value === 'object' ? JSON.stringify(value).slice(0, 15) : String(value)}
                  </span>
                </div>
              ))}
            {Object.entries(node.data).filter(([key]) => key !== 'provider' && key !== 'option').length > 4 && (
              <div className="text-center text-muted-foreground italic mt-1">
                +{Object.entries(node.data).length - 6} more...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeComponent;
