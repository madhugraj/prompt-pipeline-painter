
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PipelineNode } from '@/lib/types';
import ConfigurableComponent from '@/components/ConfigurableComponent';

interface PipelineComponentsListProps {
  nodes: PipelineNode[];
  onAddComponent: () => void;
  onNodeUpdate: (node: PipelineNode) => void;
  onNodeDelete: (nodeId: string) => void;
}

const PipelineComponentsList: React.FC<PipelineComponentsListProps> = ({
  nodes,
  onAddComponent,
  onNodeUpdate,
  onNodeDelete
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Pipeline Components</h2>
        <Button onClick={onAddComponent}>
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
              onUpdate={onNodeUpdate}
              onDelete={onNodeDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PipelineComponentsList;
