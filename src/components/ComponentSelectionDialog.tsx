
import React, { useState } from 'react';
import { ComponentType } from '@/lib/pipeline-types';
import { componentCategories } from '@/lib/pipeline-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Database, 
  MessageCircle, 
  Network, 
  Move, 
  Edit, 
  Scissors, 
  Settings, 
  Thermometer, 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Position } from '@/lib/pipeline-types';

interface ComponentSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComponentSelect: (type: ComponentType, position: Position) => void;
}

const ComponentSelectionDialog: React.FC<ComponentSelectionDialogProps> = ({
  isOpen,
  onClose,
  onComponentSelect,
}) => {
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType | ''>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  
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

  // Filter available providers based on selected component type
  const availableProviders = selectedComponentType 
    ? componentCategories.find(cat => cat.type === selectedComponentType)?.providers || []
    : [];

  // Handle component creation
  const handleAddComponent = () => {
    if (selectedComponentType) {
      // Place the component in the center of the canvas area for visibility
      onComponentSelect(selectedComponentType, { x: 300, y: 200 });
      // Reset selections
      setSelectedComponentType('');
      setSelectedProvider('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setSelectedComponentType('');
      setSelectedProvider('');
      onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
          <DialogDescription>
            Select a component type and provider to add to your pipeline.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right text-sm font-medium">Component:</div>
            <div className="col-span-3">
              <Select value={selectedComponentType} onValueChange={(value) => {
                setSelectedComponentType(value as ComponentType);
                setSelectedProvider('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select component..." />
                </SelectTrigger>
                <SelectContent>
                  {componentCategories.map((category) => (
                    <SelectItem key={category.type} value={category.type}>
                      <div className="flex items-center">
                        <div className={`p-1 mr-2 rounded-md ${getIconBgColor(category.type)}`}>
                          {getComponentIcon(category.type)}
                        </div>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedComponentType && availableProviders.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-sm font-medium">Provider:</div>
              <div className="col-span-3">
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddComponent} 
            disabled={!selectedComponentType}
          >
            Add Component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentSelectionDialog;
