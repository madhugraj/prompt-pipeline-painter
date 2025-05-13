
// Component Types
export enum ComponentType {
  VECTOR_DB = 'vectordb',
  EMBEDDING = 'embedding',
  LLM = 'llm',
  PROMPT = 'prompt',
  RAG = 'rag',
  CHUNKING = 'chunking',
  FINE_TUNING = 'finetuning',
  TEMPERATURE = 'temperature',
}

export enum ConnectionType {
  DATA = 'data', 
  CONTROL = 'control',
}

// Provider types
export type VectorDBProvider = 
  | 'ChromaDB' 
  | 'Pinecone'
  | 'Weaviate'
  | 'Milvus'
  | 'Qdrant'
  | 'PostgreSQL'
  | 'ElasticSearch'
  | 'RedisVL'
  | 'FAISS'
  | 'LanceDB';

export type EmbeddingProvider = 
  | 'OpenAI'
  | 'Cohere'
  | 'HuggingFace'
  | 'VoyageAI'
  | 'JinaAI'
  | 'GoogleGecko'
  | 'MistralEmbed'
  | 'AWSBedrock'
  | 'AlephAlpha';

export type LLMProvider = 
  | 'OpenAI'
  | 'Anthropic'
  | 'Mistral'
  | 'Groq'
  | 'Cohere'
  | 'DBRX'
  | 'Ollama'
  | 'Gemini'
  | 'Llama';

export type PromptOption = 
  | 'BasicTemplates'
  | 'FewShotLearning'
  | 'ChainOfThought'
  | 'LangChainHub'
  | 'MicrosoftPromptFlow';

export type RAGOption = 
  | 'BasicRAG'
  | 'HyDE'
  | 'ColBERT'
  | 'LlamaIndex'
  | 'AzureAISearch'
  | 'MultiQuery';

export type ChunkingOption = 
  | 'FixedSize'
  | 'SemanticSplitting'
  | 'MarkdownHTML'
  | 'NLTK'
  | 'PDFOCR';

export type FineTuningOption = 
  | 'LoRA'
  | 'QLoRA'
  | 'FullFineTuning'
  | 'Axolotl'
  | 'Unsloth'
  | 'AWSSagemaker';

export type TemperatureOption = 
  | 'FixedValue'
  | 'DynamicAdjustment'
  | 'PerToken'
  | 'LLMGuided';

// Node and connection interfaces
export interface Position {
  x: number;
  y: number;
}

export interface BaseNode {
  id: string;
  type: ComponentType;
  position: Position;
  data: Record<string, any>;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  type: ConnectionType;
}

export interface VectorDBNode extends BaseNode {
  type: ComponentType.VECTOR_DB;
  data: {
    provider: VectorDBProvider;
    [key: string]: any;
  }
}

export interface EmbeddingNode extends BaseNode {
  type: ComponentType.EMBEDDING;
  data: {
    provider: EmbeddingProvider;
    [key: string]: any;
  }
}

export interface LLMNode extends BaseNode {
  type: ComponentType.LLM;
  data: {
    provider: LLMProvider;
    [key: string]: any;
  }
}

export interface PromptNode extends BaseNode {
  type: ComponentType.PROMPT;
  data: {
    option: PromptOption;
    [key: string]: any;
  }
}

export interface RAGNode extends BaseNode {
  type: ComponentType.RAG;
  data: {
    option: RAGOption;
    [key: string]: any;
  }
}

export interface ChunkingNode extends BaseNode {
  type: ComponentType.CHUNKING;
  data: {
    option: ChunkingOption;
    [key: string]: any;
  }
}

export interface FineTuningNode extends BaseNode {
  type: ComponentType.FINE_TUNING;
  data: {
    option: FineTuningOption;
    [key: string]: any;
  }
}

export interface TemperatureNode extends BaseNode {
  type: ComponentType.TEMPERATURE;
  data: {
    option: TemperatureOption;
    [key: string]: any;
  }
}

export type PipelineNode = 
  | VectorDBNode
  | EmbeddingNode
  | LLMNode
  | PromptNode
  | RAGNode
  | ChunkingNode
  | FineTuningNode
  | TemperatureNode;

export interface Pipeline {
  id: string;
  name: string;
  nodes: PipelineNode[];
  connections: Connection[];
  created: string;
  updated: string;
}

// Additional configuration types for providers
export interface PineconeConfig {
  apiKey: string;
  indexType: 'pod' | 'serverless';
  region: string;
  metadataFilters?: Record<string, any>;
}

export interface MilvusConfig {
  consistencyLevel: 'Strong' | 'Session' | 'Bounded' | 'Eventually';
  gpuAcceleration: boolean;
  indexType: 'HNSW' | 'ANNOY';
}

export interface OpenAIEmbeddingConfig {
  model: 'text-embedding-3-small' | 'text-embedding-3-large';
  batchSize: number;
}

export interface GroqConfig {
  model: 'Llama2-70B' | 'Mixtral';
  speedVsCost: 'speed' | 'balanced' | 'cost';
}
