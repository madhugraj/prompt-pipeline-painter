
import React, { useState } from 'react';
import { PipelineNode, ComponentType } from '@/lib/pipeline-types';
import { componentCategories } from '@/lib/pipeline-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Database, 
  MessageCircle, 
  Network, 
  Move, 
  Edit, 
  Scissors, 
  Settings, 
  Thermometer,
  ChevronDown,
  ChevronUp,
  X,
  Check,
} from 'lucide-react';
import NodeSettings from '@/components/NodeSettings';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ConfigurableComponentProps {
  node: PipelineNode;
  onUpdate: (node: PipelineNode) => void;
  onDelete: (nodeId: string) => void;
}

const ConfigurableComponent: React.FC<ConfigurableComponentProps> = ({
  node,
  onUpdate,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  
  // Find the component category based on the node type
  const category = componentCategories.find(cat => cat.type === node.type);
  if (!category) return null;
  
  // Find the provider key based on the node type
  const providerKey = getProviderKey(node.type);
  const providerOrOption = node.data[providerKey] as string;

  const getComponentIcon = (type: ComponentType) => {
    switch (type) {
      case ComponentType.VECTOR_DB:
        return <Database className="h-5 w-5" />;
      case ComponentType.EMBEDDING:
        return <Move className="h-5 w-5" />;
      case ComponentType.LLM:
        return <MessageCircle className="h-5 w-5" />;
      case ComponentType.RAG:
        return <Network className="h-5 w-5" />;
      case ComponentType.PROMPT:
        return <Edit className="h-5 w-5" />;
      case ComponentType.CHUNKING:
        return <Scissors className="h-5 w-5" />;
      case ComponentType.FINE_TUNING:
        return <Settings className="h-5 w-5" />;
      case ComponentType.TEMPERATURE:
        return <Thermometer className="h-5 w-5" />;
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
  
  const handleProviderChange = (value: string) => {
    // Find the provider
    const provider = category.providers.find(p => p.id === value);
    if (!provider) return;
    
    // Create a new data object with the provider
    const newData = {
      ...node.data,
      [providerKey]: value
    };
    
    // Update the node
    const updatedNode = {
      ...node,
      data: newData
    } as PipelineNode;
    
    onUpdate(updatedNode);
  };
  
  function getProviderKey(type: ComponentType): string {
    switch (type) {
      case ComponentType.VECTOR_DB:
      case ComponentType.EMBEDDING:
      case ComponentType.LLM:
        return 'provider';
      case ComponentType.PROMPT:
      case ComponentType.RAG:
      case ComponentType.CHUNKING:
      case ComponentType.FINE_TUNING:
      case ComponentType.TEMPERATURE:
        return 'option';
      default:
        return 'provider';
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Component header */}
      <div className="flex justify-between items-center p-4 bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className={cn("p-2 rounded-md", getIconBgColor(node.type))}>
            {getComponentIcon(node.type)}
          </div>
          <div>
            <h3 className="font-medium">{category.label}</h3>
            <p className="text-sm text-muted-foreground">
              {providerOrOption ? (
                category.providers.find(p => p.id === providerOrOption)?.name || providerOrOption
              ) : (
                "No provider selected"
              )}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(node.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="p-4 border-t">
          {/* Provider selection */}
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium">
              {providerKey === 'provider' ? 'Provider' : 'Type'}
            </label>
            <Select
              value={providerOrOption || ''}
              onValueChange={handleProviderChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {category.providers.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Configure button */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsSettingsVisible(!isSettingsVisible)}
            >
              {isSettingsVisible ? "Hide Properties" : "Configure Properties"}
            </Button>
          </div>
          
          {/* Settings panel */}
          {isSettingsVisible && (
            <div className="mt-4 border rounded-md p-4 bg-background">
              <NodeSettings
                node={node}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onClose={() => setIsSettingsVisible(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConfigurableComponent;
