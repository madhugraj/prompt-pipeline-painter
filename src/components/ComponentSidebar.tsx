import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  MessageCircle, 
  Network, 
  Move, 
  Search, 
  Edit, 
  Scissors, 
  Settings, 
  Thermometer, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentType, PipelineNode, Position } from '@/lib/pipeline-types';
import { ComponentCategory, componentCategories } from '@/lib/pipeline-data';

interface ComponentSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onAddComponent: (type: ComponentType, position: Position) => void;
}

const ComponentSidebar: React.FC<ComponentSidebarProps> = ({ 
  isExpanded, 
  onToggle, 
  onAddComponent 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'components' | 'providers'>('components');
  const [draggedComponentType, setDraggedComponentType] = useState<ComponentType | null>(null);
  
  // Handle starting to drag a component
  const handleDragStart = (type: ComponentType) => {
    setDraggedComponentType(type);
  };
  
  // Handle dropping a component
  const handleDragEnd = (e: React.DragEvent) => {
    if (draggedComponentType) {
      // Get the drop position relative to the canvas
      const canvasElement = document.querySelector('.canvas-container');
      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect();
        const position = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        onAddComponent(draggedComponentType, position);
      } else {
        // If we can't find the canvas, just add at a default position
        onAddComponent(draggedComponentType, { x: 100, y: 100 });
      }
    }
    setDraggedComponentType(null);
  };
  
  // Filter components based on search query
  const filteredCategories = componentCategories.filter(category => 
    category.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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

  return (
    <div 
      className={cn(
        "h-full bg-card border-r border-border transition-all duration-300 overflow-hidden flex flex-col",
        isExpanded ? "w-64" : "w-14"
      )}
    >
      {/* Toggle button */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onToggle}
        className="self-end m-1"
      >
        {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </Button>
      
      {/* Search and Tabs - only visible when expanded */}
      {isExpanded && (
        <>
          <div className="p-3">
            <Input 
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} className="w-full">
            <TabsList className="grid grid-cols-2 mx-3">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
            </TabsList>
          </Tabs>
        </>
      )}
      
      {/* Component list */}
      <ScrollArea className="flex-grow">
        <div className={cn("p-2", !isExpanded && "flex flex-col items-center")}>
          {selectedTab === 'components' && filteredCategories.map((category) => (
            <div 
              key={category.type} 
              className="mb-2"
              draggable
              onDragStart={() => handleDragStart(category.type)}
              onDragEnd={handleDragEnd}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-start gap-2 hover:bg-muted cursor-grab active:cursor-grabbing",
                        !isExpanded && "h-12 w-12 p-0 justify-center",
                      )}
                      onClick={() => onAddComponent(category.type, { x: 200, y: 200 })}
                    >
                      <div className={cn("p-1.5 rounded-md", getIconBgColor(category.type))}>
                        {getComponentIcon(category.type)}
                      </div>
                      {isExpanded && <span className="truncate">{category.label}</span>}
                    </Button>
                  </TooltipTrigger>
                  {!isExpanded && (
                    <TooltipContent side="right">
                      <p>{category.label}</p>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              
              {isExpanded && (
                <div className="ml-10 text-xs text-muted-foreground">
                  {category.providers.length} providers
                </div>
              )}
            </div>
          ))}
          
          {selectedTab === 'providers' && isExpanded && filteredCategories.flatMap((category) => 
            category.providers.map(provider => (
              <div key={`${category.type}-${provider.id}`} className="mb-3">
                <div className="flex items-center mb-1">
                  <div className={cn("p-1.5 rounded-md mr-2", getIconBgColor(category.type))}>
                    {getComponentIcon(category.type)}
                  </div>
                  <span className="font-medium">{provider.name}</span>
                </div>
                <div className="ml-10 text-xs">
                  <p className="text-muted-foreground mb-1">{provider.description}</p>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="outline" className="text-[10px]">{provider.pricing}</Badge>
                    <Badge variant="outline" className="text-[10px]">{provider.deployment}</Badge>
                    {provider.useCases.slice(0, 2).map(useCase => (
                      <Badge key={useCase} variant="secondary" className="text-[10px]">{useCase}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ComponentSidebar;
