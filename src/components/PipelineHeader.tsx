
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload } from 'lucide-react';

interface PipelineHeaderProps {
  onSave: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PipelineHeader: React.FC<PipelineHeaderProps> = ({ 
  onSave, 
  onExport, 
  onImport 
}) => {
  return (
    <header className="border-b border-border p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">AI Pipeline Builder</h1>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <div className="relative">
            <input
              type="file"
              id="import-pipeline"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="application/json"
              onChange={onImport}
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
  );
};

export default PipelineHeader;
