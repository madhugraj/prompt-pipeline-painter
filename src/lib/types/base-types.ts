
import { ComponentType } from './component-types';
import { ConnectionType } from './component-types';

// Position and base node structure
export interface Position {
  x: number;
  y: number;
}

// Base interface for all node types
export interface BaseNode {
  id: string;
  position: Position;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: ConnectionType;
  label?: string;
  metadata?: {
    title?: string;
    description?: string;
    dataType?: string;
    dataSize?: number;
    transformations?: string[];
    priority?: number;
    status?: 'active' | 'pending' | 'error';
    lastTransferred?: string;
    requiresAuth?: boolean;
    encrypted?: boolean;
  };
}

// Interface for connection ports
export interface Port {
  id: string;
  type: 'input' | 'output';
  connectionType: ConnectionType[];
  label: string;
  description?: string;
  required?: boolean;
  multiple?: boolean; // Can accept multiple connections
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export interface Pipeline {
  id: string;
  name: string;
  nodes: PipelineNode[];
  connections: Connection[];
  created: string;
  updated: string;
  metadata?: {
    description?: string;
    version?: string;
    author?: string;
    tags?: string[];
    lastRun?: string;
    status?: string;
    environment?: string;
    deploymentTarget?: string;
  };
}

// Import this to avoid circular dependencies
import type { 
  VectorDBNode,
  EmbeddingNode,
  LLMNode,
  PromptNode,
  RAGNode,
  ChunkingNode,
  FineTuningNode,
  TemperatureNode
} from './node-types';

// Union type for all node types
export type PipelineNode = 
  | VectorDBNode
  | EmbeddingNode
  | LLMNode
  | PromptNode
  | RAGNode
  | ChunkingNode
  | FineTuningNode
  | TemperatureNode;
