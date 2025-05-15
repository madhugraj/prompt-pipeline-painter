
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

interface ComponentSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComponentSelect: (type: ComponentType) => void;
}

const ComponentSelectionDialog: React.FC<ComponentSelectionDialogProps> = ({
  isOpen,
  onClose,
  onComponentSelect,
}) => {
  const [selectedComponentType, setSelectedComponentType] = useState<ComponentType | ''>('');
  
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

  // Handle component creation
  const handleAddComponent = () => {
    if (selectedComponentType) {
      onComponentSelect(selectedComponentType);
      // Reset selections
      setSelectedComponentType('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setSelectedComponentType('');
      onClose();
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
          <DialogDescription>
            Select a component type to add to your pipeline.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right text-sm font-medium">Component:</div>
            <div className="col-span-3">
              <Select value={selectedComponentType} onValueChange={(value) => {
                setSelectedComponentType(value as ComponentType);
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
