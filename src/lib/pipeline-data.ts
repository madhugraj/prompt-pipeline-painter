
import { ComponentType } from './pipeline-types';

export interface ComponentCategory {
  type: ComponentType;
  label: string;
  description: string;
  icon: string;
  providers: ComponentProvider[];
}

export interface ComponentProvider {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  pricing: 'free' | 'tiered' | 'pay-per-use';
  deployment: 'cloud' | 'local' | 'hybrid';
  useCases: string[];
  configFields: ConfigField[];
}

export interface ConfigField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'boolean' | 'slider';
  required: boolean;
  tooltip?: string;
  options?: string[];
  default?: any;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const componentCategories: ComponentCategory[] = [
  {
    type: ComponentType.VECTOR_DB,
    label: 'Vector Database',
    description: 'Store and retrieve vector embeddings',
    icon: 'database',
    providers: [
      {
        id: 'pinecone',
        name: 'Pinecone',
        description: 'Cloud vector database with simple API and managed service',
        pricing: 'tiered',
        deployment: 'cloud',
        useCases: ['production', 'RAG', 'semantic search'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your Pinecone API key',
            tooltip: 'Found in Pinecone dashboard under API Keys'
          },
          {
            id: 'indexType',
            label: 'Index Type',
            type: 'select',
            required: true,
            options: ['pod', 'serverless'],
            default: 'serverless',
            tooltip: 'Serverless offers easier scaling, Pod gives more control'
          },
          {
            id: 'region',
            label: 'Region',
            type: 'select',
            required: true,
            options: ['us-east-1', 'us-west-1', 'eu-west-1', 'ap-southeast-1'],
            default: 'us-east-1'
          }
        ]
      },
      {
        id: 'chromadb',
        name: 'ChromaDB',
        description: 'Open-source embedding database for AI applications',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['prototyping', 'local development', 'self-hosting'],
        configFields: [
          {
            id: 'persistDirectory',
            label: 'Persist Directory',
            type: 'text',
            required: false,
            default: './chroma_db',
            tooltip: 'Local directory to persist database files'
          },
          {
            id: 'collectionName',
            label: 'Collection Name',
            type: 'text',
            required: true,
            default: 'my_collection'
          }
        ]
      },
      {
        id: 'milvus',
        name: 'Milvus',
        description: 'Open-source vector database with high performance',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['large-scale', 'high-performance', 'clustering'],
        configFields: [
          {
            id: 'host',
            label: 'Host',
            type: 'text',
            required: true,
            default: 'localhost'
          },
          {
            id: 'port',
            label: 'Port',
            type: 'number',
            required: true,
            default: 19530
          },
          {
            id: 'consistencyLevel',
            label: 'Consistency Level',
            type: 'select',
            required: false,
            options: ['Strong', 'Session', 'Bounded', 'Eventually'],
            default: 'Session',
            tooltip: 'Affects query consistency vs performance trade-off'
          },
          {
            id: 'gpuAcceleration',
            label: 'GPU Acceleration',
            type: 'boolean',
            required: false,
            default: false
          }
        ]
      }
    ]
  },
  {
    type: ComponentType.EMBEDDING,
    label: 'Embedding Models',
    description: 'Convert text to vector embeddings',
    icon: 'move',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'State-of-the-art embedding models from OpenAI',
        pricing: 'pay-per-use',
        deployment: 'cloud',
        useCases: ['search', 'classification', 'clustering'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your OpenAI API key'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['text-embedding-3-small', 'text-embedding-3-large'],
            default: 'text-embedding-3-small',
            tooltip: 'Small is cheaper, Large is more powerful'
          },
          {
            id: 'batchSize',
            label: 'Batch Size',
            type: 'number',
            required: false,
            default: 100,
            tooltip: 'Number of texts to process in a single API call'
          }
        ]
      },
      {
        id: 'voyageai',
        name: 'Voyage AI',
        description: 'Advanced embeddings specialized for search and retrieval',
        pricing: 'pay-per-use',
        deployment: 'cloud',
        useCases: ['semantic search', 'RAG', 'multilingual'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your Voyage AI API key'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['voyage-2', 'voyage-large-2'],
            default: 'voyage-2'
          }
        ]
      },
      {
        id: 'jinaai',
        name: 'Jina AI',
        description: 'Open-source neural search ecosystem',
        pricing: 'tiered',
        deployment: 'hybrid',
        useCases: ['search', 'multilingual', 'code search'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your Jina AI API key'
          },
          {
            id: 'task',
            label: 'Task',
            type: 'select',
            required: true,
            options: ['search', 'clustering'],
            default: 'search'
          },
          {
            id: 'multilingual',
            label: 'Multilingual Support',
            type: 'boolean',
            required: false,
            default: false
          }
        ]
      }
    ]
  },
  {
    type: ComponentType.LLM,
    label: 'Large Language Models',
    description: 'Generate text and answers from prompts',
    icon: 'message-circle',
    providers: [
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'GPT models with state-of-the-art capabilities',
        pricing: 'pay-per-use',
        deployment: 'cloud',
        useCases: ['chat', 'completion', 'function calling'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your OpenAI API key'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
            default: 'gpt-3.5-turbo'
          },
          {
            id: 'maxTokens',
            label: 'Max Tokens',
            type: 'number',
            required: false,
            default: 1000
          },
          {
            id: 'temperature',
            label: 'Temperature',
            type: 'slider',
            required: false,
            default: 0.7,
            min: 0,
            max: 2,
            step: 0.1
          }
        ]
      },
      {
        id: 'anthropic',
        name: 'Anthropic',
        description: 'Claude models known for safety and helpful assistants',
        pricing: 'pay-per-use',
        deployment: 'cloud',
        useCases: ['chat', 'reasoning', 'safety-critical'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your Anthropic API key'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
            default: 'claude-3-sonnet'
          },
          {
            id: 'maxTokens',
            label: 'Max Tokens',
            type: 'number',
            required: false,
            default: 1000
          }
        ]
      },
      {
        id: 'groq',
        name: 'Groq',
        description: 'Ultra-fast inference for large language models',
        pricing: 'pay-per-use',
        deployment: 'cloud',
        useCases: ['chat', 'real-time', 'low-latency'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your Groq API key'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['llama2-70b-4096', 'mixtral-8x7b-32768'],
            default: 'mixtral-8x7b-32768'
          },
          {
            id: 'speedVsCost',
            label: 'Optimization Priority',
            type: 'select',
            required: false,
            options: ['speed', 'balanced', 'cost'],
            default: 'balanced'
          }
        ]
      }
    ]
  },
  {
    type: ComponentType.RAG,
    label: 'RAG',
    description: 'Retrieval-Augmented Generation',
    icon: 'network',
    providers: [
      {
        id: 'basicrag',
        name: 'Basic RAG',
        description: 'Simple retrieval and generation process',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['question-answering', 'document augmentation'],
        configFields: [
          {
            id: 'numResults',
            label: 'Number of Results',
            type: 'number',
            required: true,
            default: 3,
            tooltip: 'Number of documents to retrieve'
          },
          {
            id: 'threshold',
            label: 'Similarity Threshold',
            type: 'slider',
            required: false,
            default: 0.7,
            min: 0,
            max: 1,
            step: 0.05,
            tooltip: 'Minimum similarity score for retrieved documents'
          }
        ]
      },
      {
        id: 'colbert',
        name: 'ColBERT',
        description: 'Token-level interaction for precise retrieval',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['high-precision retrieval', 'complex QA'],
        configFields: [
          {
            id: 'tokenRetrieval',
            label: 'Token-level Retrieval',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Enable token-level matching for more precise results'
          },
          {
            id: 'compression',
            label: 'Compression Level',
            type: 'select',
            required: false,
            options: ['None', 'Low', 'Medium', 'High'],
            default: 'Medium',
            tooltip: 'Trade-off between index size and retrieval quality'
          }
        ]
      }
    ]
  },
  {
    type: ComponentType.PROMPT,
    label: 'Prompt Engineering',
    description: 'Design effective prompts for LLMs',
    icon: 'edit',
    providers: [
      {
        id: 'basic',
        name: 'Basic Templates',
        description: 'Simple template-based prompting',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['general purpose', 'simple tasks'],
        configFields: [
          {
            id: 'template',
            label: 'Template',
            type: 'text',
            required: true,
            placeholder: 'Enter your prompt template with {variables}'
          }
        ]
      },
      {
        id: 'fewshot',
        name: 'Few-Shot Learning',
        description: 'Provide examples to guide LLM responses',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['classification', 'formatting', 'consistency'],
        configFields: [
          {
            id: 'examples',
            label: 'Example Pairs',
            type: 'text',
            required: true,
            placeholder: 'Input 1 => Output 1\nInput 2 => Output 2'
          },
          {
            id: 'delimiter',
            label: 'Delimiter Tokens',
            type: 'text',
            required: false,
            default: '=>',
            tooltip: 'Token(s) separating inputs from outputs in examples'
          }
        ]
      }
    ]
  },
  {
    type: ComponentType.CHUNKING,
    label: 'Chunking',
    description: 'Split documents into processable pieces',
    icon: 'scissors',
    providers: [
      {
        id: 'fixedsize',
        name: 'Fixed Size',
        description: 'Split text into chunks of consistent size',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['simple documents', 'uniform content'],
        configFields: [
          {
            id: 'chunkSize',
            label: 'Chunk Size',
            type: 'number',
            required: true,
            default: 1000,
            tooltip: 'Number of characters per chunk'
          },
          {
            id: 'overlap',
            label: 'Overlap',
            type: 'number',
            required: false,
            default: 200,
            tooltip: 'Number of characters to overlap between chunks'
          }
        ]
      },
      {
        id: 'semantic',
        name: 'Semantic Splitting',
        description: 'Split text based on semantic boundaries',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['complex documents', 'preserving context'],
        configFields: [
          {
            id: 'similarityThreshold',
            label: 'Similarity Threshold',
            type: 'slider',
            required: true,
            default: 0.75,
            min: 0,
            max: 1,
            step: 0.05,
            tooltip: 'Threshold for splitting based on semantic similarity'
          }
        ]
      }
    ]
  },
  {
    type: ComponentType.FINE_TUNING,
    label: 'Fine-Tuning',
    description: 'Customize models for specific tasks',
    icon: 'settings',
    providers: [
      {
        id: 'lora',
        name: 'LoRA',
        description: 'Low-Rank Adaptation for efficient fine-tuning',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['efficient tuning', 'custom assistant', 'domain adaptation'],
        configFields: [
          {
            id: 'rank',
            label: 'Rank',
            type: 'number',
            required: true,
            default: 8,
            tooltip: 'Rank of the update matrices (higher = more capacity but more parameters)'
          },
          {
            id: 'alpha',
            label: 'Alpha',
            type: 'number',
            required: true,
            default: 16,
            tooltip: 'Scaling factor for the update (usually 2x rank)'
          }
        ]
      },
      {
        id: 'qlora',
        name: 'QLoRA',
        description: 'Quantized LoRA for memory-efficient fine-tuning',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['memory-constrained', 'large models', 'consumer hardware'],
        configFields: [
          {
            id: 'bits',
            label: '4-bit Precision',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Use 4-bit quantization for base model weights'
          },
          {
            id: 'datasetFormat',
            label: 'Dataset Format',
            type: 'select',
            required: true,
            options: ['JSON', 'CSV', 'JSONL', 'Hugging Face'],
            default: 'JSONL'
          }
        ]
      }
    ]
  },
  {
    type: ComponentType.TEMPERATURE,
    label: 'Temperature',
    description: 'Control randomness in LLM outputs',
    icon: 'thermometer',
    providers: [
      {
        id: 'fixed',
        name: 'Fixed Value',
        description: 'Set a constant temperature value',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['consistent outputs', 'simple configuration'],
        configFields: [
          {
            id: 'value',
            label: 'Temperature',
            type: 'slider',
            required: true,
            default: 0.7,
            min: 0,
            max: 2,
            step: 0.1,
            tooltip: '0 = deterministic, 1 = balanced, 2 = random'
          }
        ]
      },
      {
        id: 'dynamic',
        name: 'Dynamic Adjustment',
        description: 'Adjust temperature based on rules',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['adaptive generation', 'context-aware randomness'],
        configFields: [
          {
            id: 'rules',
            label: 'Rule Templates',
            type: 'text',
            required: true,
            placeholder: 'if repetitive → +0.2',
            tooltip: 'Rules to adjust temperature dynamically'
          },
          {
            id: 'baseTemperature',
            label: 'Base Temperature',
            type: 'slider',
            required: true,
            default: 0.7,
            min: 0,
            max: 2,
            step: 0.1
          }
        ]
      }
    ]
  }
];
