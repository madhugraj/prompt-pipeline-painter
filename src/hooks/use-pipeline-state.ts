
import { useState } from 'react';
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
} from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function usePipelineState() {
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
  
  const handleAddComponent = (type: ComponentType, position: Position = { x: 0, y: 0 }) => {
    // Create a new node of the selected type
    let newNode: PipelineNode;
    
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

  return {
    nodes,
    setNodes,
    connections,
    setConnections,
    isDialogOpen,
    setIsDialogOpen,
    selectedNodeId,
    setSelectedNodeId,
    pipeline,
    setPipeline,
    handleAddComponent,
    handleNodeUpdate,
    handleNodeDelete,
    handleSavePipeline,
    handleExportPipeline,
    handleImportPipeline
  };
}
