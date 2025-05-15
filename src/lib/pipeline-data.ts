
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
          },
          {
            id: 'dimensions',
            label: 'Dimensions',
            type: 'number',
            required: true,
            default: 1536,
            tooltip: 'Dimension of vectors to store (must match your embeddings)'
          },
          {
            id: 'metric',
            label: 'Distance Metric',
            type: 'select',
            required: false,
            options: ['cosine', 'euclidean', 'dotproduct'],
            default: 'cosine',
            tooltip: 'Similarity metric for vector search'
          },
          {
            id: 'namespace',
            label: 'Namespace',
            type: 'text',
            required: false,
            default: '',
            tooltip: 'Optional namespace for partitioning your index'
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
          },
          {
            id: 'allowDuplicates',
            label: 'Allow Duplicates',
            type: 'boolean',
            required: false,
            default: false,
            tooltip: 'Allow duplicate documents in the collection'
          },
          {
            id: 'inMemory',
            label: 'In Memory',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Run ChromaDB in memory without persistence'
          },
          {
            id: 'compressionLevel',
            label: 'Compression Level',
            type: 'slider',
            required: false,
            default: 0,
            min: 0,
            max: 9,
            step: 1,
            tooltip: '0 for no compression, 9 for maximum compression'
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
          },
          {
            id: 'indexType',
            label: 'Index Type',
            type: 'select',
            required: false,
            options: ['FLAT', 'IVF_FLAT', 'IVF_SQ8', 'IVF_PQ', 'HNSW', 'ANNOY'],
            default: 'HNSW',
            tooltip: 'Vector index type - affects search performance and accuracy'
          },
          {
            id: 'loadBalancing',
            label: 'Load Balancing',
            type: 'boolean',
            required: false,
            default: true
          }
        ]
      },
      {
        id: 'qdrant',
        name: 'Qdrant',
        description: 'Vector similarity search engine with extended filtering',
        pricing: 'tiered',
        deployment: 'hybrid',
        useCases: ['hybrid search', 'filtered retrieval', 'scalable deployments'],
        configFields: [
          {
            id: 'url',
            label: 'URL',
            type: 'text',
            required: true,
            default: 'http://localhost:6333',
            tooltip: 'URL of your Qdrant instance'
          },
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: false,
            placeholder: 'Optional for cloud deployment',
            tooltip: 'API key for Qdrant Cloud'
          },
          {
            id: 'collectionName',
            label: 'Collection Name',
            type: 'text',
            required: true,
            default: 'my_collection'
          },
          {
            id: 'vectorSize',
            label: 'Vector Size',
            type: 'number',
            required: true,
            default: 1536,
            tooltip: 'Dimension of vectors to store'
          },
          {
            id: 'distance',
            label: 'Distance Function',
            type: 'select',
            required: false,
            options: ['Cosine', 'Euclid', 'Dot'],
            default: 'Cosine',
            tooltip: 'Distance function for similarity search'
          }
        ]
      },
      {
        id: 'weaviate',
        name: 'Weaviate',
        description: 'Open-source vector database with GraphQL API',
        pricing: 'tiered',
        deployment: 'hybrid',
        useCases: ['knowledge graphs', 'semantic search', 'multimodal'],
        configFields: [
          {
            id: 'endpoint',
            label: 'Endpoint URL',
            type: 'text',
            required: true,
            default: 'http://localhost:8080',
            tooltip: 'Weaviate instance URL'
          },
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: false,
            placeholder: 'Optional for cloud deployment',
            tooltip: 'API key for Weaviate Cloud'
          },
          {
            id: 'className',
            label: 'Class Name',
            type: 'text',
            required: true,
            default: 'Document',
            tooltip: 'Name of the Weaviate class to use'
          },
          {
            id: 'batchSize',
            label: 'Batch Size',
            type: 'number',
            required: false,
            default: 100,
            tooltip: 'Number of objects to upsert in a single batch'
          },
          {
            id: 'useGraphQL',
            label: 'Use GraphQL',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Use GraphQL for querying instead of REST API'
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
          },
          {
            id: 'dimensions',
            label: 'Dimensions',
            type: 'select',
            required: false,
            options: ['256', '512', '1024', '1536', '2048', '3072'],
            default: '1536',
            tooltip: 'Vector dimensions (smaller is faster but less accurate)'
          },
          {
            id: 'encoding',
            label: 'Encoding',
            type: 'select',
            required: false,
            options: ['float', 'base64'],
            default: 'float',
            tooltip: 'Output format for embeddings'
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
          },
          {
            id: 'input_type',
            label: 'Input Type',
            type: 'select',
            required: false,
            options: ['query', 'document'],
            default: 'document',
            tooltip: 'Optimize for query or document embeddings'
          },
          {
            id: 'normalize',
            label: 'Normalize Vectors',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'L2 normalize the output vectors'
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
          },
          {
            id: 'dimensions',
            label: 'Dimensions',
            type: 'number',
            required: false,
            default: 768,
            tooltip: 'Output vector dimension'
          }
        ]
      },
      {
        id: 'cohere',
        name: 'Cohere',
        description: 'Multilingual embedding models for semantic search',
        pricing: 'pay-per-use',
        deployment: 'cloud',
        useCases: ['multilingual search', 'content recommendation', 'classification'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your Cohere API key'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['embed-english-v3.0', 'embed-multilingual-v3.0', 'embed-english-light-v3.0', 'embed-multilingual-light-v3.0'],
            default: 'embed-english-v3.0',
            tooltip: 'Light models are faster but less accurate'
          },
          {
            id: 'inputType',
            label: 'Input Type',
            type: 'select',
            required: false,
            options: ['search_query', 'search_document', 'classification', 'clustering'],
            default: 'search_document',
            tooltip: 'Optimize embeddings for specific use case'
          },
          {
            id: 'truncate',
            label: 'Truncation Strategy',
            type: 'select',
            required: false,
            options: ['NONE', 'START', 'END', 'MIDDLE'],
            default: 'END',
            tooltip: 'How to handle texts longer than the token limit'
          }
        ]
      },
      {
        id: 'mistralai',
        name: 'Mistral AI Embed',
        description: 'High-quality embedding models from Mistral AI',
        pricing: 'pay-per-use',
        deployment: 'cloud',
        useCases: ['search', 'RAG', 'clustering'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your Mistral AI API key'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['mistral-embed', 'mistral-embed-v2'],
            default: 'mistral-embed-v2',
            tooltip: 'Latest embedding model from Mistral AI'
          },
          {
            id: 'encodingFormat',
            label: 'Encoding Format',
            type: 'select',
            required: false,
            options: ['float', 'base64'],
            default: 'float',
            tooltip: 'Output format for embeddings'
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
            options: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4-turbo'],
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
          },
          {
            id: 'topP',
            label: 'Top P',
            type: 'slider',
            required: false,
            default: 1,
            min: 0,
            max: 1,
            step: 0.01,
            tooltip: 'Alternative to temperature for nucleus sampling'
          },
          {
            id: 'systemPrompt',
            label: 'System Prompt',
            type: 'text',
            required: false,
            placeholder: 'You are a helpful assistant...',
            tooltip: 'Instructions that set the behavior of the assistant'
          },
          {
            id: 'responseFormat',
            label: 'Response Format',
            type: 'select',
            required: false,
            options: ['text', 'json'],
            default: 'text',
            tooltip: 'Format for model to respond in'
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
            options: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-3.5-sonnet-20240620'],
            default: 'claude-3-sonnet-20240229'
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
            max: 1,
            step: 0.1
          },
          {
            id: 'topP',
            label: 'Top P',
            type: 'slider',
            required: false,
            default: 0.9,
            min: 0,
            max: 1,
            step: 0.01
          },
          {
            id: 'topK',
            label: 'Top K',
            type: 'number',
            required: false,
            default: 40,
            tooltip: 'Limits sampling to top K tokens'
          },
          {
            id: 'system',
            label: 'System Prompt',
            type: 'text',
            required: false,
            placeholder: 'You are Claude, an AI assistant...'
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
            options: ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'],
            default: 'llama3-8b-8192'
          },
          {
            id: 'temperature',
            label: 'Temperature',
            type: 'slider',
            required: false,
            default: 0.7,
            min: 0,
            max: 1,
            step: 0.1
          },
          {
            id: 'maxTokens',
            label: 'Max Tokens',
            type: 'number',
            required: false,
            default: 1024
          },
          {
            id: 'topP',
            label: 'Top P',
            type: 'slider',
            required: false,
            default: 0.9,
            min: 0,
            max: 1,
            step: 0.01
          }
        ]
      },
      {
        id: 'mistralai',
        name: 'Mistral AI',
        description: 'High-performance open models with efficient inference',
        pricing: 'pay-per-use',
        deployment: 'cloud',
        useCases: ['chat', 'instruction-following', 'reasoning'],
        configFields: [
          {
            id: 'apiKey',
            label: 'API Key',
            type: 'text',
            required: true,
            placeholder: 'Enter your Mistral AI API key'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['mistral-small-latest', 'mistral-medium-latest', 'mistral-large-latest', 'open-mistral-7b', 'open-mixtral-8x7b'],
            default: 'mistral-small-latest'
          },
          {
            id: 'maxTokens',
            label: 'Max Tokens',
            type: 'number',
            required: false,
            default: 1024
          },
          {
            id: 'temperature',
            label: 'Temperature',
            type: 'slider',
            required: false,
            default: 0.7,
            min: 0,
            max: 1,
            step: 0.1
          },
          {
            id: 'topP',
            label: 'Top P',
            type: 'slider',
            required: false,
            default: 1,
            min: 0,
            max: 1,
            step: 0.01
          },
          {
            id: 'randomSeed',
            label: 'Random Seed',
            type: 'number',
            required: false,
            placeholder: '42',
            tooltip: 'Set for deterministic outputs'
          }
        ]
      },
      {
        id: 'ollama',
        name: 'Ollama',
        description: 'Run open LLMs locally on your hardware',
        pricing: 'free',
        deployment: 'local',
        useCases: ['self-hosting', 'privacy', 'offline-usage'],
        configFields: [
          {
            id: 'baseUrl',
            label: 'Base URL',
            type: 'text',
            required: true,
            default: 'http://localhost:11434',
            tooltip: 'URL where Ollama server is running'
          },
          {
            id: 'model',
            label: 'Model',
            type: 'select',
            required: true,
            options: ['llama3:latest', 'mistral:latest', 'mixtral:latest', 'phi3:latest', 'gemma:latest', 'codellama:latest'],
            default: 'llama3:latest'
          },
          {
            id: 'temperature',
            label: 'Temperature',
            type: 'slider',
            required: false,
            default: 0.8,
            min: 0,
            max: 2,
            step: 0.1
          },
          {
            id: 'contextSize',
            label: 'Context Size',
            type: 'select',
            required: false,
            options: ['2048', '4096', '8192', '16384', '32768'],
            default: '4096',
            tooltip: 'Maximum context window size'
          },
          {
            id: 'numGpu',
            label: 'Number of GPUs',
            type: 'number',
            required: false,
            default: 1,
            tooltip: 'Number of GPUs to use for inference'
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
          },
          {
            id: 'promptTemplate',
            label: 'Prompt Template',
            type: 'text',
            required: false,
            default: 'Answer the question based on the context. Question: {question}\nContext: {context}',
            tooltip: 'Template for structuring the prompt to the LLM'
          },
          {
            id: 'includeSources',
            label: 'Include Sources',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Include source references in the response'
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
          },
          {
            id: 'numResults',
            label: 'Number of Results',
            type: 'number',
            required: true,
            default: 5,
            tooltip: 'Number of documents to retrieve'
          },
          {
            id: 'useExactMatching',
            label: 'Use Exact Matching',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Boost scores for exact token matches'
          }
        ]
      },
      {
        id: 'hyde',
        name: 'Hypothetical Document Embeddings',
        description: 'Generate hypothetical answers before retrieval',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['improved retrieval', 'complex queries', 'semantic search'],
        configFields: [
          {
            id: 'hydePrompt',
            label: 'HyDE Prompt',
            type: 'text',
            required: false,
            default: 'Write a passage that answers this question: {question}',
            tooltip: 'Prompt for generating hypothetical document'
          },
          {
            id: 'llmModel',
            label: 'LLM Model for Hypothesis',
            type: 'text',
            required: true,
            default: 'gpt-3.5-turbo',
            tooltip: 'LLM to generate hypothetical answers'
          },
          {
            id: 'numResults',
            label: 'Number of Results',
            type: 'number',
            required: true,
            default: 4,
            tooltip: 'Number of documents to retrieve'
          },
          {
            id: 'temperature',
            label: 'Hypothesis Temperature',
            type: 'slider',
            required: false,
            default: 0.5,
            min: 0,
            max: 1,
            step: 0.1
          }
        ]
      },
      {
        id: 'multiquery',
        name: 'Multi-Query RAG',
        description: 'Generate multiple search queries from a single question',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['comprehensive retrieval', 'complex questions'],
        configFields: [
          {
            id: 'queryCount',
            label: 'Number of Queries',
            type: 'number',
            required: true,
            default: 3,
            tooltip: 'Number of different queries to generate'
          },
          {
            id: 'queryGenerationPrompt',
            label: 'Generation Prompt',
            type: 'text',
            required: false,
            default: 'Generate {count} different search queries for: {question}',
            tooltip: 'Prompt to generate diverse queries'
          },
          {
            id: 'mergeStrategy',
            label: 'Merge Strategy',
            type: 'select',
            required: true,
            options: ['unique', 'rerank', 'reciprocal_rank_fusion'],
            default: 'reciprocal_rank_fusion',
            tooltip: 'How to combine results from multiple queries'
          },
          {
            id: 'numResultsPerQuery',
            label: 'Results Per Query',
            type: 'number',
            required: true,
            default: 3
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
          },
          {
            id: 'useMarkdown',
            label: 'Use Markdown',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Format template using markdown'
          },
          {
            id: 'defaultVariables',
            label: 'Default Variables',
            type: 'text',
            required: false,
            placeholder: 'variable1=value1,variable2=value2',
            tooltip: 'Comma-separated default values for template variables'
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
          },
          {
            id: 'shotCount',
            label: 'Number of Shots',
            type: 'number',
            required: false,
            default: 3,
            tooltip: 'Number of examples to include in each prompt'
          },
          {
            id: 'exampleSelection',
            label: 'Example Selection',
            type: 'select',
            required: false,
            options: ['random', 'similar', 'fixed'],
            default: 'similar',
            tooltip: 'How to select examples for each prompt'
          }
        ]
      },
      {
        id: 'cot',
        name: 'Chain of Thought',
        description: 'Guide LLMs to show reasoning steps',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['reasoning', 'math', 'complex problems'],
        configFields: [
          {
            id: 'reasoningPrompt',
            label: 'Reasoning Prompt',
            type: 'text',
            required: true,
            default: 'Let\'s think through this step by step.',
            tooltip: 'Prompt to encourage step-by-step reasoning'
          },
          {
            id: 'examples',
            label: 'Reasoning Examples',
            type: 'text',
            required: false,
            placeholder: 'Problem: ... \nSolution steps: 1. ... 2. ... 3. ...',
            tooltip: 'Examples showing reasoning process'
          },
          {
            id: 'extractAnswer',
            label: 'Extract Final Answer',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Extract only the final answer from reasoning'
          },
          {
            id: 'selfCritique',
            label: 'Self-Critique',
            type: 'boolean',
            required: false,
            default: false,
            tooltip: 'Have model critique its own reasoning'
          }
        ]
      },
      {
        id: 'tree',
        name: 'Tree of Thoughts',
        description: 'Explore multiple reasoning pathways',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['complex reasoning', 'problem solving', 'planning'],
        configFields: [
          {
            id: 'branchingFactor',
            label: 'Branching Factor',
            type: 'number',
            required: true,
            default: 3,
            tooltip: 'Number of thought branches to explore at each step'
          },
          {
            id: 'maxDepth',
            label: 'Maximum Depth',
            type: 'number',
            required: true,
            default: 3,
            tooltip: 'Maximum depth of thought tree'
          },
          {
            id: 'evaluationPrompt',
            label: 'Evaluation Prompt',
            type: 'text',
            required: false,
            default: 'Evaluate if this reasoning path is promising (1-10):',
            tooltip: 'Prompt for evaluating thought paths'
          },
          {
            id: 'searchStrategy',
            label: 'Search Strategy',
            type: 'select',
            required: true,
            options: ['breadth_first', 'depth_first', 'best_first'],
            default: 'best_first'
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
          },
          {
            id: 'chunkingUnit',
            label: 'Chunking Unit',
            type: 'select',
            required: false,
            options: ['character', 'word', 'sentence', 'paragraph'],
            default: 'character',
            tooltip: 'Unit to use for chunking'
          },
          {
            id: 'trimWhitespace',
            label: 'Trim Whitespace',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Remove excess whitespace from chunks'
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
          },
          {
            id: 'minChunkSize',
            label: 'Minimum Chunk Size',
            type: 'number',
            required: false,
            default: 200,
            tooltip: 'Minimum size of chunks in characters'
          },
          {
            id: 'maxChunkSize',
            label: 'Maximum Chunk Size',
            type: 'number',
            required: false,
            default: 2000,
            tooltip: 'Maximum size of chunks in characters'
          },
          {
            id: 'embeddingModel',
            label: 'Embedding Model',
            type: 'text',
            required: false,
            default: 'text-embedding-3-small',
            tooltip: 'Model to use for semantic embedding'
          }
        ]
      },
      {
        id: 'markdown',
        name: 'Markdown/HTML Splitting',
        description: 'Split documents based on markup structure',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['documentation', 'web content', 'structured text'],
        configFields: [
          {
            id: 'splitByHeadings',
            label: 'Split by Headings',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Split at heading markers (e.g., #, ##, <h1>, <h2>)'
          },
          {
            id: 'headingLevel',
            label: 'Heading Level',
            type: 'select',
            required: false,
            options: ['1', '2', '3', 'all'],
            default: 'all',
            tooltip: 'Maximum heading level to split on'
          },
          {
            id: 'keepHeadings',
            label: 'Keep Headings with Content',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Include headings with the content below them'
          },
          {
            id: 'splitElements',
            label: 'Elements to Split On',
            type: 'text',
            required: false,
            default: 'hr,table',
            tooltip: 'Comma-separated list of HTML elements to split on'
          }
        ]
      },
      {
        id: 'recursive',
        name: 'Recursive Splitting',
        description: 'Split documents using multiple strategies recursively',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['complex documents', 'mixed content', 'hierarchical documents'],
        configFields: [
          {
            id: 'chunkSize',
            label: 'Target Chunk Size',
            type: 'number',
            required: true,
            default: 1000,
            tooltip: 'Target size for final chunks'
          },
          {
            id: 'separators',
            label: 'Separators',
            type: 'text',
            required: false,
            default: '\n\n,\n,.',
            tooltip: 'Comma-separated list of separators in order of priority'
          },
          {
            id: 'keepSeparators',
            label: 'Keep Separators',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Keep separators with chunks'
          },
          {
            id: 'recursiveDepth',
            label: 'Recursive Depth',
            type: 'number',
            required: false,
            default: 3,
            tooltip: 'Maximum depth of recursive splitting'
          }
        ]
      },
      {
        id: 'pdfocr',
        name: 'PDF/OCR Processing',
        description: 'Extract and chunk text from PDFs and images',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['document processing', 'scanned documents', 'reports'],
        configFields: [
          {
            id: 'extractMode',
            label: 'Extraction Mode',
            type: 'select',
            required: true,
            options: ['text', 'ocr', 'hybrid'],
            default: 'hybrid',
            tooltip: 'Method for extracting text from documents'
          },
          {
            id: 'preserveLayout',
            label: 'Preserve Layout',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Attempt to preserve document layout'
          },
          {
            id: 'ocrLanguage',
            label: 'OCR Language',
            type: 'select',
            required: false,
            options: ['eng', 'spa', 'fra', 'deu', 'chi_sim', 'jpn', 'auto'],
            default: 'auto',
            tooltip: 'Language to use for OCR'
          },
          {
            id: 'postChunkingSize',
            label: 'Post-OCR Chunk Size',
            type: 'number',
            required: false,
            default: 1000,
            tooltip: 'Size of chunks after OCR processing'
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
          },
          {
            id: 'baseModel',
            label: 'Base Model',
            type: 'select',
            required: true,
            options: ['llama-2-7b', 'mistral-7b', 'phi-2', 'gemma-7b', 'pythia-1.4b'],
            default: 'llama-2-7b'
          },
          {
            id: 'trainingEpochs',
            label: 'Training Epochs',
            type: 'number',
            required: true,
            default: 3
          },
          {
            id: 'learningRate',
            label: 'Learning Rate',
            type: 'number',
            required: false,
            default: 0.0002,
            tooltip: 'Learning rate for training'
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
          },
          {
            id: 'baseModel',
            label: 'Base Model',
            type: 'select',
            required: true,
            options: ['llama-2-13b', 'mistral-7b', 'mixtral-8x7b', 'gemma-7b'],
            default: 'llama-2-13b'
          },
          {
            id: 'rank',
            label: 'LoRA Rank',
            type: 'number',
            required: false,
            default: 16
          },
          {
            id: 'maxSteps',
            label: 'Maximum Steps',
            type: 'number',
            required: false,
            default: 1000
          }
        ]
      },
      {
        id: 'fullft',
        name: 'Full Fine-Tuning',
        description: 'Traditional fine-tuning of all model parameters',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['maximum performance', 'comprehensive adaptation', 'production models'],
        configFields: [
          {
            id: 'baseModel',
            label: 'Base Model',
            type: 'select',
            required: true,
            options: ['gpt-3.5-turbo', 'llama-2-7b', 'mistral-7b', 'pythia-1.4b'],
            default: 'gpt-3.5-turbo'
          },
          {
            id: 'epochs',
            label: 'Training Epochs',
            type: 'number',
            required: true,
            default: 3
          },
          {
            id: 'batchSize',
            label: 'Batch Size',
            type: 'number',
            required: false,
            default: 8
          },
          {
            id: 'learningRate',
            label: 'Learning Rate',
            type: 'number',
            required: false,
            default: 0.00002
          },
          {
            id: 'validationSplit',
            label: 'Validation Split',
            type: 'slider',
            required: false,
            default: 0.1,
            min: 0,
            max: 0.5,
            step: 0.05
          }
        ]
      },
      {
        id: 'adapter',
        name: 'Adapter Tuning',
        description: 'Add small trainable modules between model layers',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['efficient tuning', 'multi-task learning', 'incremental learning'],
        configFields: [
          {
            id: 'baseModel',
            label: 'Base Model',
            type: 'text',
            required: true,
            default: 'bert-base-uncased'
          },
          {
            id: 'adapterSize',
            label: 'Adapter Size',
            type: 'number',
            required: false,
            default: 64,
            tooltip: 'Bottleneck dimension of adapter'
          },
          {
            id: 'trainingSteps',
            label: 'Training Steps',
            type: 'number',
            required: true,
            default: 2000
          },
          {
            id: 'learningRate',
            label: 'Learning Rate',
            type: 'number',
            required: false,
            default: 0.0001
          },
          {
            id: 'taskType',
            label: 'Task Type',
            type: 'select',
            required: true,
            options: ['classification', 'ner', 'qa', 'summarization', 'custom'],
            default: 'classification'
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
          },
          {
            id: 'rounding',
            label: 'Round to Decimal Places',
            type: 'number',
            required: false,
            default: 2,
            tooltip: 'Round temperature to this many decimal places'
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
          },
          {
            id: 'minTemperature',
            label: 'Minimum Temperature',
            type: 'slider',
            required: false,
            default: 0.1,
            min: 0,
            max: 2,
            step: 0.1
          },
          {
            id: 'maxTemperature',
            label: 'Maximum Temperature',
            type: 'slider',
            required: false,
            default: 1.5,
            min: 0,
            max: 2,
            step: 0.1
          },
          {
            id: 'adaptationSpeed',
            label: 'Adaptation Speed',
            type: 'slider',
            required: false,
            default: 0.5,
            min: 0.1,
            max: 1,
            step: 0.1,
            tooltip: 'How quickly temperature adapts (0.1=slow, 1=fast)'
          }
        ]
      },
      {
        id: 'contextual',
        name: 'Contextual Temperature',
        description: 'Vary temperature based on input content',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['mixed creative/factual content', 'adaptive responses'],
        configFields: [
          {
            id: 'creativeTopics',
            label: 'Creative Topics',
            type: 'text',
            required: true,
            default: 'story, poem, fiction, creative, imagine',
            tooltip: 'Comma-separated topics that should use higher temperature'
          },
          {
            id: 'factualTopics',
            label: 'Factual Topics',
            type: 'text',
            required: true,
            default: 'fact, science, history, data, definition',
            tooltip: 'Comma-separated topics that should use lower temperature'
          },
          {
            id: 'creativeTemperature',
            label: 'Creative Temperature',
            type: 'slider',
            required: true,
            default: 1.0,
            min: 0,
            max: 2,
            step: 0.1
          },
          {
            id: 'factualTemperature',
            label: 'Factual Temperature',
            type: 'slider',
            required: true,
            default: 0.2,
            min: 0,
            max: 2,
            step: 0.1
          },
          {
            id: 'defaultTemperature',
            label: 'Default Temperature',
            type: 'slider',
            required: true,
            default: 0.7,
            min: 0,
            max: 2,
            step: 0.1
          }
        ]
      },
      {
        id: 'autotuning',
        name: 'Auto-Tuning Temperature',
        description: 'Automatically adjust temperature based on feedback',
        pricing: 'free',
        deployment: 'hybrid',
        useCases: ['optimization', 'self-improving systems', 'continuous learning'],
        configFields: [
          {
            id: 'initialTemperature',
            label: 'Initial Temperature',
            type: 'slider',
            required: true,
            default: 0.7,
            min: 0,
            max: 2,
            step: 0.1
          },
          {
            id: 'learningRate',
            label: 'Learning Rate',
            type: 'slider',
            required: false,
            default: 0.05,
            min: 0.01,
            max: 0.2,
            step: 0.01,
            tooltip: 'How quickly to adjust based on feedback'
          },
          {
            id: 'optimizeFor',
            label: 'Optimize For',
            type: 'select',
            required: true,
            options: ['diversity', 'consistency', 'relevance', 'specificity'],
            default: 'diversity',
            tooltip: 'Quality to optimize temperature for'
          },
          {
            id: 'historyWindow',
            label: 'History Window',
            type: 'number',
            required: false,
            default: 10,
            tooltip: 'Number of past interactions to consider'
          },
          {
            id: 'resetOnTopicChange',
            label: 'Reset on Topic Change',
            type: 'boolean',
            required: false,
            default: true,
            tooltip: 'Reset temperature when topic changes significantly'
          }
        ]
      }
    ]
  }
];

