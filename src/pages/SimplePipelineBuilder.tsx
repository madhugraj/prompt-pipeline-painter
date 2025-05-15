
import React from 'react';
import { usePipelineState } from '@/hooks/use-pipeline-state';
import ComponentSelectionDialog from '@/components/ComponentSelectionDialog';
import PipelineHeader from '@/components/PipelineHeader';
import PipelineComponentsList from '@/components/PipelineComponentsList';

const SimplePipelineBuilder: React.FC = () => {
  const {
    nodes,
    connections,
    isDialogOpen,
    setIsDialogOpen,
    selectedNodeId,
    setSelectedNodeId,
    handleAddComponent,
    handleNodeUpdate,
    handleNodeDelete,
    handleSavePipeline,
    handleExportPipeline,
    handleImportPipeline
  } = usePipelineState();
  
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <PipelineHeader 
        onSave={handleSavePipeline}
        onExport={handleExportPipeline}
        onImport={handleImportPipeline}
      />
      
      {/* Main content */}
      <div className="flex-grow p-6 overflow-auto">
        <PipelineComponentsList 
          nodes={nodes}
          onAddComponent={() => setIsDialogOpen(true)}
          onNodeUpdate={handleNodeUpdate}
          onNodeDelete={handleNodeDelete}
        />
      </div>
      
      {/* Component selection dialog */}
      <ComponentSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onComponentSelect={handleAddComponent}
      />
    </div>
  );
};

export default SimplePipelineBuilder;
