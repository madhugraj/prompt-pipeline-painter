
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
