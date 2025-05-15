
import React from 'react';
import { PipelineNode } from '@/lib/pipeline-types';
import { componentCategories } from '@/lib/pipeline-data';
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
  
  // Find the provider key based on the node type
  const providerKey = getProviderKey(node.type);
  const providerOrOption = node.data[providerKey] as string;
  
  // Find the provider configuration - case insensitive matching
  const provider = category.providers.find(p => 
    p.id.toLowerCase() === (providerOrOption || '').toLowerCase() || 
    p.name.toLowerCase() === (providerOrOption || '').toLowerCase()
  );
  
  if (!provider) {
    return (
      <div>
        <div className="text-destructive mb-4">
          Please select a provider before configuring properties.
        </div>
      </div>
    );
  }
  
  // Handle input changes
  const handleFieldChange = (fieldId: string, value: any) => {
    // Use type assertion to ensure correct types
    const updatedNode = {
      ...node,
      data: {
        ...node.data,
        [fieldId]: value
      }
    } as PipelineNode;
    
    onUpdate(updatedNode);
  };

  function getProviderKey(type: string): string {
    if (type === 'prompt' || type === 'rag' || type === 'chunking' || 
        type === 'finetuning' || type === 'temperature') {
      return 'option';
    }
    return 'provider';
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Configuration Properties</h3>
      
      {/* Provider Description */}
      <div className="text-sm text-muted-foreground mb-4">
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
                value={String(node.data[field.id] || field.default || '')}
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
                  checked={Boolean(node.data[field.id] ?? field.default ?? false)}
                  onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                />
                <Label htmlFor={field.id}>
                  {Boolean(node.data[field.id] ?? field.default ?? false) ? 'Enabled' : 'Disabled'}
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
                  value={[Number(node.data[field.id] ?? field.default ?? 0)]}
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
  );
};

export default NodeSettings;
