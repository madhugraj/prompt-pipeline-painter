
import { Port, ComponentType, ConnectionType } from './pipeline-types';

// Define standard ports for each component type
export const getDefaultPorts = (componentType: ComponentType): { inputs: Port[], outputs: Port[] } => {
  switch (componentType) {
    case ComponentType.VECTOR_DB:
      return {
        inputs: [
          {
            id: 'documents',
            type: 'input',
            connectionType: [ConnectionType.DOCUMENT],
            label: 'Documents',
            description: 'Document data to be stored in vector database',
            required: false,
            multiple: true,
          },
          {
            id: 'embeddings',
            type: 'input',
            connectionType: [ConnectionType.EMBEDDING],
            label: 'Embeddings',
            description: 'Pre-generated embeddings to store',
            required: false,
          },
          {
            id: 'query',
            type: 'input',
            connectionType: [ConnectionType.QUERY],
            label: 'Query',
            description: 'Query for vector search',
            required: false,
          },
          {
            id: 'config',
            type: 'input',
            connectionType: [ConnectionType.CONFIG],
            label: 'Config',
            description: 'Database configuration',
            required: false,
          }
        ],
        outputs: [
          {
            id: 'results',
            type: 'output',
            connectionType: [ConnectionType.RESULT],
            label: 'Results',
            description: 'Search results from the database',
          },
          {
            id: 'metadata',
            type: 'output',
            connectionType: [ConnectionType.DATA],
            label: 'Metadata',
            description: 'Metadata from database operations',
          }
        ]
      };
      
    case ComponentType.EMBEDDING:
      return {
        inputs: [
          {
            id: 'text',
            type: 'input',
            connectionType: [ConnectionType.TEXT],
            label: 'Text',
            description: 'Text to be embedded',
            required: true,
            multiple: true,
          },
          {
            id: 'config',
            type: 'input',
            connectionType: [ConnectionType.CONFIG],
            label: 'Config',
            description: 'Embedding model configuration',
            required: false,
          }
        ],
        outputs: [
          {
            id: 'embeddings',
            type: 'output',
            connectionType: [ConnectionType.EMBEDDING],
            label: 'Embeddings',
            description: 'Generated embeddings',
          },
          {
            id: 'metadata',
            type: 'output',
            connectionType: [ConnectionType.DATA],
            label: 'Metadata',
            description: 'Embedding generation metadata',
          }
        ]
      };
      
    case ComponentType.LLM:
      return {
        inputs: [
          {
            id: 'prompt',
            type: 'input',
            connectionType: [ConnectionType.TEXT],
            label: 'Prompt',
            description: 'Prompt text for the model',
            required: true,
          },
          {
            id: 'context',
            type: 'input',
            connectionType: [ConnectionType.DATA],
            label: 'Context',
            description: 'Additional context for the model',
            required: false,
            multiple: true,
          },
          {
            id: 'config',
            type: 'input',
            connectionType: [ConnectionType.CONFIG],
            label: 'Config',
            description: 'Model configuration parameters',
            required: false,
          },
          {
            id: 'temperature',
            type: 'input',
            connectionType: [ConnectionType.DATA],
            label: 'Temperature',
            description: 'Temperature setting from temperature component',
            required: false,
          }
        ],
        outputs: [
          {
            id: 'response',
            type: 'output',
            connectionType: [ConnectionType.TEXT],
            label: 'Response',
            description: 'Model generated text',
          },
          {
            id: 'metadata',
            type: 'output',
            connectionType: [ConnectionType.DATA],
            label: 'Metadata',
            description: 'Response metadata and token usage',
          }
        ]
      };
      
    case ComponentType.PROMPT:
      return {
        inputs: [
          {
            id: 'variables',
            type: 'input',
            connectionType: [ConnectionType.DATA],
            label: 'Variables',
            description: 'Template variables',
            required: false,
            multiple: true,
          },
          {
            id: 'context',
            type: 'input',
            connectionType: [ConnectionType.TEXT, ConnectionType.DATA],
            label: 'Context',
            description: 'Context to include in prompt',
            required: false,
            multiple: true,
          }
        ],
        outputs: [
          {
            id: 'prompt',
            type: 'output',
            connectionType: [ConnectionType.TEXT],
            label: 'Prompt',
            description: 'Generated prompt text',
          }
        ]
      };
      
    case ComponentType.RAG:
      return {
        inputs: [
          {
            id: 'query',
            type: 'input',
            connectionType: [ConnectionType.TEXT],
            label: 'Query',
            description: 'User query text',
            required: true,
          },
          {
            id: 'retrievedDocs',
            type: 'input',
            connectionType: [ConnectionType.DOCUMENT, ConnectionType.RESULT],
            label: 'Retrieved Docs',
            description: 'Documents from retrieval system',
            required: true,
          },
          {
            id: 'config',
            type: 'input',
            connectionType: [ConnectionType.CONFIG],
            label: 'Config',
            description: 'RAG pipeline configuration',
            required: false,
          }
        ],
        outputs: [
          {
            id: 'context',
            type: 'output',
            connectionType: [ConnectionType.TEXT],
            label: 'Context',
            description: 'Generated context for LLM',
          },
          {
            id: 'formattedQuery',
            type: 'output',
            connectionType: [ConnectionType.TEXT],
            label: 'Formatted Query',
            description: 'Reformulated query',
          },
          {
            id: 'metadata',
            type: 'output',
            connectionType: [ConnectionType.DATA],
            label: 'Metadata',
            description: 'RAG process metadata',
          }
        ]
      };
      
    case ComponentType.CHUNKING:
      return {
        inputs: [
          {
            id: 'document',
            type: 'input',
            connectionType: [ConnectionType.DOCUMENT, ConnectionType.TEXT],
            label: 'Document',
            description: 'Document to be chunked',
            required: true,
            multiple: true,
          },
          {
            id: 'config',
            type: 'input',
            connectionType: [ConnectionType.CONFIG],
            label: 'Config',
            description: 'Chunking configuration',
            required: false,
          }
        ],
        outputs: [
          {
            id: 'chunks',
            type: 'output',
            connectionType: [ConnectionType.DOCUMENT],
            label: 'Chunks',
            description: 'Chunked document fragments',
          },
          {
            id: 'metadata',
            type: 'output',
            connectionType: [ConnectionType.DATA],
            label: 'Metadata',
            description: 'Chunking process metadata',
          }
        ]
      };
      
    case ComponentType.FINE_TUNING:
      return {
        inputs: [
          {
            id: 'trainingData',
            type: 'input',
            connectionType: [ConnectionType.DATA, ConnectionType.DOCUMENT],
            label: 'Training Data',
            description: 'Data for model fine-tuning',
            required: true,
          },
          {
            id: 'validationData',
            type: 'input',
            connectionType: [ConnectionType.DATA, ConnectionType.DOCUMENT],
            label: 'Validation Data',
            description: 'Validation dataset',
            required: false,
          },
          {
            id: 'config',
            type: 'input',
            connectionType: [ConnectionType.CONFIG],
            label: 'Config',
            description: 'Fine-tuning configuration',
            required: false,
          }
        ],
        outputs: [
          {
            id: 'model',
            type: 'output',
            connectionType: [ConnectionType.DATA],
            label: 'Model',
            description: 'Fine-tuned model reference',
          },
          {
            id: 'metrics',
            type: 'output',
            connectionType: [ConnectionType.DATA],
            label: 'Metrics',
            description: 'Training and validation metrics',
          },
          {
            id: 'logs',
            type: 'output',
            connectionType: [ConnectionType.TEXT],
            label: 'Logs',
            description: 'Training process logs',
          }
        ]
      };
      
    case ComponentType.TEMPERATURE:
      return {
        inputs: [
          {
            id: 'context',
            type: 'input',
            connectionType: [ConnectionType.TEXT, ConnectionType.DATA],
            label: 'Context',
            description: 'Context for adaptive temperature',
            required: false,
          },
          {
            id: 'config',
            type: 'input',
            connectionType: [ConnectionType.CONFIG],
            label: 'Config',
            description: 'Temperature configuration',
            required: false,
          }
        ],
        outputs: [
          {
            id: 'temperature',
            type: 'output',
            connectionType: [ConnectionType.DATA],
            label: 'Temperature',
            description: 'Calculated temperature value',
          }
        ]
      };
      
    default:
      return {
        inputs: [],
        outputs: []
      };
  }
};

// Helper function to assign connection compatibility
export const areConnectionTypesCompatible = (
  sourceType: ConnectionType[],
  targetType: ConnectionType[]
): boolean => {
  return sourceType.some(sType => targetType.includes(sType));
};

// Get connection label based on type
export const getConnectionLabel = (type: ConnectionType): string => {
  switch (type) {
    case ConnectionType.DATA: return 'Data';
    case ConnectionType.CONTROL: return 'Control';
    case ConnectionType.TEXT: return 'Text';
    case ConnectionType.EMBEDDING: return 'Embedding';
    case ConnectionType.VECTOR: return 'Vector';
    case ConnectionType.QUERY: return 'Query';
    case ConnectionType.RESULT: return 'Result';
    case ConnectionType.DOCUMENT: return 'Document';
    case ConnectionType.CONFIG: return 'Config';
    default: return 'Connection';
  }
};
