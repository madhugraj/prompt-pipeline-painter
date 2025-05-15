
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ComponentType, 
  PipelineNode, 
  Connection, 
  Position, 
  Pipeline,
  ConnectionType,
  VectorDBNode,
  EmbeddingNode,
  LLMNode,
  PromptNode,
  RAGNode,
  ChunkingNode,
  FineTuningNode,
  TemperatureNode
} from '@/lib/pipeline-types';
import PipelineCanvas from '@/components/PipelineCanvas';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Download,
  Upload,
  Play,
  AlertCircle,
  Info,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ComponentSelectionDialog from '@/components/ComponentSelectionDialog';
import PropertyConfigurationModal from '@/components/PropertyConfigurationModal';
import { componentCategories } from '@/lib/pipeline-data';

const PipelineBuilder = () => {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<Pipeline>({
    id: uuidv4(),
    name: 'New Pipeline',
    nodes: [],
    connections: [],
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  });
  
  // Dialog states
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  
  const { toast } = useToast();
  
  // Add a component to the canvas
  const handleAddComponent = (type: ComponentType, position: Position) => {
    let newNode: PipelineNode;
    
    // Find the component category and get first provider
    const category = componentCategories.find(cat => cat.type === type);
    const defaultProvider = category?.providers[0]?.id || '';
    
    switch (type) {
      case ComponentType.VECTOR_DB:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: defaultProvider,
            indexName: 'my-vector-index'
          }
        } as VectorDBNode;
        break;
        
      case ComponentType.EMBEDDING:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: defaultProvider,
            dimensions: 1536
          }
        } as EmbeddingNode;
        break;
        
      case ComponentType.LLM:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: defaultProvider,
            model: 'gpt-3.5-turbo',
            temperature: 0.7
          }
        } as LLMNode;
        break;
        
      case ComponentType.PROMPT:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: defaultProvider,
            template: 'You are a helpful assistant. {input}'
          }
        } as PromptNode;
        break;
        
      case ComponentType.RAG:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: defaultProvider,
            retrievalMethod: 'similarity'
          }
        } as RAGNode;
        break;
        
      case ComponentType.CHUNKING:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: defaultProvider,
            chunkSize: 1000,
            overlap: 200
          }
        } as ChunkingNode;
        break;
        
      case ComponentType.FINE_TUNING:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: defaultProvider,
            trainingEpochs: 3
          }
        } as FineTuningNode;
        break;
        
      case ComponentType.TEMPERATURE:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: defaultProvider,
            value: 0.7
          }
        } as TemperatureNode;
        break;
        
      default:
        return;
    }
    
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setIsPropertyModalOpen(true);
  };
  
  // Update a node's properties
  const handleNodeUpdate = (updatedNode: PipelineNode) => {
    setNodes(prev => prev.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
    
    toast({
      title: "Component updated",
      description: "Properties have been saved successfully"
    });
  };
  
  // Delete a node and its connections
  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.source !== nodeId && conn.target !== nodeId
    ));
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
      setIsPropertyModalOpen(false);
    }
    
    toast({
      title: "Component deleted",
      description: "The component and its connections have been removed"
    });
  };
  
  // Create a new connection between nodes
  const handleConnectionCreate = (connectionData: Partial<Connection>) => {
    if (!connectionData.source || !connectionData.target) return;
    
    // Check if connection already exists
    const connectionExists = connections.some(
      conn => conn.source === connectionData.source && 
             conn.target === connectionData.target &&
             conn.sourceHandle === connectionData.sourceHandle &&
             conn.targetHandle === connectionData.targetHandle
    );
    
    if (connectionExists) {
      toast({
        title: "Connection already exists",
        description: "These components are already connected",
        variant: "destructive"
      });
      return;
    }
    
    const newConnection: Connection = {
      id: uuidv4(),
      source: connectionData.source,
      target: connectionData.target,
      sourceHandle: connectionData.sourceHandle,
      targetHandle: connectionData.targetHandle,
      type: connectionData.type || ConnectionType.DATA
    };
    
    setConnections(prev => [...prev, newConnection]);
    
    toast({
      title: "Connection created",
      description: "Components have been connected successfully"
    });
  };
  
  // Delete a connection
  const handleConnectionDelete = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    
    toast({
      title: "Connection deleted",
      description: "The connection has been removed"
    });
  };
  
  // Handle node selection
  const handleNodeSelect = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId) {
      setIsPropertyModalOpen(true);
    } else {
      setIsPropertyModalOpen(false);
    }
  };
  
  // Save the current pipeline
  const handleSavePipeline = () => {
    const updatedPipeline: Pipeline = {
      ...pipeline,
      nodes,
      connections,
      updated: new Date().toISOString()
    };
    
    setPipeline(updatedPipeline);
    
    // In a real app, this would save to backend
    localStorage.setItem('ai-pipeline', JSON.stringify(updatedPipeline));
    
    toast({
      title: "Pipeline saved",
      description: "Your pipeline has been saved successfully"
    });
  };
  
  // Export the pipeline as JSON
  const handleExportPipeline = () => {
    const pipelineJson = JSON.stringify({
      ...pipeline,
      nodes,
      connections,
      updated: new Date().toISOString()
    }, null, 2);
    
    const blob = new Blob([pipelineJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pipeline.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Pipeline exported",
      description: "Your pipeline has been downloaded as JSON"
    });
  };
  
  // Import a pipeline from JSON
  const handleImportPipeline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedPipeline = JSON.parse(event.target?.result as string) as Pipeline;
        setPipeline(importedPipeline);
        setNodes(importedPipeline.nodes);
        setConnections(importedPipeline.connections);
        
        toast({
          title: "Pipeline imported",
          description: `Imported ${importedPipeline.name} with ${importedPipeline.nodes.length} components`
        });
      } catch (error) {
        console.error("Failed to parse pipeline JSON:", error);
        toast({
          title: "Import failed",
          description: "The selected file is not a valid pipeline JSON",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    e.target.value = '';
  };
  
  // Run the pipeline
  const handleRunPipeline = () => {
    toast({
      title: "Running pipeline",
      description: "This is a demo - no actual execution is happening"
    });
  };
  
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">AI Pipeline Builder</h1>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSavePipeline}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExportPipeline}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <div className="relative">
              <input
                type="file"
                id="import-pipeline"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="application/json"
                onChange={handleImportPipeline}
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="import-pipeline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </label>
              </Button>
            </div>
            
            <Button onClick={handleRunPipeline}>
              <Play className="h-4 w-4 mr-2" />
              Run Pipeline
            </Button>
          </div>
        </div>
        
        {/* Pipeline stats */}
        <div className="flex mt-2 text-sm text-muted-foreground">
          <div className="flex items-center mr-4">
            <Info className="h-4 w-4 mr-1" />
            <span>{nodes.length} components</span>
          </div>
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>Last updated: {new Date(pipeline.updated).toLocaleString()}</span>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-grow overflow-hidden relative">
        {/* Canvas */}
        <div className="flex-grow relative canvas-container">
          <PipelineCanvas
            nodes={nodes}
            connections={connections}
            onNodeSelect={handleNodeSelect}
            onNodeDelete={handleNodeDelete}
            onConnectionCreate={handleConnectionCreate}
            onConnectionDelete={handleConnectionDelete}
            selectedNodeId={selectedNodeId}
          />
          
          {/* Floating action button to add components */}
          <Button 
            className="absolute bottom-6 right-6 rounded-full w-12 h-12" 
            onClick={() => setIsComponentDialogOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Component selection dialog */}
        <ComponentSelectionDialog 
          isOpen={isComponentDialogOpen}
          onClose={() => setIsComponentDialogOpen(false)}
          onComponentSelect={handleAddComponent}
        />
        
        {/* Property configuration modal */}
        <PropertyConfigurationModal
          node={nodes.find(node => node.id === selectedNodeId) || null}
          isOpen={isPropertyModalOpen}
          onClose={() => setIsPropertyModalOpen(false)}
          onUpdate={handleNodeUpdate}
          onDelete={handleNodeDelete}
        />
      </div>
    </div>
  );
};

export default PipelineBuilder;
