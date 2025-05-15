
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ComponentType, 
  PipelineNode,
  Connection,
  Position,
  Pipeline,
  PromptOption,
  RAGOption,
  ChunkingOption,
  FineTuningOption,
  TemperatureOption,
  VectorDBProvider,
  EmbeddingProvider,
  LLMProvider
} from '@/lib/pipeline-types';
import { Button } from '@/components/ui/button';
import { Plus, Save, Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ComponentSelectionDialog from '@/components/ComponentSelectionDialog';
import ConfigurableComponent from '@/components/ConfigurableComponent';

const SimplePipelineBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<Pipeline>({
    id: uuidv4(),
    name: 'New Pipeline',
    nodes: [],
    connections: [],
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  });
  
  const { toast } = useToast();
  
  const handleAddComponent = (type: ComponentType) => {
    // Create a new node of the selected type
    let newNode: PipelineNode;
    const position = { x: 0, y: 0 }; // Position doesn't matter in this UI
    
    switch (type) {
      case ComponentType.VECTOR_DB:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: '' as VectorDBProvider,
            indexName: 'my-vector-index'
          }
        };
        break;
        
      case ComponentType.EMBEDDING:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: '' as EmbeddingProvider,
            dimensions: 1536
          }
        };
        break;
        
      case ComponentType.LLM:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            provider: '' as LLMProvider,
            model: 'gpt-3.5-turbo',
            temperature: 0.7
          }
        };
        break;
        
      case ComponentType.PROMPT:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            option: 'BasicTemplates' as PromptOption,
            template: 'You are a helpful assistant. {input}'
          }
        };
        break;
        
      case ComponentType.RAG:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            option: 'BasicRAG' as RAGOption,
            retrievalStrategy: 'similarity',
            numResults: 3
          }
        };
        break;
        
      case ComponentType.CHUNKING:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            option: 'FixedSize' as ChunkingOption,
            chunkSize: 1000,
            overlap: 200
          }
        };
        break;
        
      case ComponentType.FINE_TUNING:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            option: 'LoRA' as FineTuningOption,
            trainingEpochs: 3,
            baseModel: 'llama-2-7b',
            rank: 8
          }
        };
        break;
        
      case ComponentType.TEMPERATURE:
        newNode = {
          id: uuidv4(),
          type,
          position,
          data: {
            option: 'FixedValue' as TemperatureOption,
            value: 0.7
          }
        };
        break;
        
      default:
        return;
    }
    
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
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
  
  // Delete a node
  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.source !== nodeId && conn.target !== nodeId
    ));
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    
    toast({
      title: "Component deleted",
      description: "The component has been removed"
    });
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
  
  return (
    <div className="flex flex-col h-screen bg-background">
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
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Pipeline Components</h2>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Component
            </Button>
          </div>
          
          {/* List of components */}
          <div className="space-y-4">
            {nodes.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg">
                <p className="text-muted-foreground">
                  No components added yet. Click "Add Component" to start building your pipeline.
                </p>
              </div>
            ) : (
              nodes.map(node => (
                <ConfigurableComponent
                  key={node.id}
                  node={node}
                  onUpdate={handleNodeUpdate}
                  onDelete={handleNodeDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Component selection dialog */}
      <ComponentSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onComponentSelect={(type) => {
          handleAddComponent(type);
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
};

export default SimplePipelineBuilder;
