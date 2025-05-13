
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ComponentType, 
  PipelineNode, 
  Connection, 
  Position, 
  Pipeline 
} from '@/lib/pipeline-types';
import PipelineCanvas from '@/components/PipelineCanvas';
import ComponentSidebar from '@/components/ComponentSidebar';
import NodeSettings from '@/components/NodeSettings';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Download,
  Upload,
  Play,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PipelineBuilder = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
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
  
  const { toast } = useToast();
  
  // Create an initial sample node
  useEffect(() => {
    if (nodes.length === 0) {
      handleAddComponent(ComponentType.LLM, { x: 300, y: 200 });
    }
  }, []);
  
  // Add a component to the canvas
  const handleAddComponent = (type: ComponentType, position: Position) => {
    const defaultData: Record<string, any> = {};
    
    // Set default provider based on type
    switch (type) {
      case ComponentType.VECTOR_DB:
        defaultData.provider = 'Pinecone';
        break;
      case ComponentType.EMBEDDING:
        defaultData.provider = 'OpenAI';
        break;
      case ComponentType.LLM:
        defaultData.provider = 'OpenAI';
        defaultData.model = 'gpt-3.5-turbo';
        defaultData.temperature = 0.7;
        break;
      case ComponentType.PROMPT:
        defaultData.option = 'BasicTemplates';
        break;
      case ComponentType.RAG:
        defaultData.option = 'BasicRAG';
        break;
      case ComponentType.CHUNKING:
        defaultData.option = 'FixedSize';
        break;
      case ComponentType.FINE_TUNING:
        defaultData.option = 'LoRA';
        break;
      case ComponentType.TEMPERATURE:
        defaultData.option = 'FixedValue';
        defaultData.value = 0.7;
        break;
    }
    
    const newNode: PipelineNode = {
      id: uuidv4(),
      type,
      position,
      data: defaultData
    };
    
    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
  };
  
  // Update a node's properties
  const handleNodeUpdate = (updatedNode: PipelineNode) => {
    setNodes(prev => prev.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
  };
  
  // Delete a node and its connections
  const handleNodeDelete = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.source !== nodeId && conn.target !== nodeId
    ));
    
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    
    toast({
      title: "Node deleted",
      description: "The node and its connections have been removed"
    });
  };
  
  // Create a new connection between nodes
  const handleConnectionCreate = (connectionData: Partial<Connection>) => {
    if (!connectionData.source || !connectionData.target) return;
    
    // Check if connection already exists
    const connectionExists = connections.some(
      conn => conn.source === connectionData.source && conn.target === connectionData.target
    );
    
    if (connectionExists) {
      toast({
        title: "Connection already exists",
        description: "These nodes are already connected",
        variant: "destructive"
      });
      return;
    }
    
    const newConnection: Connection = {
      id: uuidv4(),
      source: connectionData.source,
      target: connectionData.target,
      type: connectionData.type || 'data'
    };
    
    setConnections(prev => [...prev, newConnection]);
  };
  
  // Delete a connection
  const handleConnectionDelete = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
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
          description: `Imported ${importedPipeline.name} with ${importedPipeline.nodes.length} nodes`
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
      <div className="flex flex-grow overflow-hidden">
        {/* Component sidebar */}
        <ComponentSidebar 
          isExpanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          onAddComponent={handleAddComponent}
        />
        
        {/* Canvas */}
        <div className="flex-grow relative canvas-container">
          <PipelineCanvas
            nodes={nodes}
            connections={connections}
            onNodeAdd={handleAddComponent}
            onNodeUpdate={handleNodeUpdate}
            onNodeSelect={setSelectedNodeId}
            onNodeDelete={handleNodeDelete}
            onConnectionCreate={handleConnectionCreate}
            onConnectionDelete={handleConnectionDelete}
            selectedNodeId={selectedNodeId}
          />
        </div>
        
        {/* Settings panel - only shows when a node is selected */}
        {selectedNodeId && (
          <NodeSettings
            node={nodes.find(node => node.id === selectedNodeId) || null}
            onUpdate={handleNodeUpdate}
            onDelete={handleNodeDelete}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PipelineBuilder;
