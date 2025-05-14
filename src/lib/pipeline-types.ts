
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
  TEXT = 'text',
  EMBEDDING = 'embedding',
  VECTOR = 'vector',
  QUERY = 'query',
  RESULT = 'result',
  DOCUMENT = 'document',
  CONFIG = 'config',
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

// Base interface for all node types
export interface BaseNode {
  id: string;
  position: Position;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
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

// Type-specific node interfaces
export interface VectorDBNode extends BaseNode {
  type: ComponentType.VECTOR_DB;
  data: {
    provider: VectorDBProvider;
    // Common VectorDB parameters
    indexName?: string;
    dimensions?: number;
    metric?: 'cosine' | 'euclidean' | 'dot' | 'manhattan';
    shards?: number;
    replicas?: number;
    podType?: string;
    storageType?: 'memory' | 'disk' | 'hybrid';
    apiVersion?: string;
    namespace?: string;
    upsertBatchSize?: number;
    queryBatchSize?: number;
    maxConnections?: number;
    waitForIndexing?: boolean;
    metadataFilterable?: string[];
    embeddingDimension?: number;
    // Provider specific parameters can be added in each provider config
    [key: string]: any;
  }
  inputs?: Port[];
  outputs?: Port[];
}

export interface EmbeddingNode extends BaseNode {
  type: ComponentType.EMBEDDING;
  data: {
    provider: EmbeddingProvider;
    // Common embedding parameters
    model?: string;
    dimensions?: number;
    apiKey?: string;
    batchSize?: number;
    apiEndpoint?: string;
    truncation?: boolean;
    maxTokens?: number;
    normalizationMethod?: 'none' | 'l2';
    textPreprocessing?: string[];
    cacheLifetime?: number;
    contextWindow?: number;
    vectorType?: 'float' | 'int8' | 'binary';
    poolingStrategy?: 'mean' | 'cls' | 'first-last-avg';
    organization?: string;
    [key: string]: any;
  }
  inputs?: Port[];
  outputs?: Port[];
}

export interface LLMNode extends BaseNode {
  type: ComponentType.LLM;
  data: {
    provider: LLMProvider;
    // Common LLM parameters
    model?: string;
    apiKey?: string;
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stopSequences?: string[];
    systemPrompt?: string;
    responseFormat?: 'text' | 'json';
    seed?: number;
    stream?: boolean;
    timeout?: number;
    organization?: string;
    apiEndpoint?: string;
    contextWindow?: number;
    requestConcurrency?: number;
    tools?: any[];
    toolChoice?: string;
    [key: string]: any;
  }
  inputs?: Port[];
  outputs?: Port[];
}

export interface PromptNode extends BaseNode {
  type: ComponentType.PROMPT;
  data: {
    option: PromptOption;
    // Common prompt parameters
    template?: string;
    examples?: string[];
    variables?: string[];
    instructions?: string;
    format?: string;
    reasoning?: boolean;
    systemMessage?: string;
    retrieval?: boolean;
    variableDelimiter?: string;
    resourceLinks?: string[];
    version?: string;
    author?: string;
    useMarkdown?: boolean;
    injectionPoint?: 'start' | 'end' | 'contextual';
    maxLength?: number;
    [key: string]: any;
  }
  inputs?: Port[];
  outputs?: Port[];
}

export interface RAGNode extends BaseNode {
  type: ComponentType.RAG;
  data: {
    option: RAGOption;
    // Common RAG parameters
    numResults?: number;
    similarityThreshold?: number;
    retrievalStrategy?: 'similarity' | 'hybrid' | 'mmr';
    reranking?: boolean;
    useMetadata?: boolean;
    filterFields?: string[];
    recursiveRetrieval?: boolean;
    agentEnabled?: boolean;
    searchType?: 'semantic' | 'keyword' | 'hybrid';
    includeSources?: boolean;
    queryTransformation?: boolean;
    contextWindow?: number;
    diversityWeight?: number;
    subQueries?: number;
    queryExpansion?: boolean;
    maxTokensPerDoc?: number;
    [key: string]: any;
  }
  inputs?: Port[];
  outputs?: Port[];
}

export interface ChunkingNode extends BaseNode {
  type: ComponentType.CHUNKING;
  data: {
    option: ChunkingOption;
    // Common chunking parameters
    chunkSize?: number;
    overlap?: number;
    chunkingStrategy?: 'fixed' | 'semantic' | 'recursive' | 'hybrid';
    minChunkSize?: number;
    maxChunkSize?: number;
    paragraphSeparator?: string;
    splitByHeadings?: boolean;
    preserveMetadata?: boolean;
    preserveStructure?: boolean;
    extractMetadata?: string[];
    documentTypes?: string[];
    handleTables?: boolean;
    handleLists?: boolean;
    handleImages?: boolean;
    handleCode?: boolean;
    languageDetection?: boolean;
    [key: string]: any;
  }
  inputs?: Port[];
  outputs?: Port[];
}

export interface FineTuningNode extends BaseNode {
  type: ComponentType.FINE_TUNING;
  data: {
    option: FineTuningOption;
    // Common fine-tuning parameters
    baseModel?: string;
    trainingData?: string;
    validationData?: string;
    epochs?: number;
    batchSize?: number;
    learningRate?: number;
    rank?: number;
    alpha?: number;
    weightDecay?: number;
    warmupSteps?: number;
    lora?: boolean;
    adapters?: string[];
    quantization?: '4bit' | '8bit' | 'none';
    mixedPrecision?: boolean;
    checkpointFrequency?: number;
    valMonitorMetric?: 'loss' | 'accuracy' | 'f1';
    earlyStopping?: boolean;
    dataFormat?: 'jsonl' | 'csv' | 'huggingface';
    preprocessingSteps?: string[];
    [key: string]: any;
  }
  inputs?: Port[];
  outputs?: Port[];
}

export interface TemperatureNode extends BaseNode {
  type: ComponentType.TEMPERATURE;
  data: {
    option: TemperatureOption;
    // Common temperature parameters
    value?: number;
    minTemp?: number;
    maxTemp?: number;
    baseTemperature?: number;
    dynamicRules?: string[];
    adaptationSpeed?: number;
    contextAware?: boolean;
    userAdjustable?: boolean;
    confidenceThreshold?: number;
    creativeTopics?: string[];
    factualTopics?: string[];
    adjustmentFunction?: string;
    noiseFunction?: string;
    [key: string]: any;
  }
  inputs?: Port[];
  outputs?: Port[];
}

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

// Additional configuration types for providers
export interface PineconeConfig {
  apiKey: string;
  indexType: 'pod' | 'serverless';
  region: string;
  metadataFilters?: Record<string, any>;
  podType?: string;
  podSize?: string;
  replicaCount?: number;
  namespace?: string;
}

export interface ChromaDBConfig {
  persistDirectory: string;
  collectionName: string;
  allowDuplicates?: boolean;
  embeddingFunction?: string;
  metadata?: Record<string, any>;
}

export interface MilvusConfig {
  consistencyLevel: 'Strong' | 'Session' | 'Bounded' | 'Eventually';
  gpuAcceleration: boolean;
  indexType: 'HNSW' | 'ANNOY';
  loadBalancing?: boolean;
  partitions?: number;
  shardCount?: number;
  replicaCount?: number;
  cacheSize?: number;
  connectionPoolSize?: number;
}

export interface OpenAIEmbeddingConfig {
  model: 'text-embedding-3-small' | 'text-embedding-3-large';
  batchSize: number;
  dimensions?: number;
  apiKey?: string;
  organization?: string;
  encoding?: string;
  truncation?: boolean;
  userIdentifier?: string;
}

export interface VoyageAIConfig {
  model: 'voyage-2' | 'voyage-large-2';
  apiKey: string;
  encode_format?: 'float' | 'base64';
  input_type?: 'query' | 'document';
  truncation?: boolean;
  normalize?: boolean;
}

export interface GroqConfig {
  model: 'Llama2-70B' | 'Mixtral';
  speedVsCost: 'speed' | 'balanced' | 'cost';
  apiKey?: string;
  contextWindow?: number;
  responseFormat?: 'json' | 'text';
  stream?: boolean;
}

export interface AnthropicConfig {
  model: 'claude-3-opus' | 'claude-3-sonnet' | 'claude-3-haiku';
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
  stream?: boolean;
  system?: string;
  tools?: any[];
}
