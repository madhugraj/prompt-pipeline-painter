
import React from 'react';
import { PipelineNode, ComponentType } from '@/lib/pipeline-types';
import { componentCategories } from '@/lib/pipeline-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

interface NodeSettingsProps {
  node: PipelineNode | null;
  onUpdate: (node: PipelineNode) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const NodeSettings: React.FC<NodeSettingsProps> = ({ node, onUpdate, onDelete, onClose }) => {
  if (!node) return null;
  
  // Find the component category based on the node type
  const category = componentCategories.find(cat => cat.type === node.type);
  if (!category) return null;
  
  // Find the provider data based on the node data
  const providerKey = 'provider' in node.data ? 'provider' : 'option';
  const providerOrOption = node.data[providerKey] as string;
  
  // Find the provider configuration
  const provider = category.providers.find(p => 
    p.id.toLowerCase() === providerOrOption.toLowerCase() || 
    p.name.toLowerCase() === providerOrOption.toLowerCase()
  );
  
  if (!provider) return null;
  
  // Handle input changes
  const handleFieldChange = (fieldId: string, value: any) => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        [fieldId]: value
      }
    });
  };
  
  // Handle provider selection change
  const handleProviderChange = (value: string) => {
    // Find the new provider
    const newProvider = category.providers.find(p => p.id === value);
    if (!newProvider) return;
    
    // Create a new data object with the provider
    const newData: Record<string, any> = {
      [providerKey]: newProvider.name
    };
    
    // Add default values for the new provider's fields
    newProvider.configFields.forEach(field => {
      if (field.default !== undefined) {
        newData[field.id] = field.default;
      }
    });
    
    // Update the node
    onUpdate({
      ...node,
      data: newData
    });
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border w-80">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="font-medium">Node Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-5">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">
              {providerKey === 'provider' ? 'Provider' : 'Type'}
            </Label>
            <Select
              value={provider.id}
              onValueChange={handleProviderChange}
            >
              <SelectTrigger id="provider">
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
          
          {/* Provider Description */}
          <div className="text-sm text-muted-foreground">
            {provider.description}
          </div>
          
          {/* Configuration Fields */}
          <div className="space-y-4">
            {provider.configFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="flex justify-between">
                  <span>{field.label}</span>
                  {field.required && <span className="text-xs text-destructive">*</span>}
                </Label>
                
                {/* Render different input types based on field type */}
                {field.type === 'text' && (
                  <Input
                    id={field.id}
                    value={node.data[field.id] || ''}
                    placeholder={field.placeholder}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  />
                )}
                
                {field.type === 'number' && (
                  <Input
                    id={field.id}
                    type="number"
                    value={node.data[field.id] || field.default || ''}
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
                    onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value))}
                  />
                )}
                
                {field.type === 'select' && field.options && (
                  <Select
                    value={node.data[field.id] || field.default || ''}
                    onValueChange={(value) => handleFieldChange(field.id, value)}
                  >
                    <SelectTrigger id={field.id}>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {field.type === 'boolean' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={field.id}
                      checked={node.data[field.id] || field.default || false}
                      onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                    />
                    <Label htmlFor={field.id}>
                      {node.data[field.id] ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                )}
                
                {field.type === 'slider' && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">
                        {field.min || 0}
                      </span>
                      <span className="text-xs font-medium">
                        {node.data[field.id] || field.default || 0}
                        {field.unit && ` ${field.unit}`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {field.max || 1}
                      </span>
                    </div>
                    <Slider
                      id={field.id}
                      value={[node.data[field.id] || field.default || 0]}
                      min={field.min || 0}
                      max={field.max || 1}
                      step={field.step || 0.1}
                      onValueChange={([value]) => handleFieldChange(field.id, value)}
                    />
                  </div>
                )}
                
                {/* Field tooltip */}
                {field.tooltip && (
                  <p className="text-xs text-muted-foreground">
                    {field.tooltip}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={() => onDelete(node.id)}
        >
          Delete Node
        </Button>
      </div>
    </div>
  );
};

export default NodeSettings;
