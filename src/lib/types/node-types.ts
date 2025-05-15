
import { BaseNode, Port } from './base-types';
import { ComponentType } from './component-types';
import { 
  VectorDBProvider,
  EmbeddingProvider,
  LLMProvider,
  PromptOption,
  RAGOption,
  ChunkingOption,
  FineTuningOption,
  TemperatureOption
} from './provider-types';

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
