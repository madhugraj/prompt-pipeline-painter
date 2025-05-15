
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PipelineNode, ComponentType } from '@/lib/pipeline-types';
import { componentCategories } from '@/lib/pipeline-data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useForm } from 'react-hook-form';

interface PropertyConfigurationModalProps {
  node: PipelineNode | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (node: PipelineNode) => void;
  onDelete: (nodeId: string) => void;
}

const PropertyConfigurationModal: React.FC<PropertyConfigurationModalProps> = ({
  node,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!node) return null;

  // Get component category for the node
  const componentCategory = componentCategories.find(cat => cat.type === node.type);
  if (!componentCategory) return null;

  // Find the provider configuration
  const providerConfig = componentCategory.providers.find(
    p => p.id.toLowerCase() === (node.data?.provider || '').toLowerCase()
  );
  
  // Set up form
  const form = useForm({
    defaultValues: {
      ...node.data
    }
  });
  
  // Handle form submission
  const handleSubmit = (data: any) => {
    const updatedNode = {
      ...node,
      data: {
        ...data
      }
    };
    onUpdate(updatedNode);
    onClose();
  };
  
  // Get component title
  const getComponentTitle = () => {
    const nodeType = componentCategory ? componentCategory.label : 'Component';
    const provider = providerConfig ? providerConfig.name : node.data?.provider || '';
    return `${nodeType} - ${provider}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getComponentTitle()} Properties</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Provider selection */}
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {componentCategory.providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            {/* Type-specific fields */}
            {node.type === ComponentType.LLM && (
              <>
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Select the model to use for this LLM.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value || 0]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Controls randomness of outputs (0 = deterministic, 1 = creative).
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {node.type === ComponentType.VECTOR_DB && (
              <FormField
                control={form.control}
                name="indexName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Index Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the vector index.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            
            {node.type === ComponentType.EMBEDDING && (
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        value={field.value || 1536} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of dimensions for the embedding vectors.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            
            {node.type === ComponentType.PROMPT && (
              <FormField
                control={form.control}
                name="template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template</FormLabel>
                    <FormControl>
                      <textarea 
                        className="w-full h-36 p-2 border rounded-md" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your prompt template with variables like {"{input}"}.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter className="pt-4 flex justify-between">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => {
                  if (node.id) onDelete(node.id);
                  onClose();
                }}
              >
                Delete
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyConfigurationModal;
